import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { anuncioSchema, type AnuncioForm } from "../schema/AnuncioForm";
import api from "../services/api";
import type { AxiosError } from "axios";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { useNavigate } from "react-router-dom";
import type { Anuncio } from "../interfaces/heroAnuncio";

function CreateAnuncioSection() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null);
  const [existingImageIds, setExistingImageIds] = useState<number[]>([]);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnuncioForm>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      condicao: "NOVO",
    },
  });

  const condicaoValue = watch("condicao");

  useEffect(() => {
    const storedAnuncio = localStorage.getItem("editingAnuncio");
    if (storedAnuncio) {
      try {
        const anuncio: Anuncio = JSON.parse(storedAnuncio);
        setEditingAnuncio(anuncio);

        setValue("titulo", anuncio.titulo);
        setValue(
          "categoria",
          anuncio.categoria as
            | "CPU"
            | "GPU"
            | "PLACA_MAE"
            | "RAM"
            | "FONTE"
            | "GABINETE"
            | "ARMAZENAMENTO"
            | "COOLER"
            | "MONITOR"
            | "TECLADO"
            | "MOUSE"
            | "HEADSET",
        );
        setValue("preco", anuncio.preco);
        setValue("condicao", anuncio.condicao as "NOVO" | "USADO");
        setValue("marca", anuncio.marca);
        setValue("descricao", anuncio.descricao);

        if (anuncio.imagens && anuncio.imagens.length > 0) {
          const imagePreviews = anuncio.imagens.map((img) => {
            const caminho = img.url_caminho || "";
            return caminho.startsWith("http")
              ? caminho
              : `${import.meta.env.VITE_API_URL}${caminho}`;
          });
          const imageIds = anuncio.imagens.map((img) => img.id_imagem || 0);
          setPreviews(imagePreviews);
          setExistingImageIds(imageIds);
        }

        // Limpar localStorage após carregar
        localStorage.removeItem("editingAnuncio");
      } catch (error) {
        console.error("Erro ao carregar dados de edição:", error);
      }
    }
  }, [setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const remainingSlots = 5 - imageFiles.length;

      if (remainingSlots === 0) {
        addToast(
          "Você já atingiu o limite de 5 imagens por anúncio",
          "warning",
        );
        return;
      }

      const fileNames = new Set(imageFiles.map((f) => f.name));
      const duplicates = newFiles.filter((f) => fileNames.has(f.name));

      if (duplicates.length > 0) {
        addToast(
          `${duplicates.length} imagem(ns) já foi(foram) adicionada(s)`,
          "warning",
        );
        const uniqueNewFiles = newFiles.filter((f) => !fileNames.has(f.name));
        newFiles.length = 0;
        newFiles.push(...uniqueNewFiles);
      }

      const filesToAdd = newFiles.slice(0, remainingSlots);

      if (filesToAdd.length === 0) return;

      setImageFiles((prev) => [...prev, ...filesToAdd]);

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviews((prev) => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });

      if (newFiles.length > remainingSlots) {
        addToast(
          `Apenas ${remainingSlots} imagem(ns) podem ser adicionadas. Limite de 5 imagens por anúncio.`,
          "info",
        );
      } else if (filesToAdd.length > 0) {
        addToast(
          `${filesToAdd.length} imagem(ns) adicionada(s) com sucesso`,
          "success",
          3000,
        );
      }
    }
  };

  const handleremoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setExistingImageIds((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AnuncioForm) => {
    if (!editingAnuncio && imageFiles.length === 0) {
      addToast("Por favor, selecione pelo menos uma imagem.", "error");
      return;
    }

    const uniqueIds = new Set(imageFiles.map((f) => f.name));
    if (uniqueIds.size !== imageFiles.length) {
      addToast("Erro: Imagens duplicadas detectadas", "error");
      return;
    }

    try {
      const imageIds: number[] = [...existingImageIds];

      for (const file of imageFiles) {
        const imagemFormData = new FormData();
        imagemFormData.append("file", file);
        const imageRes = await api.post("/upload", imagemFormData);
        imageIds.push(Number(imageRes.data.id_imagem));
      }

      if (imageIds.length > 5) {
        addToast("Erro: Máximo de 5 imagens permitido", "error");
        return;
      }

      const uniqueImageIds = new Set(imageIds);
      if (uniqueImageIds.size !== imageIds.length) {
        addToast(
          "Erro: Não é permitido enviar a mesma imagem múltiplas vezes",
          "error",
        );
        return;
      }

      const anuncioPayload = {
        titulo: data.titulo,
        descricao: data.descricao,
        preco: data.preco,
        condicao: data.condicao,
        marca: data.marca,
        categoria: data.categoria,
        ...(imageIds.length > 0 && { id_imagens: imageIds }),
      };

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let response;
      if (editingAnuncio) {
        response = await api.patch(
          `/anuncios/${editingAnuncio.id_anuncio}`,
          anuncioPayload,
          { headers },
        );
      } else {
        response = await api.post("/anuncios", anuncioPayload, { headers });
      }

      if (response.status === 201 || response.status === 200) {
        const successMessage = editingAnuncio
          ? "Anúncio atualizado com sucesso!"
          : "Anúncio publicado com sucesso!";
        addToast(successMessage, "success");
        setImageFiles([]);
        setPreviews([]);
        setExistingImageIds([]);
        localStorage.removeItem("editingAnuncio");
        setTimeout(() => {
          navigate("/meusAnuncios");
        }, 1500);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Ocorreu um erro ao publicar o anúncio.";
      addToast(errorMessage, "error");
      console.error(
        "Erro na requisição:",
        axiosError.response?.data || axiosError.message,
      );
    }
  };

  return (
    <div className="bg-primary min-h-screen py-12 px-8">
      <h1 className="text-4xl font-semibold text-white font-display text-center">
        {editingAnuncio ? "Editar Anúncio" : "Criar Anúncio"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-3xl p-12"
      >
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
              Título do Produto
            </label>
            <input
              type="text"
              {...register("titulo")}
              placeholder="Ex: NVIDIA RTX 4090 Founders Edition"
              className={`bg-[#201f1f] text-white rounded-3xl px-6 py-4 outline-0 placeholder-[rgba(173,170,170,0.3)] ${errors.titulo ? "ring-1 ring-red-500" : ""}`}
            />
            {errors.titulo && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.titulo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
              Categoria
            </label>
            <select
              {...register("categoria")}
              className="bg-[#201f1f] text-white rounded-3xl px-6 py-4 outline-0"
            >
              <option value="">Selecione uma categoria</option>
              <option value="CPU">CPU</option>
              <option value="GPU">GPU</option>
              <option value="PLACA_MAE">PLACA MAE</option>
              <option value="RAM">RAM</option>
              <option value="FONTE">FONTE</option>
              <option value="GABINETE">GABINETE</option>
              <option value="ARMAZENAMENTO">ARMAZENAMENTO</option>
              <option value="COOLER">COOLER</option>
              <option value="MONITOR">MONITOR</option>
              <option value="TECLADO">TECLADO</option>
              <option value="MOUSE">MOUSE</option>
              <option value="HEADSET">HEADSET</option>
            </select>
            {errors.categoria && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.categoria.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-2 mb-8">
            <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
              Preço
            </label>
            <div className="bg-[#201f1f] rounded-3xl px-6 py-4 flex items-center gap-2">
              <span className="text-tertiary font-semibold">R$</span>
              <input
                type="text"
                {...register("preco")}
                placeholder="0.00"
                className="bg-transparent text-white outline-0 flex-1 placeholder-[rgba(173,170,170,0.3)]"
              />
            </div>
            {errors.preco && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.preco.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
              Condição
            </label>
            <div className="bg-[#131313] rounded-3xl p-1 flex gap-1">
              <button
                type="button"
                onClick={() => setValue("condicao", "NOVO")}
                className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-colors ${
                  condicaoValue === "NOVO"
                    ? "bg-[#201f1f] text-tertiary"
                    : "text-[#adaaaa]"
                }`}
              >
                Novo
              </button>
              <button
                type="button"
                onClick={() => setValue("condicao", "USADO")}
                className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-colors ${
                  condicaoValue === "USADO"
                    ? "bg-[#201f1f] text-tertiary"
                    : "text-[#adaaaa]"
                }`}
              >
                Usado
              </button>
              {errors.condicao && (
                <span className="text-red-500 text-[10px] mt-1">
                  {errors.condicao.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
            Marca
          </label>
          <input
            type="text"
            {...register("marca")}
            placeholder="Ex: AMD, ASUS"
            className="bg-[#201f1f] text-white rounded-3xl px-6 py-4 outline-0"
          />
          {errors.marca && (
            <span className="text-red-500 text-[10px] mt-1">
              {errors.marca.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
            Descrição Detalhada
          </label>
          <textarea
            {...register("descricao")}
            placeholder="Descreva as especificações..."
            className="bg-[#201f1f] text-white rounded-3xl px-6 py-4 outline-0 h-32 resize-none"
          />
          {errors.descricao && (
            <span className="text-red-500 text-[10px] mt-1">
              {errors.descricao.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wider">
            Galeria de Imagens
          </label>
          <label className="border-2 border-dashed border-[rgba(72,72,71,0.3)] rounded-3xl p-12 text-center cursor-pointer hover:border-tertiary transition-colors">
            <div className="flex flex-col items-center gap-4">
              <Plus className="w-12 h-12 text-tertiary" />
              <div>
                <p className="text-white font-semibold">
                  Arraste as fotos aqui
                </p>
                <p className="text-[#adaaaa] text-sm">
                  ou clique para selecionar
                </p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {previews.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-[#201f1f] rounded-3xl overflow-hidden aspect-square"
                >
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleremoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
                  >
                    <Plus className="w-4 h-4 text-white rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("editingAnuncio");
              navigate("/meusAnuncios");
            }}
            className="px-10 py-4 rounded-3xl font-semibold text-xs uppercase text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-12 py-4 rounded-3xl font-semibold bg-tertiary"
          >
            {editingAnuncio ? "Atualizar Anúncio" : "Publicar Anúncio"}
          </button>
        </div>
      </form>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default CreateAnuncioSection;
