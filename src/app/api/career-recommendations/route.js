import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
  console.log("Career Recommendations API - GET request started");
  try {
    // Get the authenticated user
    console.log("Attempting to get authenticated user from Supabase");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(
      "User authentication result:",
      user ? "User authenticated" : "No user found"
    );

    if (!user) {
      console.log("Unauthorized request - no user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Authenticated user ID:", user.id);

    // Check if a specific career path ID is requested
    const { searchParams } = new URL(req.url);
    const pathId = searchParams.get("pathId");
    console.log("Requested pathId:", pathId || "None - fetching all paths");

    if (pathId) {
      console.log(`Fetching specific career path with ID: ${pathId}`);
      const careerPath = await prisma.careerRecommendation.findUnique({
        where: {
          id: pathId,
          userId: user.id,
        },
      });

      console.log(
        "Career path lookup result:",
        careerPath ? "Found" : "Not found"
      );
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

    // Check if career recommendations already exist
    console.log("Checking for existing career recommendations");
    const existingRecommendations = await prisma.careerRecommendation.findMany({
      where: { userId: user.id },
    });
    console.log(
      `Found ${existingRecommendations.length} existing recommendations`
    );

    if (existingRecommendations.length > 0) {
      console.log("Returning existing career recommendations");
      return NextResponse.json({ recommendations: existingRecommendations });
    }

    // Fetch user's onboarding data - using the correct model name from schema
    console.log(
      "No existing recommendations found. Fetching onboarding data..."
    );
    console.log("User ID being used for lookup:", user.id);

    // Try multiple query approaches to find the onboarding data
    let onboardingData = null;

    // Approach 1: Direct userId lookup with detailed logging
    const directLookupResult = await prisma.onboardingData.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    console.log(
      "Direct userId lookup result:",
      directLookupResult ? "Found" : "Not found"
    );

    if (directLookupResult) {
      onboardingData = directLookupResult;
      console.log("Found onboarding data via direct userId lookup");
    } else {
      // Approach 2: Try lookup with user_id field
      console.log("Trying lookup with user_id field");
      const userIdLookupResult = await prisma.onboardingData.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (userIdLookupResult) {
        onboardingData = userIdLookupResult;
        console.log("Found onboarding data via user_id field");
      } else {
        // Approach 3: Try with relations
        console.log("Trying lookup via User relation");
        const relationLookupResult = await prisma.onboardingData.findFirst({
          where: {
            User: {
              OR: [{ id: user.id }, { user_id: user.id }],
            },
          },
          orderBy: { createdAt: "desc" },
          include: { User: true },
        });

        if (relationLookupResult) {
          onboardingData = relationLookupResult;
          console.log("Found onboarding data via User relation");
        }
      }

      // If still not found, try the fallback method with more logging
      if (!onboardingData) {
        console.log(
          "All direct lookups failed. Trying fallback method to find onboarding data"
        );

        // Dump the first few onboarding records for debugging
        const sampleRecords = await prisma.onboardingData.findMany({
          take: 3,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userId: true,
            jobTitle: true,
            User: {
              select: {
                id: true,
                user_id: true,
                email: true,
              },
            },
          },
        });
        console.log(
          "Sample onboarding records for debugging:",
          JSON.stringify(sampleRecords, null, 2)
        );

        // Try using the user_id field as fallback
        const userRecord = await prisma.user.findFirst({
          where: { user_id: user.id },
        });
        console.log(
          "User record lookup result:",
          userRecord ? `Found with ID: ${userRecord.id}` : "Not found"
        );

        if (userRecord) {
          const onboardingByUserRelation =
            await prisma.onboardingData.findFirst({
              where: { userId: userRecord.id },
              orderBy: { createdAt: "desc" },
            });
          console.log(
            "Onboarding data by relation lookup:",
            onboardingByUserRelation ? "Found" : "Not found"
          );

          if (onboardingByUserRelation) {
            onboardingData = onboardingByUserRelation;
            console.log("Found onboarding data via user relation");
          } else {
            console.log("Onboarding data not found through any method");
            return NextResponse.json(
              {
                error:
                  "Onboarding data not found. Please complete your profile.",
              },
              { status: 404 }
            );
          }
        } else {
          console.log("No user record found in database");
          return NextResponse.json(
            {
              error: "Onboarding data not found. Please complete your profile.",
            },
            { status: 404 }
          );
        }
      }
    }

    console.log("Onboarding data retrieved:", {
      id: onboardingData.id,
      userId: onboardingData.userId,
      jobTitle: onboardingData.jobTitle,
      experience: onboardingData.experience,
      topSkills: onboardingData.topSkills,
      industries: onboardingData.industryInterest,
    });

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
    console.log("Calling OpenAI API to generate career recommendations");
    console.log("OpenAI prompt:", prompt);

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
    console.log("OpenAI API call completed");

    // Parse the response
    const responseText = completion.choices[0].message.content;
    console.log("OpenAI raw response:", responseText);
    let responseData;

    try {
      console.log("Attempting to parse response with regex extraction");
      // Try to extract JSON from the text in case it's wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/) || [
        null,
        responseText,
      ];
      const cleanedJson = jsonMatch[1].trim();
      console.log("Cleaned JSON:", cleanedJson);
      responseData = JSON.parse(cleanedJson);
      console.log("JSON parsed successfully from regex extraction");
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.log("Parse error details:", parseError.message);
      console.log("Raw response for debugging:", responseText);

      // Last attempt - try to find JSON object pattern
      try {
        console.log("Attempting alternative JSON object pattern extraction");
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          console.log("JSON object pattern found");
          const extractedJson = jsonObjectMatch[0];
          console.log("Extracted JSON:", extractedJson);
          responseData = JSON.parse(extractedJson);
          console.log("Alternative JSON parsing successful");
        } else {
          console.error("No JSON pattern found in the response");
          return NextResponse.json(
            { error: "Failed to process AI response. Please try again." },
            { status: 500 }
          );
        }
      } catch (finalError) {
        console.error("Final JSON parsing attempt failed:", finalError.message);
        return NextResponse.json(
          { error: "Failed to process AI response. Please try again." },
          { status: 500 }
        );
      }
    }

    const careerPaths = responseData?.recommendations || [];
    console.log(`Extracted ${careerPaths.length} career paths from response`);

    if (!careerPaths.length) {
      console.error("No career paths found in the response");
      return NextResponse.json(
        { error: "Failed to generate recommendations. Please try again." },
        { status: 500 }
      );
    }

    // Save recommendations to the database with auto-generated IDs
    console.log("Saving recommendations to database");
    const savedRecommendations = await Promise.all(
      careerPaths.map(async (path, index) => {
        console.log(`Saving career path ${index + 1}: ${path.title}`);
        try {
          // Let Prisma auto-generate the ID using cuid()
          const saved = await prisma.careerRecommendation.create({
            data: {
              // Omit id field - Prisma will generate it automatically
              userId: user.id,
              title: path.title,
              matchPercentage: parseInt(path.match.toString().replace("%", "")),
              description: path.description,
              skills: path.skills,
              growthOutlook: path.growth,
              salaryRange: path.salary,
            },
          });
          console.log(`Career path saved with ID: ${saved.id}`);
          return saved;
        } catch (saveError) {
          console.error(`Error saving career path ${index + 1}:`, saveError);
          throw saveError;
        }
      })
    );
    console.log("All recommendations saved successfully");

    return NextResponse.json({ recommendations: savedRecommendations });
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    console.error("Error stack trace:", error.stack);
    return NextResponse.json(
      { error: "Failed to generate recommendations: " + error.message },
      { status: 500 }
    );
  }
}
