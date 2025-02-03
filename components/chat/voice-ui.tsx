"use client";

import { Card, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";

// Animation settings for Framer Motion
const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: "spring", stiffness: 250 },
};

export default function VoiceUI() {
  return (
    <motion.div {...animationConfig} className="flex flex-col h-full">
      <div className="flex-grow flex items-center justify-center">
        <p className="text-default-500">Voice UI</p>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-6 py-3 rounded-full bg-primary text-background dark:text-background"
            disabled
          >
            Hold to Speak
          </button>
        </div>
      </div>
    </motion.div>
  );
}
