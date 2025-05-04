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
  RefreshCw,
  AlertCircle,
  Bell,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast, Toaster } from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Markdown from "react-markdown";

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
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const chatContainerRef = useRef(null);
  const [showSuggestPromptDialog, setShowSuggestPromptDialog] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState("");

  // Fetch saved notes on component mount and when active tab changes to notes
  useEffect(() => {
    if (activeTab === "notes") {
      fetchSavedNotes();
    }
  }, [activeTab]);

  // Function to fetch saved notes from the API
  const fetchSavedNotes = async () => {
    try {
      setIsLoadingNotes(true);
      setNotesError(null);

      const response = await fetch("/api/notes");

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const data = await response.json();

      // Transform the notes to match our front-end format
      const formattedNotes = data.notes.map((note) => ({
        id: note.id,
        text: note.text,
        date: new Date(note.createdAt).toLocaleString(),
        conversationId: note.conversationId,
      }));

      setSavedNotes(formattedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotesError("Failed to load your saved notes. Please try again later.");
    } finally {
      setIsLoadingNotes(false);
    }
  };

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
      // Get authenticated session to include auth in the request
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authentication if available
          ...(session?.access_token
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : {}),
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

  const handleSaveToNotes = async (messageText) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: messageText,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const { note } = await response.json();

      const newNote = {
        id: note.id,
        text: note.text,
        date: new Date(note.createdAt).toLocaleString(),
        conversationId: note.conversationId,
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
    } catch (error) {
      console.error("Error saving note:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "❌ Failed to save note. Please try again.",
          id: Date.now(),
        },
      ]);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setSavedNotes(savedNotes.filter((note) => note.id !== noteId));
      setNoteToDelete(null); // Reset after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleScheduleSession = (mentor) => {
    alert(
      `Scheduling session with ${mentor.name}. This would connect to your calendar in the full implementation.`
    );
  };

  const handleNotifyMentor = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Calendar className="h-10 w-10 text-blue-500 bg-blue-50 p-2 rounded-md" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Notification Set!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;ll let you know when mentor matching becomes
                  available.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleSuggestPrompt = async () => {
    if (!suggestedPrompt.trim()) return;

    try {
      // Send the prompt suggestion to the API
      const response = await fetch("/api/prompt-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: suggestedPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit prompt suggestion");
      }

      // Show success message
      toast.success("Thank you! Your prompt suggestion has been received.", {
        duration: 3000,
      });

      // Reset and close dialog
      setSuggestedPrompt("");
      setShowSuggestPromptDialog(false);
    } catch (error) {
      console.error("Error submitting prompt suggestion:", error);
      toast.error("Failed to submit your suggestion. Please try again.");
    }
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

  // Filter notes based on search query
  const filteredNotes = searchQuery
    ? savedNotes.filter((note) =>
        note.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedNotes;

  // Custom handler for dock item clicks
  const handleDockItemClick = (event, onClick) => {
    if (!onClick) return;

    event.preventDefault();
    onClick();
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 text-black bg-white relative rounded-lg sm:rounded-2xl">
      <Toaster position="top-center" />

      {/* Suggest Prompt Dialog */}
      <AlertDialog
        open={showSuggestPromptDialog}
        onOpenChange={setShowSuggestPromptDialog}
      >
        <AlertDialogContent className="max-w-[95%] sm:max-w-lg w-full p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Suggest a Prompt
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              Suggest a topic or question you&apos;d like to see in our prompt
              library
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3 sm:py-4">
            <textarea
              value={suggestedPrompt}
              onChange={(e) => setSuggestedPrompt(e.target.value)}
              placeholder="Your prompt suggestion..."
              className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black/50 resize-none h-24 sm:h-32 text-sm sm:text-base text-black placeholder-gray-500"
            />
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setSuggestedPrompt("")}
              className="mt-2 sm:mt-0 text-sm"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuggestPrompt}
              className="bg-black hover:bg-gray-800 text-white text-sm"
              disabled={!suggestedPrompt.trim()}
            >
              Submit Suggestion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tab Contents */}
      {activeTab === "chat" && (
        <div className="animate-in fade-in-50 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="lg:col-span-3 bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
              <CardHeader className="border-b border-gray-200 pb-3 sm:pb-4 flex flex-row items-center bg-gray-50 p-3 sm:p-4">
                <div className="p-1.5 sm:p-2 rounded-md bg-black mr-2 sm:mr-3">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-base sm:text-xl">
                    Compass Coach
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-xs sm:text-sm">
                    Ask anything about your career journey
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-3 sm:px-6">
                <div
                  ref={chatContainerRef}
                  className="h-[400px] sm:h-[480px] md:h-[560px] mb-3 sm:mb-5 overflow-y-auto rounded-md bg-gray-50 p-3 sm:p-5 shadow-inner border border-gray-200"
                >
                  <div className="space-y-3 sm:space-y-4">
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
                        <div
                          className={`max-w-[95%] sm:max-w-[75%] md:max-w-[85%] lg:max-w-[90%] relative group ${
                            msg.sender === "system"
                              ? "bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded-full border border-gray-300"
                              : msg.sender === "user"
                              ? "bg-black text-white p-3 sm:p-4 rounded-md"
                              : "bg-gray-100 text-gray-800 p-3 sm:p-4 rounded-md border border-gray-300"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base"></p>
                          <Markdown>{msg.text}</Markdown>
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
                    rows="2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about career advice, resume tips, interview preparation..."
                    className="w-full bg-white border border-gray-200 rounded-md px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/50 pr-10 sm:pr-12 resize-none overflow-auto text-sm sm:text-base text-black placeholder-gray-500"
                    maxLength={1000}
                  />
                  <div className="absolute right-12 sm:right-14 bottom-2 sm:bottom-3 text-[10px] sm:text-xs text-gray-500">
                    {message.length}/1000
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || message.trim() === ""}
                    aria-label="Send message"
                    tabIndex="0"
                    className={`absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-2 sm:p-2.5 rounded-full transition-all duration-300 ${
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
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 flex items-center">
                  <Info className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  Press Enter to send, Shift+Enter for new line
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-1 space-y-3 sm:space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
                <CardHeader className="border-b border-gray-200 pb-2 sm:pb-3 p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-black flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Suggested Prompts
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                    Quick conversation starters
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                  <div className="flex overflow-x-auto pb-2 mb-2 sm:mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {promptCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActivePromptCategory(category.id)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap mr-1.5 sm:mr-2 transition-all ${
                          activePromptCategory === category.id
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-1.5 sm:gap-2 animate-in fade-in-50 duration-200">
                    {getFilteredPrompts().map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="
                            flex flex-wrap items-start justify-start gap-1.5 sm:gap-2
                            w-full p-1.5 sm:p-2 text-xs sm:text-sm font-medium
                            bg-gray-50 border-gray-200
                            text-gray-800 hover:bg-gray-100 hover:text-black
                            transition-all duration-200
                            h-fit
                          "
                        onClick={() => handlePromptClick(prompt)}
                        title={prompt}
                      >
                        <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 self-center" />
                        <span className="flex-1 whitespace-normal break-words">
                          {prompt}
                        </span>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                        Need something specific?
                      </p>
                      <Badge className="bg-gray-800 text-white text-[8px] sm:text-xs px-1 py-0 sm:px-1.5 sm:py-0.5">
                        New
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-xs sm:text-sm w-full justify-start text-gray-700 hover:text-black hover:bg-gray-100 group p-1.5 sm:p-2 h-auto"
                      aria-label="Submit prompt request"
                      onClick={() => setShowSuggestPromptDialog(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setShowSuggestPromptDialog(true);
                        }
                      }}
                    >
                      <PlusCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2 group-hover:rotate-90 transition-transform duration-200" />
                      Suggest a prompt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-md">
                <CardHeader className="border-b border-gray-200 pb-2 sm:pb-3 p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-black flex items-center">
                    <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-5 px-3 sm:px-6">
                  <div className="p-1 sm:p-2 space-y-2 sm:space-y-4">
                    <div className="bg-gray-50 rounded-md p-2 sm:p-3 border border-gray-200">
                      <Badge className="bg-gray-800 text-white mb-1.5 sm:mb-2 px-1 sm:px-2 py-0 sm:py-0.5 text-[8px] sm:text-xs">
                        <Save className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        Save Insights
                      </Badge>
                      <p className="text-gray-700 text-[10px] sm:text-sm">
                        Hover over any AI response and click the save icon to
                        keep it for future reference.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-md p-2 sm:p-3 border border-gray-200">
                      <Badge className="bg-gray-800 text-white mb-1.5 sm:mb-2 px-1 sm:px-2 py-0 sm:py-0.5 text-[8px] sm:text-xs">
                        <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        Be Specific
                      </Badge>
                      <p className="text-gray-700 text-[10px] sm:text-sm">
                        Ask detailed questions for more personalized career
                        guidance.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full text-xs sm:text-sm bg-white border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-black mt-1 sm:mt-2 h-8 sm:h-10"
                      onClick={() => setActiveTab("notes")}
                    >
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
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
            <CardHeader className="border-b border-gray-200 pb-2 sm:pb-3 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Bookmark className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Saved Notes
                </CardTitle>

                {savedNotes.length > 0 && (
                  <div className="flex items-center">
                    <Badge className="bg-gray-800 text-white text-[10px] sm:text-xs">
                      {savedNotes.length}{" "}
                      {savedNotes.length === 1 ? "note" : "notes"}
                    </Badge>
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-600 text-[10px] sm:text-sm mt-0.5 sm:mt-1">
                Your saved insights from AI conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              {isLoadingNotes ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  <span className="ml-3 text-gray-600">
                    Loading your notes...
                  </span>
                </div>
              ) : notesError ? (
                <div className="text-center py-12 bg-red-50 rounded-md border border-red-200">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-800 mb-1">
                    Error Loading Notes
                  </h3>
                  <p className="text-red-600 max-w-md mx-auto mb-4">
                    {notesError}
                  </p>
                  <Button
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                    onClick={fetchSavedNotes}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : savedNotes.length === 0 ? (
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
                  <div className="mb-3 sm:mb-4 flex items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search your notes..."
                        className="w-full bg-white border border-gray-300 rounded-md pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="ml-1.5 sm:ml-2 bg-white border-gray-300 text-gray-800 h-8 sm:h-auto p-1.5 sm:p-2"
                      onClick={fetchSavedNotes}
                      title="Refresh notes"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {filteredNotes.length === 0 && searchQuery ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                      <p className="text-gray-600">
                        No notes matching &apos;{searchQuery}&apos;
                      </p>
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-white rounded-md p-4 border border-gray-200 relative group hover:shadow-sm transition-all duration-200"
                        >
                          <div className="text-gray-500 text-xs mb-2 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {note.date}
                          </div>
                          <div className="text-gray-800 whitespace-pre-wrap">
                            <Markdown>{note.text}</Markdown>
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                  aria-label="Delete note"
                                  onClick={() => setNoteToDelete(note.id)}
                                >
                                  ×
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Note
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this note?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                                    onClick={() =>
                                      handleDeleteNote(noteToDelete)
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {filteredNotes.length > 0 && !isLoadingNotes && !notesError && (
              <CardFooter className="border-t border-gray-200 py-2 sm:py-3 px-3 sm:px-6">
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Notes are automatically saved to your account and can be
                  accessed from any device
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      )}

      {activeTab === "mentors" && (
        <div className="animate-in fade-in-50 duration-300">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 flex flex-col items-center text-center">
              <div className="p-3 sm:p-4 rounded-full bg-blue-50 mb-4 sm:mb-6">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                Mentor Matching Coming Soon
              </h2>
              <p className="text-gray-600 max-w-lg mb-6 sm:mb-8 text-sm sm:text-base">
                We&apos;re working on connecting you with industry professionals
                for personalized career guidance. Get matched with mentors
                who&apos;ve walked the path you&apos;re pursuing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl w-full mb-6 sm:mb-8">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                  <VideoIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mb-2 sm:mb-3" />
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    1:1 Video Sessions
                  </h3>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mb-2 sm:mb-3" />
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    Professional Feedback
                  </h3>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mb-2 sm:mb-3" />
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    Industry Connections
                  </h3>
                </div>
              </div>
              <Button
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm h-9 sm:h-10"
                tabIndex="0"
                aria-label="Get notified when mentor matching launches"
                onClick={handleNotifyMentor}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNotifyMentor();
                  }
                }}
              >
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Notify Me When Available
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Floating Dock Navigation */}
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
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
          mobileClassName="shadow-lg scale-90 sm:scale-100"
          onItemClick={handleDockItemClick}
        />
      </div>
    </div>
  );
};

export default Counseling;
