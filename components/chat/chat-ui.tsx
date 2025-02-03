"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";

export default function ChatUI() {
  return (
    <Card className="h-full">
      <CardBody>
        <div className="flex flex-col h-full">
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
              <button
                className="px-4 py-2 rounded-lg bg-primary text-white"
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
