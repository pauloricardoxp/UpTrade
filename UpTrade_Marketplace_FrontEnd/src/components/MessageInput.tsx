import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  isLoading = false,
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-[#1B1B1B] text-ttertiary px-4 py-3 rounded-lg outline-0 border border-[#444444] focus:border-[#858584] transition-colors"
        disabled={isLoading}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !value.trim()}
        className="bg-tertiary text-tprimary px-2 py-3 rounded-lg hover:brightness-75 disabled:opacity-50 transition-all font-semibold flex items-center gap-2"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
