import { getUser } from "@/queries/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import config from "@/utils/config";
import { authLogger } from "@/utils/logger";

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const encodedRedirectTo =
      requestUrl.searchParams.get("redirect") || "/onboarding";
    const priceId = decodeURIComponent(
      requestUrl.searchParams.get("priceId") || ""
    );
    const discountCode = decodeURIComponent(
      requestUrl.searchParams.get("discountCode") || ""
    );
    const redirectTo = decodeURIComponent(encodedRedirectTo);

    authLogger("callback", "Auth callback initiated", {
      url: request.url,
      code: code ? "present" : "missing",
      redirectTo,
      priceId: priceId || "none",
      discountCode: discountCode || "none",
      headers: Object.fromEntries(request.headers),
      nodeEnv: process.env.NODE_ENV,
    });

    if (!code) {
      authLogger("callback", "No code provided in callback", null, "error");
      return NextResponse.redirect(
        new URL("/sign-in?error=no_code", config.domainName)
      );
    }

    const supabase = await createClient();
    authLogger("callback", "Supabase client created");

    // Exchange the code for a session
    authLogger("callback", "Exchanging code for session");
    const {
      data: { session },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      authLogger(
        "callback",
        "Error exchanging code for session",
        exchangeError,
        "error"
      );
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_failed", config.domainName)
      );
    }

    if (!session) {
      authLogger(
        "callback",
        "No session created after code exchange",
        null,
        "error"
      );
      return NextResponse.redirect(
        new URL("/sign-in?error=session_failed", config.domainName)
      );
    }

    authLogger("callback", "Session created successfully", {
      sessionId: session.user.id,
      email: session.user.email,
    });

    // Get the authenticated user from Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      authLogger("callback", "Error getting user", userError, "error");
      return NextResponse.redirect(
        new URL("/sign-in?error=user_not_found", config.domainName)
      );
    }

    // Set full_name to email part before @ if no name is provided
    let displayName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (!displayName) {
      displayName = user.email.split("@")[0];
      // Update user metadata with this name
      if (!user.user_metadata) {
        user.user_metadata = {};
      }
      user.user_metadata.full_name = displayName;
    }

    // Get complete user data from Prisma database
    let userData = null;
    try {
      userData = await prisma.user.findFirst({
        where: {
          OR: [{ user_id: user.id }, { email: user.email }],
        },
      });

      authLogger("callback", "User data fetched from database", {
        prismaUserFound: !!userData,
        prismaUserId: userData?.id,
      });
    } catch (dbError) {
      authLogger(
        "callback",
        "Error fetching user data from database",
        dbError,
        "error"
      );
      // Continue with authentication flow even if we can't fetch user data
    }

    // Check if user exists in Prisma database
    const existingProfile = userData; // Use the userData we fetched above

    authLogger("callback", "User data checked in database", {
      exists: !!existingProfile,
      id: existingProfile?.id,
    });

    // Create user profile if it doesn't exist
    if (!existingProfile) {
      authLogger("callback", "Creating new user profile in database");

      try {
        // Create user in Prisma
        await prisma.user.create({
          data: {
            user_id: user.id,
            email: user.email,
            full_name: displayName,
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

        authLogger("callback", "User profile created successfully");
      } catch (insertError) {
        authLogger(
          "callback",
          "Error creating user profile",
          insertError,
          "error"
        );
        // Log the error but continue with redirect
      }
    }

    // Set session cookies
    authLogger("callback", "Creating redirect response");
    const response = NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);

    authLogger("callback", "Setting session cookies");
    // Set the session cookie
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set the refresh token cookie
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Handle priceId if present (for subscription flow)
    if (priceId && priceId !== "") {
      authLogger("callback", "Handling subscription flow", {
        priceId,
        discountCode,
      });
      // Add your subscription logic here
      // await createCheckoutSession({ priceId, discountCode });
    }

    authLogger(
      "callback",
      "Auth callback completed successfully, redirecting",
      {
        destination: `${requestUrl.origin}${redirectTo}`,
      }
    );
    return response;
  } catch (error) {
    authLogger("callback", "Unexpected error in auth callback", error, "error");
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_callback_error", config.domainName)
    );
  }
}
