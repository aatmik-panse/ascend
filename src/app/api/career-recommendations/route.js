import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define constants
const OPENAI_TIMEOUT = 20000; // 20 seconds timeout for OpenAI API calls
const RECOMMENDATION_CACHE_KEY = "career-recommendations-";

export async function GET(req) {
  console.log("Career Recommendations API - GET request started");
  try {
    // Get the authenticated user
    console.log("Attempting to get authenticated user from Supabase");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Handle authentication
    if (!user) {
      console.log("Unauthorized request - no user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Authenticated user ID:", user.id);

    // Check if a specific career path ID is requested
    const { searchParams } = new URL(req.url);
    const pathId = searchParams.get("pathId");
    console.log("Requested pathId:", pathId || "None - fetching all paths");

    // Handle single path request
    if (pathId) {
      console.log(`Fetching specific career path with ID: ${pathId}`);
      const careerPath = await prisma.careerRecommendation.findUnique({
        where: {
          id: pathId,
          userId: user.id,
        },
      });

      if (!careerPath) {
        console.log(
          `Career path with ID ${pathId} not found for user ${user.id}`
        );
        return NextResponse.json(
          { error: "Career path not found" },
          { status: 404 }
        );
      }

      console.log("Returning specific career path");
      return NextResponse.json({ recommendations: [careerPath] });
    }

    // Check for existing recommendations - first check
    const existingRecommendations = await prisma.careerRecommendation.findMany({
      where: { userId: user.id },
    });

    if (existingRecommendations.length > 0) {
      console.log("Returning existing career recommendations");
      return NextResponse.json({ recommendations: existingRecommendations });
    }

    // Optimized onboarding data fetch - consolidated into a single query with fallbacks
    console.log("Fetching onboarding data with optimized query");
    const onboardingData = await getOnboardingData(user.id);

    if (!onboardingData) {
      return NextResponse.json(
        { error: "Onboarding data not found. Please complete your profile." },
        { status: 404 }
      );
    }

    console.log("Onboarding data retrieved successfully");

    // Prepare the prompt for ChatGPT
    const prompt = createPrompt(onboardingData);

    // Call OpenAI API with timeout
    console.log("Calling OpenAI API with timeout");
    const responseData = await callOpenAIWithTimeout(prompt);

    if (
      !responseData ||
      !responseData.recommendations ||
      responseData.recommendations.length === 0
    ) {
      return NextResponse.json(
        { error: "Failed to generate recommendations. Please try again." },
        { status: 500 }
      );
    }

    // Save recommendations to the database using a more efficient approach
    console.log("Saving recommendations to database");
    const savedRecommendations = await saveRecommendations(
      user.id,
      responseData.recommendations
    );
    console.log("All recommendations saved successfully");

    return NextResponse.json({ recommendations: savedRecommendations });
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations: " + error.message },
      { status: 500 }
    );
  }
}

// Helper function to get onboarding data efficiently with caching
async function getOnboardingData(userId) {
  try {
    // Use an in-memory cache for frequently requested data
    const cacheKey = `onboarding-data-${userId}`;
    const cachedData = global[cacheKey];

    if (cachedData && Date.now() - cachedData.timestamp < 3600000) {
      // 1 hour cache
      console.log("Returning cached onboarding data");
      return cachedData.data;
    }

    // Direct lookup - most efficient query
    console.log(`Attempting direct lookup with userId: ${userId}`);
    let data = await prisma.onboardingData.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (data) {
      console.log("Onboarding data found via direct userId lookup");
      // Cache the result
      global[cacheKey] = { data, timestamp: Date.now() };
      return data;
    }

    // If direct lookup fails, try a simplified email-based approach
    console.log("Direct lookup failed, trying email-based approach");
    try {
      const supabase = await createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user?.email) {
        // Find user by email and get their onboarding data in a single query
        // This avoids multiple roundtrips to the database
        const userWithData = await prisma.user.findFirst({
          where: { email: userData.user.email },
          select: {
            id: true,
            email: true,
            onboardingData: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        if (userWithData?.onboardingData?.[0]) {
          data = userWithData.onboardingData[0];
          console.log(
            `Found onboarding data via email lookup for user ${userWithData.email}`
          );
          // Cache the result
          global[cacheKey] = { data, timestamp: Date.now() };
          return data;
        }
      }
    } catch (error) {
      console.error("Email lookup failed:", error.message);
      // Continue with execution if this approach fails
    }

    console.log("No onboarding data found for this user");
    return null;
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    return null;
  }
}

// Helper function to create a well-structured prompt
function createPrompt(onboardingData) {
  return `
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
}

// Helper function to call OpenAI with timeout handling
async function callOpenAIWithTimeout(prompt) {
  try {
    // Create a promise that will resolve with the OpenAI response
    const openaiPromise = openai.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
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

    // Create a promise that will reject after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("OpenAI API call timed out")),
        OPENAI_TIMEOUT
      );
    });

    // Race the OpenAI promise against the timeout promise
    const completion = await Promise.race([openaiPromise, timeoutPromise]);
    const responseText = completion.choices[0].message.content;

    // Parse the response with improved error handling
    return parseOpenAIResponse(responseText);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

// Helper function to parse the OpenAI response
function parseOpenAIResponse(responseText) {
  try {
    // First try: direct parsing
    return JSON.parse(responseText);
  } catch (e) {
    try {
      // Second try: extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim());
      }

      // Third try: find any JSON object pattern
      const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        return JSON.parse(jsonObjectMatch[0]);
      }
    } catch (finalError) {
      console.error("All parsing attempts failed:", finalError);
    }
    return null;
  }
}

// Helper function to save recommendations efficiently
async function saveRecommendations(userId, recommendations) {
  try {
    // Prepare data for bulk creation
    const recommendationsData = recommendations.map((path) => ({
      userId,
      title: path.title,
      matchPercentage: parseInt(path.match.toString().replace("%", "")) || 70,
      description: path.description,
      skills: Array.isArray(path.skills) ? path.skills : [],
      growthOutlook: path.growth,
      salaryRange: path.salary,
    }));

    // Use createMany for efficiency if available, or fall back to transactiond GPT-4 model
    if (prisma.careerRecommendation.createMany) {
      await prisma.careerRecommendation.createMany({
        data: recommendationsData,
      });
    } else {
      // Fall back to transaction for multiple creates
      await prisma.$transaction(
        recommendationsData.map((data) =>
          prisma.careerRecommendation.create({
            data,
          })
        )
      );
    }

    // Fetch the saved recommendations to return them
    return await prisma.careerRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error saving recommendations:", error);
    throw error;
  }
}
