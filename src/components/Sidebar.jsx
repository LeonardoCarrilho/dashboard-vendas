const NAV = [
  { href: "#overview", label: "Visão geral", icon: "grid" },
  { href: "#channels", label: "Canais", icon: "pie" },
  { href: "#orders", label: "Pedidos", icon: "bag" },
];

function NavIcon({ name }) {
  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    );
  }
  if (name === "pie") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
        <path d="M14 3.5A8.5 8.5 0 0 1 20.5 10H14V3.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`} aria-label="Menu lateral">
      <a className="brand" href="#overview" onClick={onClose}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
          </svg>
        </span>
        <span>
          <strong>Vendas</strong>
          <small>painel comercial</small>
        </span>
      </a>

      <nav className="side-nav">
        <span className="side-label">Análise</span>
        {NAV.map((item, index) => (
          <a
            key={item.href}
            className={index === 0 ? "is-active" : ""}
            href={item.href}
            onClick={onClose}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="side-card">
        <span className="side-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3v18M3 12h18" />
          </svg>
        </span>
        <strong>Conecte seus dados</strong>
        <p>Este painel usa dados simulados. Troque por uma API quando quiser.</p>
      </div>

      <div className="side-foot">
        <span className="avatar" aria-hidden="true">LC</span>
        <span>
          <strong>Leonardo Carrilho</strong>
          <small>Desenvolvedor Full Stack</small>
        </span>
      </div>
    </aside>
  );
}
