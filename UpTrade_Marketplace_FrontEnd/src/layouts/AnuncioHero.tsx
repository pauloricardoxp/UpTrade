import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import type { AnuncioDetail } from "../interfaces/anuncioDetail";

function AnuncioHero() {
  const [searchParams] = useSearchParams();
  const [anuncio, setAnuncio] = useState<AnuncioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const idAnuncio = searchParams.get("id");

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
        setCurrentImageIndex(0);
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

  const handlePrevImage = () => {
    if (anuncio?.imagens && anuncio.imagens.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? anuncio.imagens!.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (anuncio?.imagens && anuncio.imagens.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === anuncio.imagens!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-150 bg-primary flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  if (error || !anuncio) {
    return (
      <div className="w-full h-150 bg-primary flex items-center justify-center">
        <p className="text-red-500 text-lg">
          {error || "Anúncio não encontrado"}
        </p>
      </div>
    );
  }

  const imagens = anuncio.imagens || [];
  const currentImage = imagens[currentImageIndex];
  const hasMultipleImages = imagens.length > 1;

  return (
    <div className="w-full h-150 bg-primary flex items-center justify-center overflow-hidden relative">
      {currentImage?.url_caminho ? (
        <>
          <img
            src={currentImage.url_caminho}
            alt={`${anuncio.titulo} - ${currentImageIndex + 1}`}
            className="w-full h-150 object-contain"
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {imagens.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex
                        ? "bg-tertiary w-6"
                        : "bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {currentImageIndex + 1} / {imagens.length}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <p className="text-[#858584]">Imagem não disponível</p>
        </div>
      )}
    </div>
  );
}

export default AnuncioHero;
