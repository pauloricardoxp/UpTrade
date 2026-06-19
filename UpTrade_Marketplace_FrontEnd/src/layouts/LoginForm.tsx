import { Mail, Lock } from "lucide-react";
import imagemLogin from "../imagens/ImagemLogin.jpg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { LoginFormType } from "../types/loginType";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(data: LoginFormType) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("auth/login", {
        email: data.email,
        senha: data.senha,
      });

      const { token } = response.data;
      const decodedToken = decodeToken(token);

      localStorage.setItem("token", token);
      if (decodedToken) {
        const userData = {
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role,
          nome: decodedToken.email.split("@")[0],
        };
        localStorage.setItem("user", JSON.stringify(userData));
      }

      window.dispatchEvent(new Event("loginSuccess"));

      setTimeout(() => {
        navigate("/explorar");
      }, 200);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Erro ao fazer login. Verifique suas credenciais.",
        );
      } else {
        setErrorMessage("Erro inesperado ao fazer login.");
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
            src={imagemLogin}
            alt="Hardware"
            className="w-450 h-full object-cover"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h1 className="text-6xl font-['Work_Sans:SemiBold',sans-serif] font-semibold text-white mb-6 leading-[1.1]">
                Login
              </h1>
              <p className="text-2xl font-['Work_Sans:Regular',sans-serif] text-white leading-[1.6]">
                Entre na plataforma Nº1 em compra e venda de hardwares!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
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
                    placeholder="Email"
                    className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 font text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
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

              <div className="relative">
                <input
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 8,
                      message: "A senha precisa ter pelo menos 8 caracteres",
                    },
                  })}
                  type="password"
                  placeholder="Senha"
                  className="w-full h-12 bg-white border border-[#858584] rounded-full px-5 pl-14 font text-base text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
                <Lock
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                />
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}

              <div className="text-center">
                <p className="text-sm text-[#858584]">
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/registrar")}
                    className="text-tertiary hover:text-[#8b47d9] font-semibold transition-colors"
                  >
                    Registre-se aqui
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-tertiary hover:bg-[#8b47d9] disabled:opacity-50 rounded-full font-['Work_Sans:SemiBold',sans-serif] font-semibold text-base text-white transition-all duration-200 mt-8"
              >
                {isLoading ? "Carregando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;
/* patter senha
value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                      message:
                        "A senha precisa ter 1 letra maiúscula, 1 número e 1 caractere especial",
                        */
