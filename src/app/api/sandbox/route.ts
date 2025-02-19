import { AiCodeSchema } from "@/lib/schema";
import { ExecutionResultInterpreter, ExecutionResultWeb } from "@/lib/types";
import { Sandbox } from "@e2b/code-interpreter";

const sandboxTimeout = 10 * 60 * 1000;

export async function POST(req: Request) {
    const {
        aiCode,
        userID,
        apiKey,
    }: { aiCode: AiCodeSchema; userID: string; apiKey?: string } =
        await req.json();
    console.log("aiCode", aiCode, "userID:", userID, "apiKey:", apiKey);
    // Create a interpreter or a sandbox

    const sbx = await Sandbox.create(aiCode.template, {
        metadata: { template: aiCode.template, userID: userID },
        timeoutMs: sandboxTimeout,
        apiKey,
    })
    // Install packages
    if (aiCode.additional_dependencies) {
        await sbx.commands.run(aiCode.install_dependencies_command)
        console.log(
            `Installed dependencies: ${aiCode.additional_dependencies.join(', ')} in sandbox ${sbx.sandboxId}`,
        )
    }

    // Copy code to fs
    if (aiCode.code && Array.isArray(aiCode.code)) {
        aiCode.code.forEach(async (file) => {
            await sbx.files.write(file.file_path, file.file_content);
        });
    } else {
        await sbx.files.write(aiCode.file_path, aiCode.code);
    }
    // Execute code or return a URL to the running sandbox
    // if (aiCode.template === 'garron-nextjs-developer') {
    //     const { logs, error, results } = await sbx.runCode(aiCode.code || '')
    //     return new Response(
    //         JSON.stringify({
    //             sbxId: sbx?.sandboxId,
    //             template: aiCode.template,
    //             stdout: logs.stdout,
    //             stderr: logs.stderr,
    //             runtimeError: error,
    //             cellResults: results,
    //         } as ExecutionResultInterpreter),
    //     )
    // }

    // 返回结果
    return new Response(
        JSON.stringify({
            sbxId: sbx?.sandboxId,
            template: aiCode.template,
            url: `https://${sbx?.getHost(aiCode.port || 80)}`,
        } as ExecutionResultWeb),
    )
}