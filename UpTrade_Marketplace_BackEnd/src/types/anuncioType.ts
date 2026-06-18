export interface anuncioType {
  titulo: string;
  descricao: string;
  preco: string;
  condicao: "NOVO" | "USADO";
  marca?: string;
  id_imagens?: number[];
  categoria:
    | "CPU"
    | "GPU"
    | "PLACA_MAE"
    | "RAM"
    | "FONTE"
    | "GABINETE"
    | "ARMAZENAMENTO"
    | "COOLER"
    | "MONITOR"
    | "TECLADO"
    | "MOUSE"
    | "HEADSET";
}
