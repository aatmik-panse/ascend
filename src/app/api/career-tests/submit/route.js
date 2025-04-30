import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId, answers } = await req.json();

    if (!testId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 }
      );
    }

    // Fetch the test to make sure it belongs to this user
    const test = await prisma.careerPathTest.findUnique({
      where: {
        id: testId,
        userId: user.id,
      },
      include: {
        questions: true,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Calculate score
    let correctCount = 0;

    // Save each answer and calculate score
    const userResponses = await Promise.all(
      answers.map(async (answer) => {
        // Find the corresponding question
        const question = test.questions.find(q => q.id === answer.questionId);
        
        if (!question) {
          throw new Error(`Question not found: ${answer.questionId}`);
        }
        
        // Check if answer is correct
        const isCorrect = question.correctAnswer === answer.userAnswer;
        
        if (isCorrect) {
          correctCount++;
        }

        // Save the response
        return await prisma.testResponse.create({
          data: {
            testId: testId,
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            isCorrect: isCorrect,
          },
        });
      })
    );

    // Calculate percentage score
    const score = Math.round((correctCount / test.questions.length) * 100);

    // Update the test as completed with the score
    const completedTest = await prisma.careerPathTest.update({
      where: { id: testId },
      data: {
        completedAt: new Date(),
        score: score,
      },
      include: {
        questions: true,
        userResponses: true,
      },
    });

    return NextResponse.json({
      score,
      test: completedTest,
    });
  } catch (error) {
    console.error("Error submitting test answers:", error);
    return NextResponse.json(
      { error: "Failed to submit test: " + error.message },
      { status: 500 }
    );
  }
}
