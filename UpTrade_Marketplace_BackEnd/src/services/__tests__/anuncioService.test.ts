import { describe, it, expect, vi, beforeEach } from "vitest";
import { anuncioService } from "../anuncioService.js";

const mockPrisma = {
  anuncio: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  imagem: {
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
};

let service: anuncioService;

beforeEach(() => {
  service = new anuncioService(mockPrisma as any);
  vi.clearAllMocks();
});

describe("anuncioService", () => {

  it("deve lançar erro ao tentar editar anúncio de outro usuário", async () => {
    mockPrisma.anuncio.findUnique.mockResolvedValue({
      id_anuncio: 1,
      id_usuario: 99,
      status: "ATIVO",
    });

    await expect(
      service.update({} as any, 1, 1)
    ).rejects.toThrow("Você não tem permissão para editar este anúncio.");
  });

  it("deve lançar erro ao tentar editar anúncio com status INATIVO", async () => {
    mockPrisma.anuncio.findUnique.mockResolvedValue({
      id_anuncio: 1,
      id_usuario: 1,
      status: "INATIVO",
    });

    await expect(
      service.update({} as any, 1, 1)
    ).rejects.toThrow("Você não pode editar um anúncio que esteja Inativo ou Trocado");
  });

  it("deve lançar erro ao passar mais de 5 imagens", async () => {
    const data = { id_imagens: [1, 2, 3, 4, 5, 6] } as any;

    await expect(
      service.create(data, 1)
    ).rejects.toThrow("Máximo de 5 imagens permitido");
  });

  it("deve lançar erro ao passar imagens duplicadas", async () => {
    const data = { id_imagens: [1, 1, 2] } as any;

    await expect(
      service.create(data, 1)
    ).rejects.toThrow("Não é permitido enviar a mesma imagem múltiplas vezes");
  });

});