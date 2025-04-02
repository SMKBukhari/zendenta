// components/ui/dialog.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { createContext, useContext } from "react";
import { Button } from "../ui/button";

interface DialogContextType {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog");
  }
  return context;
};

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  position?: "right" | "center" | "left";
}

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "right",
}: DialogProps) => {
  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Position classes and animations
  const positionClasses = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      positionClass: "right-3 top-1/2 -translate-y-1/2",
    },
    center: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 },
      positionClass: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      positionClass: "left-0 top-1/2 -translate-y-1/2",
    },
  };

  const currentPosition = positionClasses[position];

  return (
    <DialogContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 z-40'
              onClick={onClose}
            />

            {/* Dialog Content */}
            <motion.div
              initial={currentPosition.initial}
              animate={currentPosition.animate}
              exit={currentPosition.exit}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className={`fixed inset-y-0 h-[90%] rounded-2xl ${currentPosition.positionClass} w-full ${sizeClasses[size]} bg-white shadow-lg overflow-y-auto border border-brand-neutrals/50 z-[99999999]`}
            >
              <div className='h-full flex flex-col'>
                {/* Header */}
                <div className='flex px-4 py-2 bg-brand-neutrals/5 justify-between items-center mb-6 border-b border-brand-neutrals/20'>
                  <h2 className='text-xl font-medium text-brand-neutrals'>
                    {title}
                  </h2>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={onClose}
                    className='text-gray-500 hover:text-brand-primary-pink hover:bg-transparent'
                    aria-label='Close dialog'
                  >
                    <X />
                  </Button>
                </div>

                {/* Main Content */}
                <div className='flex-1 overflow-y-auto'>{children}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

// Dialog Footer component
interface DialogFooterProps {
  children: React.ReactNode;
}

const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <div className='flex justify-end gap-3 p-4 mt-4 border-t border-brand-neutrals/20'>
      {children}
    </div>
  );
};

Dialog.Footer = DialogFooter;

export default Dialog;
