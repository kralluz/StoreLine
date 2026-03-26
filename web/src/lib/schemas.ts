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

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;