export interface AnuncioDetail {
  id_anuncio: number;
  titulo: string;
  descricao: string;
  preco: string;
  data_criacao: string;
  condicao: string;
  marca: string;
  status: string;
  id_usuario: number;
  id_imagens?: number[];
  categoria: string;
  imagens?: {
    id_imagem: number;
    url_caminho: string;
  }[];
  usuario?: {
    nome: string;
    foto_perfil?: string;
  };
}
