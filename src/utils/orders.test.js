import { describe, expect, it } from "vitest";
import { ariaSortFor, nextSort, sortOrders } from "./orders";

const orders = [
  { id: "#1001", customer: "Bruno", value: 200, date: "2026-10-02" },
  { id: "#1002", customer: "Álvaro", value: 100, date: "2026-10-03" },
  { id: "#1003", customer: "Carla", value: 300, date: "2026-10-03" },
  { id: "#1000", customer: "Diana", value: 150, date: "2026-10-01" },
];

const ids = (list) => list.map((order) => order.id);

describe("sortOrders", () => {
  it("ordena por data decrescente por padrão", () => {
    expect(ids(sortOrders(orders))).toEqual(["#1003", "#1002", "#1001", "#1000"]);
  });

  it("ordena por data crescente", () => {
    expect(ids(sortOrders(orders, { key: "date", direction: "asc" }))).toEqual([
      "#1000",
      "#1001",
      "#1002",
      "#1003",
    ]);
  });

  it("ordena por valor", () => {
    expect(ids(sortOrders(orders, { key: "value", direction: "asc" }))).toEqual([
      "#1002",
      "#1000",
      "#1001",
      "#1003",
    ]);
    expect(ids(sortOrders(orders, { key: "value", direction: "desc" }))).toEqual([
      "#1003",
      "#1001",
      "#1000",
      "#1002",
    ]);
  });

  it("ordena por cliente respeitando acentos", () => {
    expect(ids(sortOrders(orders, { key: "customer", direction: "asc" }))).toEqual([
      "#1002",
      "#1001",
      "#1003",
      "#1000",
    ]);
  });

  it("não altera a lista original", () => {
    const original = [...orders];
    sortOrders(orders, { key: "value", direction: "asc" });
    expect(orders).toEqual(original);
  });
});

describe("nextSort", () => {
  it("começa em ordem decrescente para data/valor e crescente para cliente", () => {
    expect(nextSort({ key: "date", direction: "asc" }, "value")).toEqual({
      key: "value",
      direction: "desc",
    });
    expect(nextSort({ key: "date", direction: "desc" }, "customer")).toEqual({
      key: "customer",
      direction: "asc",
    });
  });

  it("inverte a direção ao clicar na mesma coluna", () => {
    expect(nextSort({ key: "value", direction: "desc" }, "value")).toEqual({
      key: "value",
      direction: "asc",
    });
    expect(nextSort({ key: "value", direction: "asc" }, "value")).toEqual({
      key: "value",
      direction: "desc",
    });
  });
});

describe("ariaSortFor", () => {
  it("descreve a ordenação ativa", () => {
    const sort = { key: "date", direction: "asc" };

    expect(ariaSortFor(sort, "date")).toBe("ascending");
    expect(ariaSortFor({ key: "date", direction: "desc" }, "date")).toBe("descending");
    expect(ariaSortFor(sort, "value")).toBe("none");
  });
});
