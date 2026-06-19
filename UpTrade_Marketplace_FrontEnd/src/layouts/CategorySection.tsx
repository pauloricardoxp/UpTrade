import {
  MemoryStick,
  Cpu,
  Gpu,
  Mouse,
  Keyboard,
  CircuitBoard,
  Monitor,
  Laptop,
  type LucideIcon,
} from "lucide-react";
import CategoryCard from "../components/CategoryCard";

interface Category {
  title: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { title: "Memória RAM", icon: MemoryStick },
  { title: "Processadores", icon: Cpu },
  { title: "Placa de Vídeo", icon: Gpu },
  { title: "Mouses", icon: Mouse },
  { title: "Teclados", icon: Keyboard },
  { title: "Placa-mãe", icon: CircuitBoard },
  { title: "Monitores", icon: Monitor },
  { title: "Notebooks", icon: Laptop },
];

export default function CategorySection() {
  return (
    <section id="category" className="bg-primary w-full py-10 px-48">
      <div className="flex flex-col gap-15 items-start w-full max-w-7xl mx-auto">
        <h1 className="text-tprimary text-5xl font-semibold">
          Categorias
        </h1>

        <div className="w-full grid grid-cols-4 gap-7.5">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
