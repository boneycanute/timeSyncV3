import { Card, CardBody } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  useEffect,
  FormEvent,
  useRef,
  memo,
  useCallback,
} from "react";
import { MessageSquare, Mic, Paperclip, CornerDownLeft } from "lucide-react";
import VoiceUI from "./voice-ui";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserAvatarContext";
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
  metadata?: any;
};

type TextModeProps = {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  userAvatarUrl: string | null;
};

const TextMode = memo(
  ({
    messages,
    isLoading,
    input,
    onInputChange,
    onSubmit,
    userAvatarUrl,
  }: TextModeProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus input when component mounts
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
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
                      ? userAvatarUrl || "/avatars/user-avatar.png"
                      : "/avatars/agent-avatar.png"
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
                  src="/avatars/agent-avatar.png"
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
            className="relative rounded-lg border focus-within:ring-0 p-1"
          >
            <ChatInput
              ref={inputRef}
              value={input}
              onChange={onInputChange}
              placeholder="Start typing and press enter"
              className="min-h-12 resize-none rounded-lg border-0 p-3 shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as any);
                }
              }}
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
    );
  }
);

TextMode.displayName = "TextMode";

const WEBHOOK_URL = "https://nikotin.cloud/webhook/eeefb676-66ec-44e3-bc18-334f145ee9e1";

export default function ChatUI() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("text");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi!👋 How can i help with your scheduling today ?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      console.log("📝 Sending message:", { input, userId: user?.id });

      // Add user message
      const userMessage = {
        id: messages.length + 1,
        content: input,
        sender: "user" as const,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        console.log("🚀 Making webhook request to:", WEBHOOK_URL);
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            userId: user?.id || 'anonymous',
            messageId: userMessage.id,
            context: {
              previousMessages: messages,
              userProfile: {
                email: user?.email,
                fullName: user?.fullName,
                preferences: user?.preferences
              }
            }
          })
        });

        if (!response.ok) {
          console.error("❌ Webhook error:", { 
            status: response.status, 
            statusText: response.statusText 
          });
          throw new Error('Failed to get response from assistant');
        }

        const data = await response.json();
        console.log("✅ Received webhook response:", data);
        
        const aiMessage = {
          id: messages.length + 2,
          content: data.content || "I apologize, but I couldn't process your request at the moment.",
          sender: "ai" as const,
          metadata: data.metadata
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('❌ Error in chat:', error);
        const errorMessage = {
          id: messages.length + 2,
          content: "I apologize, but I encountered an error while processing your request. Please try again.",
          sender: "ai" as const,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, user]
  );

  // Add keyboard event listener for text mode
  useEffect(() => {
    if (selectedMode !== "text") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is already typing in the input
      if (document.activeElement?.tagName === "TEXTAREA") return;

      // Ignore special key combinations
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Handle Enter key to send message
      if (e.key === "Enter") {
        e.preventDefault();
        if (input.trim()) {
          handleSubmit(new Event("submit") as any);
        }
        return;
      }

      // Only handle printable characters
      if (e.key.length === 1) {
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedMode, input, handleSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <Card
      className="h-full shadow-none border-none bg-transparent"
      radius="none"
    >
      <CardBody className="p-0 bg-transparent">
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {selectedMode === "text" ? (
                <TextMode
                  key="text"
                  messages={messages}
                  isLoading={isLoading}
                  input={input}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  userAvatarUrl={user?.avatarUrl || null}
                />
              ) : (
                <VoiceUI key="voice" />
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
