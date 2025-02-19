import { Message } from "@/lib/messages";
import { AiCodeSchema } from "@/lib/schema";
import { ExecutionResult } from "@/lib/types";
import { DeepPartial } from "ai";
import { LoaderIcon, Terminal } from "lucide-react";
import React, { useEffect } from "react";

const Chat = ({
  messages,
  isLoading,
  setCurrentPreview
}: {
  messages: Message[];
  isLoading: boolean;
  setCurrentPreview: (preview: {
    aiCode: DeepPartial<AiCodeSchema> | undefined;
    result: ExecutionResult | undefined;
  }) => void;
}) => {
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [JSON.stringify(messages)]);
  return (
    <div id="chat-container" className="flex flex-col pb-4 gap-2 overflow-y-auto max-h-full">
      {messages.map((message: Message, index: number) => (
        <div
          key={index}
          className={`flex flex-col px-4 shadow-sm whitespace-pre-wrap ${
            message.role !== "user"
              ? "bg-accent dark:bg-white/5 border text-accent-foreground dark:text-muted-foreground py-4 rounded-2xl gap-4 w-full"
              : "bg-gradient-to-b from-black/5 to-black/10 dark:from-black/30 dark:to-black/50 py-2 rounded-xl gap-2 w-fit"
          } font-serif`}
        >
          {message.content.map((content, id) => {
            if (content.type === "text") {
              return content.text;
            }
            if (content.type === "image") {
              return (
                <img
                  key={id}
                  src={content.image}
                  alt="aicode"
                  className="mr-2 inline-block w-12 h-12 object-cover rounded-lg bg-white mb-2"
                />
              );
            }
          })}
          {message.object && (
            <div
              onClick={() =>
                setCurrentPreview({
                  aiCode: message.object,
                  result: message.result
                })
              }
              className="py-2 pl-2 w-full md:w-max flex items-center border rounded-xl select-none hover:bg-white dark:hover:bg-white/5 hover:cursor-pointer"
            >
              <div className="rounded-[0.5rem] w-10 h-10 bg-black/5 dark:bg-white/5 self-stretch flex items-center justify-center">
                <Terminal strokeWidth={2} className="" />
              </div>
              <div className="pl-2 pr-4 flex flex-col">
                <span className="font-bold font-sans text-sm text-primary">
                  {message.object.title}
                </span>
                <span className="font-sans text-sm text-muted-foreground">点击查看代码</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <LoaderIcon strokeWidth={2} className="animate-spin w-4 h-4" />
          <span>生成代码中...</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
