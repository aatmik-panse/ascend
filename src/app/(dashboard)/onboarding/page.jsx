"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function CareerOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    experience: "",
    topSkills: ["", "", ""], // Start with 3 empty skills
    enjoyDislike: "",
    motivators: "",
    timeForGrowth: "",
    industryInterest: "",
    linkedinUrl: "", // Keep linkedinUrl field
    biggestConcern: "",
  });

  // Add a state to track if submission is explicitly requested
  const [submissionRequested, setSubmissionRequested] = useState(false);

  const inputRefs = useRef({});
  const totalQuestions = 10;

  // Add a new skill input field
  const addSkill = () => {
    setFormData({
      ...formData,
      topSkills: [...formData.topSkills, ""],
    });
    // Focus on the new skill input after it's added
    setTimeout(() => {
      const newSkillIndex = formData.topSkills.length;
      if (inputRefs.current[`skill-${newSkillIndex}`]) {
        inputRefs.current[`skill-${newSkillIndex}`].focus();
      }
    }, 10);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle global keyboard events if not inside an input field
      const isInInput =
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.id?.startsWith("skill-");

      if (e.key === "Enter" && !e.shiftKey && !isInInput) {
        nextStep();
      }
      if (e.key === "ArrowUp") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  useEffect(() => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion?.field && inputRefs.current[currentQuestion.field]) {
      setTimeout(() => {
        inputRefs.current[currentQuestion.field].focus();
      }, 400);
    }
    // Clear validation error when step changes
    setValidationError(false);
  }, [currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when user types
    setValidationError(false);
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setValidationError(false);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.topSkills];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      topSkills: updatedSkills,
    });

    setValidationError(false);
  };

  // Validate the current field
  const validateCurrentField = () => {
    const currentQuestion = questions[currentStep];

    // No validation needed for welcome, complete, and confirm screens
    if (
      currentQuestion.id === "welcome" ||
      currentQuestion.id === "complete" ||
      currentQuestion.id === "confirm"
    ) {
      return true;
    }

    // Skip validation for optional fields
    if (currentQuestion.optional) {
      return true;
    }

    // Special validation for skills (require at least three filled skills)
    if (currentQuestion.field === "topSkills") {
      const filledSkills = formData.topSkills.filter(
        (skill) => skill.trim() !== ""
      );
      return filledSkills.length >= 3;
    }

    // For select fields, check if a value has been selected
    if (currentQuestion.type === "select") {
      const fieldValue = formData[currentQuestion.field];
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue.toString().trim() !== ""
      );
    }

    // For regular fields, check if they're filled
    const fieldValue = formData[currentQuestion.field];
    return (
      fieldValue !== undefined &&
      fieldValue !== null &&
      fieldValue.toString().trim() !== ""
    );
  };

  // Validate all fields in the form
  const validateAllFields = () => {
    // Track which required fields haven't been completed yet
    const missingFields = [];

    // Check required fields
    if (!formData.jobTitle.trim()) {
      missingFields.push("Current Role");
    }

    if (!formData.experience) {
      missingFields.push("Experience");
    }

    // Check skills (need at least 3)
    const filledSkills = formData.topSkills.filter(
      (skill) => skill.trim() !== ""
    );
    if (filledSkills.length < 3) {
      missingFields.push("Skills (need at least 3)");
    }

    if (!formData.enjoyDislike?.trim()) {
      missingFields.push("Tasks that energize/drain you");
    }

    if (!formData.motivators) {
      missingFields.push("Motivators");
    }

    if (!formData.timeForGrowth) {
      missingFields.push("Weekly learning time");
    }

    if (!formData.industryInterest?.trim()) {
      missingFields.push("Industries of interest");
    }

    // linkedinUrl is optional, so we don't check it
    // biggestConcern is optional, so we don't check it

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };

  const submitFormData = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Get the Supabase client to access auth tokens
      const supabase = createClient();

      // Get the session which contains the access token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Prepare the data payload
      const payload = {
        jobTitle: formData.jobTitle,
        experience: formData.experience,
        topSkills: formData.topSkills.filter(Boolean),
        enjoyDislike: formData.enjoyDislike || "",
        motivators: formData.motivators,
        timeForGrowth: formData.timeForGrowth,
        industryInterest: formData.industryInterest || "",
        linkedinUrl: formData.linkedinUrl || "", // Include optional linkedinUrl
        biggestConcern: formData.biggestConcern || "", // Optional field
      };

      // Make API request with authentication header
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the Authorization header if available
          ...(session?.access_token
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save onboarding data");
      }

      // Show a success message briefly before moving to the next step
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Move to the completion step after successful submission
      setCurrentStep(currentStep + 1);

      // Reset submission requested flag
      setSubmissionRequested(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = () => {
    // Set flag to indicate explicit submission request
    setSubmissionRequested(true);

    // Validate all fields before submitting
    const { isValid, missingFields } = validateAllFields();

    if (isValid) {
      // All fields are complete, proceed with submission
      submitFormData();
    } else {
      // Show validation error with missing fields
      setSubmissionError(
        `Please complete all required fields: ${missingFields.join(", ")}`
      );
      setValidationError(true);
      prevStep();
    }
  };

  const nextStep = () => {
    if (currentStep < totalQuestions + 1) {
      if (currentStep === totalQuestions) {
        // For the confirm step, we should only submit if explicitly requested
        if (submissionRequested) {
          submitFormData();
        }
      } else {
        // For other steps, validate the current field
        if (validateCurrentField()) {
          setCurrentStep(currentStep + 1);
          setValidationError(false);
        } else {
          setValidationError(true);
          // Focus on the input field if validation fails
          const currentQuestion = questions[currentStep];
          if (
            currentQuestion?.field &&
            inputRefs.current[currentQuestion.field]
          ) {
            inputRefs.current[currentQuestion.field].focus();
          } else if (currentQuestion.type === "skills") {
            // For skills, focus on the first empty input
            for (let i = 0; i < formData.topSkills.length; i++) {
              if (!formData.topSkills[i] && inputRefs.current[`skill-${i}`]) {
                inputRefs.current[`skill-${i}`].focus();
                break;
              }
            }
          }
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationError(false);
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    if (currentStep === totalQuestions + 1) return 100;
    return (currentStep / (totalQuestions + 1)) * 100;
  };

  const questions = [
    // Phase 1: Quick Profile
    {
      id: "welcome",
      title: "Welcome to Certcy!",
      subtitle:
        "We'll analyze your profile and suggest new career paths—no guesswork.",
      type: "welcome",
    },
    {
      id: "currentRole",
      title: "What's your current role and company?",
      field: "jobTitle",
      placeholder: "e.g. Senior UX Designer at Acme Inc.",
      type: "text",
    },
    {
      id: "experience",
      title: "How many years of experience do you have?",
      field: "experience",
      type: "select",
      options: [
        { value: "0-1", label: "Less than 1 year" },
        { value: "1-3", label: "1–3 years" },
        { value: "3-5", label: "3–5 years" },
        { value: "5-10", label: "5–10 years" },
        { value: "10+", label: "10+ years" },
      ],
    },

    // Phase 2: Skills & Motivators
    {
      id: "topSkills",
      title: "Which core skills set you apart?",
      field: "topSkills",
      type: "skills",
      description: "Press Enter or tap 'Add skill' to list at least three.",
    },
    {
      id: "enjoyDislike",
      title: "Which tasks energize you vs. drain you?",
      field: "enjoyDislike",
      type: "textarea",
      placeholder:
        "e.g. I love problem-solving but hate repetitive data entry.",
    },
    {
      id: "motivators",
      title: "What motivates you most at work?",
      field: "motivators",
      type: "select",
      options: [
        { value: "impact", label: "Making an impact" },
        { value: "learning", label: "Learning new skills" },
        { value: "balance", label: "Work–life balance" },
        { value: "leadership", label: "Leading teams" },
      ],
    },

    // Phase 3: Constraints & Context
    {
      id: "timeForGrowth",
      title: "How many hours can you dedicate weekly to learning?",
      field: "timeForGrowth",
      type: "select",
      options: [
        { value: "1-3", label: "1–3 hrs/week" },
        { value: "4-7", label: "4–7 hrs/week" },
        { value: "8-15", label: "8–15 hrs/week" },
        { value: "15+", label: "15+ hrs/week" },
      ],
    },
    // {
    //   id: "pivotMonth",
    //   title: "When do you plan to start your pivot?",
    // },
    {
      id: "linkedinUrl",
      title: "What's your LinkedIn URL? ",
      subtitle: "This helps us analyze your professional network",
      field: "linkedinUrl",
      placeholder: "https://linkedin.com/in/yourprofile",
      type: "text",
      optional: true,
    },
    {
      id: "industryInterest",
      title: "Which industries intrigue you most?",
      field: "industryInterest",
      type: "textarea",
      placeholder: "e.g. Fintech, Healthcare, Sustainability…",
    },
    {
      id: "biggestChallenge",
      title: "What's your biggest roadblock right now? ",
      field: "biggestConcern",
      type: "textarea",
      optional: true,
      placeholder: "e.g. Lack of credentials, network, domain knowledge…",
    },
    {
      id: "confirm",
      title: "Great! Review & Submit",
      subtitle: "Ensure everything's correct before we generate your pivots.",
      type: "confirm",
    },
    {
      id: "complete",
      title: "All set! 🎉",
      subtitle:
        "Your personalized pivot report is on its way to your dashboard.",
      type: "complete",
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Tab" &&
      !e.shiftKey &&
      index < formData.topSkills.length - 1 &&
      inputRefs.current[`skill-${index + 1}`]
    ) {
      setTimeout(() => {
        inputRefs.current[`skill-${index + 1}`].focus();
      }, 10);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const getFormField = () => {
    if (
      !currentQuestion ||
      currentQuestion.id === "welcome" ||
      currentQuestion.id === "complete"
    ) {
      return null;
    }

    switch (currentQuestion.type) {
      case "text":
        return (
          <div className="w-full max-w-md mt-8">
            <Input
              ref={(el) => (inputRefs.current[currentQuestion.field] = el)}
              type={currentQuestion.inputType || "text"}
              name={currentQuestion.field}
              value={formData[currentQuestion.field]}
              onChange={handleInputChange}
              placeholder={
                currentQuestion.placeholder || "Type your answer here..."
              }
              className={cn(
                "w-full text-xl h-14 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-gray-300",
                validationError &&
                  !currentQuestion.optional &&
                  "border-red-500 focus-visible:border-b-red-500"
              )}
              required={!currentQuestion.optional}
              onKeyDown={(e) => e.key === "Enter" && nextStep()}
            />
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div className="w-full max-w-md mt-8">
            <Textarea
              ref={(el) => (inputRefs.current[currentQuestion.field] = el)}
              name={currentQuestion.field}
              value={formData[currentQuestion.field]}
              onChange={handleInputChange}
              placeholder={
                currentQuestion.placeholder || "Type your answer here..."
              }
              className={cn(
                "w-full text-xl h-32 bg-transparent border-2 border-gray-300 rounded-md px-4 py-3 focus-visible:ring-0 focus-visible:border-white",
                validationError &&
                  !currentQuestion.optional &&
                  "border-red-500 focus-visible:border-red-500"
              )}
              required={!currentQuestion.optional}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation(); // Stop event bubbling to global handler
                }
              }}
            />
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>
        );
      case "select":
        return (
          <div className="w-full max-w-md mt-8 space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  // First update the form data
                  handleSelectChange(currentQuestion.field, option.value);

                  // Allow time for the state to update before validation
                  setTimeout(() => {
                    const isValid = validateCurrentField();

                    // Only proceed if the field passes validation
                    if (isValid) {
                      nextStep();
                    }
                  }, 100);
                }}
                className={cn(
                  "w-full text-left px-5 py-4 border-2 rounded-md text-lg transition-all flex items-center justify-between",
                  formData[currentQuestion.field] === option.value
                    ? "border-gray-50 bg-black text-white"
                    : "border-gray-400 hover:border-gray-500"
                )}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectChange(currentQuestion.field, option.value);

                    // Allow time for the state to update before validation
                    setTimeout(() => {
                      const isValid = validateCurrentField();

                      // Only proceed if the field passes validation
                      if (isValid) {
                        nextStep();
                      }
                    }, 100);
                  }
                }}
                aria-label={option.label}
              >
                <span>{option.label}</span>
                {formData[currentQuestion.field] === option.value && (
                  <CheckCircle className="h-5 w-5" />
                )}
              </button>
            ))}
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                Please select an option
              </p>
            )}
          </div>
        );
      case "skills":
        return (
          <div className="w-full max-w-md mt-8 space-y-4">
            {formData.topSkills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-10 h-10 border border-b-blue-100 rounded-full bg-neutral-800 flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                <Input
                  ref={(el) => (inputRefs.current[`skill-${index}`] = el)}
                  type="text"
                  id={`skill-${index}`}
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Enter skill ${index + 1}`}
                  className={cn(
                    "flex-1 text-lg h-12 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-neutral-600",
                    validationError &&
                      formData.topSkills.filter((skill) => skill.trim() !== "")
                        .length < 3 &&
                      "border-red-500 focus-visible:border-b-red-500"
                  )}
                  onKeyDown={(e) => {
                    // Handle Enter key specifically for skill inputs
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      e.stopPropagation(); // Stop event bubbling to global handler

                      const filledSkills = formData.topSkills.filter(
                        (s) => s.trim() !== ""
                      );

                      if (filledSkills.length >= 3) {
                        // If we have enough skills, go to the next step
                        nextStep();
                      } else if (
                        formData.topSkills[index].trim() !== "" &&
                        index === formData.topSkills.length - 1
                      ) {
                        // If current field has content and it's the last one, add a new skill field
                        addSkill();
                      }
                    } else {
                      // Handle other key navigation (tab, arrows, etc)
                      handleKeyDown(e, index);
                    }
                  }}
                />
              </div>
            ))}

            <div className="flex justify-center self-center items-center">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addSkill();
                }}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mt-2 rounded-full border border-gray-100 hover:border-white px-6 py-2 h-auto"
                tabIndex={0}
                aria-label="Add another skill"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    addSkill();
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add skill
              </Button>

              {validationError &&
                formData.topSkills.filter((skill) => skill.trim() !== "")
                  .length < 3 && (
                  <p className="text-red-500 text-sm m-4">
                    Please enter at least 3 skills
                  </p>
                )}
            </div>

            {/* Add "Continue" button for skills section to make navigation clearer */}
            <div className="mt-6">
              <Button
                onClick={nextStep}
                className="h-12 px-8 bg-black hover:bg-gray-800 text-white rounded-full font-normal text-lg w-full flex items-center justify-center"
                tabIndex={0}
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case "confirm":
        return (
          <div className="w-full max-w-md mt-8">
            <motion.div
              className="bg-gray-50 text-gray-800 p-6 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg leading-relaxed mb-4">
                <span className="font-semibold">Perfect!</span> We&apos;ve
                learned that you&apos;re a{" "}
                <span className="font-semibold">{formData.jobTitle}</span> with{" "}
                <span className="font-semibold">{formData.experience}</span>{" "}
                year&apos;s of experience, skilled in{" "}
                <span className="font-semibold">
                  {formData.topSkills.filter(Boolean).join(", ")}
                </span>
                .
              </p>

              <p className="text-lg leading-relaxed mb-4">
                You&apos;re motivated most by{" "}
                <span className="font-semibold">
                  {formData.motivators === "impact"
                    ? "making an impact"
                    : formData.motivators === "learning"
                    ? "learning new skills"
                    : formData.motivators === "balance"
                    ? "work-life balance"
                    : formData.motivators === "leadership"
                    ? "leading teams"
                    : formData.motivators}
                </span>{" "}
                and can dedicate{" "}
                <span className="font-semibold">{formData.timeForGrowth}</span>{" "}
                hours to professional growth each week.
              </p>

              <p className="text-lg leading-relaxed">
                Your interest in{" "}
                <span className="font-semibold">
                  {formData.industryInterest}
                </span>{" "}
                will help us identify optimal pivot paths for you.
                {formData.linkedinUrl && (
                  <>
                    {" "}
                    We&apos;ll also analyze insights from your LinkedIn profile.
                  </>
                )}
              </p>

              <div className="mt-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Ready to discover your high-potential career pivots!
                </p>
              </div>
            </motion.div>

            {submissionError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{submissionError}</span>
              </div>
            )}
          </div>
        );
      case "complete":
        return (
          <div className="w-full max-w-md mt-8">
            <motion.div
              className="bg-gray-50 text-gray-800 p-8 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Profile Complete!
              </h3>

              <p className="text-gray-600 mb-6">
                Your personalized pivot paths are now available on your
                dashboard!
              </p>

              <div className="flex flex-col items-center justify-center">
                <Button
                  onClick={handleGoToDashboard}
                  className="h-12 px-10 bg-black hover:bg-gray-800 text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
                  tabIndex={0}
                  aria-label="Go to dashboard"
                >
                  View My Pivot Paths <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/25 text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        {currentStep > 0 && (
          <motion.div
            className="h-full bg-black"
            initial={{ width: `${getProgressPercentage() - 10}%` }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <div className="w-full min-h-screen flex flex-col">
        {currentStep > 0 && currentStep <= totalQuestions && (
          <div className="flex justify-between py-4 px-6">
            <button
              onClick={prevStep}
              className="text-gray-500 hover:text-black transition-colors"
              aria-label="Go back"
              tabIndex={0}
            >
              Back
            </button>
            <div className="text-gray-500 text-sm">
              {currentStep} of {totalQuestions}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-0"
              >
                <h1 className="text-3xl md:text-4xl font-medium mb-2">
                  {currentQuestion.title}
                </h1>
                <span>{currentQuestion.optional ? "(Optional)" : ""}</span>

                {currentQuestion.subtitle && (
                  <p className="text-lg text-gray-400 mb-1">
                    {currentQuestion.subtitle}
                  </p>
                )}

                {currentQuestion.description && (
                  <p className="text-gray-500">{currentQuestion.description}</p>
                )}

                {getFormField()}

                {currentStep === totalQuestions && submissionError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-500 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{submissionError}</span>
                  </div>
                )}

                {(currentStep === 0 ||
                  currentStep === totalQuestions + 1 ||
                  currentQuestion.type === "text" ||
                  currentQuestion.type === "textarea" ||
                  currentQuestion.type === "confirm") && (
                  <div className="mt-8">
                    <Button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent any default form submission

                        if (currentStep === totalQuestions + 1) {
                          handleGoToDashboard();
                        } else if (currentStep === totalQuestions) {
                          // At confirm step, explicitly call handleConfirmSubmit
                          handleConfirmSubmit();
                        } else {
                          nextStep();
                        }
                      }}
                      disabled={isSubmitting}
                      className={cn(
                        "h-12 px-16 bg-gray-100 hover:bg-white text-black font-black rounded-md  text-lg w-full md:w-auto flex items-center justify-center",
                        isSubmitting && "opacity-80"
                      )}
                      tabIndex={0}
                      aria-label={
                        currentStep === totalQuestions
                          ? "Submit profile information"
                          : "Continue to next step"
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Generating pivots...
                        </>
                      ) : currentStep === 0 ? (
                        <>Find My Pivots</>
                      ) : currentStep === totalQuestions ? (
                        <>Generate My Pivot Paths</>
                      ) : currentStep === totalQuestions + 1 ? (
                        <>Go to Dashboard</>
                      ) : (
                        <>
                          Continue <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center pb-16 text-sm text-gray-100">
          {currentStep !== totalQuestions ? (
            <>
              Press{" "}
              <kbd className="px-2 py-1 bg-neutral-600 rounded text-xs mx-1">
                Enter
              </kbd>{" "}
              to continue or{" "}
              <kbd className="px-2 py-1 bg-neutral-600 rounded text-xs mx-1">
                ↑
              </kbd>{" "}
              to go back
            </>
          ) : (
            // At confirmation step, instruct user to click the button
            <span className="text-yellow-300 font-medium">
              Click the button above to generate your pivot paths
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
