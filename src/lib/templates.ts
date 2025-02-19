import templates from "./templates.json";

export default templates;

export type Templates = keyof typeof templates;
export type TemplateId = keyof typeof templates;
export type TemplateConfig = (typeof templates)[TemplateId];

export function templatesToPrompt(templates: Templates) {
  return `${Object.entries(templates)
    .map(
      ([id, t]: any, index) =>
        `${index + 1}. ${id}: "${t.instructions}". 文件: ${t.file || "none"
        }. 安装的依赖项： ${t.lib.join(",")}. 端口: ${t.port || "none"
        }`
    )
    .join("\n")}`;
}
