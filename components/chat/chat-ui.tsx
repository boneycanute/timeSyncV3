import { Card, CardBody } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, FormEvent, memo } from "react";
import { MessageSquare, Mic, Paperclip, CornerDownLeft } from "lucide-react";
import VoiceUI from "./voice-ui";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";

const animationConfig = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.3, type: "spring", stiffness: 100 },
};

type ChatMode = "text" | "voice";
type Message = {
  id: number;
  content: string;
  sender: "user" | "ai";
};

type TextModeProps = {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
};

const TextMode = memo(
  ({ messages, isLoading, input, onInputChange, onSubmit }: TextModeProps) => (
    <motion.div {...animationConfig} className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === "user"
                    ? "/avatars/user-avatar.png"
                    : "/avatars/ai-avatar.png"
                }
                fallback={message.sender === "user" ? "U" : "A"}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="/avatars/ai-avatar.png"
                fallback="A"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      <div className="p-4">
        <form
          onSubmit={onSubmit}
          className="relative rounded-lg border focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={onInputChange}
            placeholder="Message your calendar assistant..."
            className="min-h-12 resize-none rounded-lg border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex"></div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
);

TextMode.displayName = "TextMode";

export default function ChatUI() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("text");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your calendar assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Replace with actual webhook call
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        content:
          "I understand you want to know about your calendar. Let me help you with that.",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <Card className="h-full shadow-none border-none bg-transparent" radius="none">
      <CardBody className="p-0 bg-transparent">
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {selectedMode === "text" ? (
                <TextMode
                  messages={messages}
                  isLoading={isLoading}
                  input={input}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                />
              ) : (
                <VoiceUI />
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-center">
            <Tabs
              aria-label="Chat Mode"
              color="primary"
              variant="solid"
              selectedKey={selectedMode}
              onSelectionChange={(key) => setSelectedMode(key as ChatMode)}
              classNames={{
                tabList: "gap-6",
                tab: "px-4 py-2",
                cursor: "bg-primary",
              }}
            >
              <Tab
                key="text"
                title={
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Text</span>
                  </div>
                }
              />
              <Tab
                key="voice"
                title={
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
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
