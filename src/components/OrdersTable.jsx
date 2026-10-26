import { formatCurrencyPrecise, statusStyles } from "../data/sales";
import { buildOrdersCsv, csvFileName } from "../utils/csv";

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
  const orderLabel = orders.length === 1 ? "pedido" : "pedidos";

  const handleExport = () => {
    downloadCsv(buildOrdersCsv(orders), csvFileName(days, endDate));
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

      <div className="table-wrap">
        <table>
          <caption className="sr-only">
            Pedidos dos últimos {days} dias com cliente, produto, valor, status e data.
          </caption>
          <thead>
            <tr>
              <th scope="col">Pedido</th>
              <th scope="col">Cliente</th>
              <th scope="col">Produto</th>
              <th scope="col">Valor</th>
              <th scope="col">Status</th>
              <th scope="col">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  Nenhum pedido no período selecionado.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
        O CSV inclui os {orders.length} {orderLabel} do período selecionado.
      </p>
    </section>
  );
}
