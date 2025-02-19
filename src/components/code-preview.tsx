import { ExecutionResult, ExecutionResultWeb } from "@/lib/types";
import { CodeWeb } from "./code-web";

export const CodePreview = ({ result }: { result: ExecutionResultWeb }) => {
  return <CodeWeb result={result} />;
};
