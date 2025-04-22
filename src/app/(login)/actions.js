"use server";
import { z } from "zod";
import { validatedAction } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcrypt";
import { getCallbackUrl } from "@/utils/getCallbackUrl";

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

    // Check if user exists in the users table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", signInData.user.id)
      .single();

    // If user doesn't exist in users table, create the profile
    if (userDataError && userDataError.code === "PGRST116") {
      console.log(`Creating profile for user: ${signInData.user.id}`);
      const { error: insertError } = await supabase.from("users").insert({
        user_id: signInData.user.id,
        email: signInData.user.email,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
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

    // Check if user profile already exists
    console.log("Checking if user profile already exists");
    const { data: existingProfile, error: profileError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email)
      .single();

    const passwordHash = await hashPassword(password);

    // Only create users entry if it doesn't exist
    if (signUpData?.user && !existingProfile) {
      console.log("Creating user profile in database");
      const { error: insertError } = await supabase.from("users").insert({
        user_id: signUpData.user.id,
        email: signUpData.user.email,
        created_at: new Date().toISOString(),
        passwordHash: passwordHash,
      });

      if (insertError) {
        console.error("Error creating users entry:", insertError);
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
