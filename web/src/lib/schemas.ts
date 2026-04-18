import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Nome deve ter no minimo 3 caracteres"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha obrigatoria"),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  description: z.string().max(2000, "Descricao muito longa").optional().nullable(),
  imageUrl: z.string().trim().max(2048, "URL da imagem muito longa").optional().nullable(),
  price: z.coerce.number().min(0, "Preco invalido"),
  stock: z.coerce.number().int().min(0, "Estoque invalido").optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export const ProductUpdateSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio").optional(),
  description: z.string().max(2000, "Descricao muito longa").nullable().optional(),
  imageUrl: z.string().trim().max(2048, "URL da imagem muito longa").nullable().optional(),
  price: z.coerce.number().min(0, "Preco invalido").optional(),
  stock: z.coerce.number().int().min(0, "Estoque invalido").optional(),
  isActive: z.coerce.boolean().optional(),
});

export const AddCartItemSchema = z.object({
  productId: z.string().min(1, "productId obrigatorio"),
  quantity: z.number().int().min(1, "Quantidade minima e 1").default(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantidade minima e 1"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type AddCartItemInput = z.infer<typeof AddCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
