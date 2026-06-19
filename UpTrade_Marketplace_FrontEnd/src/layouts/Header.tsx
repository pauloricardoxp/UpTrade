import { Store } from "lucide-react";
import { useState, useEffect } from "react";
import HeaderButton from "../components/HeaderButton.tsx";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";

interface User {
  nome?: string;
  email?: string;
  foto_perfil?: string;
}

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const userData: User = JSON.parse(user);
          setIsLoggedIn(true);
          setUserName(userData.nome || userData.email || "Usuário");
        } catch (error) {
          console.error(error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkAuth();
    const handleLoginSuccess = () => {
      setTimeout(() => {
        checkAuth();
      }, 100);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    const interval = setInterval(() => {
      checkAuth();
    }, 200);

    window.addEventListener("loginSuccess", handleLoginSuccess);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserName("");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-primary flex justify-evenly w-full h-24 px-12.5 items-center shadow-lg select-none">
      <div className="flex gap-8">
        <div className="flex items-center gap-5">
          <Store className="text-tertiary size-12" />
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/explorar")}
          >
            UpTrade Marketplace
          </h1>
        </div>
      </div>

      <div className="flex gap-8">
        {isLoggedIn ? (
          <ul className="flex gap-8 items-center">
            <HeaderButton goto={"/minhaConta"} text={"Minha Conta"} />
            <HeaderButton goto={"/meusAnuncios"} text={"Meus Anúncios"} />
            <button
              onClick={() => navigate("/chats")}
              className="text-ttertiary hover:text-tertiary transition-colors font-medium cursor-pointer"
            >
              Minhas Conversas
            </button>
          </ul>
        ) : (
          <ul className="flex gap-8 items-center">
            <HeaderButton goto={"/explorar"} text={"Hardwares"} />
            <HeaderButton goto={"/explorar"} text={"Periféricos"} />
            <HeaderButton goto={"#category"} text={"Categoria"} />
            <HeaderButton goto={"#sobrenos"} text={"Sobre nós"} />
          </ul>
        )}

        {isLoggedIn && (
          <button
            onClick={() => navigate("/criarAnuncio")}
            className="bg-tertiary flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer  hover:brightness-75 active:brightness-50 transition-all text-white font-semibold"
          >
            Criar Anuncio
          </button>
        )}

        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            className="bg-tertiary flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer hover:brightness-75 active:brightness-50 transition-all text-white font-semibold"
          >
            Login
          </button>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLoginLogout}
            className="text-ttertiary hover:text-tertiary transition-colors flex items-center gap-2"
          >
            <CiLogout className="fill-white size-6" />
            <span className="text-lg">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
