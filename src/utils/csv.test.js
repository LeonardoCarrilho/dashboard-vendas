import { describe, expect, it } from "vitest";
import {
  CSV_HEADER,
  buildOrdersCsv,
  csvFileName,
  escapeCsvField,
  formatCsvDate,
  formatCsvNumber,
} from "./csv";

const orders = [
  {
    id: "#1042",
    customer: 'Mariana "Mari" Alves',
    product: "Fone; Bluetooth",
    value: 349.9,
    status: "Pago",
    date: "2026-10-22",
  },
  {
    id: "#1041",
    customer: "Rafael Souza",
    product: "Teclado mecânico",
    value: 489,
    status: "Enviado",
    date: "2026-10-21",
  },
];

describe("escapeCsvField", () => {
  it("mantém textos simples", () => {
    expect(escapeCsvField("Rafael Souza")).toBe("Rafael Souza");
    expect(escapeCsvField(42)).toBe("42");
    expect(escapeCsvField(null)).toBe("");
  });

  it("protege separador, aspas e quebras de linha", () => {
    expect(escapeCsvField("Fone; Bluetooth")).toBe('"Fone; Bluetooth"');
    expect(escapeCsvField('Fone "Pro"')).toBe('"Fone ""Pro"""');
    expect(escapeCsvField("linha 1\nlinha 2")).toBe('"linha 1\nlinha 2"');
  });
});

describe("formatCsvNumber", () => {
  it("usa vírgula como separador decimal", () => {
    expect(formatCsvNumber(349.9)).toBe("349,90");
    expect(formatCsvNumber(489)).toBe("489,00");
  });
});

describe("formatCsvDate", () => {
  it("converte ISO em dd/mm/aaaa", () => {
    expect(formatCsvDate("2026-10-22")).toBe("22/10/2026");
    expect(formatCsvDate("")).toBe("");
  });
});

describe("buildOrdersCsv", () => {
  it("inclui BOM, cabeçalho, separador ; e CRLF", () => {
    const csv = buildOrdersCsv(orders);
    const lines = csv.slice(1).split("\r\n");

    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(lines[0]).toBe(CSV_HEADER.join(";"));
    expect(lines).toHaveLength(4);
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("formata valores, datas e escapa aspas", () => {
    const csv = buildOrdersCsv(orders);

    expect(csv).toContain("349,90");
    expect(csv).toContain("22/10/2026");
    expect(csv).toContain('"Mariana ""Mari"" Alves"');
    expect(csv).toContain('"Fone; Bluetooth"');
  });

  it("exporta apenas o cabeçalho quando não há pedidos", () => {
    const csv = buildOrdersCsv([]);

    expect(csv).toBe(`\uFEFF${CSV_HEADER.join(";")}\r\n`);
  });
});

describe("csvFileName", () => {
  it("inclui o período e a data final", () => {
    expect(csvFileName(30, "2026-10-22")).toBe("pedidos-30-dias-2026-10-22.csv");
    expect(csvFileName(7)).toBe("pedidos-7-dias.csv");
  });
});
