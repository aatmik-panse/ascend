import { getUser } from "@/queries/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const encodedRedirectTo = requestUrl.searchParams.get("redirect") || "/layoff_risk";
    const priceId = decodeURIComponent(requestUrl.searchParams.get("priceId") || "");
    const discountCode = decodeURIComponent(requestUrl.searchParams.get("discountCode") || "");
    const redirectTo = decodeURIComponent(encodedRedirectTo);

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    const supabase = await createClient();
    const cookieStore = await cookies();

    // Exchange the code for a session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    await cookies().getAll();

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    if (!session) {
      console.error('No session created after code exchange');
      return NextResponse.redirect(new URL('/login?error=session_failed', request.url));
    }

    // Get the user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
    }

    // Set full_name to email part before @ if no name is provided
    let displayName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (!displayName) {
      displayName = user.email.split('@')[0];
      // Update user metadata with this name
      if (!user.user_metadata) {
        user.user_metadata = {};
      }
      user.user_metadata.full_name = displayName;
    }

    // Check if user exists in the users table
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    console.log("user data from sb " , user)
    
    // Create user profile if it doesn't exist
    if (!existingProfile) {
      const { error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: displayName,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        auth_provider: user.app_metadata?.provider || 'email',
        email_verified: user.email_confirmed_at ? true : false,
        phone: user.phone || null,
        created_at: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString(),
        provider_sub: user.user_metadata?.iss || null,
        is_anonymous: user.is_anonymous || false,
        role: user.role || 'user'
      });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // Log the error but continue with redirect
      }
    }

    // Set session cookies
    const response = NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
    
    // Set the session cookie
    response.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Set the refresh token cookie
    response.cookies.set('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Handle priceId if present (for subscription flow)
    if (priceId && priceId !== "") {
      // Add your subscription logic here
      // await createCheckoutSession({ priceId, discountCode });
    }

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
