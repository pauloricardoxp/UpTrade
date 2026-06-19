import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Chat, Mensagem } from "../interfaces/chatInterface";
import api from "../services/api";
import MessagesList from "../components/MessagesList";
import MessageInput from "../components/MessageInput";

export default function ChatListPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const currentUserId = userStr ? JSON.parse(userStr).id : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const handleStorageChange = () => {
      const updatedUserStr = localStorage.getItem("user");
      if (updatedUserStr) {
        fetchChats();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    fetchChats();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token, navigate]);

  useEffect(() => {
    if (currentUserId) {
      fetchChats();
    }
  }, [currentUserId]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/chats");

      if (!response.data || response.data.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const chatsEnriquecidos = await Promise.all(
        (response.data || []).map(async (chat: Chat) => {
          try {
            const anuncioResponse = await api.get(
              `/anuncios/${chat.id_anuncio}`,
            );
            return {
              ...chat,
              anuncio: {
                ...chat.anuncio,
                preco: anuncioResponse.data.preco,
                imagem: anuncioResponse.data.imagem,
              },
            };
          } catch {
            return chat;
          }
        }),
      );

      const chatsDedupados = Array.from(
        new Map(
          chatsEnriquecidos.map((chat) => [chat.id_anuncio, chat]),
        ).values(),
      ).sort((a, b) => {
        const aMensagens = a.mensagens?.length || 0;
        const bMensagens = b.mensagens?.length || 0;
        return bMensagens - aMensagens;
      });

      setChats(chatsDedupados);
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      setMessages(response.data.mensagens || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat.id_chat);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    setSendingMessage(true);
    try {
      await api.post(`/chats/${selectedChat.id_chat}/mensagem`, {
        texto: messageInput,
      });
      setMessageInput("");
      await fetchMessages(selectedChat.id_chat);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.anuncio?.titulo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!token) {
    return null;
  }

  const displayName =
    selectedChat &&
    (selectedChat.anuncio?.id_usuario === currentUserId
      ? selectedChat.usuario?.nome
      : selectedChat.anuncio?.usuario?.nome);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 py-8">
      <div className="bg-[#2B2B2B] rounded-3xl w-full max-w-6xl h-150 flex gap-6 p-6">
        <div className="flex flex-col gap-6 w-80">
          <h1 className="text-5xl font-bold text-white">Conversas</h1>

          <div
            className="flex-1 overflow-y-auto space-y-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="text-[#858584] text-center py-8">
                Carregando...
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-[#858584] text-center py-8">
                Nenhuma conversa
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = selectedChat?.id_chat === chat.id_chat;
                const chatDisplayName =
                  chat.anuncio?.id_usuario === currentUserId
                    ? chat.usuario?.nome
                    : chat.anuncio?.usuario?.nome;

                return (
                  <button
                    key={chat.id_chat}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-4 rounded-2xl text-left transition-colors font-normal text-[16px] flex items-center gap-3 ${
                      isSelected
                        ? "bg-tertiary text-tprimary"
                        : "bg-[#3B3B3B] text-white hover:bg-[#444444]"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#858584] shrink-0" />
                    <span className="truncate">{chatDisplayName}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#3B3B3B] rounded-3xl flex-1 p-6 flex flex-col">
            {selectedChat ? (
              <>
                <div className="mb-6 pb-4 border-b border-[#444444]">
                  <h2 className="text-xl font-bold text-white">
                    {selectedChat.anuncio?.titulo}
                  </h2>
                  <p className="text-sm text-[#858584]">{displayName}</p>
                </div>

                <div className="flex-1 overflow-hidden mb-4">
                  <MessagesList
                    messages={messages}
                    currentUserId={currentUserId}
                  />
                </div>

                <MessageInput
                  value={messageInput}
                  onChange={setMessageInput}
                  onSend={handleSendMessage}
                  isLoading={sendingMessage}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[#858584] text-lg">
                <p>Selecione uma conversa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
