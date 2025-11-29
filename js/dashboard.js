// Dashboard.js

if (window.ChartDataLabels && window.Chart) {
  Chart.register(window.ChartDataLabels);
}


// --- Inject Google Fonts & Visual Upgrade CSS ---
(function addVisualUpgradeCSS() {
  // Load Inter font
  const interFont = document.createElement('link');
  interFont.rel = 'stylesheet';
  interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
  document.head.appendChild(interFont);

  // Glassmorphism, soft shadows, rounded corners, animated buttons, table enhancements
  const style = document.createElement('style');
  style.innerHTML = `
    body, .dashboard-root, .dashboard * {
      font-family: 'Inter', system-ui, sans-serif !important;
    }
    .glass {
      background: rgba(255,255,255,0.25);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
      backdrop-filter: blur(12px);
      border-radius: 1.25rem;
      border: 1px solid rgba(255,255,255,0.18);
    }
    .summary-card {
  border-radius: 1.25rem !important;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(10px);
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s, background 0.18s;
  will-change: transform;
  border: 1px solid rgba(255,255,255,0.18);
}
.summary-card.bg-blue-100 {
  background-color: #e0e7ff;
  box-shadow: 0 8px 32px 0 rgba(96, 165, 250, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-red-100 {
  background-color: #ffe0e0;
  box-shadow: 0 8px 32px 0 rgba(239, 68, 68, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-green-100 {
  background-color: #d1fae5;
  box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-lime-100 {
  background-color: #eaffd0;
  box-shadow: 0 8px 32px 0 rgba(163, 230, 53, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-cyan-100 {
  background-color: #cffafe;
  box-shadow: 0 8px 32px 0 rgba(6, 182, 212, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-amber-100 {
  background-color: #fef3c7;
  box-shadow: 0 8px 32px 0 rgba(251, 191, 36, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-yellow-100 {
  background-color: #fef9c3;
  box-shadow: 0 8px 32px 0 rgba(253, 224, 71, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-pink-100 {
  background-color: #fce7f3;
  box-shadow: 0 8px 32px 0 rgba(236, 72, 153, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-orange-100 {
  background-color: #ffedd5;
  box-shadow: 0 8px 32px 0 rgba(251, 146, 60, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-indigo-100 {
 background-color: #e0e7ff;
  box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-fuchsia-100 {
  background-color: #fae8ff;
  box-shadow: 0 8px 32px 0 rgba(232, 121, 249, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}
.summary-card.bg-slate-100 {
  background-color: #f1f5f9;
  box-shadow: 0 8px 32px 0 rgba(100, 116, 139, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08);
}

    .summary-card:hover, .summary-card:focus-within {
      transform: scale(1.045);
      box-shadow: 0 12px 32px 0 rgba(0,0,0,0.14), 0 2px 8px 0 rgba(0,0,0,0.10);
      background: rgba(255,255,255,0.45);
      z-index: 2;
    }
    button, .btn {
      transition: transform 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s;
      border-radius: 0.75rem !important;
      font-family: 'Inter', system-ui, sans-serif !important;
      font-weight: 600;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
      outline: none;
    }
    button:active, .btn:active {
      transform: scale(0.97);
      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.10);
    }
    button:hover, .btn:hover {
      background: #f3f4f6;
      color: #111827;
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.10);
      transform: scale(1.04);
    }
    select, input[type="number"] {
      border-radius: 0.75rem !important;
      font-family: 'Inter', system-ui, sans-serif !important;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      background: rgba(255,255,255,0.65);
      transition: border 0.15s;
    }
    select:focus, input[type="number"]:focus {
      border-color: #6366f1;
      outline: none;
    }
    table {
      font-family: 'Inter', system-ui, sans-serif !important;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
      background: rgba(255,255,255,0.55);
      backdrop-filter: blur(6px);
      border-collapse: separate;
      border-spacing: 0;
    }
    th, td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.98rem;
    }
    th {
      background: rgba(243,244,246,0.85);
      font-weight: 600;
      color: #374151;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tbody tr {
      transition: background 0.15s;
    }
    tbody tr:hover {
      background: rgba(236, 72, 153, 0.08);
    }
    @media (max-width: 768px) {
      .max-w-7xl { max-width: 100vw !important; }
      .grid, .grid-cols-1, .md\\:grid-cols-2, .md\\:grid-cols-4 {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }
      section, .glass, .summary-card {
        padding: 1rem !important;
        border-radius: 1rem !important;
      }
      table, th, td {
        font-size: 0.92rem !important;
        padding: 0.5rem !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

// --- Utility Functions ---
console.log("dashboard.js loaded");

function $(id) {
  return document.getElementById(id);
}

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

// --- Loading & Error State ---

function setLoading(isLoading) {
  if (isLoading) {
    show($("dashboard-loading"));
    hide($("dashboard-error"));
  } else {
    hide($("dashboard-loading"));
  }
}

function setError(msg) {
  $("dashboard-error").innerText = msg;
  show($("dashboard-error"));
}


// --- Main Dashboard Loader ---

window.loadDashboard = async function () {
  const container = $("dashboard");
  if (!container) return;

  container.innerHTML = `
    <div id="dashboard-loading" class="hidden text-center py-4 text-gray-500">Loading...</div>
    <div id="dashboard-error" class="hidden text-center py-4 text-red-600"></div>
    <section class="glass p-6 rounded-2xl shadow max-w-7xl mx-auto dashboard-root">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 flex items-center" style="font-family: 'Inter', system-ui, sans-serif;">
        <span class="mr-2">📊</span> Monthly Dashboard
      </h2>
      <p class="text-sm text-gray-500 mb-6">View your monthly financial summary</p>
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <label class="text-sm text-gray-600">Month:
          <select id="filter-month" class="border p-2 rounded"></select>
        </label>
        <label class="text-sm text-gray-600">Year:
          <input id="filter-year" type="number" class="border p-2 rounded w-24" value="${new Date().getFullYear()}" />
        </label>
        <label class="text-sm text-gray-600 flex items-center gap-1">
          <input type="checkbox" id="partial-toggle" />
          Same period last month
        </label>
        <button id="prev-month" class="btn bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300" title="Previous Month">◀</button>
        <button id="next-month" class="btn bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300" title="Next Month">▶</button>
        <button id="apply-filters" class="btn bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Apply</button>
        <button id="export-csv" class="btn bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">Export CSV</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" id="summary-cards"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="glass p-4 rounded-2xl shadow">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-600">Revenue Trend</h3>
            <button id="toggle-trend" class="btn text-xs text-blue-600 hover:underline">Hide</button>
          </div>
          <div class="w-full h-64" id="trendChart-container">
            <canvas id="trendChart" class="w-full h-full" aria-label="Revenue Trend Bar Chart" role="img"></canvas>
          </div>
        </div>
        <div class="glass p-4 rounded-2xl shadow">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-600">Cost Breakdown</h3>
            <button id="toggle-cost" class="btn text-xs text-blue-600 hover:underline">Hide</button>
          </div>
          <div class="w-full h-64 flex items-center justify-center" id="costChart-container">
            <canvas id="costChart" class="w-full h-full max-w-[300px]" aria-label="Cost Breakdown Pie Chart" role="img"></canvas>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="glass p-4 rounded-2xl shadow">
          <h4 class="font-semibold mb-2">Top 3 Best-Selling Items</h4>
          <table class="w-full text-sm border rounded" aria-label="Top 3 Best-Selling Items">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-1">Item</th>
                <th class="border p-1">Qty Sold</th>
                <th class="border p-1">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody id="top-sellers-tbody"></tbody>
          </table>
        </div>
        <div class="glass p-4 rounded-2xl shadow">
          <h4 class="font-semibold mb-2">Top Clients</h4>
          <table class="w-full text-sm border rounded" aria-label="Top Clients">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-1">Client</th>
                <th class="border p-1">Orders</th>
                <th class="border p-1">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody id="top-clients-tbody"></tbody>
          </table>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="glass p-4 rounded-2xl shadow">
          <h4 class="font-semibold mb-2">Top Clients by Revenue</h4>
          <table class="w-full text-sm border rounded" aria-label="Top Clients by Revenue">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-1">Client</th>
                <th class="border p-1">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody id="revenue-per-client-tbody"></tbody>
          </table>
        </div>
        <div class="glass p-4 rounded-2xl shadow">
          <h4 class="font-semibold mb-2">Profit per Client</h4>
          <table class="w-full text-sm border rounded" aria-label="Profit per Client">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-1">Client</th>
                <th class="border p-1">Profit (₹)</th>
              </tr>
            </thead>
            <tbody id="profit-per-client-tbody"></tbody>
          </table>
        </div>
      </div>
      <div class="glass p-4 rounded-2xl shadow mb-6">
        <h4 class="font-semibold mb-2">Expense Breakdown</h4>
        <table class="w-full text-sm border rounded" aria-label="Expense Breakdown">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-1">Category</th>
              <th class="border p-1">Amount (₹)</th>
            </tr>
          </thead>
          <tbody id="expense-breakdown-tbody"></tbody>
        </table>
      </div>
      <div class="glass p-4 rounded-2xl shadow mb-6">
        <h4 class="font-semibold mb-2">Revenue & Profit Over Time</h4>
        <canvas id="lineChart" class="w-full h-64" aria-label="Revenue and Profit Over Time" role="img"></canvas>
      </div>
      <div class="glass p-4 rounded-2xl shadow mb-6">
  <h4 class="font-semibold mb-2 text-lg text-gray-800">Total Revenue & Cost Till Date</h4>
  <canvas id="tillDateBarChart" class="w-full h-64" aria-label="Total Revenue and Cost Till Date" role="img"></canvas>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div class="glass p-4 rounded-2xl shadow">
    <h4 class="font-semibold mb-2 text-lg text-gray-800">Monthly Revenue Trend</h4>
    <canvas id="monthlyRevenueLineChart" class="w-full h-64" aria-label="Monthly Revenue Trend" role="img"></canvas>
  </div>
  <div class="glass p-4 rounded-2xl shadow">
    <h4 class="font-semibold mb-2 text-lg text-gray-800">Monthly Orders Trend</h4>
    <canvas id="monthlyOrdersLineChart" class="w-full h-64" aria-label="Monthly Orders Trend" role="img"></canvas>
    <div id="monthlyOrdersPctChange" class="mt-2 text-sm"></div>
  </div>
</div>

<div class="glass p-4 rounded-2xl shadow mb-6" id="monthlyRevenueComboChart-container">
  <h4 class="font-semibold mb-2 text-lg text-gray-800">Monthly Revenue Trend & Difference</h4>
  <canvas id="monthlyRevenueComboChart" class="w-full h-64" aria-label="Monthly Revenue Trend & Difference" role="img"></canvas>
</div>


<div class="glass p-4 rounded-2xl shadow mb-6">
  <h4 class="font-semibold mb-2 text-lg text-gray-800">Daily Orders Trend</h4>
  <canvas id="dailyOrdersAreaChart" class="w-full h-64" aria-label="Daily Orders Trend" role="img"></canvas>
</div>


      <div class="glass p-4 rounded-2xl shadow">
        <h4 class="font-semibold mb-2">Summary Table</h4>
        <table class="w-full text-sm border rounded" aria-label="Summary Table">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-1">Metric</th>
              <th class="border p-1">Value (₹)</th>
            </tr>
          </thead>
          <tbody id="summary-table-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  $("filter-month").innerHTML = [...Array(12).keys()].map(m => `<option value="${m+1}">${new Date(0, m).toLocaleString('default', { month: 'long' })}</option>`).join('');
  $("filter-month").value = new Date().getMonth() + 1;

  $("prev-month").addEventListener("click", () => changeMonth(-1));
  $("next-month").addEventListener("click", () => changeMonth(1));
  $("apply-filters").addEventListener("click", () => applyFilters());
  $("partial-toggle").addEventListener("change", () => applyFilters());
  $("export-csv").addEventListener("click", () => exportDashboardCSV());
  $("toggle-trend").addEventListener("click", function() {
    const el = $("trendChart-container");
    if (el.style.display === "none") {
      el.style.display = "";
      this.innerText = "Hide";
    } else {
      el.style.display = "none";
      this.innerText = "Show";
    }
  });
  $("toggle-cost").addEventListener("click", function() {
    const el = $("costChart-container");
    if (el.style.display === "none") {
      el.style.display = "";
      this.innerText = "Hide";
    } else {
      el.style.display = "none";
      this.innerText = "Show";
    }
  });

  const m = new Date().getMonth() + 1;
const y = new Date().getFullYear();
const dayLimit = null;
await loadDashboardData(m, y, dayLimit);
renderTillDateBarChart();
await renderMonthlyRevenueLineChart();
await renderMonthlyOrdersLineChart();
await renderDailyOrdersAreaChart(m, y, dayLimit);
await renderMonthlyRevenueComboChart();





};

function changeMonth(delta) {
  let m = parseInt($("filter-month").value);
  let y = parseInt($("filter-year").value);
  m += delta;
  if (m < 1) { m = 12; y--; }
  if (m > 12) { m = 1; y++; }
  $("filter-month").value = m;
  $("filter-year").value = y;
  loadDashboardData(m, y);
  renderDailyOrdersAreaChart(m, y, null);
}


function applyFilters() {
  const m = parseInt($("filter-month").value);
  const y = parseInt($("filter-year").value);
  const usePartial = $("partial-toggle").checked;
  const dayLimit = usePartial ? new Date().getDate() : null;
  loadDashboardData(m, y, dayLimit);
  renderDailyOrdersAreaChart(m, y, dayLimit);
}


// --- Data Fetching and Rendering ---

async function loadDashboardData(month, year, dayLimit = null) {
  setLoading(true);
  try {
    const datePrefix = `${year}-${String(month).padStart(2, '0')}`;
const endDay = dayLimit || new Date(year, month, 0).getDate();
const endDate = `${datePrefix}-${String(endDay).padStart(2, '0')}`;
const logsSnap = await window.db.collection("dailyLogs")
  .where("date", ">=", `${datePrefix}-01`)
  .where("date", "<=", endDate)
  .get();

    if (logsSnap.empty) {
      renderEmptyState();
      setLoading(false);
      return;
    }

    let totalRevenue = 0, totalIngredients = 0, totalPackaging = 0;
    let allItems = [], clientMap = {};
    // --- Order Days & Streak Calculation ---
    const orderDatesSet = new Set();
    logsSnap.forEach(doc => {
      const d = doc.data();
      if (d.items && Array.isArray(d.items)) {
        d.items.forEach(item => {
          allItems.push({ ...item, date: d.date, client: d.client });
          totalRevenue += item.revenue || 0;
          totalIngredients += item.ingredients || 0;
          totalPackaging += item.packaging || 0;
        });
      }
      if (d.client) {
        if (!clientMap[d.client]) clientMap[d.client] = { orders: 0, revenue: 0 };
        clientMap[d.client].orders += 1;
        if (d.items && Array.isArray(d.items)) {
          d.items.forEach(item => {
            clientMap[d.client].revenue += item.revenue || 0;
          });
        }
      }
      if (d.date) orderDatesSet.add(d.date);
    });

    // Calculate order days, streak, and no order days
    const orderDatesArr = Array.from(orderDatesSet).sort();
    const orderDays = orderDatesArr.length;
    let maxStreak = 0, currentStreak = 0;
    let prevDate = null;
    orderDatesArr.forEach(dateStr => {
      const date = new Date(dateStr);
      if (prevDate) {
        const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      prevDate = date;
    });
    const orderStreak = maxStreak;
    const daysInMonth = new Date(year, month, 0).getDate();
    const noOrderDays = daysInMonth - orderDays;

    const orderCount = logsSnap.size;
    const avgOrderValue = orderCount ? totalRevenue / orderCount : 0;
    const repeatCustomers = Object.values(clientMap).filter(c => c.orders > 1).length;
    const revenuePerClient = Object.entries(clientMap)
      .map(([name, stats]) => ({ name, revenue: stats.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const itemMap = {};
    allItems.forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = { qty: 0, revenue: 0, profit: 0, category: item.category || "Uncategorized" };
      itemMap[item.name].qty += item.qty || 0;
      itemMap[item.name].revenue += item.revenue || 0;
      itemMap[item.name].profit += (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
    });
    const itemsArr = Object.entries(itemMap).map(([name, stats]) => ({ name, ...stats }));
    const bestSelling = itemsArr.length ? itemsArr.slice().sort((a, b) => b.qty - a.qty)[0] : null;
    const worstSelling = itemsArr.length ? itemsArr.slice().sort((a, b) => a.qty - b.qty)[0] : null;
    const mostProfitable = itemsArr.length ? itemsArr.slice().sort((a, b) => b.profit - a.profit)[0] : null;

    let prevMonth = month - 1, prevYear = year;
if (prevMonth < 1) { prevMonth = 12; prevYear--; }
const prevPrefix = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
const prevEndDay = dayLimit || new Date(prevYear, prevMonth, 0).getDate();
const prevEndDate = `${prevPrefix}-${String(prevEndDay).padStart(2, '0')}`;
const prevSnap = await window.db.collection("dailyLogs")
  .where("date", ">=", `${prevPrefix}-01`)
  .where("date", "<=", prevEndDate)
  .get();
let prevRevenue = 0, prevCost = 0, prevProfit = 0;
prevSnap.forEach(doc => {
  const d = doc.data();
  if (d.items && Array.isArray(d.items)) {
    d.items.forEach(item => {
      prevRevenue += item.revenue || 0;
      prevCost += (item.ingredients || 0) + (item.packaging || 0);
      prevProfit += (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
    });
  }
});
let prevOrderCount = prevSnap.size;

    const prevProfitPercent = prevRevenue ? (prevProfit / prevRevenue) * 100 : 0;

    // Count unique clients in prevSnap
const prevClientSet = new Set();
prevSnap.forEach(doc => {
  const d = doc.data();
  if (d.client) prevClientSet.add(d.client);
});
const prevClientCount = prevClientSet.size;
const prevProfitPerClient = prevClientCount ? prevProfit / prevClientCount : 0;

    const prevActualProfit = prevProfit;

    const grossProfit = totalRevenue - (totalIngredients + totalPackaging);

    const clientCount = Object.keys(clientMap).length;
    const profitPerClient = clientCount ? grossProfit / clientCount : 0;
    const actualProfit = grossProfit;
    const profitPercent = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0;

    // Profit per client table (detailed)
    const profitPerClientArr = Object.entries(clientMap)
      .map(([name, stats]) => ({ name, profit: stats.revenue }));
    profitPerClientArr.forEach(client => {
      const clientItems = allItems.filter(item => item.client === client.name);
      let totalCost = 0;
      clientItems.forEach(item => {
        totalCost += (item.ingredients || 0) + (item.packaging || 0);
      });
      client.profit = client.profit - totalCost;
    });

    function pctChange(current, prev) {
  current = Number(current);
  prev = Number(prev);

  if (!prev && !current) return "0%";
  if (!prev && current) return "▲ 100%";
  if (prev && !current) return "▼ 100%";

  const pct = ((current - prev) / Math.abs(prev)) * 100;
  return (pct >= 0 ? "▲ " : "▼ ") + Math.abs(pct).toFixed(1) + "%";
}

  renderSummaryCards({
  totalRevenue, totalIngredients, totalPackaging, grossProfit,
  prevRevenue, prevCost, prevProfit, orderCount, avgOrderValue, repeatCustomers,
  bestSelling, worstSelling, mostProfitable, pctChange,
  profitPerClient, actualProfit, profitPercent,
  orderDays, orderStreak, noOrderDays,
  prevActualProfit,
  prevProfitPerClient,
  prevProfitPercent,
  dayLimit // <-- add this
});



    renderTopItems(itemsArr);
    renderTopClients(clientMap);
    renderRevenuePerClient(revenuePerClient);
    renderProfitPerClientTable(profitPerClientArr);
    renderExpenseBreakdown(totalIngredients, totalPackaging, grossProfit);
    renderSummaryTable({
      totalRevenue, totalIngredients, totalPackaging, grossProfit,
      orderCount, avgOrderValue, repeatCustomers,
      profitPerClient, actualProfit, profitPercent
    });

    renderCostChart(totalIngredients, totalPackaging, grossProfit);
    renderTrendChart(logsSnap);
    renderLineChart(allItems);

    setLoading(false);
  } catch (err) {
    setError("Failed to load data. Please try again.");
    setLoading(false);
  }
}

async function renderTillDateBarChart() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Fetch all dailyLogs up to today
  const logsSnap = await window.db.collection("dailyLogs")
    .where("date", "<=", todayStr)
    .get();

  let totalRevenue = 0, totalCost = 0;
  logsSnap.forEach(doc => {
    const d = doc.data();
    if (d.items && Array.isArray(d.items)) {
      d.items.forEach(item => {
        totalRevenue += item.revenue || 0;
        totalCost += (item.ingredients || 0) + (item.packaging || 0);
      });
    }
  });

  const ctx = document.getElementById("tillDateBarChart").getContext("2d");
  if (window.tillDateBarChartInstance) window.tillDateBarChartInstance.destroy();
  window.tillDateBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Total Revenue", "Total Cost"],
      datasets: [{
        label: "Amount (₹)",
        data: [totalRevenue, totalCost],
        backgroundColor: ["#60a5fa", "#f87171"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Total Revenue & Cost Till Date",
          font: { size: 18, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
          color: '#374151',
          padding: { top: 10, bottom: 20 }
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const formatted = context.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              return `${context.label}: ₹${formatted}`;
            }
          }
        }
        // REMOVE datalabels config here
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount (₹)" },
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    }
    // REMOVE plugins: [ChartDataLabels] here
  });
}

function renderEmptyState() {
  $("summary-cards").innerHTML = "";
  $("top-sellers-tbody").innerHTML = "";
  $("top-clients-tbody").innerHTML = "";
  $("revenue-per-client-tbody").innerHTML = "";
  $("profit-per-client-tbody").innerHTML = "";
  $("expense-breakdown-tbody").innerHTML = "";
  $("summary-table-tbody").innerHTML = "";
  if (window.costChartInstance) window.costChartInstance.destroy();
  if (window.trendChartInstance) window.trendChartInstance.destroy();
  if (window.lineChartInstance) window.lineChartInstance.destroy();
  setError("No data found for this month.");
}

// --- UI Rendering Functions ---

function renderSummaryCards({
  totalRevenue, totalIngredients, totalPackaging, grossProfit,
  prevRevenue, prevCost, prevProfit, orderCount, avgOrderValue, repeatCustomers,
  bestSelling, worstSelling, mostProfitable, pctChange,
  profitPerClient, actualProfit, profitPercent,
  orderDays, orderStreak, noOrderDays,
  prevActualProfit,
  prevProfitPerClient,
  prevProfitPercent,
  prevOrderCount,
  dayLimit // <-- add this
}) {

  $("summary-cards").innerHTML = `
    <div class="summary-card bg-blue-100 p-4 rounded flex flex-col items-start justify-between cursor-pointer">
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="text-sm font-medium text-blue-700">
  Total Revenue
  ${dayLimit ? `<span class="text-xs text-gray-500">(till day ${dayLimit})</span>` : ""}
</p>
          <p class="text-xl font-bold text-blue-900 flex items-center">
            <span id="dash-revenue">${"₹" + totalRevenue.toFixed(2)}</span>
            <span class="ml-2 text-xs ${totalRevenue - prevRevenue >= 0 ? 'text-green-600' : 'text-red-600'}">${pctChange(totalRevenue, prevRevenue)}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="summary-card bg-red-100 p-4 rounded flex flex-col items-start justify-between cursor-pointer">
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="text-sm font-medium text-red-700">Total Cost</p>
          <p class="text-xl font-bold text-red-900 flex items-center">
            <span id="dash-cost">${"₹" + (totalIngredients + totalPackaging).toFixed(2)}</span>
            <span class="ml-2 text-xs ${totalIngredients + totalPackaging - prevCost >= 0 ? 'text-red-600' : 'text-green-600'}">${pctChange(totalIngredients + totalPackaging, prevCost)}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="summary-card bg-green-100 p-4 rounded flex flex-col items-start justify-between cursor-pointer">
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="text-sm font-medium text-green-700">Gross Profit</p>
          <p class="text-xl font-bold text-green-900 flex items-center">
            <span id="dash-gross">${"₹" + grossProfit.toFixed(2)}</span>
            <span class="ml-2 text-xs ${grossProfit - prevProfit >= 0 ? 'text-green-600' : 'text-red-600'}">${pctChange(grossProfit, prevProfit)}</span>
          </p>
        </div>
      </div>
    </div>
   <div class="summary-card bg-lime-100 p-4 rounded flex flex-col items-start justify-between">
  <div class="flex items-center justify-between w-full">
    <div>
      <p class="text-sm font-medium text-lime-700">Actual Profit</p>
      <p class="text-xl font-bold text-lime-900 flex items-center">
        <span id="dash-actual-profit">₹${actualProfit.toFixed(2)}</span>
        <span class="ml-2 text-xs ${actualProfit - prevActualProfit >= 0 ? 'text-green-600' : 'text-red-600'}">${pctChange(actualProfit, prevActualProfit)}</span>
      </p>
    </div>
  </div>
</div>
    <div class="summary-card bg-cyan-100 p-4 rounded flex flex-col items-start justify-between">
  <div class="flex items-center justify-between w-full">
    <div>
      <p class="text-sm font-medium text-cyan-700">Profit per Client</p>
      <p class="text-xl font-bold text-cyan-900 flex items-center">
        <span id="dash-profit-per-client">₹${profitPerClient.toFixed(2)}</span>
        <span class="ml-2 text-xs ${profitPerClient - prevProfitPerClient >= 0 ? 'text-green-600' : 'text-red-600'}">${pctChange(profitPerClient, prevProfitPerClient)}</span>
      </p>
    </div>
  </div>
</div>
    <div class="summary-card bg-amber-100 p-4 rounded flex flex-col items-start justify-between">
  <div class="flex items-center justify-between w-full">
    <div>
      <p class="text-sm font-medium text-amber-700">Profit %</p>
      <p class="text-xl font-bold text-amber-900 flex items-center">
        <span id="dash-profit-percent">${profitPercent.toFixed(1)}%</span>
        <span class="ml-2 text-xs ${profitPercent - prevProfitPercent >= 0 ? 'text-green-600' : 'text-red-600'}">${pctChange(profitPercent, prevProfitPercent)}</span>
      </p>
    </div>
  </div>
</div>
   <div class="summary-card bg-yellow-100 p-4 rounded flex flex-col items-start justify-between">
  <div class="flex items-center justify-between w-full">
    <div>
      <p class="text-sm font-medium text-yellow-700">Orders</p>
      <p class="text-xl font-bold text-yellow-900">
        <span id="dash-orders">${orderCount}</span>
      </p>
    </div>
  </div>
</div>

    <div class="summary-card bg-pink-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-pink-700">Avg Order Value</p>
      <p class="text-xl font-bold text-pink-900">₹${avgOrderValue.toFixed(2)}</p>
    </div>
    <div class="summary-card bg-green-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-green-700">Repeat Customers</p>
      <p class="text-xl font-bold text-green-900">${repeatCustomers}</p>
    </div>
    <div class="summary-card bg-blue-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-blue-700">Best Seller</p>
      <p class="text-base font-bold text-blue-900">${bestSelling ? bestSelling.name : "N/A"}</p>
      <p class="text-xs text-blue-700">Qty: ${bestSelling ? bestSelling.qty : 0}</p>
    </div>
    <div class="summary-card bg-gray-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-gray-700">Worst Seller</p>
      <p class="text-base font-bold text-gray-900">${worstSelling ? worstSelling.name : "N/A"}</p>
      <p class="text-xs text-gray-700">Qty: ${worstSelling ? worstSelling.qty : 0}</p>
    </div>
    <div class="summary-card bg-orange-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-orange-700">Most Profitable</p>
      <p class="text-base font-bold text-orange-900">${mostProfitable ? mostProfitable.name : "N/A"}</p>
      <p class="text-xs text-orange-700">Profit: ₹${mostProfitable ? mostProfitable.profit.toFixed(2) : 0}</p>
    </div>
    <div class="summary-card bg-indigo-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-indigo-700">Order Days</p>
      <p class="text-xl font-bold text-indigo-900">${orderDays}</p>
      <p class="text-xs text-indigo-700">Days with at least 1 order</p>
    </div>
    <div class="summary-card bg-fuchsia-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-fuchsia-700">Order Streak</p>
      <p class="text-xl font-bold text-fuchsia-900">${orderStreak}</p>
      <p class="text-xs text-fuchsia-700">Longest consecutive days</p>
    </div>
    <div class="summary-card bg-slate-100 p-4 rounded flex flex-col items-start justify-between">
      <p class="text-sm font-medium text-slate-700">No Order Days</p>
      <p class="text-xl font-bold text-slate-900">${noOrderDays}</p>
      <p class="text-xs text-slate-700">Days with zero orders</p>
    </div>    
  `;
}

function renderTopItems(itemsArr) {
  const topItems = itemsArr.slice().sort((a, b) => b.qty - a.qty).slice(0, 3);
  $("top-sellers-tbody").innerHTML = topItems.map(item => `
    <tr>
      <td class="border p-1">${item.name}</td>
      <td class="border p-1">${item.qty}</td>
      <td class="border p-1">₹${item.revenue.toFixed(2)}</td>
    </tr>
  `).join('');
}

function renderTopClients(clientMap) {
  const topClients = Object.entries(clientMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 3);
  $("top-clients-tbody").innerHTML = topClients.map(([name, stats]) => `
    <tr>
      <td class="border p-1">${name}</td>
      <td class="border p-1">${stats.orders}</td>
      <td class="border p-1">₹${stats.revenue.toFixed(2)}</td>
    </tr>
  `).join('');
}

function renderRevenuePerClient(revenuePerClient) {
  $("revenue-per-client-tbody").innerHTML = revenuePerClient.map(c => `
    <tr>
      <td class="border p-1">${c.name}</td>
      <td class="border p-1">₹${c.revenue.toFixed(2)}</td>
    </tr>
  `).join('');
}

function renderProfitPerClientTable(profitPerClientArr) {
  $("profit-per-client-tbody").innerHTML = profitPerClientArr
    .sort((a, b) => b.profit - a.profit)
    .map(client => `
      <tr>
        <td class="border p-1">${client.name}</td>
        <td class="border p-1">₹${client.profit.toFixed(2)}</td>
      </tr>
    `).join('');
}

function renderExpenseBreakdown(ingredients, packaging, grossProfit) {
  $("expense-breakdown-tbody").innerHTML = `
    <tr>
      <td class="border p-1">Ingredients</td>
      <td class="border p-1">₹${ingredients.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="border p-1">Packaging</td>
      <td class="border p-1">₹${packaging.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="border p-1 font-semibold">Gross Profit</td>
      <td class="border p-1 font-semibold">₹${grossProfit.toFixed(2)}</td>
    </tr>
  `;
}

function renderSummaryTable({
  totalRevenue, totalIngredients, totalPackaging, grossProfit,
  orderCount, avgOrderValue, repeatCustomers,
  profitPerClient, actualProfit, profitPercent
}) {
  $("summary-table-tbody").innerHTML = `
    <tr><td class="border p-1">Total Revenue</td><td class="border p-1">₹${totalRevenue.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Total Cost</td><td class="border p-1">₹${(totalIngredients + totalPackaging).toFixed(2)}</td></tr>
    <tr><td class="border p-1">Gross Profit</td><td class="border p-1">₹${grossProfit.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Actual Profit</td><td class="border p-1">₹${actualProfit.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Profit per Client</td><td class="border p-1">₹${profitPerClient.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Profit %</td><td class="border p-1">${profitPercent.toFixed(1)}%</td></tr>
    <tr><td class="border p-1">Ingredients</td><td class="border p-1">₹${totalIngredients.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Packaging</td><td class="border p-1">₹${totalPackaging.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Orders</td><td class="border p-1">${orderCount}</td></tr>
    <tr><td class="border p-1">Avg Order Value</td><td class="border p-1">₹${avgOrderValue.toFixed(2)}</td></tr>
    <tr><td class="border p-1">Repeat Customers</td><td class="border p-1">${repeatCustomers}</td></tr>
  `;
}

// --- Chart Rendering ---

function renderCostChart(ingredients, packaging, profit) {
  const ctx = $("costChart").getContext("2d");
  if (window.costChartInstance) window.costChartInstance.destroy();
  window.costChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Ingredients", "Packaging", "Gross Profit"],
      datasets: [{
        data: [ingredients, packaging, profit],
        backgroundColor: ["#ff4d4d", "#ffcd38", "#33cc99"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#374151',
            font: { size: 13, family: 'Poppins' },
            boxWidth: 15,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ₹${context.parsed.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

function renderTrendChart(logsSnap) {
  const dailyTotals = {};
  logsSnap.forEach(doc => {
    const d = doc.data();
    const date = d.date;
    if (!dailyTotals[date]) dailyTotals[date] = 0;
    if (d.items && Array.isArray(d.items)) {
      d.items.forEach(item => {
        dailyTotals[date] += item.revenue || 0;
      });
    }
  });

  const rawDates = Object.keys(dailyTotals).sort();
  const labels = rawDates.map(dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const data = rawDates.map(date => dailyTotals[date]);
  const peakIndex = data.indexOf(Math.max(...data));

  // Set point colors: orange for peak, blue for others
  const pointColors = labels.map((_, i) => i === peakIndex ? "#f97316" : "#60a5fa");
  const pointRadius = labels.map((_, i) => i === peakIndex ? 7 : 4);

  const ctx = $("trendChart").getContext("2d");
  if (window.trendChartInstance) window.trendChartInstance.destroy();
  window.trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.1)",
        fill: true,
        pointBackgroundColor: pointColors,
        pointRadius: pointRadius,
        pointBorderColor: pointColors,
        pointHoverRadius: 9,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: "Date", color: '#6b7280' },
          ticks: { color: '#374151' }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount (₹)", color: '#6b7280' },
          ticks: { color: '#374151' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Revenue: ₹${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    }
  });

  const legendHtml = `
    <div class="flex items-center gap-4 mt-2 text-xs">
      <span class="flex items-center"><span style="display:inline-block;width:16px;height:10px;background:#f97316;margin-right:4px;border-radius:2px"></span>Highest Revenue Day</span>
      <span class="flex items-center"><span style="display:inline-block;width:16px;height:10px;background:#60a5fa;margin-right:4px;border-radius:2px"></span>Other Days</span>
    </div>
  `;
  const chartContainer = $("trendChart-container");
  let legendDiv = chartContainer.querySelector('.custom-legend');
  if (!legendDiv) {
    legendDiv = document.createElement('div');
    legendDiv.className = 'custom-legend';
    chartContainer.appendChild(legendDiv);
  }
  legendDiv.innerHTML = legendHtml;
}


function renderLineChart(allItems) {
  const dailyMap = {};
  allItems.forEach(item => {
    const date = item.date || "Unknown";
    if (!dailyMap[date]) dailyMap[date] = { revenue: 0, profit: 0 };
    dailyMap[date].revenue += item.revenue || 0;
    dailyMap[date].profit += (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
  });
  const dates = Object.keys(dailyMap).sort();
  const revenues = dates.map(d => dailyMap[d].revenue);
  const profits = dates.map(d => dailyMap[d].profit);

  const ctxLine = $("lineChart").getContext("2d");
  if (window.lineChartInstance) window.lineChartInstance.destroy();
  window.lineChartInstance = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: "Revenue",
          data: revenues,
          borderColor: "#60a5fa",
          backgroundColor: "rgba(96,165,250,0.1)",
          fill: true,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#374151',
            font: { weight: 'bold', size: 13 },
            formatter: function(value) {
              return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
          }
        },
        {
          label: "Profit",
          data: profits,
          borderColor: "#34d399",
          backgroundColor: "rgba(52,211,153,0.1)",
          fill: true,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#374151',
            font: { weight: 'bold', size: 13 },
            formatter: function(value) {
              return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
          }
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        datalabels: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount (₹)" },
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}


// --- CSV Export ---

async function exportDashboardCSV() {
  const month = parseInt($("filter-month").value);
  const year = parseInt($("filter-year").value);
  const datePrefix = `${year}-${String(month).padStart(2, '0')}`;
  const logsSnap = await window.db.collection("dailyLogs")
    .where("date", ">=", `${datePrefix}-01`)
    .where("date", "<=", `${datePrefix}-31`)
    .get();

  let csv = "Date,Client,Item,Qty,Revenue,Ingredients,Packaging,Profit,Notes\n";
  logsSnap.forEach(doc => {
    const d = doc.data();
    (d.items || []).forEach(item => {
      const profit = (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
      csv += [
        d.date,
        `"${d.client || ""}"`,
        `"${item.name || ""}"`,
        item.qty || 0,
        item.revenue || 0,
        item.ingredients || 0,
        item.packaging || 0,
        profit,
        `"${d.notes || ""}"`
      ].join(",") + "\n";
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard_${year}_${String(month).padStart(2, '0')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function renderMonthlyRevenueLineChart() {
  // Fetch all logs
  const logsSnap = await window.db.collection("dailyLogs").get();

  // Prepare monthly totals
  const monthlyTotals = {};
  logsSnap.forEach(doc => {
    const d = doc.data();
    if (!d.date) return;
    const [year, month] = d.date.split('-');
    const key = `${year}-${month}`;
    if (!monthlyTotals[key]) monthlyTotals[key] = 0;
    if (d.items && Array.isArray(d.items)) {
      d.items.forEach(item => {
        monthlyTotals[key] += item.revenue || 0;
      });
    }
  });

  // Sort months
  const sortedKeys = Object.keys(monthlyTotals).sort();
  const labels = sortedKeys.map(key => {
    const [year, month] = key.split('-');
    return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
  });
  const data = sortedKeys.map(key => monthlyTotals[key]);

  // Draw chart
  const ctx = document.getElementById("monthlyRevenueLineChart").getContext("2d");
  if (window.monthlyRevenueLineChartInstance) window.monthlyRevenueLineChartInstance.destroy();
  window.monthlyRevenueLineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Total Revenue",
        data,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.08)",
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointRadius: 5,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#374151',
          font: { weight: 'bold', size: 13 },
          formatter: function(value) {
            // Indian number format
            return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `₹${context.parsed.y.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Revenue (₹)" },
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

async function renderMonthlyOrdersLineChart() {
  // Fetch all logs
  const logsSnap = await window.db.collection("dailyLogs").get();

  // Prepare monthly order counts
  const monthlyOrderCounts = {};
  logsSnap.forEach(doc => {
    const d = doc.data();
    if (!d.date) return;
    const [year, month] = d.date.split('-');
    const key = `${year}-${month}`;
    if (!monthlyOrderCounts[key]) monthlyOrderCounts[key] = 0;
    monthlyOrderCounts[key] += 1;
  });

  // Sort months
  const sortedKeys = Object.keys(monthlyOrderCounts).sort();
  const labels = sortedKeys.map(key => {
    const [year, month] = key.split('-');
    return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
  });
  const data = sortedKeys.map(key => monthlyOrderCounts[key]);

  // Calculate % change for the latest month
  let pctChangeStr = "";
  if (data.length > 1) {
    const prev = data[data.length - 2];
    const curr = data[data.length - 1];
    if (!prev && !curr) pctChangeStr = "0%";
    else if (!prev && curr) pctChangeStr = "▲ 100%";
    else if (prev && !curr) pctChangeStr = "▼ 100%";
    else {
      const pct = ((curr - prev) / Math.abs(prev)) * 100;
      pctChangeStr = (pct >= 0 ? "▲ " : "▼ ") + Math.abs(pct).toFixed(1) + "%";
    }
  }

  // Draw chart
  const ctx = document.getElementById("monthlyOrdersLineChart").getContext("2d");
  if (window.monthlyOrdersLineChartInstance) window.monthlyOrdersLineChartInstance.destroy();
  window.monthlyOrdersLineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Order Count",
        data,
        borderColor: "#f59e42",
        backgroundColor: "rgba(245,158,66,0.08)",
        fill: true,
        pointBackgroundColor: "#f59e42",
        pointRadius: 5,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#374151',
          font: { weight: 'bold', size: 13 },
          formatter: function(value) {
            return value;
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Orders: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Order Count" },
          ticks: { stepSize: 1 }
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  // Show % change below the chart
  const pctDiv = document.getElementById("monthlyOrdersPctChange");
  if (pctDiv) {
    pctDiv.innerHTML = data.length > 1
      ? `<span class="font-semibold">Latest Month % Change:</span> <span class="${pctChangeStr.startsWith('▲') ? 'text-green-600' : 'text-red-600'}">${pctChangeStr}</span>`
      : "";
  }
}

async function renderDailyOrdersAreaChart(month, year, dayLimit = null) {
  // Prepare date range
  const datePrefix = `${year}-${String(month).padStart(2, '0')}`;
  const endDay = dayLimit || new Date(year, month, 0).getDate();
  const endDate = `${datePrefix}-${String(endDay).padStart(2, '0')}`;

  // Fetch logs for the month
  const logsSnap = await window.db.collection("dailyLogs")
    .where("date", ">=", `${datePrefix}-01`)
    .where("date", "<=", endDate)
    .get();

  // Count orders per day
  const orderCountMap = {};
  for (let d = 1; d <= endDay; d++) {
    const dateStr = `${datePrefix}-${String(d).padStart(2, '0')}`;
    orderCountMap[dateStr] = 0;
  }
  logsSnap.forEach(doc => {
    const d = doc.data();
    if (d.date && orderCountMap.hasOwnProperty(d.date)) {
      orderCountMap[d.date]++;
    }
  });

  // Prepare chart data
  const labels = Object.keys(orderCountMap).map(dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  });
  const data = Object.values(orderCountMap);

  // --- Move debug logs here ---
  console.log("Daily Orders Area Chart - labels:", labels);
  console.log("Daily Orders Area Chart - data:", data);

  // Draw area chart
  const ctx = document.getElementById("dailyOrdersAreaChart").getContext("2d");
  if (window.dailyOrdersAreaChartInstance) window.dailyOrdersAreaChartInstance.destroy();
  window.dailyOrdersAreaChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Orders",
        data,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.18)",
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointRadius: 4,
        tension: 0.3,
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#374151',
          font: { weight: 'bold', size: 13 },
          formatter: function(value) {
            return value;
          }
        }
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: { display: true },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Orders: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Order Count" },
          ticks: {
            stepSize: 1
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Add this function to Dashboard.js

async function renderMonthlyRevenueComboChart() {
  const chartId = "monthlyRevenueComboChart";

  // Fetch all logs
  const logsSnap = await window.db.collection("dailyLogs").get();

  // Prepare monthly totals
  const monthlyTotals = {};
  logsSnap.forEach(doc => {
    const d = doc.data();
    if (!d.date) return;
    const [year, month] = d.date.split('-');
    const key = `${year}-${month}`;
    if (!monthlyTotals[key]) monthlyTotals[key] = 0;
    if (d.items && Array.isArray(d.items)) {
      d.items.forEach(item => {
        monthlyTotals[key] += item.revenue || 0;
      });
    }
  });

  // Sort months
  const sortedKeys = Object.keys(monthlyTotals).sort();
  const labels = sortedKeys.map(key => {
    const [year, month] = key.split('-');
    return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
  });
  const revenueData = sortedKeys.map(key => monthlyTotals[key]);

  // Calculate month-on-month difference
  const diffData = revenueData.map((val, idx) => {
    if (idx === 0) return 0;
    return val - revenueData[idx - 1];
  });


  const ctx = document.getElementById(chartId).getContext("2d");
  if (window.monthlyRevenueComboChartInstance) window.monthlyRevenueComboChartInstance.destroy();

  window.monthlyRevenueComboChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: "Revenue",
          data: revenueData,
          backgroundColor: "#6366f1",
          borderRadius: 8,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#374151',
            font: { weight: 'bold', size: 13 },
            formatter: function(value) {
              return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
          }
        },
        {
          type: 'line',
          label: "Difference from Previous Month",
          data: diffData,
          borderColor: "#34d399",
          backgroundColor: "rgba(52,211,153,0.1)",
          fill: false,
          pointBackgroundColor: "#34d399",
          pointRadius: 5,
          tension: 0.3,
          datalabels: {
            anchor: 'end',
            align: 'bottom',
            color: '#34d399',
            font: { weight: 'bold', size: 13 },
            formatter: function(value) {
              // Show + or - sign
              const sign = value > 0 ? "+" : value < 0 ? "−" : "";
              return sign + '₹' + Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
          }
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        datalabels: { display: true },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.dataset.label === "Revenue") {
                return `Revenue: ₹${context.parsed.y.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
              } else {
                const sign = context.parsed.y > 0 ? "+" : context.parsed.y < 0 ? "−" : "";
                return `Difference: ${sign}₹${Math.abs(context.parsed.y).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
              }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount (₹)" },
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Call this function after your dashboard loads
// Example: await renderMonthlyRevenueComboChart();



