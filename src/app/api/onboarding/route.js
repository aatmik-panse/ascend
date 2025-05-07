import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import supabase from "@/lib/supabase";

// This function handles the POST request for onboarding data
export async function POST(request) {
  try {
    // Use Supabase auth only
    let session = null;

    // Get user from Supabase auth
    const authHeader = request.headers.get("Authorization");
    let supabaseUser = null;
    let prismaUser = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);

      if (!error && data?.user) {
        supabaseUser = data.user;

        // Now fetch user data from Prisma as well
        prismaUser = await prisma.user.findFirst({
          where: {
            OR: [{ user_id: supabaseUser.id }, { email: supabaseUser.email }],
          },
        });
      }
    }

    // Parse the request body
    const onboardingData = await request.json();

    // Add detailed logging for debugging
    console.log(
      "Received onboarding data:",
      JSON.stringify(onboardingData, null, 2)
    );

    console.log(
      "Current user:",
      supabaseUser
        ? `ID: ${supabaseUser.id}, Email: ${supabaseUser.email}`
        : "Not authenticated"
    );

    let userId = null;

    // If we have a Supabase user, get or create corresponding Prisma user
    if (supabaseUser) {
      // First check if there's already a user with this email
      const existingUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email },
      });

      if (existingUser) {
        userId = existingUser.id;
        console.log(`Found existing user with ID: ${userId}`);
      } else {
        // Create a new user record based on Supabase user data
        const newUser = await prisma.user.create({
          data: {
            id: supabaseUser.id, // Use the Supabase ID as the Prisma ID
            user_id: supabaseUser.id, // Also store as user_id for compatibility
            email: supabaseUser.email,
            full_name:
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.user_metadata?.name,
            avatar_url:
              supabaseUser.user_metadata?.avatar_url ||
              supabaseUser.user_metadata?.picture,
            auth_provider: supabaseUser.app_metadata?.provider || "supabase",
            email_verified: supabaseUser.email_confirmed_at ? true : false,
            provider_id: supabaseUser.app_metadata?.provider,
            provider_sub: supabaseUser.app_metadata?.sub,
            last_sign_in_at: new Date(
              supabaseUser.last_sign_in_at || Date.now()
            ),
            updated_at: new Date(),
            is_anonymous: false,
            role: "user",
          },
        });

        userId = newUser.id;
        console.log(`Created new user with ID: ${userId}`);
      }

      // Check if user already has onboarding data
      if (userId) {
        const existingOnboardingData = await prisma.onboardingData.findFirst({
          where: {
            OR: [
              { userId },
              { User: { id: userId } },
              { User: { user_id: supabaseUser.id } },
            ],
          },
        });

        if (existingOnboardingData) {
          console.log(
            `User ${userId} already has onboarding data (ID: ${existingOnboardingData.id})`
          );
          return NextResponse.json(
            {
              error: "Onboarding data already exists for this user",
              message:
                "You have already completed onboarding. To update your profile, please use the profile edit feature.",
              existingDataId: existingOnboardingData.id,
            },
            { status: 409 }
          );
        }
      }
    }

    // Create the data object with the JSON field as primary storage
    const createData = {
      // Connect to the User by ID if available
      ...(userId
        ? {
            User: {
              connect: { id: userId },
            },
          }
        : {}),

      // Store all 50 question responses as the primary data source
      detailedResponses: onboardingData,

      // For backward compatibility, extract some fields for existing queries
      // All these fields are now optional in the schema
      jobTitle: onboardingData.jobTitle || null,
      experience: onboardingData.experience || onboardingData.q26 || null,
      motivators: onboardingData.motivators || null,
      timeForGrowth: onboardingData.timeForGrowth || onboardingData.q12 || null,
      industryInterest: onboardingData.industryInterest || null,
      topSkills: Array.isArray(onboardingData.topSkills)
        ? onboardingData.topSkills.filter(Boolean)
        : [],
      enjoyDislike: onboardingData.enjoyDislike || null,
      linkedinUrl: onboardingData.linkedinUrl || null,
      biggestConcern: onboardingData.biggestConcern || null,
    };

    // Log the full data object being sent to Prisma
    console.log(
      "Data being sent to Prisma:",
      JSON.stringify(createData, null, 2)
    );

    const result = await prisma.onboardingData.create({
      data: createData,
    });

    console.log(`Successfully created onboarding record:`, result);

    // Return success response with the created data
    return NextResponse.json(
      {
        message: "Onboarding data saved successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving onboarding data:", error);

    // Provide more specific error messages based on the error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A record for this user already exists" },
        { status: 409 }
      );
    }

    // Include the error message and stack trace for debugging
    return NextResponse.json(
      {
        error: "Failed to save onboarding data",
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to retrieve onboarding data
export async function GET(request) {
  try {
    const supabase = createClient();

    // Check for Supabase user
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
    }

    // Determine user ID from Supabase
    const userId = supabaseUser?.id;

    if (userId) {
      console.log(`Looking for onboarding data for user: ${userId}`);

      // Get data from Prisma - using the correct relation field
      let data = await prisma.onboardingData.findFirst({
        where: {
          OR: [
            { userId },
            { User: { id: userId } },
            { User: { user_id: userId } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          User: true,
        },
      });

      if (data) {
        console.log("Found onboarding data in Prisma");
        return NextResponse.json({ data });
      }

      return NextResponse.json(
        { error: "No onboarding data found for this user" },
        { status: 404 }
      );
    }

    // If no authenticated user, return most recent entry (for development)
    console.log("No authenticated user, returning most recent entry");
    const data = await prisma.onboardingData.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "No onboarding data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error retrieving onboarding data:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve onboarding data",
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
