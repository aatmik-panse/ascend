import { NextResponse } from "next/server";
import { openaiService } from "@/utils/openai";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

// In-memory storage for chat messages (temporary solution until database is set up)
let chatMessages = [];
let chatConversations = [];

// Store conversation contexts (for maintaining conversation history with OpenAI)
const conversationContexts = new Map();

// Helper functions
function randomItem(itemArray) {
  return itemArray[Math.floor(Math.random() * itemArray.length)];
}

// Fetch user's onboarding data to provide context to the AI
async function getUserOnboardingData(userId) {
  if (!userId) return null;

  try {
    console.log(`Fetching onboarding data for user: ${userId}`);

    // Fetch onboarding data from Prisma with proper relations
    const onboardingData = await prisma.onboardingData.findFirst({
      where: {
        OR: [{ User: { id: userId } }, { User: { user_id: userId } }],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true, // Include user relation for verification
      },
    });

    if (onboardingData) {
      console.log(`Found onboarding data in Prisma for user: ${userId}`);
      return onboardingData;
    }

    // Secondary approach: direct query by userId if the relation approach fails
    const directOnboardingData = await prisma.onboardingData.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (directOnboardingData) {
      console.log(`Found onboarding data via direct userId query: ${userId}`);
      return directOnboardingData;
    }

    // Fallback to Supabase only if needed
    // const supabase = await createClient();
    // const { data, error } = await supabase
    //   .from("onboarding_data")
    //   .select("*")
    //   .eq("user_id", userId)
    //   .order("created_at", { ascending: false })
    //   .limit(1)
    //   .single();

    if (!error && data) {
      console.log(`Found onboarding data in Supabase for user: ${userId}`);
      return data;
    }

    console.log(`No onboarding data found for user: ${userId}`);
    return null;
  } catch (error) {
    console.error(`Error fetching onboarding data for user ${userId}:`, error);
    return null;
  }
}

// Format onboarding data into a context string for the AI
function formatUserContextFromOnboarding(onboardingData) {
  if (!onboardingData) return "";

  // Convert snake_case keys to camelCase if needed
  const data = {};
  Object.keys(onboardingData).forEach((key) => {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) =>
      letter.toUpperCase()
    );
    data[camelKey] = onboardingData[key];
  });

  // Build structured context
  return `
## USER PROFILE CONTEXT
Current Role: ${data.jobTitle || data.job_title || "Not specified"}
Experience Level: ${data.experience || "Not specified"}
Top Skills: ${
    Array.isArray(data.topSkills || data.top_skills)
      ? (data.topSkills || data.top_skills).join(", ")
      : "Not specified"
  }
Work Preferences: ${data.enjoyDislike || data.enjoy_dislike || "Not specified"}
Primary Motivators: ${data.motivators || "Not specified"}
Weekly Learning Time: ${
    data.timeForGrowth || data.time_for_growth || "Not specified"
  }
Industries of Interest: ${
    data.industryInterest || data.industry_interest || "Not specified"
  }
Main Career Concern: ${
    data.biggestConcern || data.biggest_concern || "Not specified"
  }

Please use this information to personalize your career guidance, but do not explicitly mention that you have this background data unless directly asked.
`;
}

// Function to generate AI response using OpenAI
async function generateAIResponse(message, conversationId, userId = null) {
  try {
    // Get or initialize conversation context
    if (!conversationContexts.has(conversationId)) {
      // Get user's onboarding data if userId is provided
      let userContext = "";
      if (userId) {
        const onboardingData = await getUserOnboardingData(userId);
        userContext = formatUserContextFromOnboarding(onboardingData);
      }

      // Initialize a new conversation with OpenAI
      const careerBot = await openaiService.getCareerCounselingBot();

      // Combine system prompt with user context
      const enhancedSystemPrompt =
        careerBot.systemPrompt + (userContext ? "\n\n" + userContext : "");

      conversationContexts.set(conversationId, {
        systemPrompt: enhancedSystemPrompt,
        messages: [{ role: "system", content: enhancedSystemPrompt }],
      });
    }

    // Get the conversation context
    const context = conversationContexts.get(conversationId);

    // Add user message to context
    context.messages.push({ role: "user", content: message });

    // Keep only the last 10 messages to avoid token limits
    if (context.messages.length > 11) {
      // system prompt + 10 messages
      context.messages = [
        { role: "system", content: context.systemPrompt },
        ...context.messages.slice(-10),
      ];
    }

    // Get response from OpenAI
    const response = await openaiService.createChatCompletion(context.messages);

    // Add assistant response to context
    const assistantMessage = response.choices[0].message.content;
    context.messages.push({ role: "assistant", content: assistantMessage });

    // Save updated context
    conversationContexts.set(conversationId, context);

    return assistantMessage;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Can you please try again in a moment?";
  }
}

export async function POST(request) {
  try {
    const { message, conversationId } = await request.json();

    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Use real user ID if available, otherwise use temporary ID
    const userId = user?.id || "temp-user-id";

    // Ensure conversation exists
    let actualConversationId = conversationId;

    if (!actualConversationId) {
      // Create a new conversation
      const newConversation = {
        id: crypto.randomUUID(),
        user_id: userId,
        title: "New Conversation",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      chatConversations.push(newConversation);
      actualConversationId = newConversation.id;
    }

    // Save user message
    const userMessage = {
      id: crypto.randomUUID(),
      user_id: userId,
      conversation_id: actualConversationId,
      content: message,
      sent_by: "user",
      created_at: new Date().toISOString(),
    };

    chatMessages.push(userMessage);

    // Generate AI response using OpenAI with user context
    const aiResponseContent = await generateAIResponse(
      message,
      actualConversationId,
      userId
    );

    // Create AI response object
    const aiResponse = {
      id: crypto.randomUUID(),
      user_id: userId,
      conversation_id: actualConversationId,
      content: aiResponseContent,
      created_at: new Date().toISOString(),
      sent_by: "assistant",
    };

    // Save AI response
    chatMessages.push(aiResponse);

    // Update conversation's updated_at timestamp
    const conversation = chatConversations.find(
      (conv) => conv.id === actualConversationId
    );
    if (conversation) {
      conversation.updated_at = new Date().toISOString();
    }

    return NextResponse.json({
      message: userMessage,
      response: aiResponse,
      conversationId: actualConversationId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Use a simple userId for now
    const userId = "temp-user-id";

    // Get conversation ID from query params
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    // Filter messages
    let filteredMessages = chatMessages.filter((msg) => msg.user_id === userId);

    // Filter by conversation if provided
    if (conversationId) {
      filteredMessages = filteredMessages.filter(
        (msg) => msg.conversation_id === conversationId
      );
    }

    // Sort by creation time
    filteredMessages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    return NextResponse.json({ messages: filteredMessages });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
