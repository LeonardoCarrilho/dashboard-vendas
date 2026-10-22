const ICONS = {
  revenue: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M4 10h16M8 14h4" />
    </svg>
  ),
  conversion: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function StatCard({ icon, label, value, delta, deltaLabel = "%", note }) {
  const hasDelta = typeof delta === "number";
  const positive = hasDelta && delta >= 0;
  const formattedDelta = hasDelta
    ? Math.abs(delta).toLocaleString("pt-BR", { maximumFractionDigits: 1 })
    : "";

  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">{ICONS[icon]}</span>
        {hasDelta && (
          <span
            className={`delta ${positive ? "is-up" : "is-down"}`}
            aria-label={`${positive ? "Aumento" : "Queda"} de ${formattedDelta}${deltaLabel} ${note}`}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d={positive ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} />
            </svg>
            {formattedDelta}
            {deltaLabel}
          </span>
        )}
      </div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </article>
  );
}
