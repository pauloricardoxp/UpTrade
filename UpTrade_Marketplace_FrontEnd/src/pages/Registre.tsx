import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import RegistreForm from "../layouts/RegistreForm";

function Registre() {
  return (
    <div className="bg-primary flex flex-col gap-1 font-display text-white">
      <Header />
      <RegistreForm/>
      <Footer />
    </div>
  );
}
export default Registre;
