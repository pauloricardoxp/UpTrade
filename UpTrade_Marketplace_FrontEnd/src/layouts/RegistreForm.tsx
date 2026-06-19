import { useForm } from "react-hook-form";
import ImagemRegistre from "../imagens/ImagemRegistre.jpg";
import { useState } from "react";
import { Mail } from "lucide-react";
import type { RegistreType } from "../types/RegistreType";
import { FaEye, FaEyeSlash, FaRegUser } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegistreForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistreType>();
  const senha = watch("senha");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }

  function formatTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  async function onSubmit(data: RegistreType) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const cpfSemFormatacao = data.cpf.replace(/\D/g, "");
      const telefoneSemFormatacao = data.telefone.replace(/\D/g, "");

      const response = await api.post("/auth/register", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: cpfSemFormatacao,
        telefone: telefoneSemFormatacao,
      });

      console.log(response.data);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Erro ao fazer registro. Verifique os dados.",
        );
      } else {
        setErrorMessage("Erro inesperado ao fazer registro.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-primary flex items-center">
      <div className="flex w-full h-screen">
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <img
            src={ImagemRegistre}
            alt="Hardware"
            className="w-450 h-full object-cover"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h1 className="text-5xl font-semibold text-white mb-6 leading-[1.1]">
                Crie Sua Conta!
              </h1>
              <p className="text-2xl text-white leading-[1.6]">
                Seja Bem-vindo, crie sua conta agora e venda ou compre peças e
                notebooks!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500 text-white p-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <input
                      {...register("nome", {
                        required: "Nome é obrigatório",
                        minLength: {
                          value: 3,
                          message: "O nome precisa ter pelo menos 3 caracteres",
                        },
                      })}
                      type="text"
                      placeholder="Nome do Usuário"
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <FaRegUser
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...register("cpf", {
                        required: "CPF é obrigatório",
                        pattern: {
                          value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                          message: "CPF inválido",
                        },
                      })}
                      type="text"
                      placeholder="CPF"
                      onChange={(e) => {
                        e.target.value = formatCPF(e.target.value);
                      }}
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <FaRegUser
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <input
                      {...register("email", {
                        required: "Email é obrigatório",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Digite um email válido",
                        },
                      })}
                      type="email"
                      placeholder="Email do Usuário"
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <Mail
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...register("telefone", {
                        required: "Telefone é obrigatório",
                      })}
                      type="text"
                      onChange={(e) => {
                        e.target.value = formatTelefone(e.target.value);
                      }}
                      placeholder="Telefone"
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <MdOutlineLocalPhone
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telefone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <input
                      {...register("senha", {
                        required: "Senha é obrigatória",
                        minLength: {
                          value: 8,
                          message: "A senha deve ter no mínimo 8 caracteres",
                        },
                        //pattern: {
                          //value:
                            ///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                         // message:
                            //"A senha precisa ter maiúscula, minúscula, número e caractere especial",
                        //},
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <TbLockPassword
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...register("confirmarSenha", {
                        required: "Confirmar senha é obrigatório",
                        validate: (value) =>
                          value === senha || "As senhas não coincidem",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Senha"
                      className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                    />
                    <TbLockPassword
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmarSenha.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-tertiary hover:bg-[#8b47d9] disabled:opacity-50 rounded-full font-semibold text-base text-white transition-all duration-200 mt-8"
              >
                {isLoading ? "Carregando..." : "Registrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistreForm;
