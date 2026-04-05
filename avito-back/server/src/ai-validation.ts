import { z } from 'zod';
import { ITEM_CATEGORIES } from './constants.ts';

const CategorySchema = z.enum(Object.values(ITEM_CATEGORIES));

const AiParamValueSchema = z.union([z.string(), z.number(), z.undefined()]);

export const AiItemInputSchema = z.strictObject({
  itemId: z.string().trim().optional(),
  category: CategorySchema,
  title: z.string().trim().min(1),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  params: z.record(z.string(), AiParamValueSchema),
});
