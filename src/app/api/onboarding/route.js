import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import supabase from '@/lib/supabase';

// This function handles the POST request for onboarding data
export async function POST(request) {
  try {
    // Use Supabase auth only
    let session = null;
    
    // Get user from Supabase auth
    const authHeader = request.headers.get('Authorization');
    let supabaseUser = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);
      
      if (!error && data?.user) {
        supabaseUser = data.user;
      }
    }
    
    // Parse the request body
    const onboardingData = await request.json();
    
    // Validate required fields
    if (!onboardingData.jobTitle) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }
    
    // Prepare data for database - handle topSkills array properly
    // Filter out empty skills
    const topSkills = Array.isArray(onboardingData.topSkills) 
      ? onboardingData.topSkills.filter(Boolean) 
      : [];
    
    // Determine user ID from Supabase
    const userId = supabaseUser?.id || null;
    
    // If using Supabase, check if user exists in our Prisma DB
    // If not, create a user record from Supabase data
    if (supabaseUser) {
      const existingUser = await prisma.user.findUnique({
        where: { 
          email: supabaseUser.email 
        }
      });
      
      if (!existingUser) {
        // Create a new user record based on Supabase user data
        await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            full_name: supabaseUser.user_metadata?.full_name,
            avatar_url: supabaseUser.user_metadata?.avatar_url,
            auth_provider: supabaseUser.app_metadata?.provider || 'supabase',
            email_verified: supabaseUser.email_confirmed_at ? true : false,
            provider_id: supabaseUser.app_metadata?.provider,
            provider_sub: supabaseUser.app_metadata?.sub,
            last_sign_in_at: new Date(supabaseUser.last_sign_in_at),
            is_anonymous: false,
            role: 'user'
          }
        });
      }
    }
    
    // Create record in database
    const result = await prisma.onboardingData.create({
      data: {
        // Connect to user if we have a user ID
        ...(userId ? { userId } : {}),
        
        jobTitle: onboardingData.jobTitle,
        company: onboardingData.company || null,
        experience: onboardingData.experience || null,
        jobStability: onboardingData.jobStability || 3,
        salaryRange: onboardingData.salarRange || null, // Note the field name matches frontend
        topSkills: topSkills,
        timeForGrowth: onboardingData.timeForGrowth || null,
        linkedinUrl: onboardingData.linkedinUrl || null,
        biggestConcern: onboardingData.biggestConcern || null,
      }
    });
    
    // Optionally, also store in Supabase if needed
    if (supabaseUser) {
      // Insert the same data into Supabase
      const { error } = await supabase
        .from('onboarding_data')
        .insert({
          user_id: supabaseUser.id,
          job_title: onboardingData.jobTitle,
          company: onboardingData.company,
          experience: onboardingData.experience,
          job_stability: onboardingData.jobStability,
          salary_range: onboardingData.salarRange,
          top_skills: topSkills,
          time_for_growth: onboardingData.timeForGrowth,
          linkedin_url: onboardingData.linkedinUrl,
          biggest_concern: onboardingData.biggestConcern
        });
        
      if (error) {
        console.error("Supabase insertion error:", error);
        // Continue anyway since Prisma insertion succeeded
      }
    }
    
    // Return success response with the created data
    return NextResponse.json(
      { 
        message: "Onboarding data saved successfully",
        data: result
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    
    // Provide more specific error messages for common database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A record for this user already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to retrieve onboarding data
export async function GET(request) {
  try {
    // Only use Supabase auth
    let session = null;
    
    // Check for Supabase token
    const authHeader = request.headers.get('Authorization');
    let supabaseUser = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);
      
      if (!error && data?.user) {
        supabaseUser = data.user;
      }
    }
    
    // Determine user ID from Supabase
    const userId = supabaseUser?.id;
    
    if (userId) {
      // Get data from Prisma
      const data = await prisma.onboardingData.findFirst({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (data) {
        return NextResponse.json({ data });
      }
      
      // If not found in Prisma but we have a Supabase user, try Supabase
      if (supabaseUser) {
        const { data: supabaseData, error } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!error && supabaseData) {
          return NextResponse.json({ data: supabaseData });
        }
      }
      
      return NextResponse.json(
        { error: "No onboarding data found for this user" },
        { status: 404 }
      );
    }
    
    // If no authenticated user, return most recent entry (for development)
    const data = await prisma.onboardingData.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
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
      { error: "Failed to retrieve onboarding data" },
      { status: 500 }
    );
  }
}
