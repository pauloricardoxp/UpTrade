import CreateAnuncioSection from "../layouts/CreateAnuncioSection";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";


function CreateAnuncio() {
  return (
    <div className="bg-primary flex flex-col  font-display text-white">
      <Header />
      <CreateAnuncioSection />
      <Footer />
    </div>
  );
}
export default CreateAnuncio;
