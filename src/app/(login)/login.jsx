"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInWithMagicLink, signIn, signUp } from "./actions";
import { useActionState, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import config from "@/utils/config";

export function Login({ mode = "signin" }) {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState("password"); // "password" or "magic"
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const discountCode = searchParams.get("discountCode");

  const handleGoogleSignIn = () => {
    const redirectTo = `${config.domainName}/api/auth/callback`;
    setLoading(true);
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&discountCode=${encodeURIComponent(
          discountCode || ""
        )}&redirect=${encodeURIComponent("/layoff_risk")}`,
      },
    });
    console.log('redirectTo', redirectTo)
    console.log("supabase user ", supabase)
    setLoading(false);
  };

  const [magicLinkState, magicLinkAction, pending] = useActionState(
    signInWithMagicLink,
    { error: "", success: "" }
  );

  const [passwordState, passwordAction, passwordPending] = useActionState(
    signIn,
    { error: "" }
  );

  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    { error: "", success: "", requiresConfirmation: false }
  );

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          {/* Logo placeholder - add your dark mode logo here */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-center text-white">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-center text-gray-400">
          {mode === "signin"
            ? "Sign in to continue to your account"
            : "Get started with your new account"}
        </p>

        <div className="mt-10">
          {(magicLinkState?.success || signUpState?.success) ? (
            <div className="p-6 text-center bg-emerald-900/30 border border-emerald-700 rounded-xl">
              <h3 className="text-sm font-medium text-emerald-400">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-emerald-300">
                {magicLinkState?.success || signUpState?.success}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Auth Method Toggle */}
              <div className="flex justify-center space-x-4 mb-6">
                <Button
                  type="button"
                  variant={authMethod === "password" ? "default" : "outline"}
                  onClick={() => setAuthMethod("password")}
                  className="flex-1"
                >
                  Password
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "magic" ? "default" : "outline"}
                  onClick={() => setAuthMethod("magic")}
                  className="flex-1"
                >
                  Magic Link
                </Button>
              </div>

              {/* Password Form */}
              {authMethod === "password" && (
                <form action={mode === "signin" ? passwordAction : signUpAction} className="space-y-4">
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="px-4 pl-10 h-12 bg-gray-800/50 text-gray-100 rounded-xl border-gray-700 shadow-lg transition-colors focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="relative">
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="px-4 pl-10 h-12 bg-gray-800/50 text-gray-100 rounded-xl border-gray-700 shadow-lg transition-colors focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    {mode === "signin" ? (
                      passwordPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Sign in with Password"
                      )
                    ) : (
                      signUpPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Create Account"
                      )
                    )}
                  </Button>
                </form>
              )}

              {/* Magic Link Form */}
              {authMethod === "magic" && (
                <form action={magicLinkAction} className="space-y-4">
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="px-4 pl-10 h-12 bg-gray-800/50 text-gray-100 rounded-xl border-gray-700 shadow-lg transition-colors focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input type="hidden" name="priceId" value={priceId || ""} />
                  <input
                    type="hidden"
                    name="discountCode"
                    value={discountCode || ""}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    {pending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Continue with Magic Link"
                    )}
                  </Button>
                </form>
              )}

              <div className="relative">
                <div className="flex absolute inset-0 items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="flex relative justify-center">
                  <span className="px-4 text-sm text-gray-500 bg-gradient-to-b from-gray-900 to-gray-950">
                    or
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 font-medium text-gray-300 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transition-all hover:bg-gray-700/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex justify-center items-center">
                    <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            </div>
          )}

          {(magicLinkState?.error || passwordState?.error) && (
            <div className="mt-4 p-3 text-sm text-red-300 bg-red-900/30 border border-red-700/50 rounded-lg">
              {magicLinkState?.error || passwordState?.error}
            </div>
          )}

          <p className="mt-8 text-sm text-center text-gray-400">
            {mode === "signin"
              ? "New to our platform? "
              : "Already have an account? "}
            <Link
              href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                redirect ? `?redirect=${redirect}` : ""
              }${priceId ? `&priceId=${priceId}` : ""}`}
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
