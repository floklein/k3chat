export enum Model {
  GEMINI_2_5_FLASH = "GEMINI_2_5_FLASH",
  CLAUDE_SONNET_4 = "CLAUDE_SONNET_4",
  GPT_4_1 = "GPT_4_1",
}

export const models: Record<
  Model,
  {
    name: string;
    provider: string;
    modelId: string;
  }
> = {
  [Model.GEMINI_2_5_FLASH]: {
    name: "Gemini 2.5 Flash",
    provider: "Google",
    modelId: "google/gemini-2.5-flash-preview-05-20",
  },
  [Model.CLAUDE_SONNET_4]: {
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    modelId: "anthropic/claude-sonnet-4",
  },
  [Model.GPT_4_1]: {
    name: "GPT 4.1",
    provider: "OpenAI",
    modelId: "openai/gpt-4.1",
  },
};

export const DEFAULT_MODEL = Model.GEMINI_2_5_FLASH;
