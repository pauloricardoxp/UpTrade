import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explorar from "./pages/Explorar";
import Login from "./pages/Login";
import Registre from "./pages/Registre";
import Anuncio from "./pages/Anuncio";
import Chat from "./pages/Chat";
import CreateAnuncio from "./pages/CreateAnuncio";
import MyAnuncio from "./pages/MyAnuncio";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explorar" element={<Explorar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registre />} />
      <Route path="/anuncio" element={<Anuncio />} />
      <Route path="/chats" element={<Chat />} />
      <Route path="/criarAnuncio" element={<CreateAnuncio />} />
      <Route path="/meusAnuncios" element={<MyAnuncio />} />
      <Route path="/minhaConta" element={<Perfil />} />
    </Routes>
  );
}
export default App;
