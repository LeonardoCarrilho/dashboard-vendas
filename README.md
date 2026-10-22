# Dashboard de Vendas

Repositório: [github.com/LeonardoCarrilho/dashboard-vendas](https://github.com/LeonardoCarrilho/dashboard-vendas)  
**Demo:** [leonardocarrilho.github.io/dashboard-vendas](https://leonardocarrilho.github.io/dashboard-vendas/)

Painel comercial responsivo feito com **React + Vite + Recharts**, com indicadores, gráfico de receita x meta, origem das vendas e tabela de pedidos recentes.

![Prévia do dashboard](docs/preview.png)

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)

## Design

Interface de analytics em tema escuro, com menta e violeta, tipografia Space Grotesk + IBM Plex Mono e cartões compactos. A intenção é parecer uma ferramenta de operação, não uma landing page.

- Contraste e navegação por teclado revisados;
- Gráficos com cores consistentes e animações desativadas para renderização estável;
- Layout adaptado para desktop, tablet e celular.

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

Publicado no **GitHub Pages**: [leonardocarrilho.github.io/dashboard-vendas](https://leonardocarrilho.github.io/dashboard-vendas/).

O projeto é uma SPA estática e também pode ser publicado na Vercel ou Netlify:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Base do Vite:** `./`, para funcionar em subdiretórios

## Licença

Uso livre para estudos e portfólio.
