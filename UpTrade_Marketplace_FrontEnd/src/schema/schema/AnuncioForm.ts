import { z } from "zod";

export const anuncioSchema = z.object({
  titulo: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  descricao: z.string().min(10, "A descrição deve ser mais detalhada"),
  preco: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Preço deve ser um número positivo",
  }),
  condicao: z.enum(["NOVO", "USADO"]),
  marca: z.string().min(1, "Informe a marca"),
  categoria: z.enum([
    "CPU",
    "GPU",
    "PLACA_MAE",
    "RAM",
    "FONTE",
    "GABINETE",
    "ARMAZENAMENTO",
    "COOLER",
    "MONITOR",
    "TECLADO",
    "MOUSE",
    "HEADSET",
  ]),
});

export type AnuncioForm = z.infer<typeof anuncioSchema>;
