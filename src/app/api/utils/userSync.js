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

  let dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  });

  if (!dbUser) {
    // Create the user in our database
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
  }

  return dbUser;
}
