"use server";
import { z } from "zod";
import { validatedAction } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcrypt";
import { getCallbackUrl } from "@/utils/getCallbackUrl";
import prisma from "@/lib/prisma";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

  console.log(`Sign in attempt: ${email}`);

  try {
    // Attempt to sign in with email and password
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return { error: "Invalid email or password. Please try again." };
    }

    if (!signInData?.user) {
      console.error("No user returned from successful auth");
      return { error: "No user found. Please check your credentials." };
    }

    console.log(`User signed in: ${signInData.user.email}`);

    // Check if user exists in Prisma database
    let userRecord = await prisma.user.findFirst({
      where: {
        OR: [{ user_id: signInData.user.id }, { email: signInData.user.email }],
      },
    });

    // If user doesn't exist in Prisma, create the profile
    if (!userRecord) {
      console.log(`Creating profile for user: ${signInData.user.id}`);
      try {
        userRecord = await prisma.user.create({
          data: {
            user_id: signInData.user.id,
            email: signInData.user.email,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        console.log("User profile created in Prisma");
      } catch (createError) {
        console.error("Error creating user profile in Prisma:", createError);
        // Continue with redirect even if profile creation fails
      }
    }

    // Successful sign in, redirect to dashboard
    console.log("Redirecting to onboarding");
    redirect("/onboarding");
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  origin: z.string().optional(),
});

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const signUp = validatedAction(signUpSchema, async (data) => {
  const supabase = await createClient();
  const { email, password, origin } = data;

  console.log(`Sign up process: ${email}`);

  // Get the dynamic callback URL
  const callbackUrl = getCallbackUrl();
  console.log(`Using callback URL: ${callbackUrl}`);

  try {
    // Check if user already exists in auth
    const { data: existingUser } = await supabase.auth.getUser();

    // First, create the user in Supabase Auth
    console.log("Creating user in Supabase Auth");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: `${callbackUrl}/api/auth/callback`,
        },
      }
    );

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return { error: signUpError.message };
    }

    // Check if user profile already exists in Prisma
    console.log("Checking if user profile already exists");
    const existingProfile = await prisma.user.findUnique({
      where: { email },
    });

    const passwordHash = await hashPassword(password);

    // Only create user entry if it doesn't exist
    if (signUpData?.user && !existingProfile) {
      console.log("Creating user profile in Prisma database");
      try {
        await prisma.user.create({
          data: {
            user_id: signUpData.user.id,
            email: signUpData.user.email,
            created_at: new Date(),
            updated_at: new Date(),
            passwordHash: passwordHash,
          },
        });
        console.log("User profile created in Prisma");
      } catch (prismaError) {
        console.error("Error creating user in Prisma:", prismaError);
      }
    }

    // Always return success message for email verification
    console.log("Sign up completed, verification email sent");
    return {
      success:
        "Please check your email for the confirmation link. Click the link to verify your account.",
      requiresConfirmation: true,
    };
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
});

export const signInWithMagicLink = validatedAction(
  z.object({
    email: z.string().email(),
    redirect: z.string().optional(),
    origin: z.string().optional(),
    priceId: z.string().optional(),
  }),

  async (data) => {
    const supabase = await createClient();
    const { email, priceId, redirect: customRedirect, origin } = data;

    console.log(`Magic link sign-in: ${email}`);

    // Get the dynamic callback URL
    const callbackUrl = getCallbackUrl();
    const redirectTo = `${callbackUrl}/api/auth/callback`;

    console.log(`Magic link URL: ${redirectTo}`);

    const { data: otpData, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&redirect=${encodeURIComponent(customRedirect || "/onboarding")}`,
      },
    });

    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    console.log("Magic link sent successfully");
    return { success: "Magic link sent to your email." };
  }
);

export const signInWithGoogle = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const supabase = await createClient();
  const priceId = formData.get("priceId");
  const discountCode = formData.get("discountCode") || "";

  console.log("Starting Google sign-in process");

  try {
    // Get the dynamic callback URL
    const callbackUrl = getCallbackUrl();
    const redirectTo = `${callbackUrl}/api/auth/callback`;

    console.log(`Google auth redirectTo: ${redirectTo}`);
    console.log(`Current environment: ${process.env.NODE_ENV}`);

    // Attempt to get current URL if we're client-side
    if (typeof window !== "undefined") {
      console.log(`Browser URL: ${window.location.origin}`);
    }

    console.log("Calling Supabase auth.signInWithOAuth");
    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&discountCode=${encodeURIComponent(
          discountCode || ""
        )}&redirect=${encodeURIComponent("/onboarding")}`,
      },
    });

    if (signInError) {
      console.error("Google sign-in error:", signInError);
      return { error: "Failed to sign in with Google. Please try again." };
    }

    console.log("OAuth redirect initiated");
  } catch (error) {
    console.error("Unexpected error during Google sign-in:", error);
    return { error: "Failed to sign in with Google. Please try again." };
  }
};

export const signOut = async () => {
  console.log("Signing out user");
  const supabase = await createClient();
  await supabase.auth.signOut();
  console.log("User signed out, redirecting to home page");
  redirect("/");
};
