import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import PerfilSection from "../layouts/PerfilSection";

function Perfil() {
  return (
    <div className="bg-primary flex flex-col  font-display text-white">
      <Header />
      <PerfilSection />
      <Footer />
    </div>
  );
}

export default Perfil;
