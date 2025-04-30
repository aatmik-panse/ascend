import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if career recommendations already exist
    const existingRecommendations = await prisma.careerRecommendation.findMany({
      where: { userId: user.id },
    });

    if (existingRecommendations.length > 0) {
      return NextResponse.json({ recommendations: existingRecommendations });
    }

    // Fetch user's onboarding data - using the correct model name from schema
    let onboardingData = await prisma.onboardingData.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!onboardingData) {
      // Try using the user_id field as fallback
      const userRecord = await prisma.user.findFirst({
        where: { user_id: user.id },
      });

      if (userRecord) {
        const onboardingByUserRelation = await prisma.onboardingData.findFirst({
          where: { userId: userRecord.id },
          orderBy: { createdAt: "desc" },
        });

        if (!onboardingByUserRelation) {
          return NextResponse.json(
            {
              error: "Onboarding data not found. Please complete your profile.",
            },
            { status: 404 }
          );
        }

        onboardingData = onboardingByUserRelation;
      } else {
        return NextResponse.json(
          { error: "Onboarding data not found. Please complete your profile." },
          { status: 404 }
        );
      }
    }

    // Prepare the prompt for ChatGPT - using the structure from our actual schema
    const prompt = `
      Based on the following user profile, suggest 5 suitable career paths:
      
      Current Role: ${onboardingData.jobTitle || "Not specified"}
      Experience Level: ${onboardingData.experience || "Not specified"}
      Top Skills: ${onboardingData.topSkills.join(", ") || "Not specified"}
      Work Preferences: ${onboardingData.enjoyDislike || "Not specified"}
      Primary Motivators: ${onboardingData.motivators || "Not specified"}
      Weekly Learning Time: ${onboardingData.timeForGrowth || "Not specified"}
      Industries of Interest: ${
        onboardingData.industryInterest || "Not specified"
      }
      Main Career Concern: ${onboardingData.biggestConcern || "Not specified"}
      
      For each career path, provide:
      1. A unique ID (kebab-case)
      2. Job title
      3. Match percentage (between 70-95%)
      4. Brief description
      5. 5 key skills required
      6. Growth outlook (Very High, High, or Moderate)
      7. Salary range
      
      Format the response as a valid JSON object with a key "recommendations" containing an array of objects with these exact keys: 
      id, title, match, description, skills, growth, salary. 
      Ensure skills is an array of strings.
    `;

    // Call ChatGPT API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Using standard GPT-4 model
      messages: [
        {
          role: "system",
          content:
            'You are a career counselor AI that provides structured data only as valid JSON. Return JSON that follows this exact structure without any additional text or markdown formatting: { "recommendations": [ { "id": "string", "title": "string", "match": "number", "description": "string", "skills": ["string"], "growth": "string", "salary": "string" } ] }',
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    let responseData;

    try {
      // Try to extract JSON from the text in case it's wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/) || [
        null,
        responseText,
      ];
      const cleanedJson = jsonMatch[1].trim();
      responseData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.log("Raw response:", responseText);

      // Last attempt - try to find JSON object pattern
      try {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          responseData = JSON.parse(jsonObjectMatch[0]);
        } else {
          return NextResponse.json(
            { error: "Failed to process AI response. Please try again." },
            { status: 500 }
          );
        }
      } catch (finalError) {
        return NextResponse.json(
          { error: "Failed to process AI response. Please try again." },
          { status: 500 }
        );
      }
    }

    const careerPaths = responseData?.recommendations || [];

    if (!careerPaths.length) {
      return NextResponse.json(
        { error: "Failed to generate recommendations. Please try again." },
        { status: 500 }
      );
    }

    // Save recommendations to the database
    const savedRecommendations = await Promise.all(
      careerPaths.map(async (path) => {
        return await prisma.careerRecommendation.create({
          data: {
            id: path.id,
            userId: user.id,
            title: path.title,
            matchPercentage: parseInt(path.match.toString().replace("%", "")),
            description: path.description,
            skills: path.skills,
            growthOutlook: path.growth,
            salaryRange: path.salary,
          },
        });
      })
    );

    return NextResponse.json({ recommendations: savedRecommendations });
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations: " + error.message },
      { status: 500 }
    );
  }
}
