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
  Info,
  Sparkles,
  Bookmark,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FloatingDock } from "@/components/ui/floating-dock";

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
  const [activePromptCategory, setActivePromptCategory] = useState("all");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const chatContainerRef = useRef(null);

  const promptCategories = [
    { id: "all", name: "All" },
    { id: "skills", name: "Skills" },
    { id: "interviews", name: "Interviews" },
    { id: "career", name: "Career Path" },
    { id: "resume", name: "Resume" },
  ];

  const categorizedPrompts = {
    skills: [
      "What skills should I learn next?",
      "How do I improve my technical writing?",
      "What's trending in Data Analytics?",
    ],
    interviews: [
      "How do I explain my employment gap?",
      "What questions should I ask the interviewer?",
      "How to answer 'Tell me about yourself'?",
    ],
    career: [
      "Am I a fit for Product Management?",
      "How to transition to a leadership role?",
      "Should I specialize or be a generalist?",
    ],
    resume: [
      "Help me rewrite this resume bullet...",
      "How to highlight achievements on my resume?",
      "How can I make my resume ATS-friendly?",
    ],
  };

  const getFilteredPrompts = () => {
    if (activePromptCategory === "all") {
      return Object.values(categorizedPrompts).flat().slice(0, 6);
    }
    return categorizedPrompts[activePromptCategory] || [];
  };

  const availableMentors = [
    {
      name: "Alex Morgan",
      role: "Product Lead",
      company: "TechGlobal",
      rating: 4.9,
      reviews: 124,
      specialties: ["Career Transitions", "Interview Prep"],
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      availability: ["Mon 2-4pm", "Wed 10-12pm"],
      experience: "8+ years",
      bio: "Former startup founder with expertise in product strategy and career pivots.",
      verified: true,
    },
    {
      name: "Sarah Chen",
      role: "Senior Data Scientist",
      company: "DataCorp",
      rating: 4.8,
      reviews: 98,
      specialties: ["Technical Skills", "Portfolio Review"],
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      availability: ["Tue 3-5pm", "Thu 1-3pm"],
      experience: "6+ years",
      bio: "AI/ML specialist helping professionals break into data science.",
      verified: true,
    },
    {
      name: "Marcus Johnson",
      role: "Engineering Manager",
      company: "InnovateTech",
      rating: 4.7,
      reviews: 87,
      specialties: ["Leadership Development", "Technical Interviews"],
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      availability: ["Mon 5-7pm", "Fri 11-1pm"],
      experience: "10+ years",
      bio: "Helping engineers grow into leadership roles and ace technical interviews.",
      verified: true,
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

  // Define dock items for navigation
  const dockItems = [
    {
      title: "AI Coach",
      icon: <Bot className="h-full w-full text-black" />,
      href: "#chat",
      onClick: () => setActiveTab("chat"),
      active: activeTab === "chat",
    },
    {
      title: "Notes",
      icon: <Bookmark className="h-full w-full text-black" />,
      href: "#notes",
      onClick: () => setActiveTab("notes"),
      active: activeTab === "notes",
    },
    {
      title: "Mentors",
      icon: <Star className="h-full w-full text-black" />,
      href: "#mentors",
      onClick: () => setActiveTab("mentors"),
      active: activeTab === "mentors",
    },
  ];

  // Custom handler for dock item clicks
  const handleDockItemClick = (event, onClick) => {
    if (!onClick) return;

    event.preventDefault();
    onClick();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black bg-white relative rounded-2xl">
      {/* Welcome Header */}
      {/* <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Counseling</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Get personalized career guidance, clarity, and motivational support
        </p>
      </div> */}

      {/* Current tab indicator */}
      {/* <div className="flex justify-center mb-6">
        <div className="px-4 py-2 bg-gray-100 rounded-md border border-gray-200 text-center">
          <span className="text-sm font-medium">
            {activeTab === "chat" && "AI Coach"}
            {activeTab === "notes" && "Saved Notes"}
            {activeTab === "mentors" && "Premium Mentors"}
          </span>
        </div>
      </div> */}

      {/* Tab Contents */}
      {activeTab === "chat" && (
        <div className="animate-in fade-in-50 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
              <CardHeader className="border-b border-gray-200 pb-4 flex flex-row items-center bg-gray-50">
                <div className="p-2 rounded-md bg-black mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-xl">
                    AI Career Coach
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Ask anything about your career journey
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                {/* {showWelcomeMessage && (
                  <div className="mb-5 bg-gray-50 rounded-md p-4 border border-gray-200 relative animate-in slide-in-from-top-4 duration-300">
                    <button
                      onClick={() => setShowWelcomeMessage(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-black"
                      aria-label="Dismiss welcome message"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-medium text-black mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Welcome to your AI Career Coach
                    </h3>
                    <p className="text-gray-700 text-sm mb-2">
                      I can help with resume reviews, interview preparation,
                      career transitions, and more. Just ask me anything!
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge
                        className="bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
                        onClick={() =>
                          handlePromptClick("What can you help me with?")
                        }
                      >
                        Get Started
                      </Badge>
                      <Badge
                        className="bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
                        onClick={() =>
                          handlePromptClick("How do I use this tool?")
                        }
                      >
                        How it works
                      </Badge>
                    </div>
                  </div>
                )} */}

                <div
                  ref={chatContainerRef}
                  className="h-[560px] mb-5 overflow-y-auto rounded-md bg-gray-50 p-5 shadow-inner border border-gray-200"
                >
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 ${
                          msg.sender === "user" ? "justify-end" : ""
                        } ${
                          msg.sender === "system" ? "justify-center" : ""
                        } animate-in ${
                          msg.sender === "user"
                            ? "slide-in-from-right-5"
                            : "slide-in-from-left-5"
                        } duration-200`}
                      >
                        {/* {msg.sender === "bot" && (
                          <div className="p-2 rounded-md bg-black flex-shrink-0">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )} */}

                        <div
                          className={`max-w-[95%] sm:max-w-[75%] md:max-w-[85%] lg:max-w-[90%] relative group ${
                            msg.sender === "system"
                              ? "bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded-full border border-gray-300"
                              : msg.sender === "user"
                              ? "bg-black text-white p-3 sm:p-4 rounded-md"
                              : "bg-gray-100 text-gray-800 p-3 sm:p-4 rounded-md border border-gray-300"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                            {msg.text}
                          </p>

                          {msg.sender === "bot" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleSaveToNotes(msg.text)}
                                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-black border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                                    aria-label="Save to notes"
                                  >
                                    <Save className="h-3 w-3 text-white" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Save to notes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          <div className="mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.sender === "bot" && "AI Coach • "}
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {msg.sender === "user" && (
                          <div className="p-2 rounded-md bg-gray-800 flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-start space-x-3 animate-in fade-in duration-200">
                        <div className="p-2 rounded-md bg-black">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
                          <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"></div>
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about career advice, resume tips, interview preparation..."
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/50 pr-12 resize-none overflow-auto text-black placeholder-gray-500"
                    maxLength={1000}
                  />
                  <div className="absolute right-14 bottom-3 text-xs text-gray-500">
                    {message.length}/1000
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || message.trim() === ""}
                    aria-label="Send message"
                    tabIndex="0"
                    className={`absolute right-3 bottom-3 p-2.5 rounded-full transition-all duration-300 ${
                      isLoading || message.trim() === ""
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-black text-white hover:bg-gray-800"
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
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Press Enter to send, Shift+Enter for new line
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
                <CardHeader className="border-b border-gray-200 pb-3">
                  <CardTitle className="text-lg text-black flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Suggested Prompts
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-xs mt-1">
                    Quick conversation starters
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* Category tabs */}
                  <div className="flex overflow-x-auto pb-2 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {promptCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActivePromptCategory(category.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap mr-2 transition-all ${
                          activePromptCategory === category.id
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-2 animate-in fade-in-50 duration-200">
                    {getFilteredPrompts().map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="
                            flex flex-wrap items-start justify-start gap-2
                            w-full p-2 text-sm font-medium
                            bg-gray-50 border-gray-200
                            text-gray-800 hover:bg-gray-100 hover:text-black
                            transition-all duration-200
                            h-fit
                          "
                        onClick={() => handlePromptClick(prompt)}
                        title={prompt} /* optional tooltip on hover */
                      >
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 self-center" />
                        <span className="flex-1 whitespace-normal break-words">
                          {prompt}
                        </span>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600 font-medium">
                        Need something specific?
                      </p>
                      <Badge className="bg-gray-800 text-white text-xs">
                        New
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-sm w-full justify-start text-gray-700 hover:text-black hover:bg-gray-100 group"
                      aria-label="Submit prompt request"
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                      Suggest a prompt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
                <CardHeader className="border-b border-gray-200 pb-3">
                  <CardTitle className="text-lg text-black flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="p-2 space-y-4">
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                      <Badge className="bg-gray-800 text-white mb-2 px-2 py-0.5">
                        <Save className="h-3 w-3 mr-1" />
                        Save Insights
                      </Badge>
                      <p className="text-gray-700 text-sm">
                        Hover over any AI response and click the save icon to
                        keep it for future reference.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                      <Badge className="bg-gray-800 text-white mb-2 px-2 py-0.5">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Be Specific
                      </Badge>
                      <p className="text-gray-700 text-sm">
                        Ask detailed questions for more personalized career
                        guidance.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full text-sm bg-white border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-black mt-2"
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
        </div>
      )}

      {activeTab === "notes" && (
        <div className="animate-in fade-in-50 duration-300">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
            <CardHeader className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Saved Notes
                </CardTitle>

                {savedNotes.length > 0 && (
                  <div className="flex items-center">
                    <Badge className="bg-gray-800 text-white">
                      {savedNotes.length}{" "}
                      {savedNotes.length === 1 ? "note" : "notes"}
                    </Badge>
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-600 text-sm mt-1">
                Your saved insights from AI conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {savedNotes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    No saved notes yet
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-4">
                    Save important insights from your chats by hovering over any
                    AI response and clicking the save icon.
                  </p>
                  <Button
                    className="mt-2 bg-black hover:bg-gray-800 text-white"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Return to Chat
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search your notes..."
                        className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/50"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="ml-2 bg-white border-gray-300 text-gray-800"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {savedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white rounded-md p-4 border border-gray-200 relative group hover:shadow-sm transition-all duration-200"
                      >
                        <div className="text-gray-500 text-xs mb-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {note.date}
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note.text}
                        </p>
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                  aria-label="Delete note"
                                >
                                  ×
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Delete note</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "mentors" && (
        <div className="animate-in fade-in-50 duration-300">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
            <CardHeader className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Premium Human Mentors
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm mt-1">
                    Connect with industry experts for personalized guidance
                  </CardDescription>
                </div>
                <Badge className="bg-black text-white border-0">
                  Premium Feature
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 bg-gray-50 rounded-md p-5 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-2 flex items-center">
                      <VideoIcon className="h-5 w-5 mr-2" />
                      Book a 15-minute mentor session
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Get personalized guidance from industry experts in quick,
                      focused sessions tailored to your career goals.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-gray-200 text-gray-800 border border-gray-300">
                        Premium
                      </Badge>
                      <Badge className="bg-gray-200 text-gray-800 border border-gray-300">
                        2 sessions/month
                      </Badge>
                      <Badge className="bg-gray-200 text-gray-800 border border-gray-300">
                        15-min calls
                      </Badge>
                    </div>
                  </div>
                  <div className="md:w-auto flex-shrink-0">
                    <Button className="w-full md:w-auto bg-black hover:bg-gray-800 text-white">
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${mentor.image})` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                      <div className="absolute bottom-3 left-3 flex flex-col space-y-2">
                        <div className="flex items-center bg-black/60 rounded-full px-2.5 py-1">
                          <Star className="h-3.5 w-3.5 text-yellow-400 mr-1.5" />
                          <span className="text-xs font-medium text-white">
                            {mentor.rating} ({mentor.reviews})
                          </span>
                        </div>
                      </div>

                      {mentor.verified && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-black text-white border-0">
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {mentor.role}, {mentor.company}
                      </p>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {mentor.bio}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5 mb-4">
                        {mentor.specialties.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-gray-100 text-gray-800 border-gray-200"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="mb-4 bg-gray-50 rounded-md p-2 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1.5">
                          Available slots:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.availability.map((slot, idx) => (
                            <Badge
                              key={idx}
                              className="bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
                            >
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center"
                        onClick={() => handleScheduleSession(mentor)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        <span>Schedule Session</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200 text-center">
                <h4 className="text-gray-900 mb-2 font-medium">How it works</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-4 w-4 text-gray-800" />
                    </div>
                    <p className="text-gray-700 text-sm">
                      Schedule a session with your preferred mentor
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                      <VideoIcon className="h-4 w-4 text-gray-800" />
                    </div>
                    <p className="text-gray-700 text-sm">
                      Connect via video call at your scheduled time
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ThumbsUp className="h-4 w-4 text-gray-800" />
                    </div>
                    <p className="text-gray-700 text-sm">
                      Provide feedback to help improve our service
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Your ratings help us improve mentor suggestions and match you
                  with the best experts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Floating Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock
          items={dockItems.map((item) => ({
            ...item,
            icon: item.active ? (
              <div className="text-blue-600 font-bold">{item.icon}</div>
            ) : (
              item.icon
            ),
          }))}
          desktopClassName="shadow-lg border border-gray-200"
          mobileClassName="shadow-lg"
          onItemClick={handleDockItemClick}
        />
      </div>
    </div>
  );
};

export default Counseling;
