import React, { SetStateAction, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";

const ChatInput = ({
  error,
  retry,
  input,
  isLoading,
  stop,
  handleFileChange,
  handleInputChange,
  handleSubmit,
  files,
  isMultiModal,
  children
}: {
  error: undefined | unknown;
  retry: () => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  files: File[];
  handleFileChange: (files: File[]) => void;
  children: React.ReactNode;
  isMultiModal: boolean;
}) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(Array.from(e.target.files || []));
  };

  const handleFileRemove = (file: File) => {
    const newFiles = files ? Array.from(files).filter((f) => f !== file) : [];
    handleFileChange(newFiles);
  };

  const filePreview = useMemo(() => {
    if (files.length === 0) return null;
    return Array.from(files).map((file) => {
      return (
        <div className="relative" key={file.name}>
          <span
            onClick={() => handleFileRemove(file)}
            className="absolute top-[-8] right-[-8] bg-muted rounded-full p-1"
          >
            <X className="h-3 w-3 cursor-pointer" />
          </span>
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="rounded-xl w-10 h-10 object-cover"
          />
        </div>
      );
    });
  }, [files]);

  const onEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.currentTarget.checkValidity()) {
        handleSubmit(e);
      } else {
        e.currentTarget.reportValidity();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={onEnter}
      className="mb-2 flex flex-col mt-auto bg-background"
    >
      {error !== undefined && (
        <div className="text-red-400 px-3 py-2 text-sm font-">
          An unexpected error has occurred. Please
          <button className="underline" onClick={retry}>
            try again
          </button>{" "}
        </div>
      )}
      <div className="shadow-md rounded-2xl border">
        <div className="flex items-center px-3 py-2 gap-1">{children}</div>
        <TextareaAutosize
          autoFocus={true}
          minRows={1}
          maxRows={5}
          required={true}
          className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
          placeholder="描述您对应用的想象..."
          value={input}
          onChange={handleInputChange}
        />
        <div className="flex p-3 gap-2 items-center">
          <input
            type="file"
            id="multimodal"
            name="multimodal"
            accept="image/*"
            multiple={true}
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex items-center flex-1 gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!isMultiModal}
                    type="button"
                    variant={"outline"}
                    size={"icon"}
                    className="rounded-xl h-10 w-10"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("multimodal")?.click();
                    }}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>添加附件</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {files.length > 0 && filePreview}
          </div>
          <div>
            {!isLoading ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant={"default"}
                      size={"icon"}
                      className="rounded-xl h-10 w-10"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>发送消息</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"secondary"}
                      size={"icon"}
                      className="rounded-xl h-10 w-10"
                      onClick={(e) => {
                        e.preventDefault();
                        stop();
                      }}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>停止生成</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        AICode 是一个用于生成代码区块并提供实时 UI 预览的工具
      </p>
    </form>
  );
};

export default ChatInput;
