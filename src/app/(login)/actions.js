"use server";
import { z } from "zod";
import { validatedAction } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import config from "@/utils/config";
import bcrypt from "bcrypt";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

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
      return { error: "No user found. Please check your credentials." };
    }

    // Check if user exists in the users table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", signInData.user.id)
      .single();

    // If user doesn't exist in users table, create the profile
    if (userDataError && userDataError.code === "PGRST116") {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ 
          user_id: signInData.user.id,
          email: signInData.user.email,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        // Continue with redirect even if profile creation fails
      }
    }

    // Successful sign in, redirect to dashboard
    redirect("/onboarding");
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const signUp = validatedAction(signUpSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

  try {
    // Check if user already exists in auth
    const { data: existingUser } = await supabase.auth.getUser();

    // First, create the user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${config.domainName}/api/auth/callback`,
      },
    });

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return { error: signUpError.message };
    }

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email)
      .single();

    const passwordHash = hashPassword(password)

    // Only create users entry if it doesn't exist
    if (signUpData?.user && !existingProfile) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ 
          user_id: signUpData.user.id,
          email: signUpData.user.email,
          created_at: new Date().toISOString(),
          passwordHash: password
        });

      if (insertError) {
        console.error("Error creating users entry:", insertError);
        // Don't return error here as the user is still created in auth
      }
    }

    // Always return success message for email verification
    return { 
      success: "Please check your email for the confirmation link. Click the link to verify your account.",
      requiresConfirmation: true 
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
    // priceId: z.string().optional(),
  }),

  async (data) => {
    const supabase = await createClient();
    const { email, priceId } = data;
    const redirectTo = `${config.domainName}/api/auth/callback`;
    console.log("data",data);
    console.log("supabase data",supabase);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&redirect=${encodeURIComponent("/onboarding")}`,
      },
    });
    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    return { success: "Magic link sent to your email." };
  }
);

export const signInWithGoogle = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const supabase = await createClient();
  const priceId = formData.get("priceId");
  try {
    const redirectTo = `${config.domainName}/api/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&redirect=/onboarding`,
      },
    });
    if (signInError) {
      return { error: "Failed to sign in with Google. Please try again." };
    }
  } catch (error) {
    return { error: "Failed to sign in with Google. Please try again." };
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
