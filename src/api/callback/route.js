import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect") || "/";
  const priceId = requestUrl.searchParams.get("priceId");
  const discountCode = requestUrl.searchParams.get("discountCode");

  if (code) {
    try {
      // Create a response to modify cookies
      const response = NextResponse.redirect(`${requestUrl.origin}${redirect}`);

      // Create Supabase client with cookie handling
      const supabase = createRouteHandlerClient({
        cookies: () => cookies(),
      });
      cookies().getAll();

      // Exchange the code for a session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(code);
      cookies().getAll();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return NextResponse.redirect(
          `${requestUrl.origin}/signin?error=session_error`
        );
      }

      // Get user data from the session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);
        return NextResponse.redirect(
          `${requestUrl.origin}/signin?error=user_error`
        );
      }

      // Check if user profile exists in Prisma
      const existingProfile = await prisma.user.findFirst({
        where: {
          OR: [{ user_id: user.id }, { email: user.email }],
        },
      });

      if (!existingProfile) {
        console.log("Creating new user profile in Prisma");

        try {
          // Create user profile in Prisma
          await prisma.user.create({
            data: {
              user_id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name || user.user_metadata?.name,
              avatar_url:
                user.user_metadata?.avatar_url || user.user_metadata?.picture,
              auth_provider: user.app_metadata?.provider || "email",
              email_verified: user.email_confirmed_at ? true : false,
              phone: user.phone || null,
              created_at: new Date(user.created_at || Date.now()),
              last_sign_in_at: new Date(user.last_sign_in_at || Date.now()),
              updated_at: new Date(),
              provider_id: user.user_metadata?.provider_id || null,
              provider_sub: user.user_metadata?.sub || null,
              is_anonymous: user.is_anonymous || false,
              role: user.role || "user",
            },
          });
        } catch (createError) {
          console.error("Profile creation error:", createError);
          return NextResponse.redirect(
            `${requestUrl.origin}/signin?error=profile_creation_error`
          );
        }
      }

      // Handle subscription if priceId is provided
      if (priceId) {
        try {
          await prisma.subscription.create({
            data: {
              userId: existingProfile?.id || user.id,
              priceId: priceId,
              status: "active",
              discountCode: discountCode || null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (subscriptionError) {
          console.error("Subscription error:", subscriptionError);
          return NextResponse.redirect(
            `${requestUrl.origin}/signin?error=subscription_error`
          );
        }
      }

      // Set the session cookies
      response.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      response.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=callback_error`
      );
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect(`${requestUrl.origin}/signin`);
}
