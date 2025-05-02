import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET a user's roadmap or generate a new one
export async function GET(req) {
  try {
    // Authenticate the user
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
    const regenerate = searchParams.get("regenerate") === "true";
    const roadmapId = searchParams.get("id");

    // If roadmap ID is provided, return that specific roadmap
    if (roadmapId) {
      const roadmap = await prisma.learningRoadmap.findUnique({
        where: {
          id: roadmapId,
          userId: user.id,
        },
      });

      if (!roadmap) {
        return NextResponse.json(
          { error: "Roadmap not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ roadmap });
    }

    // If test ID is provided, check if a roadmap already exists for this test
    if (testId && !regenerate) {
      const existingRoadmap = await prisma.learningRoadmap.findFirst({
        where: {
          userId: user.id,
          testId: testId,
        },
      });

      if (existingRoadmap) {
        return NextResponse.json({ roadmap: existingRoadmap });
      }
    }

    // If we need to generate a roadmap, get necessary data

    // Get the test data if testId is provided
    let test = null;
    let selectedRecommendation = null;
    if (testId) {
      test = await prisma.careerPathTest.findUnique({
        where: {
          id: testId,
          userId: user.id,
        },
      });

      if (!test) {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
      }

      // Get the selected recommendation from the test
      const selectedIndex = test.selectedRoadmapIndex || 0;
      if (test.recommendations && test.recommendations[selectedIndex]) {
        selectedRecommendation = test.recommendations[selectedIndex];
      }
    }

    // Get user's onboarding data for personalization
    const onboardingData = await prisma.onboardingData.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!onboardingData && !selectedRecommendation) {
      return NextResponse.json(
        { error: "Insufficient data to generate roadmap" },
        { status: 400 }
      );
    }

    // Generate the roadmap using OpenAI
    const roadmap = await generatePersonalizedRoadmap(
      user.id,
      onboardingData,
      test,
      selectedRecommendation,
      testId
    );

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error("Error handling roadmap request:", error);
    return NextResponse.json(
      { error: "Failed to process roadmap request: " + error.message },
      { status: 500 }
    );
  }
}

// Update roadmap progress or details
export async function PATCH(req) {
  try {
    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { roadmapId, completedSteps } = await req.json();

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    // Get the roadmap to verify ownership
    const roadmap = await prisma.learningRoadmap.findUnique({
      where: {
        id: roadmapId,
        userId: user.id,
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Update the roadmap with completed steps
    const updatedRoadmap = await prisma.learningRoadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        completedSteps: completedSteps || roadmap.completedSteps,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ roadmap: updatedRoadmap });
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap: " + error.message },
      { status: 500 }
    );
  }
}

// Helper function to generate a personalized roadmap using OpenAI
async function generatePersonalizedRoadmap(
  userId,
  onboardingData,
  test,
  selectedRecommendation,
  testId
) {
  // Format user data for the AI prompt
  const userProfile = {
    jobTitle: onboardingData?.jobTitle || "Not specified",
    experience: onboardingData?.experience || "Not specified",
    topSkills: onboardingData?.topSkills?.join(", ") || "Not specified",
    timeForGrowth: onboardingData?.timeForGrowth || "4-7 hrs/week",
    industryInterest: onboardingData?.industryInterest || "Not specified",
  };

  const targetRole = selectedRecommendation?.title || "Career transition";

  // Create the prompt for OpenAI
  const prompt = `
    Generate an weekly personalized learning roadmap for someone transitioning to a ${targetRole} role.
    
    User profile:
    - Current Role: ${userProfile.jobTitle}
    - Experience Level: ${userProfile.experience}
    - Top Skills: ${userProfile.topSkills}
    - Weekly Learning Time Available: ${userProfile.timeForGrowth}
    - Industry Interest: ${userProfile.industryInterest}
    
    ${
      selectedRecommendation
        ? `
    Target learning focus:
    - Course: ${selectedRecommendation.title}
    - Provider: ${selectedRecommendation.provider || "Various resources"}
    - Level: ${selectedRecommendation.level || "Intermediate"}
    - Main topics to cover: ${
      selectedRecommendation.description || "Professional skills for the role"
    }
    `
        : ""
    }
    
    Create a week-by-week learning roadmap with:
    1. A focused theme for each week
    2. 3-5 specific learning activities per week (appropriate for their available time commitment)
    3. Recommended resources (courses, videos, articles, books, projects)
    4. Weekly learning goals and expected outcomes
    5. Practical exercises or projects to apply new knowledge
    
    Format the response as a valid JSON object with the following structure:
    {
      "title": "Learning Roadmap for [Target Role]",
      "description": "[Brief description of the roadmap]",
      "totalWeeks": 8,
      "weeks": [
        {
          "weekNumber": 1,
          "theme": "[Theme for week 1]",
          "activities": [
            {
              "type": "reading|video|course|project|exercise",
              "title": "[Activity title]",
              "description": "[Brief description]",
              "estimatedTime": "[Time estimate in hours]",
              "resource": "[URL or resource name]"
            },
            // More activities...
          ],
          "goals": "[Weekly learning goals]",
          "outcomes": "[Expected outcomes]"
        },
        // More weeks...
      ]
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "system",
          content:
            "You are a career development expert who creates personalized learning roadmaps.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    const roadmapData = parseJsonFromText(responseText);

    if (
      !roadmapData ||
      !roadmapData.weeks ||
      !Array.isArray(roadmapData.weeks)
    ) {
      throw new Error("Failed to generate valid roadmap data");
    }

    // Save the roadmap to the database
    const savedRoadmap = await prisma.learningRoadmap.create({
      data: {
        userId,
        testId: testId || null,
        title: roadmapData.title,
        description: roadmapData.description,
        weeks: roadmapData.weeks,
        totalWeeks: roadmapData.totalWeeks || 8,
        careerPathId: test?.careerPathId || null,
      },
    });

    return savedRoadmap;
  } catch (error) {
    console.error("Error generating roadmap with OpenAI:", error);
    throw new Error("Failed to generate personalized roadmap");
  }
}

// Helper function to parse JSON from text (with error handling)
function parseJsonFromText(text) {
  try {
    // Try to directly parse the text
    return JSON.parse(text);
  } catch (e) {
    try {
      // Try to extract JSON from the text
      const jsonMatch =
        text.match(/```(?:json)?([^`]+)```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0].replace(/```json|```/g, "").trim());
      }
    } catch (err) {
      console.error("JSON parsing failed:", err);
    }

    return null;
  }
}
