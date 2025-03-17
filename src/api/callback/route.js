import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const priceId = requestUrl.searchParams.get('priceId');
  const discountCode = requestUrl.searchParams.get('discountCode');

  if (code) {
    try {
      // Create a response to modify cookies
      const response = NextResponse.redirect(`${requestUrl.origin}${redirect}`);
      
      // Create Supabase client with cookie handling
      const supabase = createRouteHandlerClient({ 
        cookies: () => cookies(),
      });
      
      // Exchange the code for a session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return NextResponse.redirect(`${requestUrl.origin}/signin?error=session_error`);
      }

      // Get user data from the session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        return NextResponse.redirect(`${requestUrl.origin}/signin?error=user_error`);
      }

      // Check if user profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile check error:', profileError);
        return NextResponse.redirect(`${requestUrl.origin}/signin?error=profile_error`);
      }

      // If no profile exists, create one with all relevant user data
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            auth_provider: user.app_metadata?.provider || 'email',
            email_verified: user.email_confirmed_at ? true : false,
            phone: user.phone || null,
            created_at: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString(),
            last_sign_in_at: user.last_sign_in_at ? new Date(user.last_sign_in_at).toISOString() : new Date().toISOString(),
            updated_at: user.updated_at ? new Date(user.updated_at).toISOString() : new Date().toISOString(),
            provider_id: user.user_metadata?.provider_id || null,
            provider_sub: user.user_metadata?.sub || null,
            is_anonymous: user.is_anonymous || false,
            role: user.role || 'user'
          });

        if (insertError) {
          console.error('Profile creation error:', insertError);
          return NextResponse.redirect(`${requestUrl.origin}/signin?error=profile_creation_error`);
        }
      }

      // Handle subscription if priceId is provided
      if (priceId) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            price_id: priceId,
            status: 'active',
            discount_code: discountCode || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subscriptionError) {
          console.error('Subscription error:', subscriptionError);
          return NextResponse.redirect(`${requestUrl.origin}/signin?error=subscription_error`);
        }
      }

      // Set the session cookies
      response.cookies.set('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      response.cookies.set('sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/signin?error=callback_error`);
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect(`${requestUrl.origin}/signin`);
}
