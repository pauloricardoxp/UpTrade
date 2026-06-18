import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import api from "../services/api";
import type { Chat, Mensagem, ChatType } from "../interfaces/chatInterface";

interface ChatBoxProps {
  idAnuncio: number;
  idVendedor: number;
  tituloAnuncio: string;
  onClose: () => void;
}

function ChatBox({ idAnuncio, tituloAnuncio, onClose }: ChatBoxProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMsg, setNovaMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const usuarioId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!).id
    : null;

  useEffect(() => {
    const inicializarChat = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const chatData: ChatType = { id_anuncio: idAnuncio };
        const chatResponse = await api.post("/chats", chatData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChat(chatResponse.data);

        if (chatResponse.data.id_chat) {
          const msgResponse = await api.get(
            `/chats/${chatResponse.data.id_chat}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setMensagens(msgResponse.data.mensagens || []);
        }

        setError("");
      } catch (err: any) {
        console.error(err.response?.data);
        console.error(err.response?.status);
        console.error({ id_anuncio: idAnuncio });

        const mensagemErro = err.response?.data?.message || "";
        if (mensagemErro.includes("próprio anúncio")) {
          setError("Você não pode iniciar um chat no seu próprio anúncio.");
        } else if (mensagemErro.includes("inativo")) {
          setError("Este anúncio está inativo e não aceita novas conversas.");
        } else if (mensagemErro.includes("não encontrado")) {
          setError("Anúncio não encontrado.");
        } else {
          setError(mensagemErro || "Erro ao abrir chat.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (usuarioId) {
      inicializarChat();
    }
  }, [idAnuncio, usuarioId]);

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaMsg.trim() || !chat) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem("token");

      const mensagemData = { texto: novaMsg };
      const response = await api.post(
        `/chats/${chat.id_chat}/mensagem`,
        mensagemData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Mensagem enviada:", response.data);

      setMensagens((prev) => [
        ...prev,
        {
          ...response.data,
          usuario: {
            id_usuario: usuarioId,
            nome: JSON.parse(localStorage.getItem("user")!).email.split("@")[0],
          },
        },
      ]);

      setNovaMsg("");
    } catch (err: any) {
      setError("Erro ao enviar mensagem.");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-secondary rounded-2xl p-4 flex items-center justify-center h-64">
        <p className="text-white">Abrindo chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-secondary rounded-2xl p-4 flex flex-col items-center justify-center h-64">
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-tertiary text-white px-4 py-2 rounded-full"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary rounded-2xl shadow-xl flex flex-col mt-8">
      <div className="bg-tertiary rounded-t-2xl p-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold">{tituloAnuncio}</h3>
          <p className="text-sm text-gray-300">Chat com vendedor</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:brightness-75 transition"
        >
          <X />
        </button>
      </div>

      <div className="w-full overflow-y-auto p-4 bg-primary space-y-4 max-h-96">
        {mensagens.length === 0 ? (
          <p className="text-center text-[#858584] py-10">Inicie a conversa!</p>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg.id_mensagem}
              className={`flex ${
                msg.id_usuario === usuarioId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.id_usuario === usuarioId
                    ? "bg-tertiary text-white"
                    : "bg-secondary text-white"
                }`}
              >
                <p className="text-xs text-gray-300 mb-1">
                  {msg.usuario?.nome}
                </p>
                <p className="wrap-break-word">{msg.texto}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <form
        onSubmit={handleEnviarMensagem}
        className="p-4 border-t border-secondary"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={novaMsg}
            onChange={(e) => setNovaMsg(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-secondary text-white px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-tertiary"
          />
          <button
            type="submit"
            disabled={isSending || !novaMsg.trim()}
            className="bg-tertiary hover:brightness-90 disabled:opacity-50 text-white p-2 rounded-full transition"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
