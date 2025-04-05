import { NextResponse } from 'next/server';

// In-memory storage for chat messages (temporary solution until database is set up)
let chatMessages = [];
let chatConversations = [];

// Career counseling response templates
const careerResponses = {
  greeting: [
    "Hello! I'm here to help with your career questions. How can I assist you today?",
    "Hi there! I'm your AI career advisor. What career concerns can I help you with?",
    "Welcome! I'm ready to discuss your professional development. What's on your mind?"
  ],
  
  skills: [
    "Based on current market trends, skills in {0} are highly valued. Have you considered developing expertise in this area?",
    "Your interest in {0} is timely! This skill set is projected to grow in demand over the next few years.",
    "For someone looking to enhance their {0} abilities, I'd recommend starting with practical projects that demonstrate these skills to potential employers."
  ],
  
  jobSearch: [
    "When applying for positions in {0}, make sure to customize your resume to highlight relevant experience and use industry keywords.",
    "Job searching in the {0} field requires both digital presence and networking. Have you updated your LinkedIn profile recently?",
    "For your job search in {0}, consider reaching out to professionals already in the field for informational interviews."
  ],
  
  interview: [
    "For interviews in {0} roles, prepare to discuss specific examples of how you've solved problems in previous positions.",
    "When interviewing for {0} positions, research the company thoroughly and prepare questions that show your strategic thinking.",
    "Interview success often comes down to demonstrating both technical skills and cultural fit. For {0} roles, be ready to showcase both."
  ],
  
  career_change: [
    "Transitioning to {0} from your current field will leverage your transferable skills like problem-solving and communication.",
    "Career changes to {0} are increasingly common. Your diverse background can actually be a strength in this new field.",
    "When changing to a {0} career, start by identifying the overlap between your current skills and what's needed in the new role."
  ],
  
  salary: [
    "Based on current market data, {0} professionals with your experience level typically earn between $70,000-$95,000 annually.",
    "Compensation for {0} roles varies by location and company size, but the industry average has been increasing steadily.",
    "When negotiating salary for {0} positions, remember to consider the total compensation package including benefits and growth opportunities."
  ],
  
  fallback: [
    "That's an interesting question about your career journey. Could you tell me more about your specific goals?",
    "I'd like to help you with that. Could you share more details about your current situation and what you're hoping to achieve?",
    "Thank you for sharing that. To provide better guidance, could you elaborate on your professional background and objectives?"
  ]
};

// Simple keyword-based response matching
function generateAIResponse(message) {
  message = message.toLowerCase();
  
  // Check for greetings
  if (/^(hello|hi|hey|howdy|greetings)/i.test(message)) {
    return randomResponse(careerResponses.greeting);
  }
  
  // Check for skill development questions
  if (message.includes('skill') || message.includes('learn') || message.includes('course')) {
    const skills = ['data analysis', 'artificial intelligence', 'project management', 'digital marketing'];
    return randomResponse(careerResponses.skills).replace('{0}', randomItem(skills));
  }
  
  // Check for job search questions
  if (message.includes('job') || message.includes('apply') || message.includes('application') || message.includes('resume')) {
    const fields = ['technology', 'healthcare', 'finance', 'marketing'];
    return randomResponse(careerResponses.jobSearch).replace('{0}', randomItem(fields));
  }
  
  // Check for interview questions
  if (message.includes('interview') || message.includes('hiring')) {
    const roles = ['leadership', 'technical', 'customer-facing', 'creative'];
    return randomResponse(careerResponses.interview).replace('{0}', randomItem(roles));
  }
  
  // Check for career change questions
  if (message.includes('change') || message.includes('switch') || message.includes('transition') || message.includes('new career')) {
    const careers = ['tech', 'healthcare', 'data science', 'sustainability'];
    return randomResponse(careerResponses.career_change).replace('{0}', randomItem(careers));
  }
  
  // Check for salary questions
  if (message.includes('salary') || message.includes('pay') || message.includes('compensation') || message.includes('earn')) {
    const fields = ['software development', 'data science', 'project management', 'marketing'];
    return randomResponse(careerResponses.salary).replace('{0}', randomItem(fields));
  }
  
  // If no matches, use fallback responses
  return randomResponse(careerResponses.fallback);
}

// Helper functions
function randomResponse(responseArray) {
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

function randomItem(itemArray) {
  return itemArray[Math.floor(Math.random() * itemArray.length)];
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
    
    // Generate AI response based on message content
    const aiResponseContent = generateAIResponse(message);
    
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
    
    // Add artificial delay to simulate thinking (300-1200ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 900 + 300));
    
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