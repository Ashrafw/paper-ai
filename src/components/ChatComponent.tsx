"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

type Props = { chatId: string };

const ChatComponent = (chatId: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-cont");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative h-screen">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message List */}
      <div className=" h-[90%]  py-4 overflow-auto" id="message-cont">
        <MessageList messages={messages} />
      </div>
      {/* form input */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4 ">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full "
          />
          <Button className="bg-slate-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
