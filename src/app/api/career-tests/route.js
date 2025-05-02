import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new test for a specific career path
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

    // Parse request body
    const { careerPathId } = await req.json();

    if (!careerPathId) {
      return NextResponse.json(
        { error: "Career path ID is required" },
        { status: 400 }
      );
    }

    // Check if a test for this career path already exists for the user
    const existingTest = await prisma.careerPathTest.findFirst({
      where: {
        userId: user.id,
        careerPathId: careerPathId,
      },
      include: {
        questions: true,
      },
    });

    if (existingTest) {
      return NextResponse.json({ test: existingTest });
    }

    // Get the career path details
    const careerPath = await prisma.careerRecommendation.findUnique({
      where: { id: careerPathId },
    });

    if (!careerPath) {
      return NextResponse.json(
        { error: "Career path not found" },
        { status: 404 }
      );
    }

    // Get user's onboarding data for context
    const onboardingData = await prisma.onboardingData.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Generate personalized test questions using OpenAI
    const prompt = `
      Create a personalized assessment test for the career path: ${
        careerPath.title
      }. 
      
      User profile:
      Current Role: ${onboardingData?.jobTitle || "Not specified"}
      Experience Level: ${onboardingData?.experience || "Not specified"}
      Top Skills: ${onboardingData?.topSkills?.join(", ") || "Not specified"}
      
      The test should:
      1. Contain exactly 5 multiple-choice questions
      2. Each question should have 4 options
      3. Questions should assess knowledge and aptitude for the ${
        careerPath.title
      } role
      4. Questions should be appropriate for the user's experience level
      5. Include a mix of technical and soft skills relevant to this career path
      6. For each question, indicate which option (0-3) is the correct answer
      
      Additionally, provide 3 learning resource recommendations for this career path, each with:
      - Title
      - Provider (platform/institution)
      - Description (short description of what they'll learn)
      - Duration estimate
      - Difficulty level
      - CourseURL (a URL where they can access this course, e.g. "https://www.coursera.org/course-name")
      - RoadmapSteps (a short comma-separated list of 3-5 steps to master this skill area)
      
      Format the response as a valid JSON object with:
      1. A "questions" array with objects containing: "questionText", "options" (array of 4 strings), and "correctAnswer" (integer 0-3)
      2. A "recommendations" array with objects containing: "title", "provider", "description", "duration", "level", "courseUrl", and "roadmapSteps"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "system",
          content:
            "You are a career assessment specialist who creates personalized evaluation tests.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    let testData;

    try {
      // Try to extract JSON from the text
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/) || [
        null,
        responseText,
      ];
      const cleanedJson = jsonMatch[1].trim();
      testData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);

      // Last attempt - try to find JSON object pattern
      try {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          testData = JSON.parse(jsonObjectMatch[0]);
        } else {
          return NextResponse.json(
            { error: "Failed to generate test questions. Please try again." },
            { status: 500 }
          );
        }
      } catch (finalError) {
        return NextResponse.json(
          { error: "Failed to generate test questions. Please try again." },
          { status: 500 }
        );
      }
    }

    const questions = testData?.questions || [];
    const recommendations = testData?.recommendations || [];

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate test questions. Please try again." },
        { status: 500 }
      );
    }

    // Create the test in the database
    const newTest = await prisma.careerPathTest.create({
      data: {
        userId: user.id,
        careerPathId: careerPathId,
        recommendations: recommendations.map((rec) => ({
          title: rec.title,
          provider: rec.provider,
          description: rec.description || "",
          duration: rec.duration,
          level: rec.level,
          courseUrl: rec.courseUrl || "#",
          roadmapSteps: Array.isArray(rec.roadmapSteps)
            ? rec.roadmapSteps
            : typeof rec.roadmapSteps === "string"
            ? rec.roadmapSteps.split(",").map((step) => step.trim())
            : [],
        })),
        questions: {
          create: questions.map((q, index) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ test: newTest });
  } catch (error) {
    console.error("Error creating career path test:", error);
    return NextResponse.json(
      { error: "Failed to create test: " + error.message },
      { status: 500 }
    );
  }
}

// Get tests for the authenticated user
export async function GET(req) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check URL params
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");
    const careerPathId = searchParams.get("careerPathId");

    // If testId is provided, return that specific test
    if (testId) {
      const test = await prisma.careerPathTest.findUnique({
        where: {
          id: testId,
          userId: user.id,
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!test) {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
      }

      return NextResponse.json({ test });
    }

    // If careerPathId is provided, return test for that career path
    if (careerPathId) {
      const test = await prisma.careerPathTest.findFirst({
        where: {
          careerPathId: careerPathId,
          userId: user.id,
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });

      return NextResponse.json({ test: test || null });
    }

    // Otherwise return all tests for the user
    const tests = await prisma.careerPathTest.findMany({
      where: {
        userId: user.id,
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error("Error fetching career path tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests: " + error.message },
      { status: 500 }
    );
  }
}
