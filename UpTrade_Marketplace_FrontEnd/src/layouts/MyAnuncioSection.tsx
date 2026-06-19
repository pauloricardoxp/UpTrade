import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Trash2, Edit3, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import api from "../services/api";
import type { Anuncio } from "../interfaces/heroAnuncio";

type StatusFilter = "TODOS" | "ATIVO" | "INATIVO" | "TROCADO";
type SortOption = "recentes" | "antigos" | "preco-asc" | "preco-desc";
type AnuncioStatus = "ATIVO" | "INATIVO" | "TROCADO";

function MyAnuncioSection() {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [filteredAnuncios, setFilteredAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [sortOption, setSortOption] = useState<SortOption>("recentes");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get<Anuncio[]>("/anuncios/meus", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAnuncios(response.data);
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

  useEffect(() => {
    const filtered = anuncios.filter((anuncio) => {
      if (
        searchTerm &&
        !anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (statusFilter !== "TODOS" && anuncio.status !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "TODAS" && anuncio.categoria !== categoryFilter) {
        return false;
      }

      return anuncio.imagens && anuncio.imagens.length > 0;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "antigos":
          return (
            new Date(a.data_criacao).getTime() -
            new Date(b.data_criacao).getTime()
          );
        case "preco-asc":
          return parseFloat(a.preco) - parseFloat(b.preco);
        case "preco-desc":
          return parseFloat(b.preco) - parseFloat(a.preco);
        case "recentes":
        default:
          return (
            new Date(b.data_criacao).getTime() -
            new Date(a.data_criacao).getTime()
          );
      }
    });

    setFilteredAnuncios(filtered);
  }, [anuncios, searchTerm, statusFilter, categoryFilter, sortOption]);

  const categorias = ["TODAS", ...new Set(anuncios.map((a) => a.categoria))];

  const getStatusBadge = (status: string) => {
    const styles = {
      ATIVO: "bg-[#10B981] text-white",
      INATIVO: "bg-[#5C5B5B] text-white",
      TROCADO: "bg-[#F59E0B] text-white",
    };
    return styles[status as keyof typeof styles] || styles.ATIVO;
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await api.delete(`/anuncios/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAnuncios((prev) => prev.filter((a) => a.id_anuncio !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Erro ao deletar anúncio:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (anuncio: Anuncio) => {
    localStorage.setItem("editingAnuncio", JSON.stringify(anuncio));
    navigate("/criarAnuncio");
  };

  const handleStatusChange = async (id: number, newStatus: AnuncioStatus) => {
    try {
      setIsStatusLoading(true);
      const token = localStorage.getItem("token");

      await api.patch(
        `/anuncios/${id}`,
        { status: newStatus },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        },
      );

      setAnuncios((prev) =>
        prev.map((a) =>
          a.id_anuncio === id ? { ...a, status: newStatus } : a,
        ),
      );
      setOpenStatusDropdown(null);
    } catch (error) {
      console.error("Erro ao mudar status:", error);
      const axiosError = error as any;
      const errorMsg =
        axiosError?.response?.data?.message ||
        "Só é possível mudar status quando o anúncio está ATIVO";
      if (typeof window !== "undefined") {
        alert(`Erro: ${errorMsg}`);
      }
    } finally {
      setIsStatusLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-primary py-20 flex items-center justify-center">
        <p className="text-ttertiary">Carregando seus anúncios...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-primary py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-white font-display">
              Meus Anúncios
            </h1>
            <p className="text-sm text-[#adaaaa]">
              Gerencie seus anuncios no UpTrade Marketplace
            </p>
          </div>

          <button
            onClick={() => navigate("/criarAnuncio")}
            className="bg-tertiary hover:brightness-110 transition-all flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-white"
          >
            <Plus className="w-5 h-5" />
            NOVO ANÚNCIO
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Pesquisar nos meus anúncios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#201f1f] border border-[rgba(255,255,255,0.05)] text-white rounded-full pl-12 pr-4 py-3 outline-none focus:border-tertiary transition-colors text-sm"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none bg-[#201f1f] border border-[rgba(255,255,255,0.05)] text-white rounded-full pl-4 pr-10 py-3 outline-none focus:border-tertiary transition-colors text-sm cursor-pointer hover:border-[rgba(255,255,255,0.1)]"
            >
              <option value="TODOS">Status: Todos</option>
              <option value="ATIVO">Status: Ativo</option>
              <option value="INATIVO">Status: Inativo</option>
              <option value="TROCADO">Status: Trocado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-[#201f1f] border border-[rgba(255,255,255,0.05)] text-white rounded-full pl-4 pr-10 py-3 outline-none focus:border-tertiary transition-colors text-sm cursor-pointer hover:border-[rgba(255,255,255,0.1)]"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  Categoria: {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-[#201f1f] border border-[rgba(255,255,255,0.05)] text-white rounded-full pl-4 pr-10 py-3 outline-none focus:border-tertiary transition-colors text-sm cursor-pointer hover:border-[rgba(255,255,255,0.1)]"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="antigos">Mais Antigos</option>
              <option value="preco-asc">Preço: Menor</option>
              <option value="preco-desc">Preço: Maior</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none" />
          </div>
        </div>

        {error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredAnuncios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#858584] text-lg mb-4">
              Nenhum anúncio encontrado
            </p>
            <button
              onClick={() => navigate("/criarAnuncio")}
              className="bg-tertiary hover:brightness-110 transition-all px-6 py-2 rounded-full font-semibold text-white text-sm"
            >
              Criar seu primeiro anúncio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnuncios.map((anuncio) => (
              <div
                key={anuncio.id_anuncio}
                className="relative group"
                onClick={() => navigate(`/anuncio?id=${anuncio.id_anuncio}`)}
              >
                <div
                  className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(anuncio.status)}`}
                >
                  {anuncio.status}
                </div>

                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStatusDropdown(
                          openStatusDropdown === anuncio.id_anuncio
                            ? null
                            : anuncio.id_anuncio,
                        );
                      }}
                      className="bg-tertiary hover:brightness-110 p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mudar status"
                      disabled={isStatusLoading}
                    >
                      <ChevronDown className="w-4 h-4 text-white" />
                    </button>
                    {openStatusDropdown === anuncio.id_anuncio && (
                      <div className="absolute right-0 mt-2 w-32 bg-secondary border border-tertiary rounded-lg shadow-lg py-2 z-30">
                        {(["ATIVO", "INATIVO", "TROCADO"] as const).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(anuncio.id_anuncio, status);
                              }}
                              disabled={isStatusLoading}
                              className={`w-full text-left px-4 py-2 text-xs hover:bg-[#2a2a2a] transition-colors ${
                                anuncio.status === status
                                  ? "text-tertiary font-bold"
                                  : "text-white"
                              } disabled:opacity-50`}
                            >
                              {status}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(anuncio);
                    }}
                    className="bg-tertiary hover:brightness-110 p-2 rounded-full transition-all"
                    title="Editar anúncio"
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(anuncio.id_anuncio);
                    }}
                    disabled={anuncio.status !== "ATIVO"}
                    className="bg-red-600 hover:brightness-110 p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      anuncio.status !== "ATIVO"
                        ? "Mude o status para ATIVO para deletar"
                        : "Deletar anúncio"
                    }
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <CardProduct
                  id_anuncio={anuncio.id_anuncio}
                  titulo={anuncio.titulo}
                  preco={`R$ ${anuncio.preco}`}
                  categoria={anuncio.categoria}
                  marca={anuncio.marca}
                  imagem={anuncio.imagens?.[0]?.url_caminho || ""}
                  vendedor={{
                    nome: anuncio.usuario?.nome || "Vendedor",
                    avatar: anuncio.usuario?.foto_perfil,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {deleteConfirm !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-secondary rounded-2xl p-8 max-w-sm mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Deletar Anúncio?
                </h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-[#858584] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[#adaaaa] mb-6">
                Tem certeza que deseja deletar este anúncio? Esta ação não pode
                ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2 rounded-full text-white hover:bg-[#201f1f] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 rounded-full text-white hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isDeleting ? "Deletando..." : "Deletar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAnuncioSection;
