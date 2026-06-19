import { Search } from "lucide-react";

function ExplorerHero() {
  return (
    <section className="bg-secondary w-full py-20 px-48">
      <div className="flex flex-col gap-7.5 items-start w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2.5 text-ttertiary">
          <h2 className="font-display font-semibold text-5xl">
            Explore o UpTrade!
          </h2>
          <p className="font-display font-normal text-22text-tsecondary">
            Busque as melhores peças para o seu PC ou Notebook!
          </p>
        </div>

        <form className="w-full border border-secondary bg-transparent rounded-5 h-15 flex items-center px-5 gap-3">
          <input
            type="text"
            placeholder="Pesquise por peças ou periféricos"
            className="flex-1 bg-transparent text-ttertiary placeholder-gray-500 outline-none text-16 font-display font-normal"
          />
          <button
            type="submit"
            className="text-tsecondary hover:text-ttertiary transition-colors shrink-0"
          >
            <Search className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default ExplorerHero;
