"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Video, Calendar, Bot, Send, User, Award, BookOpen, Briefcase } from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
  dark: '#0c0c14',
  darkAccent: 'rgba(20, 20, 40, 0.5)',
};

const Counseling = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your AI career assistant. How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (message.trim() === '' || isLoading) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    setIsLoading(true);
    setMessage('');
    try {
      // Call the API endpoint with the message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationId: conversationId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Store the conversation ID for future messages
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Add bot response to chat
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: data.response.content
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm sorry, I encountered an error processing your request. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black -z-10 opacity-60"></div>
      
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
          }}>
          Career Counseling
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Get personalized guidance from AI and expert career counselors to navigate your professional journey with confidence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-2xl border border-gray-800 shadow-xl" style={{ background: theme.dark }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg" style={{ background: `${theme.periwinkle}15`, color: theme.periwinkle }}>
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">AI Career Assistant</h2>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="h-96 rounded-lg p-4 mb-4 overflow-y-auto"
              style={{ background: theme.darkAccent }}>
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'bot' && (
                      <div className="p-2 rounded-lg" style={{ background: `${theme.periwinkle}15`, color: theme.periwinkle }}>
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div className={`rounded-2xl p-3 max-w-[80%] ${
                      msg.sender === 'user' 
                        ? `bg-gradient-to-r from-${theme.periwinkle}30 to-${theme.lilac}30 text-white` 
                        : 'bg-gray-800/60'
                    }`}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="p-2 rounded-lg bg-gray-700/30">
                        <User className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg" style={{ background: `${theme.periwinkle}15`, color: theme.periwinkle }}>
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="rounded-2xl p-3 bg-gray-800/60">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 relative">
              <textarea
                rows="1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 pr-12 resize-none overflow-auto"
                style={{ '--tw-ring-color': `${theme.periwinkle}50`, maxHeight: '120px' }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || message.trim() === ''}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 hover:scale-110 ${(isLoading || message.trim() === '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ 
                  background: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)`,
                  color: 'white'
                }}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Award className="h-5 w-5" />, title: "Personalized Advice", text: "Get advice tailored to your skills and experience" },
              { icon: <Briefcase className="h-5 w-5" />, title: "Industry Insights", text: "Learn about trends and opportunities in your field" },
              { icon: <BookOpen className="h-5 w-5" />, title: "Resume Feedback", text: "Expert review of your professional documents" },
              { icon: <Calendar className="h-5 w-5" />, title: "Career Planning", text: "Strategic guidance for your professional journey" },
            ].map((feature, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-800" style={{ background: 'rgba(15, 15, 30, 0.6)' }}>
                <div className="p-2 mb-3 w-10 h-10 flex items-center justify-center rounded-lg" 
                  style={{ background: `linear-gradient(135deg, ${theme.periwinkle}20 0%, ${theme.lilac}20 100%)`, color: theme.lilac }}>
                  {feature.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-gray-800 shadow-xl" style={{ background: theme.dark }}>
            <h3 className="text-xl font-semibold mb-6">Human Counseling</h3>
            <div className="space-y-4">
              {[
                { icon: <Video className="h-5 w-5" />, label: "Video Session", price: "$99", desc: "60-min deep dive with an expert" },
                { icon: <MessageSquare className="h-5 w-5" />, label: "Chat Session", price: "$49", desc: "Unlimited messages for 24 hours" },
                { icon: <Calendar className="h-5 w-5" />, label: "Monthly Plan", price: "$199", desc: "4 sessions + priority access" }
              ].map((option, index) => (
                <div key={index} 
                  className="w-full p-4 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-gray-700 hover:shadow-lg"
                  style={{ background: 'rgba(20, 20, 40, 0.5)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ background: `${theme.lilac}15`, color: theme.lilac }}>
                        {option.icon}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span className="font-bold" style={{ color: theme.lilac }}>{option.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm ml-10">{option.desc}</p>
                  <button className="mt-3 ml-10 text-sm font-medium py-1 px-3 rounded-lg transition-colors"
                    style={{ 
                      background: `${theme.lilac}15`, 
                      color: theme.lilac,
                      border: `1px solid ${theme.lilac}30`
                    }}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-800 shadow-xl" style={{ background: theme.dark }}>
            <h3 className="text-xl font-semibold mb-4">Why Choose Human Counseling?</h3>
            <ul className="space-y-4 text-gray-300">
              {[
                "Personalized 1-on-1 attention from industry experts",
                "Deep insights based on real-world experience",
                "Customized career strategy for your unique situation",
                "Access to professional networks and opportunities"
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="mt-1 w-2 h-2 rounded-full" style={{ background: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` }}></div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 rounded-lg text-center" style={{ background: `linear-gradient(135deg, ${theme.periwinkle}15 0%, ${theme.lilac}15 100%)` }}>
              <p className="text-sm text-gray-300 mb-2">Not sure which option is right for you?</p>
              <button className="text-sm font-medium py-2 px-4 rounded-lg w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)`,
                  color: 'white'
                }}>
                Schedule Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counseling;