import { getAiApiConfig } from './constants.ts';
import type {
  AiItemInput,
  EstimatePriceResponse,
  GenerateDescriptionResponse,
} from './types.ts';

class AiConfigurationError extends Error {}

type ModelResponse = {
  choices?: Array<{
    text?: string;
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

const ensureAiEndpointConfig = (path: string): string => {
  const config = getAiApiConfig();

  if (!config.baseUrl || !config.apiKey || !config.model || !path) {
    throw new AiConfigurationError(
      'AI API is not configured. Set AI_API_BASE_URL, AI_API_KEY, AI_MODEL and endpoint paths.',
    );
  }

  return new URL(path, config.baseUrl).toString();
};

const stringifyItemPayload = (payload: AiItemInput): string =>
  JSON.stringify(payload, null, 2);

const formatParagraphsForFrontend = (text: string): string => {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    return '';
  }

  return paragraphs.map(paragraph => `${paragraph}\\n`).join('\n\n');
};

const extractTextFromResponse = (response: ModelResponse): string => {
  const firstChoice = response.choices?.[0];

  if (typeof firstChoice?.text === 'string' && firstChoice.text.trim()) {
    return firstChoice.text.trim();
  }

  const content = firstChoice?.message?.content;

  if (typeof content === 'string' && content.trim()) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map(part => part.text ?? '')
      .join('')
      .trim();

    if (text) {
      return text;
    }
  }

  throw new Error('AI API returned an empty response');
};

const extractJsonObject = (text: string): string => {
  const fencedJsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJsonMatch?.[1]) {
    return fencedJsonMatch[1].trim();
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    return objectMatch[0];
  }

  return text.trim();
};

const callModel = async (
  path: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> => {
  const config = getAiApiConfig();
  const url = ensureAiEndpointConfig(path);
  const isChatCompletionsEndpoint = /\/chat\/completions\/?$/i.test(path);

  const body = isChatCompletionsEndpoint
    ? {
        model: config.model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }
    : {
        model: config.model,
        temperature: 0.2,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
      };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`AI API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ModelResponse;
  return extractTextFromResponse(data);
};

export const generateDescription = async (
  payload: AiItemInput,
): Promise<GenerateDescriptionResponse> => {
  const description = await callModel(
    getAiApiConfig().generateDescriptionPath,
    'You are a professional marketplace copywriter. Answer like "Продаю свой MacBook Pro 16\" (2021) на чипе M1 Pro..." and keep the tone concise, professional, slightly more refined than a typical listing.',
    `Write 2 short paragraphs in Russian for this listing. Be factual, concise and slightly more professional than a typical user listing. Use only the provided details. No markdown, no bullets.\n\n${stringifyItemPayload(
      payload,
    )}`,
  );

  return {
    description: formatParagraphsForFrontend(description),
  };
};

export const estimatePrice = async (
  payload: AiItemInput,
): Promise<EstimatePriceResponse> => {
  const rawResponse = await callModel(
    getAiApiConfig().estimatePricePath,
    'You are a marketplace pricing analyst. Reasoning should look like: "Средняя цена ...", "От ...", "90 000 – ..." and stay professional. Return valid JSON only.',
    `Estimate a fair listing price in RUB for this item. Return JSON only with keys "price" and optional "reasoning". Make the reasoning short and professional and include a few candidate ranges similar to:\nСредняя цена на MacBook Pro 16" ...\n115 000 – 135 000 ₽ — отличное состояние.\nОт 140 000 ₽ — идеал, малый износ АКБ.\n90 000 – 110 000 ₽ — срочно или с дефектами нужно чтобы по цене он отдавал.\n\n${stringifyItemPayload(
      payload,
    )}`,
  );

  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonObject(rawResponse));
  } catch {
    throw new Error('AI API returned invalid JSON for price estimation');
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    typeof (parsed as { price?: unknown }).price !== 'number'
  ) {
    throw new Error('AI API price estimation response does not contain a numeric price');
  }

  const reasoning = (parsed as { reasoning?: unknown }).reasoning;

  return {
    price: (parsed as { price: number }).price,
    reasoning:
      typeof reasoning === 'string'
        ? formatParagraphsForFrontend(reasoning)
        : undefined,
  };
};

export const isAiConfigurationError = (
  error: unknown,
): error is AiConfigurationError => error instanceof AiConfigurationError;
