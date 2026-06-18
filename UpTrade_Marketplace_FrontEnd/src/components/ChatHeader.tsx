import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export default function ChatHeader({
  title,
  subtitle,
  onBack,
}: ChatHeaderProps) {
  return (
    <div className="bg-primary border-b border-[#444444] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-ttertiary hover:text-tertiary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ttertiary">{title}</h1>
          <p className="text-sm text-[#858584]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
