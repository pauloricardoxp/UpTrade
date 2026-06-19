import { useState, useEffect, useRef } from "react";
import { Lock, Upload } from "lucide-react";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import type { AnunciosStats, ApiResponse, UserData } from "../types/UserType";
import { formatarDataCadastro, formatTelefone } from "../utils/formated";




function PerfilSection() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<AnunciosStats>({
    ativos: 0,
    inativos: 0,
    trocados: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await api.get<ApiResponse>("/usuarios/perfil", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response.data;
        setUserData({
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          foto_perfil: data.foto_perfil,
          data_cadastro: data.data_cadastro,
        });

        setFormData({
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
        });

        setStats({
          ativos: data.anuncios.ativos,
          inativos: data.anuncios.inativos,
          trocados: data.anuncios.trocados,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        addToast("Erro ao carregar dados do perfil", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [addToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    
    if (name === "telefone") {
      const numberOnly = value.replace(/\D/g, "").slice(0, 11);
      const masked = formatTelefone(numberOnly);
      setFormData((prev) => ({
        ...prev,
        [name]: masked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await api.patch<ApiResponse>(
        `/usuarios/perfil/${user.id}`,
        {
          nome: formData.nome,
          telefone: formData.telefone,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              nome: response.data.nome,
              telefone: response.data.telefone,
            }
          : null,
      );

      addToast("Alterações salvas com sucesso!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      addToast("Erro ao salvar alterações", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploadingPhoto(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const formDataPhoto = new FormData();
      formDataPhoto.append("file", file);

      const response = await api.patch<{ foto_perfil: string }>(
        `/usuarios/perfil/foto/${user.id}`,
        formDataPhoto,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              foto_perfil: response.data.foto_perfil,
            }
          : null,
      );

      addToast("Foto de perfil atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao fazer upload de foto:", error);
      addToast("Erro ao atualizar foto de perfil", "error");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-primary py-20 flex items-center justify-center">
        <p className="text-tertiary">Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="w-full bg-primary min-h-screen py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="flex gap-8 items-end">
            <div className="relative">
              <div className="absolute -inset-4.5 flex items-center justify-center pointer-events-none">
                <div className="flex-none w-44 h-44">
                  <div className="bg-tertiary/30 blur-[20px] rounded-full w-full h-full" />
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="border-4 border-tertiary rounded-full w-40 h-40 flex items-center justify-center shadow-[0px_0px_30px_0px_rgba(162,89,255,0.4)] overflow-hidden relative z-10 hover:opacity-80 transition-opacity disabled:opacity-60 group"
              >
                <img
                  src={userData?.foto_perfil}
                  alt={userData?.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="absolute bottom-2 right-2 bg-tertiary rounded-full p-2 shadow-lg">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-black text-white font-display">
                {userData?.nome}
              </h1>
              <p className="text-base text-[#adaaaa] font-medium">
                Membro desde {userData?.data_cadastro ? formatarDataCadastro(userData.data_cadastro) : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#1a1919] border-t border-[rgba(255,255,255,0.05)] rounded-[48px] py-8 px-8 flex flex-col items-center gap-4">
              <div className="flex flex-col gap-4 items-center">
                <p className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
                  Anúncios Ativos
                </p>
                <p className="text-6xl font-black text-tertiary">
                  {stats.ativos}
                </p>
              </div>
              <div className="w-12 h-1 bg-tertiary/20 rounded-full" />
            </div>

            <div className="bg-[#1a1919] border-t border-[rgba(255,255,255,0.05)] rounded-[48px] py-8 px-8 flex flex-col items-center gap-4">
              <div className="flex flex-col gap-4 items-center">
                <p className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
                  Anúncios Inativos
                </p>
                <p className="text-6xl font-black text-[#adaaaa]">
                  {stats.inativos}
                </p>
              </div>
              <div className="w-12 h-1 bg-[rgba(255,255,255,0.05)] rounded-full" />
            </div>

            <div className="bg-[#1a1919] border-t border-[rgba(255,255,255,0.05)] rounded-[48px] py-8 px-8 flex flex-col items-center gap-4">
              <div className="flex flex-col gap-4 items-center">
                <p className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
                  Anúncios Trocados
                </p>
                <p className="text-6xl font-black text-tertiary">
                  {stats.trocados}
                </p>
              </div>
              <div className="w-12 h-1 bg-[rgba(255,151,178,0.2)] rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-center">
              <h2 className="text-2xl font-black text-white">
                Informações da conta
              </h2>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
            </div>

            <div className="bg-[#131313] border border-[rgba(255,255,255,0.05)] rounded-[48px] py-8 px-8">
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-tertiary uppercase tracking-wider">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-[#1a1919] rounded-[48px] px-4 py-4 text-white outline-none transition-colors ${
                        isEditing
                          ? "border border-tertiary/50 focus:border-tertiary"
                          : "border border-transparent"
                      } disabled:opacity-100`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-tertiary uppercase tracking-wider">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-[#1a1919] rounded-[48px] px-4 py-4 text-white outline-none transition-colors ${
                        isEditing
                          ? "border border-tertiary/50 focus:border-tertiary"
                          : "border border-transparent"
                      } disabled:opacity-100`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
                      E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-[#1a1919]/50 opacity-60 rounded-[48px] px-4 py-4 text-[#adaaaa] outline-none border border-transparent w-full"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#adaaaa]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="bg-[#1a1919]/50 opacity-60 rounded-[48px] px-4 py-4 text-[#adaaaa] outline-none border border-transparent w-full"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#adaaaa]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[rgba(162,89,255,0.1)] border border-tertiary/30 rounded-2xl px-4 py-3 flex gap-3">
                  <svg
                    className="w-5 h-5 text-tertiary shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-[#adaaaa]">
                    Troca de e-mail e senha disponível em breve.
                  </p>
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            nome: userData?.nome || "",
                            telefone: userData?.telefone || "",
                            email: userData?.email || "",
                          });
                        }}
                        className="px-8 py-3 rounded-full font-semibold text-white hover:bg-[#201f1f] transition-colors text-sm uppercase"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="px-8 py-3 bg-tertiary rounded-full font-semibold text-white hover:brightness-110 disabled:opacity-50 transition-all text-sm uppercase"
                      >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-3 bg-tertiary rounded-full font-semibold text-white hover:brightness-110 transition-all text-sm uppercase"
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PerfilSection;
