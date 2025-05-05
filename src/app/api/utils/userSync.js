import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Ensures that a Supabase user exists in the Prisma database
 * Creates the user if they don't exist
 *
 * @param {object} supabaseUser - User object from Supabase auth
 * @returns {object} - The user record from the database
 */
export async function ensureUserExists(supabaseUser) {
  if (!supabaseUser || !supabaseUser.id) {
    throw new Error("Invalid user data provided");
  }

  // First try to find user by id or user_id (covers both fields)
  let dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: supabaseUser.id },
        { user_id: supabaseUser.id },
        { email: supabaseUser.email },
      ],
    },
  });

  // If user exists, return it
  if (dbUser) {
    return dbUser;
  }

  // If user doesn't exist, create a new one
  try {
    dbUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        user_id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name,
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        auth_provider: supabaseUser.app_metadata?.provider,
        email_verified: supabaseUser.email_verified || false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return dbUser;
  } catch (error) {
    // If creation failed due to conflicts, try one more time to find the user
    // (Could happen in race conditions when multiple requests try to create the same user)
    if (error.code === "P2002") {
      // Unique constraint error
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: supabaseUser.id },
            { user_id: supabaseUser.id },
            { email: supabaseUser.email },
          ],
        },
      });

      if (existingUser) {
        return existingUser;
      }
    }

    // If we still can't find the user, rethrow the error
    throw error;
  }
}
