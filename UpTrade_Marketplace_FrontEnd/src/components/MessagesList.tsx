import type { Mensagem } from "../interfaces/chatInterface";

interface MessagesListProps {
  messages: Mensagem[];
  currentUserId: number | null;
  isLoading?: boolean;
}

export default function MessagesList({
  messages,
  currentUserId,
  isLoading = false,
}: MessagesListProps) {
  return (
    <div className="bg-[#1B1B1B] rounded-lg border border-[#444444] h-96 overflow-y-auto p-4 mb-4 flex flex-col">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#858584] text-center">
            {isLoading
              ? "Carregando mensagens..."
              : "Nenhuma mensagem neste chat"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id_mensagem}
              className={`flex ${
                msg.id_usuario === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.id_usuario === currentUserId
                    ? "bg-tertiary text-tprimary"
                    : "bg-[#333333] text-ttertiary"
                }`}
              >
                <p className="text-xs text-gray-300 mb-1">
                  {msg.usuario?.nome}
                </p>
                <p>{msg.texto}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.data_envio).toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
