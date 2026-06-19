export interface UserData {
  id?: number;
  nome?: string;
  telefone?: string;
  email?: string;
  foto_perfil?: string;
  data_cadastro?: string;
}

export interface ApiResponse {
  nome: string;
  email: string;
  telefone: string;
  foto_perfil: string;
  data_cadastro: string;
  anuncios: {
    ativos: number;
    inativos: number;
    trocados: number;
  };
}

export interface AnunciosStats {
  ativos: number;
  inativos: number;
  trocados: number;
}