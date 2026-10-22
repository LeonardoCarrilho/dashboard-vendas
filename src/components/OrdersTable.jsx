import { formatCurrencyPrecise, statusStyles } from "../data/sales";

function exportCsv(orders) {
  const header = ["Pedido", "Cliente", "Produto", "Valor", "Status", "Data"];
  const rows = orders.map((order) => [
    order.id,
    order.customer,
    order.product,
    order.value.toFixed(2).replace(".", ","),
    order.status,
    order.date,
  ]);
  const csv = [header, ...rows].map((row) => row.join(";")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pedidos-recentes.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function OrdersTable({ orders }) {
  return (
    <section className="panel orders-panel" id="orders" aria-labelledby="orders-title">
      <header className="panel-head">
        <div>
          <h2 id="orders-title">Pedidos recentes</h2>
          <p>Últimas movimentações da loja</p>
        </div>
        <button type="button" className="ghost-button" onClick={() => exportCsv(orders)}>
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
            {orders.map((order) => (
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
                <td className="order-date">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
