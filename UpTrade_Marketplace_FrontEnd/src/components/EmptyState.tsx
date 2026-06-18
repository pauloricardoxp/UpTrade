import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  isSearching?: boolean;
  isLoading?: boolean;
}

export default function EmptyState({
  isSearching = false,
  isLoading = false,
}: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#858584]">Carregando conversas...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <MessageSquare size={48} className="text-[#444444] mb-4" />
      <p className="text-[#858584] text-lg">
        {isSearching
          ? "Nenhuma conversa encontrada"
          : "Você ainda não tem conversas"}
      </p>
    </div>
  );
}
