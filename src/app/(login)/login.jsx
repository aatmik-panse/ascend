"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Key, LogIn } from "lucide-react";
import { signInWithMagicLink, signIn, signUp } from "./actions";
import { useActionState, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import config from "@/utils/config";
import { motion } from "framer-motion";
import Image from "next/image";

export function Login({ mode = "signin" }) {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState("password"); // "password" or "magic"
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const discountCode = searchParams.get("discountCode");
  const [callbackUrl, setCallbackUrl] = useState("");

  // Set the callback URL when component mounts
  useEffect(() => {
    setCallbackUrl(window.location.origin);
    console.log("Current origin:", window.location.origin);
  }, []);

  const handleGoogleSignIn = () => {
    const redirectUrl = `${
      callbackUrl || window.location.origin
    }/api/auth/callback`;
    console.log("Google sign-in redirect URL:", redirectUrl);
    setLoading(true);

    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}?priceId=${encodeURIComponent(
          priceId || ""
        )}&discountCode=${encodeURIComponent(
          discountCode || ""
        )}&redirect=${encodeURIComponent("/onboarding")}`,
      },
    });
  };

  const [magicLinkState, magicLinkAction, pending] = useActionState(
    signInWithMagicLink,
    { error: "", success: "" }
  );

  const [passwordState, passwordAction, passwordPending] = useActionState(
    signIn,
    { error: "" }
  );

  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, {
    error: "",
    success: "",
    requiresConfirmation: false,
  });

  const handleMagicLinkSubmit = async (formData) => {
    formData.append("origin", window.location.origin);
    return magicLinkAction(formData);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay blur-3xl animate-pulse"
          style={{ animationDuration: "15s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-zinc-700/5 rounded-full mix-blend-overlay blur-3xl animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-zinc-800/5 rounded-full mix-blend-overlay blur-3xl animate-pulse"
          style={{ animationDuration: "20s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('/noise.webp')] opacity-[0.015] mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg rotate-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Certcy Logo"
                width={50}
                height={50}
                className="relative z-10 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="relative bg-white border border-gray-200 shadow-md rounded-xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-gray-200/30 to-gray-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-gradient-to-br from-gray-300/20 to-gray-200/20 rounded-full blur-3xl"></div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-800 mb-1"
          >
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-center text-gray-600 mb-8"
          >
            {mode === "signin"
              ? "Sign in to continue to your dashboard"
              : "Join us and start your career journey"}
          </motion.p>

          <div className="space-y-6">
            {magicLinkState?.success || signUpState?.success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-emerald-800">
                  Check your email
                </h3>
                <p className="mt-2 text-sm text-emerald-600">
                  {magicLinkState?.success || signUpState?.success}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="bg-gray-100 rounded-xl p-1 shadow-inner">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setAuthMethod("password")}
                      className={`py-3 rounded-lg transition-all duration-300 ${
                        authMethod === "password"
                          ? "bg-black text-white font-medium shadow-lg"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod("magic")}
                      className={`py-3 rounded-lg transition-all duration-300 ${
                        authMethod === "magic"
                          ? "bg-black text-white font-medium shadow-lg"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Magic Link
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  {authMethod === "password" && (
                    <form
                      action={mode === "signin" ? passwordAction : signUpAction}
                      className="space-y-5"
                    >
                      <div className="space-y-1">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="pl-11 h-12 bg-white text-gray-800 rounded-xl border border-gray-300 shadow-inner transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          {mode === "signin" && (
                            <Link
                              href="/forgot-password"
                              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              Forgot password?
                            </Link>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-11 h-12 bg-white text-gray-800 rounded-xl border border-gray-300 shadow-inner transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                          />
                          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="origin"
                        value={callbackUrl || "https://certcy.space"}
                      />
                      <button
                        type="submit"
                        className="w-full h-12 font-medium text-white bg-black rounded-xl transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white flex items-center justify-center"
                      >
                        {mode === "signin" ? (
                          passwordPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <span className="flex items-center">
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign in
                            </span>
                          )
                        ) : signUpPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </form>
                  )}

                  {authMethod === "magic" && (
                    <form action={handleMagicLinkSubmit} className="space-y-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="magic-email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Input
                            id="magic-email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="pl-11 h-12 bg-white text-gray-800 rounded-xl border border-gray-300 shadow-inner transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="priceId"
                        value={priceId || ""}
                      />
                      <input
                        type="hidden"
                        name="discountCode"
                        value={discountCode || ""}
                      />
                      <input
                        type="hidden"
                        name="redirect"
                        value={redirect || ""}
                      />
                      <input
                        type="hidden"
                        name="origin"
                        value={callbackUrl || "https://certcy.space"}
                      />
                      <button
                        type="submit"
                        className="w-full h-12 font-medium text-white bg-black rounded-xl transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white flex items-center justify-center"
                      >
                        {pending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <span className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Magic Link
                          </span>
                        )}
                      </button>
                    </form>
                  )}

                  <div className="flex items-center my-6">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    ></motion.div>
                    <div className="px-4 text-sm text-gray-500">
                      or continue with
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    ></motion.div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 font-medium text-gray-700 bg-white rounded-xl border border-gray-300 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="mr-3 w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                          viewBox="0 0 24 24"
                        >
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
                  </motion.button>
                </motion.div>
              </>
            )}

            {(magicLinkState?.error ||
              passwordState?.error ||
              signUpState?.error) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-red-500">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">
                      {magicLinkState?.error ||
                        passwordState?.error ||
                        signUpState?.error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-sm text-center text-gray-600"
            >
              {mode === "signin"
                ? "New to our platform? "
                : "Already have an account? "}
              <Link
                href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
                className="font-medium text-gray-800 hover:text-black transition-colors hover:underline underline-offset-2"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </Link>
            </motion.p>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            {callbackUrl ? `Using URL: ${callbackUrl}` : "URL not set yet"}
          </div>
        )}
      </motion.div>
    </div>
  );
}
