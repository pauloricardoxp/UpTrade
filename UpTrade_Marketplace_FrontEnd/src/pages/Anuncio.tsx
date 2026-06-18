import Header from "../layouts/Header";
import AnuncioHero from "../layouts/AnuncioHero";
import AnuncioSection from "../layouts/AnuncioSection";
import Footer from "../layouts/Footer";

function AnuncioPage() {
  return (
    <div className="bg-primary flex flex-col  font-display text-white">
      <Header />
      <AnuncioHero />
      <AnuncioSection />
      <Footer />
    </div>
  );
}

export default AnuncioPage;
