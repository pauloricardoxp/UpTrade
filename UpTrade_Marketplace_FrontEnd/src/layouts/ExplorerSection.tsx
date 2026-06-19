import { useState, useEffect } from "react";
import CardProduct from "../components/CardProduct";
import api from "../services/api";
import type { Anuncio } from "../interfaces/heroAnuncio";
import type { CategoryGroup, TypeGroup } from "../interfaces/explorerSection";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const HARDWARE_CATEGORIES = [
  "CPU",
  "GPU",
  "PLACA_MAE",
  "RAM",
  "FONTE",
  "GABINETE",
  "ARMAZENAMENTO",
  "COOLER",
];

const PERIPHERAL_CATEGORIES = ["MONITOR", "TECLADO", "MOUSE", "HEADSET"];

function ExplorerSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeGroups, setTypeGroups] = useState<TypeGroup[]>([]);
  const [activeTypeTab, setActiveTypeTab] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get<Anuncio[]>("/anuncios");
        const hardwares = data.filter((anuncio) =>
          HARDWARE_CATEGORIES.includes(anuncio.categoria),
        );
        const peripherals = data.filter((anuncio) =>
          PERIPHERAL_CATEGORIES.includes(anuncio.categoria),
        );

        const groupByCategory = (items: Anuncio[]): CategoryGroup[] => {
          const grouped = items.reduce(
            (acc: Record<string, Anuncio[]>, anuncio: Anuncio) => {
              const category = anuncio.categoria || "Outros";
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(anuncio);
              return acc;
            },
            {} as Record<string, Anuncio[]>,
          );

          return Object.entries(grouped).map(
            ([name, items]: [string, Anuncio[]]) => ({
              name,
              count: items.length,
              items,
            }),
          );
        };

        const groups: TypeGroup[] = [];

        groups.push({
          type: "Hardwares",
          count: hardwares.length,
          categories: groupByCategory(hardwares),
        });

        groups.push({
          type: "Periféricos",
          count: peripherals.length,
          categories: groupByCategory(peripherals),
        });

        setTypeGroups(groups);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar anúncios",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnuncios();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-primary py-20 flex items-center justify-center">
        <p className="text-ttertiary">Carregando anúncios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-primary py-20 flex items-center justify-center">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    );
  }

  const activeType = typeGroups[activeTypeTab];
  const activeCategory =
    activeType && activeType.categories.length > 0
      ? activeType.categories[activeCategoryTab]
      : null;
  const allItems = activeCategory
    ? activeCategory.items.filter(
        (item) => item.imagens && item.imagens.length > 0,
      )
    : [];

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = allItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-primary py-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col gap-2.5 w-full mb-10">
          <div className="w-full h-px bg-linear-to-r from-[#444444] to-[#333333]" />

          <div className="flex items-center gap-2">
            {typeGroups.map((typeGroup, typeIndex) => (
              <button
                key={typeGroup.type}
                onClick={() => {
                  setActiveTypeTab(typeIndex);
                  setActiveCategoryTab(0);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-4 px-8 py-4 border-b-2 transition-all ${
                  typeIndex === activeTypeTab
                    ? "border-[#858584] text-ttertiary"
                    : "border-transparent text-[#858584] hover:text-ttertiary"
                }`}
              >
                <p className="font font-semibold text-[22px] leading-[1.4]">
                  {typeGroup.type}
                </p>
                <div
                  className={`px-2.5 py-1.5 rounded-full flex items-center ${
                    typeIndex === activeTypeTab
                      ? "bg-[#858584]"
                      : "bg-secondary"
                  }`}
                >
                  <p className="text-ttertiary leading-[1.4]">
                    {typeGroup.count}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeType && activeType.categories.length > 0 && (
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            {activeType.categories.map((category, categoryIndex) => (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategoryTab(categoryIndex);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
                  categoryIndex === activeCategoryTab
                    ? "border-white text-ttertiary"
                    : "border-transparent text-[#858584] hover:text-ttertiary"
                }`}
              >
                <p className="font text-sm">{category.name}</p>
                <span className="text-xs text-[#858584]">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8 mt-16">
          {displayedItems.map((anuncio) => (
            <CardProduct
              key={anuncio.id_anuncio}
              id_anuncio={anuncio.id_anuncio}
              titulo={anuncio.titulo}
              preco={` R$ ${anuncio.preco}`}
              categoria={anuncio.categoria}
              marca={anuncio.marca}
              imagem={anuncio.imagens?.[0]?.url_caminho || ""}
              vendedor={{
                nome: anuncio.usuario?.nome || "Vendedor",
                avatar: anuncio.usuario?.foto_perfil,
              }}
            />
          ))}
        </div>

        {displayedItems.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#858584]">
              Nenhum anúncio com imagem nesta categoria
            </p>
          </div>
        )}

        {allItems.length > itemsPerPage && (
          <div className="flex items-center justify-end gap-2 mt-12 pb-5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-1 py-3 rounded  text-ttertiary font transition-all ${
                currentPage === 1
                  ? "text-[#444444] cursor-not-allowed"
                  : "text-ttertiary hover:bg-secondary"
              }`}
            >
              <FaAngleLeft />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded font font-semibold transition-all ${
                      pageNum === currentPage
                        ? "bg-tertiary text-tprimary"
                        : " border-[#858584] text-ttertiary hover:bg-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-1 py-3 rounded  text-ttertiary font transition-all ${
                currentPage === totalPages
                  ? "text-[#444444] cursor-not-allowed opacity-50"
                  : "text-ttertiary hover:bg-secondary"
              }`}
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorerSection;
