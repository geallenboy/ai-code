import { ExecutionError, Result } from "@e2b/code-interpreter";
import { TemplateId } from "./templates";

type ExecutionResultBase = {
  sbxId: string;
};

export type ExecutionResultInterpreter = ExecutionResultBase & {
  template: "garron-nextjs-developer";
  stdout: string[];
  stderr: string[];
  runtimeError?: ExecutionError;
  cellResults: Result[];
};

export type ExecutionResultWeb = ExecutionResultBase & {
  template: Exclude<TemplateId, "garron-nextjs-developer">;
  url: string;
};

export type ExecutionResult = ExecutionResultInterpreter | ExecutionResultWeb;
