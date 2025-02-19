import { Duration } from "@/lib/duration";
import {
    getDefaultMode,
    getModelClient,
    LLMModel,
    LLMModelConfig,
} from "@/lib/models";
import { toPrompt } from "@/lib/prompt";
import ratelimit from "@/lib/ratelimit";
import { Templates } from "@/lib/templates";
import { CoreMessage, LanguageModel, streamObject } from "ai";
import { aiCodeSchema as schema } from "@/lib/schema";

const ratelimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
    : 100;

const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
    ? (process.env.RATE_LIMIT_WINDOW as Duration)
    : "1d";

export async function POST(req: Request) {
    const {
        messages,
        userID,
        template,
        model,
        config,
    }: {
        messages: CoreMessage[];
        userID: string;
        template: Templates;
        model: LLMModel;
        config: LLMModelConfig;
    } = await req.json();

    const limit = !config.apiKey
        ? await ratelimit(userID, ratelimitMaxRequests, ratelimitWindow)
        : false;

    if (limit) {
        return new Response("You have reached your request limit for the day.", {
            status: 429,
            headers: {
                "X-Ratelimit-Limit": limit.amount.toString(),
                "X-RateLimit-Remaining": limit.remaining.toString(),
                "X-RateLimit-Reset": limit.reset.toString(),
            },
        });
    }

    const {
        model: modelNameString,
        apiKey: modelApiKey,
        ...modelParams
    } = config;

    const modelClient = getModelClient(model, config);
    console.log("modelClient", modelClient);
    console.log("modelParams", modelParams);
    console.log("template", template);
    console.log("messages", messages);
    console.log("model", model);
    console.log("system", toPrompt(template));
    const stream = streamObject({
        model: modelClient as LanguageModel,
        schema,
        system: toPrompt(template),
        messages,
        mode: getDefaultMode(model),
        ...modelParams,
    });

    return stream.toTextStreamResponse();
}
