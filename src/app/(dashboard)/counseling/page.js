"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Video,
  Calendar,
  Bot,
  Send,
  User,
  BookOpen,
  Star,
  Clock,
  Save,
  ArrowRight,
  PlusCircle,
  Calendar as CalendarIcon,
  Video as VideoIcon,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Counseling = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I'm your AI Career Coach. How can I assist with your professional journey today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const chatContainerRef = useRef(null);

  const recommendedPrompts = [
    "What should I learn next?",
    "How do I explain my gap in interviews?",
    "Help me rewrite this resume bullet...",
    "What's trending in Data Analytics?",
    "Am I a fit for Product Management?",
    "How can I negotiate a higher salary?",
  ];

  const availableMentors = [
    {
      name: "Alex Morgan",
      role: "Product Lead",
      company: "TechGlobal",
      rating: 4.9,
      specialties: ["Career Transitions", "Interview Prep"],
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Chen",
      role: "Senior Data Scientist",
      company: "DataCorp",
      rating: 4.8,
      specialties: ["Technical Skills", "Portfolio Review"],
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Marcus Johnson",
      role: "Engineering Manager",
      company: "InnovateTech",
      rating: 4.7,
      specialties: ["Leadership Development", "Technical Interviews"],
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || message;
    if ((messageToSend.trim() === "" && !customMessage) || isLoading) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: messageToSend },
    ]);
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response.content,
          id: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm sorry, I encountered an error processing your request. Please try again later.",
          id: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleSaveToNotes = (messageText) => {
    const newNote = {
      id: Date.now(),
      text: messageText,
      date: new Date().toLocaleString(),
    };
    setSavedNotes((prev) => [newNote, ...prev]);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: "✅ Saved to your notes!",
        id: Date.now(),
      },
    ]);
  };

  const handleDeleteNote = (noteId) => {
    setSavedNotes(savedNotes.filter((note) => note.id !== noteId));
  };

  const handleScheduleSession = (mentor) => {
    alert(
      `Scheduling session with ${mentor.name}. This would connect to your calendar in the full implementation.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-zinc-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 text-white">
          Chatbot / Counseling – Ask, Learn, Navigate
        </h1>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          Get real-time career guidance, clarity, and motivational support from
          our AI coach.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-zinc-800 p-1 rounded-xl">
          <TabsTrigger
            value="chat"
            className="text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            AI Career Coach
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Saved Notes
          </TabsTrigger>
          <TabsTrigger
            value="mentors"
            className="text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Premium Mentors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 bg-zinc-800/90 border border-zinc-700 shadow-xl">
              <CardHeader className="border-b border-zinc-700/70 pb-4 flex flex-row items-center">
                <div className="p-2.5 rounded-lg bg-blue-600/40 mr-3">
                  <Bot className="h-5 w-5 text-blue-100" />
                </div>
                <CardTitle className="text-white text-xl">
                  AI Career Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div
                  ref={chatContainerRef}
                  className="h-[500px] mb-5 overflow-y-auto rounded-lg bg-zinc-900 p-5"
                >
                  <div className="space-y-5">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 ${
                          msg.sender === "user" ? "justify-end" : ""
                        } ${msg.sender === "system" ? "justify-center" : ""}`}
                      >
                        {msg.sender === "bot" && (
                          <div className="p-2 rounded-lg bg-blue-600/40 flex-shrink-0">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] relative group ${
                            msg.sender === "system"
                              ? "bg-green-600/30 text-green-100 text-sm py-2 px-4 rounded-full border border-green-500/20"
                              : msg.sender === "user"
                              ? "bg-indigo-600/40 text-white p-4 rounded-2xl border border-indigo-500/30"
                              : "bg-zinc-700 text-white p-4 rounded-2xl border border-zinc-600/50"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>

                          {msg.sender === "bot" && (
                            <button
                              onClick={() => handleSaveToNotes(msg.text)}
                              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-blue-600 border border-blue-300/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700 shadow-lg"
                              aria-label="Save to notes"
                            >
                              <Save className="h-3 w-3 text-white" />
                            </button>
                          )}
                        </div>

                        {msg.sender === "user" && (
                          <div className="p-2 rounded-lg bg-indigo-600/40 flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-600/40">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-zinc-700 p-4 rounded-2xl border border-zinc-600/50">
                          <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse"></div>
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 relative">
                  <textarea
                    rows="2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pr-12 resize-none overflow-auto text-white placeholder-zinc-400"
                    maxLength={1000}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || message.trim() === ""}
                    aria-label="Send message"
                    tabIndex="0"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 hover:shadow-lg ${
                      isLoading || message.trim() === ""
                        ? "bg-blue-600/30 cursor-not-allowed text-blue-300/70"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-zinc-800/90 border border-zinc-700 shadow-lg overflow-hidden">
                <CardHeader className="border-b border-zinc-700/70 pb-3 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                  <CardTitle className="text-lg text-white">
                    Recommended Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid gap-2">
                    {recommendedPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-sm justify-start bg-zinc-700 border-zinc-600 hover:bg-blue-600/40 hover:border-blue-500/40 text-zinc-100 hover:text-white font-medium"
                        onClick={() => handlePromptClick(prompt)}
                        tabIndex="0"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePromptClick(prompt);
                          }
                        }}
                      >
                        <ArrowRight
                          className="h-3.5 w-3.5 mr-2 text-blue-300"
                          aria-hidden="true"
                        />
                        {prompt}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-zinc-700">
                    <p className="text-xs text-zinc-300 mb-2 font-medium">
                      Didn't find what you need?
                    </p>
                    <Button
                      variant="ghost"
                      className="text-sm w-full justify-start text-blue-300 hover:text-blue-100 hover:bg-blue-900/20"
                      aria-label="Submit prompt request"
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-2" />
                      Suggest a prompt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/90 border border-zinc-700 shadow-lg overflow-hidden">
                <CardHeader className="border-b border-zinc-700/70 pb-3 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                  <CardTitle className="text-lg text-white">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="text-center p-2">
                    <Badge className="bg-blue-600/40 hover:bg-blue-600/60 text-white mb-3 px-3 py-1">
                      Save Important Insights
                    </Badge>
                    <p className="text-zinc-200 mb-4">
                      Hover over any AI response and click the save icon to keep
                      it for future reference.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full text-sm bg-blue-900/20 border-blue-500/30 text-blue-200 hover:text-white hover:bg-blue-700/50 hover:border-blue-400/50"
                      onClick={() => setActiveTab("notes")}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      View Saved Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="flex items-center">
                <Save className="h-5 w-5 mr-2 text-blue-400" />
                Saved Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {savedNotes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-300 mb-1">
                    No saved notes yet
                  </h3>
                  <p className="text-zinc-500">
                    Save important insights from your chats to reference later
                  </p>
                  <Button
                    className="mt-4 bg-blue-600/40 hover:bg-blue-600/60 text-zinc-100"
                    onClick={() => setActiveTab("chat")}
                  >
                    Return to Chat
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 relative group"
                    >
                      <div className="text-zinc-400 text-xs mb-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {note.date}
                      </div>
                      <p className="text-zinc-200 whitespace-pre-wrap">
                        {note.text}
                      </p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"
                        aria-label="Delete note"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Premium Human Mentors
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-800/30">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Book a 15-minute mentor session
                </h3>
                <p className="text-zinc-400 mb-3">
                  Get personalized guidance from industry experts in quick,
                  focused sessions. Premium feature available with Pro
                  subscription.
                </p>
                <div className="flex items-center">
                  <Badge className="bg-blue-600/20 text-blue-400 mr-2">
                    Premium
                  </Badge>
                  <span className="text-sm text-zinc-500">
                    Schedule up to 2 sessions per month
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${mentor.image})` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center bg-black/50 rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs font-medium text-zinc-100">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-medium text-zinc-100 mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        {mentor.role}, {mentor.company}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1 mb-4">
                        {mentor.specialties.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-zinc-700/30 text-zinc-300 border-zinc-700"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-blue-600/30 hover:bg-blue-600/50 text-zinc-100 flex items-center justify-center space-x-1"
                        onClick={() => handleScheduleSession(mentor)}
                        tabIndex="0"
                      >
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Schedule Session</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-zinc-400 mb-2 text-sm">
                  After your session, you'll be asked to provide feedback
                </p>
                <div className="flex items-center justify-center space-x-2 text-zinc-500">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Your ratings help us improve mentor suggestions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Counseling;
