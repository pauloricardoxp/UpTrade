import type { Anuncio } from "./heroAnuncio";

export interface CategoryGroup {
  name: string;
  count: number;
  items: Anuncio[];
}

export interface TypeGroup {
  type: "Hardwares" | "Periféricos";
  count: number;
  categories: CategoryGroup[];
}
