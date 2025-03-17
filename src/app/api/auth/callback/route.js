import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const redirect = searchParams.get('redirect') || '/dashboard';
    const discountCode = searchParams.get('discountCode');
    const priceId = searchParams.get('priceId');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Here you would typically:
    // 1. Exchange the code for tokens
    // 2. Store the tokens securely
    // 3. Set up any necessary session data

    // For now, we'll just redirect to the specified redirect URL
    return NextResponse.redirect(new URL(redirect, request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
} 