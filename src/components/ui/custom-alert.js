"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "./button";

export const CustomAlert = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, info, success
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    
    // When alert is shown, prevent scrolling on the body
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-10 w-10 text-amber-500" />;
      case "info":
        return <Info className="h-10 w-10 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      default:
        return <AlertTriangle className="h-10 w-10 text-amber-500" />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-amber-50 border-amber-200";
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-amber-600 hover:bg-amber-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-amber-600 hover:bg-amber-700";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden z-10"
          >
            <div className={`p-4 flex items-center border-b ${getHeaderColor()}`}>
              {getIcon()}
              <h3 className="text-lg font-semibold ml-3">{title}</h3>
              <button 
                onClick={onClose} 
                className="ml-auto text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-line">{message}</p>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={getConfirmButtonColor()}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
