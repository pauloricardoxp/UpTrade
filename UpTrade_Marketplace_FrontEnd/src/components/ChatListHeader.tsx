import { Search } from "lucide-react";

interface ChatListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  title?: string;
}

export default function ChatListHeader({
  searchTerm,
  onSearchChange,
  title = "Minhas Conversas",
}: ChatListHeaderProps) {
  return (
    <div className="bg-primary border-b border-[#444444] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-ttertiary mb-6">{title}</h1>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858584]"
          />
          <input
            type="text"
            placeholder="Pesquisar conversas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#1B1B1B] border border-[#444444] rounded-lg py-3 pl-10 pr-4 text-ttertiary placeholder-[#858584] outline-0 focus:border-[#858584] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
