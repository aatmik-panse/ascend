import { NextResponse } from 'next/server';
import { openaiService } from '@/utils/openai';

// In-memory storage for chat messages (temporary solution until database is set up)
let chatMessages = [];
let chatConversations = [];

// Store conversation contexts (for maintaining conversation history with OpenAI)
const conversationContexts = new Map();

// Helper functions
function randomItem(itemArray) {
  return itemArray[Math.floor(Math.random() * itemArray.length)];
}

// Function to generate AI response using OpenAI
async function generateAIResponse(message, conversationId) {
  try {
    // Get or initialize conversation context
    if (!conversationContexts.has(conversationId)) {
      // Initialize a new conversation with OpenAI
      const careerBot = await openaiService.getCareerCounselingBot();
      conversationContexts.set(conversationId, {
        systemPrompt: careerBot.systemPrompt,
        messages: [
          { role: "system", content: careerBot.systemPrompt }
        ]
      });
    }
    
    // Get the conversation context
    const context = conversationContexts.get(conversationId);
    
    // Add user message to context
    context.messages.push({ role: "user", content: message });
    
    // Keep only the last 10 messages to avoid token limits
    if (context.messages.length > 11) { // system prompt + 10 messages
      context.messages = [
        { role: "system", content: context.systemPrompt },
        ...context.messages.slice(-10)
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
    console.error('OpenAI API error:', error);
    return "I'm having trouble connecting to my knowledge base right now. Can you please try again in a moment?";
  }
}

export async function POST(request) {
  try {
    const { message, conversationId } = await request.json();
    
    // Use a simple userId for now
    const userId = "temp-user-id";
    
    // Ensure conversation exists
    let actualConversationId = conversationId;
    
    if (!actualConversationId) {
      // Create a new conversation
      const newConversation = {
        id: crypto.randomUUID(),
        user_id: userId,
        title: 'New Conversation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
      sent_by: 'user',
      created_at: new Date().toISOString()
    };
    
    chatMessages.push(userMessage);
    
    // Generate AI response using OpenAI
    const aiResponseContent = await generateAIResponse(message, actualConversationId);
    
    // Create AI response object
    const aiResponse = {
      id: crypto.randomUUID(),
      user_id: userId,
      conversation_id: actualConversationId,
      content: aiResponseContent,
      created_at: new Date().toISOString(),
      sent_by: 'assistant'
    };
    
    // Save AI response
    chatMessages.push(aiResponse);
    
    // Update conversation's updated_at timestamp
    const conversation = chatConversations.find(conv => conv.id === actualConversationId);
    if (conversation) {
      conversation.updated_at = new Date().toISOString();
    }
    
    return NextResponse.json({
      message: userMessage,
      response: aiResponse,
      conversationId: actualConversationId
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const conversationId = searchParams.get('conversationId');
    
    // Filter messages
    let filteredMessages = chatMessages.filter(msg => msg.user_id === userId);
    
    // Filter by conversation if provided
    if (conversationId) {
      filteredMessages = filteredMessages.filter(msg => msg.conversation_id === conversationId);
    }
    
    // Sort by creation time
    filteredMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    return NextResponse.json({ messages: filteredMessages });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}