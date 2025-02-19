"use client";
import { SetStateAction, useEffect, useState } from "react";
import AuthDialog from "@/components/auth-dialog";
import { NavBar } from "@/components/navbar";
import { AuthViewType, useAuth } from "@/lib/auth";
import { useLocalStorage } from "usehooks-ts";
import { Message, toAISDKMessages, toMessageImage } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import modelsList from "@/lib/models.json";
import { experimental_useObject as useObject } from "ai/react";
import templates, { TemplateId } from "@/lib/templates";
import Chat from "@/components/chat";
import ChatInput from "@/components/chat-input";
import ChatPicker from "@/components/chat-picker";
import { LLMModelConfig } from "@/lib/models";
import ChatSettings from "@/components/chat-settings";
import { DeepPartial } from "ai";
import { AiCodeSchema, aiCodeSchema } from "@/lib/schema";
import { ExecutionResult } from "@/lib/types";
import { usePostHog } from "posthog-js/react";
import { Preview } from "@/components/preview";

export default function Home() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthViewType>("sign_in");
  const { session } = useAuth(setIsAuthDialogOpen, setAuthView);
  const [chatInput, setChatInput] = useLocalStorage("chat", "");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<"auto" | TemplateId>("auto");
  const [languageModel, setLanguageModel] = useLocalStorage("languageModel", {
    model: "gpt-4o-mini"
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiCode, setAiCode] = useState<DeepPartial<AiCodeSchema>>();
  const [currentTab, setCurrentTab] = useState<"code" | "codeView">("code");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult>();

  const posthog = usePostHog();

  const setCurrentPreview = (preview: {
    aiCode: DeepPartial<AiCodeSchema> | undefined;
    result: ExecutionResult | undefined;
  }) => {
    setAiCode(preview.aiCode);
    setResult(preview.result);
  };
  const setMessage = (message: Partial<Message>, index?: number) => {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages];
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message
      };

      return updatedMessages;
    });
  };
  const { object, submit, isLoading, stop, error } = useObject({
    api: "/api/chat",
    schema: aiCodeSchema,
    onFinish: async ({ object, error }) => {
      console.log("onFinish callback:", object, error);
      if (!error) {
        const aiCode = object;
        console.log("code", aiCode);
        setIsPreviewLoading(true);
        posthog.capture("aiCode_generated", {
          template: aiCode?.template
        });

        const response = await fetch("/api/sandbox", {
          method: "POST",
          body: JSON.stringify({
            aiCode,
            userID: session?.user.id
          })
        });

        const result = await response.json();
        console.log("result:", result);
        posthog.capture("sandbox_created", { url: result.url });

        setResult(result);
        setCurrentPreview({ aiCode, result });
        setMessage({ result });
        setCurrentTab("codeView");
        setIsPreviewLoading(false);
      }
    }
  });
  useEffect(() => {
    if (object) {
      setAiCode(object);
      const content: Message["content"] = [
        { type: "text", text: object.commentary || "" },
        { type: "code", text: object.code || "" }
      ];

      if (!lastMessage || lastMessage.role !== "assistant") {
        addMessage({
          role: "assistant",
          content,
          object
        });
      }

      if (lastMessage && lastMessage.role === "assistant") {
        setMessage({
          content,
          object
        });
      }
    }
  }, [object]);

  useEffect(() => {
    if (error) stop();
  }, [error]);

  const logout = () => {
    supabase ? supabase.auth.signOut() : console.warn("Supabase is not initialized");
  };

  const currentModel = modelsList.models.find((model) => model.id === languageModel.model);

  const currentTemplate =
    selectedTemplate == "auto" ? templates : { [selectedTemplate]: templates[selectedTemplate] };

  const lastMessage = messages[messages.length - 1];

  const retry = () => {
    submit({
      userID: session?.user?.id,
      messages: toAISDKMessages(messages),
      template: currentTemplate,
      model: currentModel,
      config: languageModel
    });
  };
  const handleUndo = () => {
    setMessages((previousMessages) => [...previousMessages.slice(0 - 2)]);
    setCurrentPreview({ aiCode: undefined, result: undefined });
  };

  const handleClearChat = () => {
    stop();
    setChatInput("");
    setFiles([]);
    setMessages([]);
    setAiCode(undefined);
    setResult(undefined);
    setCurrentTab("code");
    setIsPreviewLoading(false);
  };

  const handleSocialClick = (target: "github" | "x" | "discord") => {
    posthog.capture(`${target}_click`);
  };
  const handleSaveInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };
  const addMessage = (message: Message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
    return [...messages, message];
  };
  const handleSubmitAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();
    if (error) {
      console.error("获取会话失败:", error);
    }
    console.log(session?.user, "session?.user ");

    if (session?.user) {
      if (isLoading) {
        stop();
      }

      const content: Message["content"] = [{ type: "text", text: chatInput }];
      const images = await toMessageImage(files);
      console.log("images", images, "content:", content);
      if (images.length > 0) {
        images.forEach((image) => {
          content.push({ type: "image", image });
        });
      }

      const updatedMessages = addMessage({
        role: "user",
        content
      });

      submit({
        userID: session?.user?.id,
        messages: toAISDKMessages(updatedMessages),
        template: currentTemplate,
        model: currentModel,
        config: languageModel
      });

      setChatInput("");
      setFiles([]);
      setCurrentTab("codeView");

      posthog.capture("chat_submit", {
        template: selectedTemplate,
        model: languageModel.model
      });
    } else {
      console.log("未登录");
      setIsAuthDialogOpen(true);
    }
  };
  const handleFileChange = (change: SetStateAction<File[]>) => {
    setFiles(change);
  };
  const handleLanguageModelChange = (e: LLMModelConfig) => {
    setLanguageModel({ ...languageModel, ...e });
  };
  return (
    <main className="flex min-h-screen max-h-screen">
      <AuthDialog
        open={isAuthDialogOpen}
        setOpen={setIsAuthDialogOpen}
        view={authView}
        supabase={supabase}
      />
      <div className="grid w-full md:grid-cols-2">
        <div
          className={`flex flex-col w-full max-w-[800px] mx-auto px-4 overflow-auto ${
            aiCode ? "col-span-1" : "col-span-2"
          }`}
        >
          <NavBar
            session={session}
            showLogin={() => setIsAuthDialogOpen(true)}
            signOut={logout}
            onClear={handleClearChat}
            canClear={messages.length > 0}
            canUndo={messages.length > 1 && !isLoading}
            onUndo={handleUndo}
            onSocialClick={handleSocialClick}
          />
          <Chat messages={messages} isLoading={isLoading} setCurrentPreview={setCurrentPreview} />
          <ChatInput
            isLoading={isLoading}
            input={chatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={handleSubmitAuth}
            handleFileChange={handleFileChange}
            files={files}
            error={error}
            retry={retry}
            isMultiModal={false}
            stop={stop}
          >
            <ChatPicker
              models={modelsList.models}
              templates={templates as any}
              selectedTemplate={selectedTemplate}
              languageModel={languageModel}
              onSelectedTemplateChange={setSelectedTemplate}
              onLanguageModelChange={handleLanguageModelChange}
            />
            <ChatSettings
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
              apiKeyConfigurable={true}
              baseURLConfigurable={true}
            />
          </ChatInput>
        </div>
        <Preview
          apiKey={""}
          selectedTab={currentTab}
          onSelectedTabChange={setCurrentTab}
          isChatLoading={isLoading}
          isPreviewLoading={isPreviewLoading}
          aiCode={aiCode}
          result={result as ExecutionResult}
          onClose={() => setAiCode(undefined)}
        />
      </div>
    </main>
  );
}
