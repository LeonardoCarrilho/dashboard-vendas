# Dashboard de Vendas

Painel comercial responsivo feito com **React + Vite + Recharts**, com indicadores, gráfico de receita x meta, origem das vendas e tabela de pedidos recentes.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)

## Funcionalidades

- Filtro de período (6 ou 12 meses) que recalcula todos os indicadores
- Cards de receita, pedidos, ticket médio e conversão
- Gráfico de área de receita com linha de meta
- Gráfico de rosca por canal de venda
- Tabela de pedidos recentes com status
- Exportação dos pedidos para CSV
- Layout responsivo com menu lateral no mobile

## Como rodar

```bash
npm install
npm run dev
```

Acesse o endereço exibido no terminal (normalmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── RevenueChart.jsx
│   ├── ChannelChart.jsx
│   └── OrdersTable.jsx
├── data/
│   └── sales.js        # dados simulados
├── App.jsx
├── main.jsx
└── styles.css
```

## Dados

Os números em `src/data/sales.js` são simulados para demonstração. Para usar dados reais, substitua esse arquivo por uma chamada à sua API (fetch/axios) e mantenha o mesmo formato:

```js
{ month: "Jan", revenue: 42800, orders: 312, goal: 40000 }
```

## Deploy

O projeto é uma SPA estática e pode ser publicado gratuitamente na Vercel, Netlify ou GitHub Pages:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Licença

Uso livre para estudos e portfólio.
