import { z } from "zod"

export const aiCodeSchema = z.object({
    commentary: z
        .string()
        .describe(`描述你即将执行的操作以及生成代码的详细步骤`),
    template: z
        .string()
        .describe("用于生成代码的模板名称"),
    title: z.string().describe("代码的简短标题，最多6个字。"),
    description: z
        .string()
        .describe("代码的简短描述，最多 1 句话。"),
    additional_dependencies: z
        .array(z.string())
        .describe("代码需要的额外依赖项。不包括模板中已包含的依赖项。"),
    install_dependencies_command: z
        .string()
        .describe("用于安装代码额外依赖项的命令。"),
    port: z
        .number()
        .nullable()
        .describe("代码使用的端口号。如果不暴露端口，则为 null"),
    code: z
        .string()
        .describe("代码生成的代码。必须是可运行的代码。"),
    file_path: z
        .string()
        .describe("相对文件路径，包括文件名。"),
});



export type AiCodeSchema = z.infer<typeof aiCodeSchema>;
