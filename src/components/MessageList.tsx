import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>;
  return (
    <div className=" flex flex-col gap-2 px-2 ">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end pl-10": message.role === "user",
            "justify-start pr-10": message.role === "assistant",
          })}
        >
          <div
            className={cn("rounded shadow-md text-sm py-1 px-3 ring-1 ring-gray-900/10", {
              " bg-slate-700 text-white": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
