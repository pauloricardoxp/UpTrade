import type { LucideIcon } from "lucide-react";


interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
}

export default function CategoryCard({ title, icon: Icon }: CategoryCardProps) {
  return (
    <div className="bg-secondary rounded-5 flex flex-col items-center overflow-hidden hover:brightness-110 transition-all cursor-pointer rounded-xl">
      <div className="h-60 w-full bg-secondary flex items-center justify-center relative">
        <div className="absolute inset-0 backdrop-blur-[7.5px] bg-white/10 flex items-center justify-center ">
          <Icon className="w-25 h-25 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <div className="w-full px-7.5 py-5 pb-6.25">
        <h3 className="text-tprimary font-display font-semibold text-22 text-center">
          {title}
        </h3>
      </div>
    </div>
  );
}
