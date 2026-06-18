import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import MyAnuncioSection from "../layouts/MyAnuncioSection";

function MyAnuncio() {
  return (
    <div className="bg-primary flex flex-col  font-display text-white">
      <Header />
      <MyAnuncioSection />
      <Footer />
    </div>
  );
}
export default MyAnuncio;
