import ExplorerHero from "../layouts/ExplorerHero";
import ExplorerSection from "../layouts/ExplorerSection";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function Explorar() {
  return (
    <div className="bg-primary flex flex-col  font-display text-white">
      <Header />
      <ExplorerHero />
      <ExplorerSection/>
      <Footer/>
    </div>
  );
}

export default Explorar;
