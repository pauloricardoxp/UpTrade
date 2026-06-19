import { Store } from "lucide-react";
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer id="sobrenos" className="bg-secondary text-tsecondary w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10 ">
        {/* Coluna 1 */}
        <div className="flex items-start justify-between gap-8">
          <div className="flex flex-col gap-5 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Store className=" text-tertiary w-6 h-6" strokeWidth={3} />
              </div>

              <span className="text-white font-display font-bold text-lg leading-26">
                UpTrade
              </span>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-sm font-normal">
                O maior Marketplace C2C
              </p>

              <div className="flex flex-col gap-3.75">
                <p className="text-sm font-normal">
                  Entre na comunidade!
                </p>

                <div className="flex gap-2.5">
                  <a
                    href="#"
                    className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                    target="_blank"
                    aria-label="Discord"
                  >
                    <div className="w-full h-full rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        <FaDiscord className="w-5 h-5" />
                      </span>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                    target="_blank"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="w-5 h-5" fill="currentColor" />
                  </a>

                  <a
                    href="#"
                    className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-5 h-5" fill="currentColor" />
                  </a>

                  <a
                    href="#"
                    className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col gap-6">
            <h3 className="text-tprimary font-display font-bold text-lg leading-26 ">
              Explore
            </h3>

            <nav className="flex flex-col gap-5">
              <a
                href="/marketplace"
                className="text-sm font-normal hover:text-tertiary transition-colors"
              >
                Marketplace
              </a>

              <a
                href="/vendedores"
                className="text-sm font-normal hover:text-tertiary transition-colors"
              >
                Vendedores
              </a>

              <a
                href="/conectar-carteira"
                className="text-sm font-normal hover:text-tertiary transition-colors"
              >
                Conecte sua carteira!
              </a>
            </nav>
          </div>

          {/* Coluna 3 */}
          <div className="flex flex-col gap-6 max-w-md">
            <h3 className="text-tprimary font-display font-bold text-lg leading-26">
              Fale com a gente
            </h3>

            <div className="flex flex-col gap-5 w-full">
              <p className="text-sm font-normal">
                Deixe sua sugestão, crítica, ou elogio para o UpTrade!
              </p>
            </div>

            <input
              type="email"
              placeholder="Digite seu email aqui"
              className="flex-1 bg-white text-tquaternary rounded-full px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
            />

            <button
              type="submit"
              className="bg-tertiary text-white px-12 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Inscreva-se
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-[#444444] to-[#333333]" />

        <p className="text-xs font-normal leading-normal text-[#999999]">
          © UpTrade Copyright (Todos os direitos reservados).
        </p>
      </div>
    </footer>
  );
}

export default Footer;
