import { Link } from "react-router-dom";

interface CardProductProps {
  id_anuncio: number;
  titulo: string;
  preco: string;
  categoria: string;
  marca: string;
  imagem: string;
  vendedor: {
    nome: string;
    avatar?: string;
  };
}

function CardProduct({
  id_anuncio,
  titulo,
  preco,
  categoria,
  marca,
  imagem,
  vendedor,
}: CardProductProps) {
  return (
    <Link to={`/anuncio?id=${id_anuncio}`} className="no-underline">
      <div className="bg-primary flex flex-col h-full min-w-64 rounded-5xl overflow-hidden cursor-pointer hover:brightness-110 transition-all">
        <div className="h-72 rounded-tl-5xl rounded-tr-5xl overflow-hidden w-full">
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-6 p-7.5 flex-1 w-full">
          <div className="flex flex-col gap-1.25">
            <h3 className="text-tprimary text-2xl font-['Work_Sans:SemiBold',sans-serif] font-semibold leading-1.4">
              {titulo}
            </h3>
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img
                  src={vendedor.avatar}
                  alt={vendedor.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-tprimary text-base font leading-1.4">
                {vendedor.nome}
              </p>
            </div>
          </div>

          <div className="flex font-['Space_Mono:Regular',sans-serif] gap-0">
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-gray-500 text-xs leading-1.1">Preço</p>
              <p className="text-tprimary text-base leading-1.4">{preco}</p>
            </div>
            <div className="flex-1 flex flex-col gap-2 text-right">
              <p className="text-gray-500 text-xs leading-1.1">{categoria}</p>
              <p className="text-tprimary text-base leading-1.4">{marca}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardProduct;
