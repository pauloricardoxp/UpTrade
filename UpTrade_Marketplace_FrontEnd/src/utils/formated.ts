export const formatTelefone = (telefone: string): string => {
  const numbers = telefone.replace(/\D/g, "");
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  return telefone;
};

// Função para formatar data de cadastro em formato legível
export const formatarDataCadastro = (data: string): string => {
  try {
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch {
    return data;
  }
};