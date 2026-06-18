import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

function LoginModal({
  isOpen,
  onClose,
  onLoginClick,
  onRegisterClick,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-3xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Faça Login para Continuar
          </h2>
          <p className="text-[#858584] text-lg mb-8">
            Você precisa estar logado para enviar mensagens ao vendedor.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={onLoginClick}
              className="bg-tertiary hover:brightness-90 text-white font-semibold py-3 px-6 rounded-full transition-all"
            >
              Entrar em sua Conta
            </button>

            <button
              onClick={onRegisterClick}
              className="bg-secondary hover:brightness-110 text-white font-semibold py-3 px-6 rounded-full transition-all border border-[#858584]"
            >
              Criar Nova Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
