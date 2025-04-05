'use client'
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Briefcase, Building, Clock, TrendingUp, DollarSign, Award, Calendar, Linkedin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    experience: '',
    jobStability: 3,
    salarRange: '',
    topSkills: ['', '', ''],
    timeForGrowth: '',
    linkedinUrl: '',
    biggestConcern: ''
  });

  const totalSteps = 6;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.topSkills];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      topSkills: updatedSkills
    });
  };

  const handleStabilityChange = (value) => {
    setFormData({
      ...formData,
      jobStability: value
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Welcome to CareerCompass</h1>
            <p className="text-gray-300 mb-10 max-w-md leading-relaxed">Let's get to know you better to personalize your career growth journey. This will take less than 2 minutes.</p>
            <div className="w-full max-w-sm">
              <button 
                onClick={nextStep} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl flex items-center justify-center font-medium transition-all duration-300 shadow-lg shadow-purple-900/20"
              >
                Get Started <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Tell us about your work</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-purple-400" /> 
                  What is your job title?
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Product Manager"
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Building className="w-4 h-4 mr-2 text-purple-400" /> 
                  Which company do you currently work at?
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Inc."
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Your experience</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-400" /> 
                  What's your estimated years of experience in this field?
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-400" /> 
                  How stable do you feel in your current job?
                </label>
                <div className="p-4 bg-[#1a1a2e]/30 backdrop-blur-sm rounded-xl border border-gray-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Very unstable</span>
                    <span className="text-xs text-gray-400">Very stable</span>
                  </div>
                  <div className="flex justify-between items-center space-x-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleStabilityChange(value)}
                        className={`w-full h-2 rounded-full ${
                          formData.jobStability >= value ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-700'
                        } transition-all duration-200 focus:outline-none relative hover:opacity-90`}
                        aria-label={`Stability level ${value}`}
                      >
                        <span 
                          className={`absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium ${
                            formData.jobStability === value ? 'text-purple-400' : 'text-gray-500'
                          }`}
                        >
                          {value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-purple-400" /> 
                  What's your approximate annual salary range? (OPTIONAL)
                </label>
                <select
                  name="salarRange"
                  value={formData.salarRange}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Prefer not to say</option>
                  <option value="0-50k">Under $50,000</option>
                  <option value="50k-75k">$50,000 - $75,000</option>
                  <option value="75k-100k">$75,000 - $100,000</option>
                  <option value="100k-150k">$100,000 - $150,000</option>
                  <option value="150k+">$150,000+</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Your skills and growth</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Award className="w-4 h-4 mr-2 text-purple-400" /> 
                  TOP 3 Skills you feel confident in?
                </label>
                <div className="space-y-3 p-4 bg-[#1a1a2e]/30 backdrop-blur-sm rounded-xl border border-gray-800/50">
                  {[0, 1, 2].map((index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <input
                        type="text"
                        value={formData.topSkills[index]}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder={`Skill ${index + 1}`}
                        className="w-full bg-[#1a1a2e]/70 text-white border border-gray-800/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-400" /> 
                  How much time can you dedicate to career growth?
                </label>
                <select
                  name="timeForGrowth"
                  value={formData.timeForGrowth}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select time</option>
                  <option value="1-3">1-3 hours/week</option>
                  <option value="4-7">4-7 hours/week</option>
                  <option value="8-15">8-15 hours/week</option>
                  <option value="15+">15+ hours/week</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Additional information</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-purple-400" /> 
                  LinkedIn URL (optional)
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-purple-400" /> 
                  What's your biggest concern in your job right now?
                </label>
                <textarea
                  name="biggestConcern"
                  value={formData.biggestConcern}
                  onChange={handleInputChange}
                  placeholder="e.g. Job security, skill gaps, career progression..."
                  className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm text-white border border-gray-800/50 rounded-xl p-3.5 h-28 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Almost there!</h2>
            <p className="text-gray-300 mb-6">Please confirm your information below:</p>
            
            <div className="bg-[#1a1a2e]/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6 space-y-4 relative overflow-hidden group-hover:border-gray-700/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
              <div className="relative">
                <div className="flex justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400">Job Title:</span>
                  <span className="text-white font-medium">{formData.jobTitle || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white font-medium">{formData.company || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white font-medium">{formData.experience || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400">Job Stability:</span>
                  <span className="text-white font-medium">{formData.jobStability}/5</span>
                </div>
                {formData.salarRange && (
                  <div className="flex justify-between py-2 border-b border-gray-800/30">
                    <span className="text-gray-400">Salary Range:</span>
                    <span className="text-white font-medium">{formData.salarRange}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400">Top Skills:</span>
                  <span className="text-white font-medium">
                    {formData.topSkills.filter(Boolean).join(", ") || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Time for Growth:</span>
                  <span className="text-white font-medium">{formData.timeForGrowth || "Not provided"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-purple-900/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
              Your account has been created!
            </h1>
            <p className="text-gray-300 mb-10 max-w-md leading-relaxed">
              Thank you for completing your profile. We've customized your experience based on your responses.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10"
            >
              <div className="bg-[#1a1a2e]/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-5 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-xl"></div>
                <h3 className="text-sm text-gray-300 mb-1 relative">Visit Help Center</h3>
                <p className="text-xs text-gray-500 relative">For tips and tricks</p>
              </div>
              <div className="bg-[#1a1a2e]/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-5 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-xl"></div>
                <h3 className="text-sm text-gray-300 mb-1 relative">Get Pro Plan</h3>
                <p className="text-xs text-gray-500 relative">Unlock all features</p>
              </div>
            </motion.div>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 px-10 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-purple-900/20"
            >
              Go to Dashboard
            </motion.button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / totalSteps) * 100}%`;
  };

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Left column - with purple gradient background and illustration */}
        <div className="hidden lg:block lg:w-5/12 bg-gradient-to-b from-purple-900 to-indigo-900 p-8 rounded-l-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-400 blur-xl"></div>
            <div className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-indigo-500 blur-xl"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-purple-600 blur-xl"></div>
            {/* Add more decorative elements */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                  boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.3)'
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <span className="text-purple-700 font-bold text-xl">C</span>
              </div>
              <span className="text-white font-bold text-xl">CareerCompass</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-white">Shape your career path with confidence</h2>
            <p className="text-purple-200 mb-8 leading-relaxed">
              Our AI-powered platform helps professionals like you make strategic career decisions and develop skills that matter.
            </p>
            
            <div className="space-y-5 mt-16">
              {Array.from({ length: totalSteps + 1 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                      i === currentStep 
                        ? 'bg-white text-purple-700 shadow-lg shadow-purple-800/50' 
                        : i < currentStep 
                          ? 'bg-purple-400 text-white' 
                          : 'bg-purple-800/70 text-purple-300'
                    }`}
                  >
                    {i < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </div>
                  <span 
                    className={`text-sm transition-all duration-300 ${
                      i === currentStep 
                        ? 'text-white font-medium' 
                        : i < currentStep 
                          ? 'text-purple-200' 
                          : 'text-purple-400'
                    }`}
                  >
                    {i === 0 && "Welcome"}
                    {i === 1 && "Work Information"}
                    {i === 2 && "Experience"}
                    {i === 3 && "Skills & Growth"}
                    {i === 4 && "Additional Info"}
                    {i === 5 && "Confirmation"}
                    {i === 6 && "Completion"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column - with form content */}
        <div className={`w-full ${currentStep === 0 || currentStep === 6 ? 'lg:w-full' : 'lg:w-7/12'} bg-[#0f0f1a] backdrop-blur-xl p-8 rounded-r-2xl relative ${currentStep === 0 || currentStep === 6 ? 'lg:rounded-l-2xl' : ''}`}>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/10 to-transparent rounded-r-2xl"></div>
          
          {/* Progress bar - mobile only */}
          <div className="lg:hidden mb-8 relative">
            <div className="h-1.5 w-full bg-gray-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Start</span>
              <span>Finish</span>
            </div>
          </div>
          
          {/* Form content */}
          <div className="min-h-[450px] relative">
            {getStepContent()}
          </div>
          
          {/* Navigation buttons */}
          {currentStep > 0 && currentStep < 6 && (
            <div className="flex justify-between mt-12">
              <button
                onClick={prevStep}
                className="flex items-center text-gray-400 hover:text-white transition-colors px-4 py-2"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2.5 px-7 rounded-xl flex items-center transition-all duration-300 shadow-lg shadow-purple-900/20"
              >
                {currentStep === 5 ? 'Complete' : 'Continue'} <ChevronRight className="ml-1 w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}