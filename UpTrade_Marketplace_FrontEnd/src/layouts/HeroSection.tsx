import { FaRocket } from "react-icons/fa";
import { useState, useEffect } from "react";
import type { Anuncio } from "../interfaces/heroAnuncio";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Anuncio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const fetchFeaturedProduct = async () => {
      try {
        const { data: anuncios } = await api.get<Anuncio[]>("/anuncios");

        const comImagens = anuncios.filter(
          (a) => a.imagens && a.imagens.length > 0,
        );

        if (comImagens.length === 0) {
          setIsLoading(false);
          return;
        }

        setProduct(comImagens[0]);
        setIsLoading(false);

        let index = 0;

        interval = setInterval(() => {
          index = (index + 1) % comImagens.length;
          setProduct(comImagens[index]);
        }, 5000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchFeaturedProduct();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const BuscarPecas = () => {
    navigate("/explorar");
  };

  const currentImage = product?.imagens?.[0];

  return (
    <section className="bg-primary w-full py-12 px-6 lg:px-24">
      <div className="flex gap-7.5 items-start w-full max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col gap-7.5">
          <div className="flex flex-col gap-5">
            <h1 className="text-white font-display font-semibold text-[67px] leading-22">
              O <span className="text-tertiary">Marketplace</span> Ideal Para O
              Seu <span className="text-tertiary">PC</span>
            </h1>

            <p className="font-display font-normal text-22 text-tsecondary">
              Explore milhares de componentes de PC de{" "}
              <span className="text-tertiary">vendedores confiáveis</span>.
              Encontre as melhores ofertas para o seu próximo{" "}
              <span className="text-tertiary">upgrade</span>.
            </p>
          </div>

          <button
            disabled={isLoading}
            className="bg-tertiary hover:opacity-90 transition-opacity disabled:opacity-50 text-white px-12 py-4 rounded-full font-semibold text-16 flex items-center gap-3 w-fit"
            onClick={BuscarPecas}
          >
            <FaRocket className="w-5 h-5" />
            {isLoading ? "Carregando..." : "Buscar Peças"}
          </button>

          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-tprimary font-mono font-bold text-28">
                240k+
              </h3>
              <p className="text-tsecondary font-display font-normal text-16">
                Usuários
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-tprimary font-mono font-bold text-28">
                100k+
              </h3>
              <p className="text-tsecondary font-display font-normal text-16">
                Negócios
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-tprimary font-mono font-bold text-28">3+</h3>
              <p className="text-tsecondary font-display font-normal text-16">
                Anos
              </p>
            </div>
          </div>
        </div>

        {product ? (
          <div
            className="flex-1 flex flex-col h-full rounded-tl-[20px] rounded-tr-[20px] overflow-hidden cursor-pointer hover:brightness-110 transition-all"
            onClick={() => navigate(`/anuncio?id=${product.id_anuncio}`)}
          >
            {currentImage?.url_caminho && (
              <div className="flex-1 relative overflow-hidden bg-secondary">
                <img
                  src={currentImage.url_caminho}
                  alt={product.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="bg-secondary px-5 py-5 flex flex-col rounded-bl-[20px] rounded-br-[20px]">
              <h2 className="text-tprimary font-display font-semibold text-22">
                {product.titulo}
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-tertiary flex items-center justify-center">
                  {product.usuario?.foto_perfil ? (
                    <img
                      src={product.usuario.foto_perfil}
                      alt={product.usuario?.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-tprimary text-xs font-bold">
                      {product.usuario?.nome?.[0]}
                    </span>
                  )}
                </div>
                <p className="text-tprimary font-display font-normal text-16 leading-22">
                  {product.usuario.nome}
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center h-127.5 bg-secondary rounded-[20px]">
            <p className="text-red-500 font-display">Erro: {error}</p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center h-127.5 bg-secondary rounded-[20px]">
            <p className="text-tsecondary font-display">Carregando...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
