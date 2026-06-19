export interface Imagem {
  id_imagem?: number;
  url_caminho: string | null;
}

export interface Usuario {
  nome: string;
  foto_perfil?: string;
}

export interface Anuncio {
  id_anuncio: number;
  titulo: string;
  descricao: string;
  preco: string;
  data_criacao: string;
  condicao: "NOVO" | "USADO" | "REFURBISHED";
  marca: string;
  status: "ATIVO" | "INATIVO" | "TROCADO";
  usuario: Usuario;
  categoria: string;
  imagens: Imagem[];
}
