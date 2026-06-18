import CategorySection from "../layouts/CategorySection";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import HeroSection from "../layouts/HeroSection";

function Home() {
  return (
    <div className="bg-primary flex flex-col gap-20 font-display text-white">
      <Header />
      <HeroSection />
      <CategorySection />
      <Footer />
    </div>
  );
}

export default Home;
