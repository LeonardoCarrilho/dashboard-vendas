import { useMemo, useState } from "react";
import { formatCurrencyPrecise, statusStyles } from "../data/sales";
import { buildOrdersCsv, csvFileName } from "../utils/csv";
import { ORDER_SORT_LABELS, ariaSortFor, nextSort, sortOrders } from "../utils/orders";

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;

  return (
    <th scope="col" aria-sort={ariaSortFor(sort, sortKey)}>
      <button
        type="button"
        className={`sort-button${active ? " is-active" : ""}`}
        onClick={() => onSort(sortKey)}
      >
        {label}
        <span className="sort-icon" aria-hidden="true">
          {active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function downloadCsv(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function OrdersTable({ orders = [], days, endDate }) {
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const sortedOrders = useMemo(() => sortOrders(orders, sort), [orders, sort]);
  const handleSort = (key) => setSort((current) => nextSort(current, key));
  const orderLabel = orders.length === 1 ? "pedido" : "pedidos";

  const handleExport = () => {
    downloadCsv(buildOrdersCsv(sortedOrders), csvFileName(days, endDate));
  };

  return (
    <section className="panel orders-panel" id="orders" aria-labelledby="orders-title">
      <header className="panel-head">
        <div>
          <h2 id="orders-title">Pedidos recentes</h2>
          <p>
            Últimas movimentações da loja ·{" "}
            <span className="orders-count">
              {orders.length} {orderLabel}
            </span>{" "}
            no período
          </p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={handleExport}
          disabled={orders.length === 0}
          aria-label={`Exportar ${orders.length} ${orderLabel} dos últimos ${days} dias em CSV`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M4 19h16" />
          </svg>
          Exportar CSV
        </button>
      </header>

      <div
        className="table-wrap"
        role="region"
        aria-label="Tabela de pedidos recentes"
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">
            Pedidos dos últimos {days} dias com cliente, produto, valor, status e data.
            Use os botões dos cabeçalhos para ordenar por cliente, valor ou data.
          </caption>
          <thead>
            <tr>
              <th scope="col">Pedido</th>
              <SortHeader
                label="Cliente"
                sortKey="customer"
                sort={sort}
                onSort={handleSort}
              />
              <th scope="col">Produto</th>
              <SortHeader label="Valor" sortKey="value" sort={sort} onSort={handleSort} />
              <th scope="col">Status</th>
              <SortHeader label="Data" sortKey="date" sort={sort} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  Nenhum pedido no período selecionado.
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="order-product">{order.product}</td>
                  <td className="order-value">{formatCurrencyPrecise(order.value)}</td>
                  <td>
                    <span className={`status status-${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="order-date">
                    {order.date.split("-").reverse().join("/")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="export-note">
        O CSV inclui os {orders.length} {orderLabel} do período e a ordenação atual
        ({ORDER_SORT_LABELS[sort.key]},{" "}
        {sort.direction === "asc" ? "crescente" : "decrescente"}).
      </p>
    </section>
  );
}
