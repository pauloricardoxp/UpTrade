import { FaArrowRight } from "react-icons/fa";
import type { Chat } from "../interfaces/chatInterface";

interface ChatCardProps {
  chat: Chat;
  currentUserId: number | null;
  onClick: (chat: Chat) => void;
}

export default function ChatCard({
  chat,
  currentUserId,
  onClick,
}: ChatCardProps) {
  const displayName =
    chat.anuncio?.id_usuario === currentUserId
      ? chat.usuario?.nome
      : chat.anuncio?.usuario?.nome;

  return (
    <button
      onClick={() => onClick(chat)}
      className="bg-[#1B1B1B] border border-[#444444] rounded-lg p-4 hover:border-tertiary transition-colors text-left group"
    >
      <div className="flex gap-4">
        {chat.anuncio?.imagem?.url_caminho && (
          <img
            src={chat.anuncio.imagem.url_caminho}
            alt={chat.anuncio?.titulo}
            className="w-24 h-24 object-cover rounded-lg shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-ttertiary group-hover:text-tertiary transition-colors truncate">
            {chat.anuncio?.titulo || "Produto sem nome"}
          </h3>
          <p className="text-tertiary font-semibold mb-2">
            R${" "}
            {chat.anuncio?.preco
              ? Number(chat.anuncio.preco).toFixed(2).replace(".", ",")
              : "0,00"}
          </p>
          <p className="text-[#858584] text-sm truncate">{displayName}</p>
          {chat.mensagens && chat.mensagens.length > 0 && (
            <p className="text-[#858584] text-sm mt-2 truncate">
              {chat.mensagens[chat.mensagens.length - 1].texto}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <div className="text-[#444444] group-hover:text-tertiary transition-colors">
           <FaArrowRight />
          </div>
        </div>
      </div>
    </button>
  );
}
