export const ITEM_CATEGORIES = {
  AUTO: 'auto',
  REAL_ESTATE: 'real_estate',
  ELECTRONICS: 'electronics',
} as const;

export const getAiApiConfig = () => ({
  baseUrl: process.env.AI_API_BASE_URL ?? '',
  apiKey: process.env.AI_API_KEY ?? '',
  model: process.env.AI_MODEL ?? '',
  generateDescriptionPath: process.env.AI_GENERATE_DESCRIPTION_PATH ?? '',
  estimatePricePath: process.env.AI_ESTIMATE_PRICE_PATH ?? '',
}) as const;
