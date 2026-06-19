export interface ChatType {
  id_anuncio: number;
}

export interface MensagemType {
  texto: string;
}

export interface Chat {
  id_chat: number;
  id_anuncio: number;
  id_usuario_criador: number;
  data_criacao: string;
  anuncio?: {
    id_anuncio: number;
    titulo: string;
    preco: string;
    id_usuario: number;
    usuario?: {
      nome: string
    }
    imagem?: {
      url_caminho: string;
    };
  };
  usuario?: {
    id_usuario: number;
    nome: string;
    email: string;
  };
  mensagens?: Mensagem[];
}

export interface Mensagem {
  id_mensagem: number;
  texto: string;
  id_chat: number;
  id_usuario: number;
  data_envio: string;
  usuario?: {
    id_usuario: number;
    nome: string;
  };
}
