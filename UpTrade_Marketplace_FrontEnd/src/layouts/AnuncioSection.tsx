import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Globe, MessageCircle } from "lucide-react";
import api from "../services/api";
import type { AnuncioDetail } from "../interfaces/anuncioDetail";
import LoginModal from "../components/LoginModal";
import ChatBox from "../components/ChatBox";

function AnuncioSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [anuncio, setAnuncio] = useState<AnuncioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const idAnuncio = searchParams.get("id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!idAnuncio) {
      setError("ID do anúncio não encontrado");
      setIsLoading(false);
      return;
    }

    const fetchAnuncio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get<AnuncioDetail>(
          `/anuncios/${idAnuncio}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setAnuncio(response.data);
        setError("");
      } catch (err) {
        console.error("Erro ao buscar anúncio:", err);
        setError("Erro ao carregar anúncio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnuncio();
  }, [idAnuncio]);

  const handleFalarComVendedor = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowChat(true);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    navigate("/registrar");
  };

  const formatarData = (data: string) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return (
      <div className="bg-primary py-10 flex justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (error || !anuncio) {
    return (
      <div className="bg-primary py-10 flex justify-center">
        <p className="text-red-500">{error || "Anúncio não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="bg-primary content-stretch flex flex-col items-center py-10 px-8">
      <div className="content-stretch flex flex-col items-start w-full max-w-262.5">
        <div className="content-stretch flex gap-32 items-start w-full">
          <div className="content-stretch flex flex-1 flex-col gap-8 items-center">
            <div className="capitalize content-stretch flex flex-col gap-2 items-start w-full">
              <h1 className="text-5xl font-semibold text-white leading-tight w-full">
                {anuncio.titulo}
              </h1>
              <p className="text-[22px] text-[#858584] leading-relaxed w-full">
                Postado em: {formatarData(anuncio.data_criacao)}
              </p>
            </div>

            <div className="content-stretch flex flex-col gap-2 items-start w-full">
              <p className="text-[22px] font-bold text-[#858584] uppercase">
                Criado por:
              </p>
              <div className="content-stretch flex gap-3 items-center rounded-full w-full">
                {anuncio.usuario?.foto_perfil ? (
                  <img
                    src={anuncio.usuario.foto_perfil}
                    alt={anuncio.usuario.nome}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#858584]" />
                )}
                <p className="text-[22px] font-semibold text-white capitalize">
                  {anuncio.usuario?.nome}
                </p>
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-2 items-start w-full">
              <p className="text-[22px] font-bold text-[#858584] uppercase">
                Descrição
              </p>
              <div className="text-[22px] text-white leading-relaxed whitespace-pre-wrap wrap-break-word">
                {anuncio.descricao}
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-2 items-start w-full">
              <p className="text-[22px] font-bold text-[#858584] uppercase">
                Detalhes
              </p>
              <div className="flex gap-2 items-start cursor-pointer hover:opacity-80 transition">
                <Globe className="w-8 h-8 text-white" />
                <p className="text-[22px] text-white leading-relaxed">
                  Ver Informações Originais
                </p>
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-5 items-start w-full">
              <p className="text-[22px] font-semibold text-[#858584] capitalize">
                Categoria
              </p>
              <div className="flex gap-5 items-start flex-wrap">
                <div className="bg-secondary flex gap-3 h-11.5 items-center justify-center px-8 rounded-full">
                  <p className="text-[16px] font-semibold text-white text-center capitalize">
                    {anuncio.categoria}
                  </p>
                </div>
                <div className="bg-secondary flex gap-3 h-11.5 items-center justify-center px-8 rounded-full">
                  <p className="text-[16px] font-semibold text-white text-center capitalize">
                    {anuncio.condicao}
                  </p>
                </div>
                <div className="bg-secondary flex gap-3 h-11.5 items-center justify-center px-8 rounded-full">
                  <p className="text-[16px] font-semibold text-white text-center capitalize">
                    {anuncio.marca}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-73.75">
            <div className="bg-secondary content-stretch flex flex-col gap-8 items-start p-8 rounded-3xl w-full">
              <button
                onClick={handleFalarComVendedor}
                className="bg-tertiary content-stretch flex gap-3 h-15 items-center justify-center px-12 rounded-full w-full hover:brightness-90 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <p className="text-[16px] font-semibold text-center text-white whitespace-nowrap">
                  Falar com vendedor
                </p>
              </button>

              <div className="w-full">
                <p className="text-[16px] text-[#858584] mb-2">Preço</p>
                <p className="text-2xl font-bold text-tertiary">
                  R$ {parseFloat(anuncio.preco).toFixed(2)}
                </p>
              </div>
            </div>

            {showChat && isLoggedIn && (
              <ChatBox
                idAnuncio={parseInt(idAnuncio!)}
                idVendedor={anuncio.id_usuario}
                tituloAnuncio={anuncio.titulo}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
      )}
    </div>
  );
}

export default AnuncioSection;
