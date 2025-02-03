"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MessageSquare, Mic } from "lucide-react";
import VoiceUI from "./voice-ui";

// Animation settings for Framer Motion
const animationConfig = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.3, type: "spring", stiffness: 100 },
};

type ChatMode = "text" | "voice";

export default function ChatUI() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("text");

  const TextMode = () => (
    <motion.div {...animationConfig} className="flex flex-col h-full">
      <div className="flex-grow">
        {/* Chat messages will go here */}
        <p className="text-default-500"></p>
      </div>
      <div className="mt-auto border-t border-default-200 pt-4">
        {/* Chat input will go here */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded-lg border border-default-200 bg-default-100"
            disabled
          />
          <button className="px-4 py-2 rounded-lg bg-primary text-white" disabled>
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Card className="h-full shadow-none border-none bg-background dark:bg-black" radius="none">
      <CardBody className="dark:bg-black">
        <div className="flex flex-col h-full">
          <AnimatePresence mode="wait">
            {selectedMode === "text" ? <TextMode /> : <VoiceUI />}
          </AnimatePresence>
          <div className="mt-4 flex justify-center">
            <Tabs
              aria-label="Chat Mode"
              color="primary"
              variant="solid"
              selectedKey={selectedMode}
              onSelectionChange={(key) => setSelectedMode(key as ChatMode)}
              classNames={{
                tabList: "gap-6",
                cursor: "w-full",
                tab: "px-6 h-10 data-[hover=true]:text-primary dark:data-[hover=true]:text-primary",
                tabContent: "text-[15px] group-data-[selected=true]:text-background"
              }}
              fullWidth
            >
              <Tab
                key="text"
                title={
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={15} />
                    <span>Text</span>
                  </div>
                }
              />
              <Tab
                key="voice"
                title={
                  <div className="flex items-center space-x-2">
                    <Mic size={15} />
                    <span>Voice</span>
                  </div>
                }
              />
            </Tabs>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
