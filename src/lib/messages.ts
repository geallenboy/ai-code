import { DeepPartial } from "ai";
import { AiCodeSchema } from "./schema";
import { ExecutionResult } from "./types";


export type MessageText = {
    type: "text";
    text: string;
};

export type MessageCode = {
    type: "code";
    text: string;
};

export type MessageImage = {
    type: "image";
    image: string;
};

export type Message = {
    role: "assistant" | "user";
    content: Array<MessageText | MessageCode | MessageImage>;
    object?: DeepPartial<AiCodeSchema>;
    result?: ExecutionResult;
};

export const toAISDKMessages = (messages: Message[]) => {
    return messages.map((message) => ({
        role: message.role,
        content: message.content.map((content) => {
            if (content.type === "code") {
                return {
                    type: "text",
                    text: content.text,
                };
            }

            return content;
        }),
    }));
}

export const toMessageImage = async (files: File[]) => {
    if (files.length === 0) {
        return [];
    }

    return Promise.all(
        files.map(async (file) => {
            const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
            return `data:${file.type};base64,${base64}`;
        })
    );
}