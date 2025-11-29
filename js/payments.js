/* ========== App Bootstrap (runs after page loads) ==========
   This block initializes the dashboard once the DOM is ready. It grabs the
   #payments container, ensures `window.db` exists (the Firestore instance),
   defines helper functions and finally calls renderPaymentsDashboard() to
   draw the UI.
*/
document.addEventListener("DOMContentLoaded", () => {
  const paymentsSection = document.getElementById("payments");
  const db = window.db;
if (!db) return; // or wait until initialized
// Firestore instance

  // --- Helper: Get current month/year as YYYY-MM ---
  /* --- Helper: getCurrentMonthYear()
     Returns current month in 'YYYY-MM' format. Used as a default filter value.
*/
function getCurrentMonthYear() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  // --- Helper: Get all clients ---
  /* --- Helper: getAllClients()
     Fetches client names from both 'dailyLogs' (sales) and 'payments' collection,
     merges them into a unique sorted list used to populate the Client filter.
*/
async function getAllClients() {
    const salesSnapshot = await db.collection("dailyLogs").get();
    const paymentsSnapshot = await db.collection("payments").get();
    const clients = new Set();
    salesSnapshot.forEach(doc => {
      const d = doc.data();
      if (d.client) clients.add(d.client);
    });
    paymentsSnapshot.forEach(doc => {
      const p = doc.data();
      if (p.client) clients.add(p.client);
    });
    return Array.from(clients).sort();
  }

  // --- Helper: Render summary cards (top) ---
  /* --- Render: Summary Cards (top of dashboard)
     Generates the small KPI cards (Outstanding, Received, Closed, Top Debtor, Fastest Payer)
     as an HTML string. This is purely presentational.
*/
function renderSummaryCards(insights) {
    return `
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[160px] rounded-xl shadow-lg p-5 flex flex-col items-center bg-gradient-to-br from-[#C8AFF0] to-[#F6F2FF]">
          <div class="text-lg font-bold text-black mb-1">₹${insights.totalOutstanding.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
          <div class="text-xs font-medium text-black">Outstanding</div>
        </div>
        <div class="flex-1 min-w-[160px] rounded-xl shadow-lg p-5 flex flex-col items-center bg-gradient-to-br from-[#B9FBC0] to-[#F6F2FF]">
          <div class="text-lg font-bold text-green-700 mb-1">₹${insights.totalReceived.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
          <div class="text-xs font-medium text-black">Received</div>
        </div>
        <div class="flex-1 min-w-[160px] rounded-xl shadow-lg p-5 flex flex-col items-center bg-gradient-to-br from-[#F3F0FF] to-[#C8AFF0]">
          <div class="text-lg font-bold text-black mb-1">${insights.closedCount}</div>
          <div class="text-xs font-medium text-black">Closed Accounts</div>
        </div>
        <div class="flex-1 min-w-[160px] rounded-xl shadow-lg p-5 flex flex-col items-center bg-gradient-to-br from-[#F7D358] to-[#F3F0FF]">
          <div class="text-lg font-bold text-[#3B2F7F] mb-1">${insights.topDebtor || '-'}</div>
          <div class="text-xs font-medium text-[#3B2F7F]">Top Debtor</div>
        </div>
        <div class="flex-1 min-w-[160px] rounded-xl shadow-lg p-5 flex flex-col items-center bg-gradient-to-br from-[#B9FBC0] to-[#F3F0FF]">
          <div class="text-lg font-bold text-[#3B2F7F] mb-1">${insights.fastestPayer || '-'}</div>
          <div class="text-xs font-medium text-[#3B2F7F]">Fastest Payer</div>
        </div>
      </div>
    `;
  }

  // --- Helper: Render attention section ---
  /* --- Render: Needs Attention Section
     Shows a highlighted area for clients that need follow-up (large outstanding or overdue).
*/
function renderAttentionSection(attentionClients) {
    if (!attentionClients.length) return '';
    return `
      <div class="mb-6">
        <div class="rounded-xl shadow-lg p-5 bg-[#FFF3F0] border-2 border-[#F7D358]">
          <div class="text-base font-bold text-[#D7263D] mb-2">⚠️ Needs Attention</div>
          <div class="flex flex-wrap gap-3">
            ${attentionClients.map(c => `
              <div class="rounded-lg bg-[#F7D358] p-3 min-w-[180px] flex flex-col items-center border border-[#3B2F7F]">
                <div class="text-sm font-bold text-[#3B2F7F]">${c.client}</div>
                <div class="text-lg font-extrabold text-[#D7263D]">₹${c.outstanding.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div class="text-xs text-[#3B2F7F]">Overdue by ${c.daysOverdue} days</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- Helper: Render payment trend chart ---
  /* --- Render: Payment Trend Chart Container
     Prepares data for Chart.js and returns the canvas container HTML.
     The actual Chart.js initialization runs later after the HTML is in DOM.
*/
function renderPaymentTrendChart(payments) {
    // Prepare data for Chart.js
    const dates = {};
    payments.forEach(p => {
      if (!p.date || !p.amount) return;
      dates[p.date] = (dates[p.date] || 0) + p.amount;
    });
    const sortedDates = Object.keys(dates).sort();
    const chartLabels = sortedDates;
    const chartData = sortedDates.map(d => dates[d]);

    // Chart container
    return `
      <div class="mb-6">
        <div class="rounded-xl shadow-lg p-5 bg-white">
          <div class="text-base font-bold text-black mb-2">Payment Timeline</div>
          <canvas id="payment-trend-chart" height="80"></canvas>
        </div>
      </div>
    `;
  }

<<<<<<< HEAD
  // --- Helper: Render filter controls (no Apply button, auto-update) ---
  function renderFilterControls(selectedMonthYear, clients, selectedClient, selectedStatus, dateRange) {
=======
// Helper: format YYYY-MM-DD -> DD-MMM-YYYY (e.g., 2025-10-14 -> 14-Oct-2025)
/* --- Helper: formatDisplayDate(isoDateStr)
     Converts 'YYYY-MM-DD' into an easier-to-read format like '14-Oct-2025'.
     Safe to call with missing or unexpected input; will fall back to original value.
*/
function formatDisplayDate(isoDateStr) {
  if (!isoDateStr || typeof isoDateStr !== 'string') return isoDateStr || '';
  // Expect "YYYY-MM-DD"
  const [y, m, d] = isoDateStr.split('-');
  if (!y || !m || !d) return isoDateStr; // fallback if unexpected format
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mmIndex = Math.max(0, Math.min(11, Number(m) - 1));
  return `${String(Number(d)).padStart(2, '0')}-${monthNames[mmIndex]}-${y}`;
}

  /* --- Render: Filter Controls
     Produces the Month, Client, Status and Date range inputs that sit above the table.
     Values are filled from the current selected state.
*/
function renderFilterControls(selectedMonthYear, clients, selectedClient, selectedStatus, dateRange) {
>>>>>>> cd217fa (Payments module and daily log tracking has been improved)
    return `
      <div id="dashboard-filter-form" class="mb-4 flex flex-wrap gap-3 items-center border border-[#C8AFF0] rounded-lg p-3 bg-[#F6F2FF]">
        <label class="font-medium text-gray-700 text-[13px]" for="filter-month">Month:</label>
        <input type="month" id="filter-month" name="month" value="${selectedMonthYear}" class="border rounded px-2 py-1 focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" aria-label="Filter by month" />
        <label class="font-medium text-gray-700 text-[13px]" for="filter-client">Client:</label>
        <select id="filter-client" name="client" class="border rounded px-2 py-1 focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" aria-label="Filter by client">
          <option value="">All</option>
          ${clients.map(c => `<option value="${c}" ${selectedClient === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <label class="font-medium text-gray-700 text-[13px]" for="filter-status">Status:</label>
        <select id="filter-status" name="status" class="border rounded px-2 py-1 focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" aria-label="Filter by status">
          <option value="">All</option>
          <option value="open" ${selectedStatus === 'open' ? 'selected' : ''}>Open</option>
          <option value="closed" ${selectedStatus === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
        <label class="font-medium text-gray-700 text-[13px]" for="filter-date-from">Date Range:</label>
        <input type="date" id="filter-date-from" name="dateFrom" value="${dateRange.from || ''}" class="border rounded px-2 py-1 focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" aria-label="Date from" />
        <span>-</span>
        <input type="date" id="filter-date-to" name="dateTo" value="${dateRange.to || ''}" class="border rounded px-2 py-1 focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" aria-label="Date to" />
<<<<<<< HEAD
      </div>
    `;
  }

  // --- Main render function ---
  async function renderPaymentsDashboard({
    selectedMonthYear = getCurrentMonthYear(),
    selectedClient = "",
    selectedStatus = "",
    dateRange = { from: "", to: "" }
  } = {}) {
    if (!paymentsSection) return;

    // --- Get all clients for filter dropdown ---
    const clients = await getAllClients();

    // --- Get all sales and payments ---
    const salesSnapshot = await db.collection("dailyLogs").get();
    const paymentsSnapshot = await db.collection("payments").get();

    // --- Prepare client totals ---
    const clientTotals = {};
    const paymentsList = [];
    salesSnapshot.forEach(doc => {
      const d = doc.data();
      if (!d.client || !d.date) return;
      // Filter by month/year
      if (selectedMonthYear && !d.date.startsWith(selectedMonthYear)) return;
      if (selectedClient && d.client !== selectedClient) return;
      if (!clientTotals[d.client]) {
        clientTotals[d.client] = { sales: 0, paid: 0, payments: [], salesDates: [] };
      }
      clientTotals[d.client].sales += d.totalRevenue || 0;
      clientTotals[d.client].salesDates.push(d.date);
    });
    paymentsSnapshot.forEach(doc => {
      const p = doc.data();
      if (!p.client || !p.date) return;
      // Filter by month/year
      if (selectedMonthYear && !p.date.startsWith(selectedMonthYear)) return;
      if (selectedClient && p.client !== selectedClient) return;
      // Filter by date range
      if (dateRange.from && p.date < dateRange.from) return;
      if (dateRange.to && p.date > dateRange.to) return;
      if (!clientTotals[p.client]) {
        clientTotals[p.client] = { sales: 0, paid: 0, payments: [], salesDates: [] };
      }
      clientTotals[p.client].paid += p.amount || 0;
      clientTotals[p.client].payments.push({ ...p, id: doc.id });
      paymentsList.push({ ...p, client: p.client });
    });

    // --- Prepare sorted client list ---
    const openAccounts = [];
    const closedAccounts = [];
    Object.entries(clientTotals).forEach(([client, data]) => {
      const outstanding = data.sales - data.paid;
      if (selectedStatus === "open" && outstanding <= 0) return;
      if (selectedStatus === "closed" && outstanding > 0) return;
      if (outstanding > 0) {
        openAccounts.push({ client, ...data, outstanding });
      } else {
        closedAccounts.push({ client, ...data, outstanding });
      }
    });
    openAccounts.sort((a, b) => b.outstanding - a.outstanding);
    closedAccounts.sort((a, b) => a.client.localeCompare(b.client));
    const sortedClients = [...openAccounts, ...closedAccounts];

    // --- Insights calculations ---
    let totalOutstanding = 0;
    let totalReceived = 0;
    let closedCount = closedAccounts.length;
    let topDebtor = openAccounts[0]?.client || "";
    let fastestPayer = "";
    openAccounts.forEach(data => { totalOutstanding += data.outstanding; });
    Object.values(clientTotals).forEach(data => { totalReceived += data.paid; });

    // Fastest payer: client who paid full earliest in the month
    let fastestPayerObj = closedAccounts
      .map(c => ({
        client: c.client,
        lastPaidDate: c.payments.length ? c.payments.sort((a, b) => a.date.localeCompare(b.date)).slice(-1)[0].date : ""
      }))
      .filter(c => c.lastPaidDate)
      .sort((a, b) => a.lastPaidDate.localeCompare(b.lastPaidDate))[0];
    if (fastestPayerObj) fastestPayer = fastestPayerObj.client;

    // --- Attention section: overdue/large outstanding ---
    const today = new Date();
    const attentionClients = openAccounts
      .map(c => {
        // Overdue: last payment > 15 days ago, or outstanding > 10,000
        let lastPaidDate = c.payments.length ? c.payments.sort((a, b) => b.date.localeCompare(a.date))[0].date : "";
        let daysOverdue = lastPaidDate ? Math.floor((today - new Date(lastPaidDate)) / (1000 * 60 * 60 * 24)) : "";
        return {
          client: c.client,
          outstanding: c.outstanding,
          daysOverdue: daysOverdue || "N/A"
        };
      })
      .filter(c => c.outstanding > 10000 || (c.daysOverdue !== "N/A" && c.daysOverdue > 15));

    // --- Render HTML ---
    let html = `
      <div class="max-w-5xl mx-auto py-6 text-[13px]">
        <h2 class="text-2xl font-bold mb-4 text-black flex items-center gap-2">
          <span>💸</span> Payments Dashboard
        </h2>
        ${renderFilterControls(selectedMonthYear, clients, selectedClient, selectedStatus, dateRange)}
        ${renderSummaryCards({ totalOutstanding, totalReceived, closedCount, topDebtor, fastestPayer })}
        ${renderAttentionSection(attentionClients)}
        ${renderPaymentTrendChart(paymentsList)}
        <div class="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table class="min-w-full text-xs text-gray-800">
            <thead>
              <tr style="background: rgba(200, 175, 240, 0.8);" class="uppercase text-[11px] tracking-wider text-black">
                <th class="p-3 text-left">Client</th>
                <th class="p-3 text-right">Total Sales (₹)</th>
                <th class="p-3 text-right">Total Paid (₹)</th>
                <th class="p-3 text-right">Outstanding (₹)</th>
                <th class="p-3 text-center">Log Payment</th>
                <th class="p-3 text-center">History</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (sortedClients.length === 0) {
      html += `
        <tr>
          <td colspan="6" class="p-6 text-center text-gray-400">No client sales or payments found for this filter.</td>
        </tr>
      `;
    } else {
      sortedClients.forEach((data, idx) => {
        html += `
          <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F6F2FF]'} hover:bg-[#E9E0FA] transition">
            <td class="p-3 font-semibold text-black">${data.client}</td>
            <td class="p-3 text-right text-black">₹${data.sales.toLocaleString(undefined, {minimumFractionDigits:2})}</td>
            <td class="p-3 text-right text-green-700 font-semibold">₹${data.paid.toLocaleString(undefined, {minimumFractionDigits:2})}</td>
            <td class="p-3 text-right ${data.outstanding > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}">
              ₹${data.outstanding.toLocaleString(undefined, {minimumFractionDigits:2})}
            </td>
            <td class="p-3 text-center">
              <button class="log-payment-btn bg-[#C8AFF0] text-black px-3 py-1 rounded-md shadow hover:bg-[#b39ddb] focus:outline-none focus:ring-2 focus:ring-[#C8AFF0] transition text-xs" data-client="${data.client}">
                + Payment
              </button>
            </td>
            <td class="p-3 text-center">
              <button class="show-history-btn text-black hover:underline font-medium text-xs" data-client="${data.client}">
                View
              </button>
            </td>
          </tr>
        `;
      });
    }

    html += `
            </tbody>
          </table>
        </div>
        <div id="payment-form-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden"></div>
        <div id="payment-history-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden"></div>
      </div>
    `;

    paymentsSection.innerHTML = html;

    // --- Chart.js: Payment Trend ---
    setTimeout(() => {
      if (window.Chart && document.getElementById('payment-trend-chart')) {
        const ctx = document.getElementById('payment-trend-chart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: paymentsList.map(p => p.date),
            datasets: [{
              label: 'Payments (₹)',
              data: paymentsList.map(p => p.amount),
              borderColor: '#3B2F7F',
              backgroundColor: 'rgba(200,175,240,0.2)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: true }, y: { display: true } }
          }
        });
      }
    }, 300);

    // --- Filter controls events (auto-update on change) ---
    const filterIds = [
      'filter-month',
      'filter-client',
      'filter-status',
      'filter-date-from',
      'filter-date-to'
    ];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = () => {
          const month = document.getElementById('filter-month').value;
          const client = document.getElementById('filter-client').value;
          const status = document.getElementById('filter-status').value;
          const dateFrom = document.getElementById('filter-date-from').value;
          const dateTo = document.getElementById('filter-date-to').value;
          renderPaymentsDashboard({
            selectedMonthYear: month,
            selectedClient: client,
            selectedStatus: status,
            dateRange: { from: dateFrom, to: dateTo }
          });
        };
      }
    });

    // Add event listeners for log payment buttons
    document.querySelectorAll('.log-payment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        showPaymentForm(e.target.dataset.client, selectedMonthYear);
      });
    });

    // Add event listeners for show history buttons
    document.querySelectorAll('.show-history-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        showPaymentHistory(
          e.target.dataset.client,
          clientTotals[e.target.dataset.client]?.payments || []
        );
      });
    });
=======
      </div>
    `;
>>>>>>> cd217fa (Payments module and daily log tracking has been improved)
  }

 // Replace the entire renderPaymentsDashboard function with this
/* ========== Core: renderPaymentsDashboard(options) ==========
     The main function that:
      1. Loads clients, sales and payments from Firestore (via window.db).
      2. Aggregates totals per client for the selected month.
      3. Builds open/closed lists, insights and attention lists.
      4. Renders the dashboard HTML, initializes Chart.js, and wires events.
     IMPORTANT: This function rebuilds the entire dashboard HTML on each change.
*/
async function renderPaymentsDashboard({
  selectedMonthYear = getCurrentMonthYear(),
  selectedClient = "",
  selectedStatus = "",
  dateRange = { from: "", to: "" }
} = {}) {
  if (!paymentsSection) return;

  // --- Get all clients for filter dropdown ---
  const clients = await getAllClients();

  // --- Get all sales and payments ---
  const salesSnapshot = await db.collection("dailyLogs").get();
  const paymentsSnapshot = await db.collection("payments").get();

  // --- Prepare client totals for CURRENT selected month only ---
  const startOfMonth = new Date(`${selectedMonthYear}-01`);
  const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0); // last day of selected month

  function within(dateStr, fromDate, toDate) {
    const d = new Date(dateStr);
    return d >= fromDate && d <= toDate;
  }

  const clientTotals = {};
  const paymentsList = [];

  // Sales: only selected month (use normalized YYYY-MM-DD string and string prefix match)
salesSnapshot.forEach(doc => {
  const d = doc.data();
  if (!d.client) return;
  const dDateStr = typeof d.date === 'string'
  ? d.date
  : (d.date && typeof d.date.toDate === 'function'
      ? d.date.toDate().toISOString().split('T')[0]
      : '');
if (!dDateStr) return;
if (selectedClient && d.client !== selectedClient) return;

const dMonth = dDateStr.slice(0, 7); // "YYYY-MM"
if (dMonth !== selectedMonthYear) return;


  const client = d.client;
  if (!clientTotals[client]) {
    clientTotals[client] = {
      salesCurrent: 0,
      paymentsCurrent: 0,
      payments: [],
      lastPaymentDate: null
    };
  }
  clientTotals[client].salesCurrent += Number(d.totalRevenue || 0);
});


 // Payments (normalize date to YYYY-MM-DD string)
paymentsSnapshot.forEach(doc => {
  const p = doc.data();
  if (!p.client) return;
  if (selectedClient && p.client !== selectedClient) return;

  // Normalize p.date to a YYYY-MM-DD string, whether it is a string or Firestore Timestamp
  const pDateStr = typeof p.date === 'string'
    ? p.date
    : (p.date && typeof p.date.toDate === 'function'
        ? p.date.toDate().toISOString().split('T')[0]
        : '');

  if (!pDateStr) return; // skip if date is missing or unparsable

  const client = p.client;
  if (!clientTotals[client]) {
    clientTotals[client] = {
      salesCurrent: 0,
      paymentsCurrent: 0,
      payments: [],
      lastPaymentDate: null
    };
  }

  // Chart list with existing filters (use normalized string)
  const includeInChart =
    (!selectedMonthYear || pDateStr.startsWith(selectedMonthYear)) &&
    (!dateRange.from || pDateStr >= dateRange.from) &&
    (!dateRange.to || pDateStr <= dateRange.to);

  if (includeInChart) {
  paymentsList.push({ ...p, client, date: pDateStr, amount: Number(p.amount || 0) });
}

  

  // Count payments that belong to the selected month:
const normalizeMonth = (m) => {
  if (!m || typeof m !== 'string') return '';
  // Accept formats like "2025-8" or "2025-08" and normalize to "YYYY-MM"
  const [yy, mm] = m.split('-');
  if (!yy || !mm) return '';
  const norm = `${yy}-${String(Number(mm)).padStart(2, '0')}`;
  return norm;
};

const paymentMonth = pDateStr.slice(0, 7); // "YYYY-MM" from actual date
const normalizedSettlementMonth = normalizeMonth(p.settlementMonth);

const settlesSelectedMonth =
  (normalizedSettlementMonth && normalizedSettlementMonth === selectedMonthYear) ||
  paymentMonth === selectedMonthYear;

if (settlesSelectedMonth) {
  clientTotals[client].paymentsCurrent += Number(p.amount || 0);
}



  // Track last payment date across all time for accurate overdue (compare normalized strings)
  if (!clientTotals[client].lastPaymentDate || pDateStr > clientTotals[client].lastPaymentDate) {
    clientTotals[client].lastPaymentDate = pDateStr;
  }

  // For history modal: store normalized date so sorting and display are consistent
  clientTotals[client].payments.push({ ...p, id: doc.id, date: pDateStr });
});


 // --- Prepare rows (only clients with business in selected month) and compute overall pending ---
const openAccounts = [];
const closedAccounts = [];

Object.entries(clientTotals).forEach(([client, data]) => {
  // Compute all-time totals for this client
  let allTimeSales = 0;
  let allTimePayments = 0;

  salesSnapshot.forEach(doc => {
    const d = doc.data();
    if (!d.client || !d.date) return;
    if (d.client !== client) return;
    allTimeSales += (d.totalRevenue || 0);
  });

  paymentsSnapshot.forEach(doc => {
  const p = doc.data();
  if (!p.client) return;
  if (p.client !== client) return;
  const amt = Number(p.amount || 0);
  if (!Number.isFinite(amt)) return;
  allTimePayments += amt;
});


  const overallPending = Math.max(0, allTimeSales - allTimePayments);
  const currentMonthPending = Math.max(0, (data.salesCurrent - data.paymentsCurrent));

  // Only include clients with business activity in the selected month (sales or payments)
  const hadSalesThisMonth = Number(data.salesCurrent) > 0;
const hadPaymentsThisMonth = Number(data.paymentsCurrent) > 0;
// Include row if either sales or payments targeted this month exist
if (!hadSalesThisMonth && !hadPaymentsThisMonth) return;


  // Apply status filter to current month context
  if (selectedStatus === "open" && currentMonthPending <= 0) return;
  if (selectedStatus === "closed" && currentMonthPending > 0) return;

  const entry = {
    client,
    salesCurrent: data.salesCurrent,
    paymentsCurrent: data.paymentsCurrent,
    payments: data.payments,
    lastPaymentDate: data.lastPaymentDate,
    currentMonthPending,
    overallPending
  };

  if (currentMonthPending > 0) {
    openAccounts.push(entry);
  } else {
    closedAccounts.push(entry);
  }
});

openAccounts.sort((a, b) => b.currentMonthPending - a.currentMonthPending);
closedAccounts.sort((a, b) => a.client.localeCompare(b.client));
const sortedClients = [...openAccounts, ...closedAccounts];

// --- Insights (current month only) ---
let totalOutstanding = 0; // sum of currentMonthPending
let totalReceived = 0;    // sum of paymentsCurrent
let closedCount = closedAccounts.length;
let topDebtor = openAccounts[0]?.client || "";
let fastestPayer = "";

openAccounts.forEach(d => { totalOutstanding += d.currentMonthPending; });
[...openAccounts, ...closedAccounts].forEach(d => { totalReceived += d.paymentsCurrent; });

// Fastest payer: among closed, earliest last payment date in current month
let fastestPayerObj = closedAccounts
  .map(c => ({
    client: c.client,
    lastPaidDate: c.payments
      .filter(p => (typeof p.date === 'string' ? p.date.slice(0, 7) : '') === selectedMonthYear)

      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-1)[0]?.date || ""
  }))
  .filter(c => c.lastPaidDate)
  .sort((a, b) => a.lastPaidDate.localeCompare(b.lastPaidDate))[0];

if (fastestPayerObj) fastestPayer = fastestPayerObj.client;


  // --- Attention section: correct overdue calculation (days since last payment) ---
  const today = new Date();
  const attentionClients = openAccounts
    .map(c => {
      const lastPaidDateStr = c.lastPaymentDate || "";
      const daysOverdue = lastPaidDateStr
        ? Math.floor((today - new Date(lastPaidDateStr)) / (1000 * 60 * 60 * 24))
        : null;

      return {
        client: c.client,
        outstanding: c.currentMonthPending,
        daysOverdue: daysOverdue
      };
    })
    .filter(c =>
      c.outstanding > 0 || (c.daysOverdue !== null && c.daysOverdue > 15)
    )
    .sort((a, b) => {
      if (b.outstanding !== a.outstanding) return b.outstanding - a.outstanding;
      const aOver = a.daysOverdue ?? -1;
      const bOver = b.daysOverdue ?? -1;
      return bOver - aOver;
    });

  // --- Render HTML ---
  let html = `
    <div class="max-w-5xl mx-auto py-6 text-[13px]">
      <h2 class="text-2xl font-bold mb-4 text-black flex items-center gap-2">
        <span></span> Payments Dashboard
      </h2>
      ${renderFilterControls(selectedMonthYear, clients, selectedClient, selectedStatus, dateRange)}
      ${renderSummaryCards({ totalOutstanding, totalReceived, closedCount, topDebtor, fastestPayer })}
      ${renderAttentionSection(attentionClients)}
      ${renderPaymentTrendChart(paymentsList)}
      <div class="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table class="min-w-full text-xs text-gray-800">
          <thead>
  <tr style="background: rgba(200, 175, 240, 0.8);" class="uppercase text-[11px] tracking-wider text-black">
    <th class="p-3 text-center break-words">Client</th>
    <th class="p-3 text-center break-words">
      Sales (₹)<br /><span class="normal-case text-gray-700">This Month</span>
    </th>
    <th class="p-3 text-center break-words">
      Paid (₹)<br /><span class="normal-case text-gray-700">This Month</span>
    </th>
    <th class="p-3 text-center break-words">
      Pending (₹)<br /><span class="normal-case text-gray-700">This Month</span>
    </th>
    <th class="p-3 text-center break-words">
      Overall Pending (₹)<br /><span class="normal-case text-gray-700">All Time</span>
    </th>
    <th class="p-3 text-center break-words">Actions</th>
  </tr>
</thead>
          <tbody>
  `;

  if (sortedClients.length === 0) {
    html += `
      <tr>
        <td colspan="6" class="p-6 text-center text-gray-400">No client sales or payments found for this filter.</td>
      </tr>
    `;
  } else {
   sortedClients.forEach((data, idx) => {
  const pendingBadgeColor =
    data.currentMonthPending > 0 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300';
  const pendingBadgeText =
    data.currentMonthPending > 0 ? 'Pending' : 'Closed';

  html += `
    <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F6F2FF]'} hover:bg-[#E9E0FA] transition">
      <!-- Client -->
      <td class="p-3 text-center">
        <div class="font-semibold text-black">${data.client}</div>
        <div class="text-[11px] text-gray-600">
          ${data.lastPaymentDate ? `Last paid: ${formatDisplayDate(data.lastPaymentDate)}` : 'No payments yet'}
        </div>
        <div class="inline-block mt-1 px-2 py-0.5 text-[11px] border rounded-full ${pendingBadgeColor}">
          ${pendingBadgeText}
        </div>
      </td>

      <!-- Sales (This Month) -->
      <td class="p-3 text-center">
        <div class="text-black font-medium">₹${data.salesCurrent.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
        <div class="text-[11px] text-gray-600">This Month</div>
      </td>

      <!-- Paid (This Month) -->
      <td class="p-3 text-center">
        <div class="text-green-700 font-semibold">₹${data.paymentsCurrent.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
        <div class="text-[11px] text-gray-600">This Month</div>
      </td>

      <!-- Pending (This Month) -->
      <td class="p-3 text-center">
        <div class="${data.currentMonthPending > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}">
          ₹${data.currentMonthPending.toLocaleString(undefined, {minimumFractionDigits:2})}
        </div>
        <div class="text-[11px] text-gray-600">This Month</div>
      </td>

      <!-- Overall Pending (All Time) -->
      <td class="p-3 text-center">
        <div class="${data.overallPending > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}">
          ₹${data.overallPending.toLocaleString(undefined, {minimumFractionDigits:2})}
        </div>
        <div class="text-[11px] text-gray-600">All Time</div>
      </td>

      <!-- Actions -->
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-2">
          <button class="log-payment-btn bg-[#C8AFF0] text-black px-3 py-1 rounded-md shadow hover:bg-[#b39ddb] focus:outline-none focus:ring-2 focus:ring-[#C8AFF0] transition text-xs" data-client="${data.client}">
            + Payment
          </button>
          <button class="show-history-btn text-[#3B2F7F] hover:underline font-medium text-xs" data-client="${data.client}">
            View
          </button>
        </div>
      </td>
    </tr>
  `;
});

  }

  html += `
          </tbody>
        </table>
      </div>
      <div id="payment-form-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden"></div>
      <div id="payment-history-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden"></div>
    </div>
  `;

  paymentsSection.innerHTML = html;

  // --- Chart.js: Payment Trend ---
  setTimeout(() => {
    if (window.Chart && document.getElementById('payment-trend-chart')) {
      const ctx = document.getElementById('payment-trend-chart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: paymentsList.map(p => p.date),
          datasets: [{
            label: 'Payments (₹)',
            data: paymentsList.map(p => p.amount),
            borderColor: '#3B2F7F',
            backgroundColor: 'rgba(200,175,240,0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { display: true }, y: { display: true } }
        }
      });
    }
  }, 300);

  // --- Filter controls events (auto-update on change) ---
  const filterIds = [
    'filter-month',
    'filter-client',
    'filter-status',
    'filter-date-from',
    'filter-date-to'
  ];
  filterIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.onchange = () => {
        const month = document.getElementById('filter-month').value;
        const client = document.getElementById('filter-client').value;
        const status = document.getElementById('filter-status').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;
        renderPaymentsDashboard({
          selectedMonthYear: month,
          selectedClient: client,
          selectedStatus: status,
          dateRange: { from: dateFrom, to: dateTo }
        });
      };
    }
  });

  // Add event listeners for log payment buttons
  document.querySelectorAll('.log-payment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showPaymentForm(e.target.dataset.client, selectedMonthYear);
    });
  });

  // Add event listeners for show history buttons
  document.querySelectorAll('.show-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showPaymentHistory(
        e.target.dataset.client,
        clientTotals[e.target.dataset.client]?.payments || []
      );
    });
  });
}


  // --- Payment form modal (same as before) ---
  /* --- UI: showPaymentForm(client, selectedMonthYear)
     Injects a modal with a form to log a new payment. On submit it writes a new
     document to the 'payments' collection and re-renders the dashboard.
*/
function showPaymentForm(client, selectedMonthYear) {
    const modal = document.getElementById('payment-form-modal');
    let defaultDate = new Date();
    if (selectedMonthYear) {
      const [y, m] = selectedMonthYear.split("-");
      defaultDate = new Date(Number(y), Number(m) - 1, defaultDate.getDate());
    }
    const defaultDateStr = defaultDate.toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative animate-fadeIn border-2 border-[#C8AFF0] text-[13px]">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold" id="close-payment-form" title="Close">&times;</button>
        <h3 class="text-lg font-bold mb-3 text-black">Log Payment for <span class="text-[#C8AFF0]">${client}</span></h3>
        <form id="log-payment-form" class="space-y-3">
  <input type="hidden" name="client" value="${client}" />
  <div>
    <label class="block text-xs font-medium mb-1 text-black" for="payment-date">Date</label>
    <input type="date" name="date" id="payment-date" class="w-full p-1 border rounded focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" required value="${defaultDateStr}" />
  </div>
  <div>
    <label class="block text-xs font-medium mb-1 text-black" for="payment-amount">Amount (₹)</label>
    <input type="number" name="amount" id="payment-amount" class="w-full p-1 border rounded focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" placeholder="Amount" required min="1" />
  </div>
  <div>
    <label class="block text-xs font-medium mb-1 text-black" for="payment-notes">Notes (optional)</label>
    <input type="text" name="notes" id="payment-notes" class="w-full p-1 border rounded focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" placeholder="Notes" />
  </div>
  <div>
    <label class="block text-xs font-medium mb-1 text-black" for="payment-settlement-month">Settle Month (optional)</label>
    <input type="month" name="settlementMonth" id="payment-settlement-month" class="w-full p-1 border rounded focus:ring-2 focus:ring-[#C8AFF0] text-[13px]" value="${selectedMonthYear}" />
    <p class="text-[11px] text-gray-600 mt-1">Use this if the payment settles a past month’s dues (e.g., paying August in September).</p>
  </div>
  <div class="flex gap-2 mt-3">
    <button type="submit" class="flex-1 bg-[#C8AFF0] text-black px-3 py-1 rounded-md shadow hover:bg-[#b39ddb] focus:outline-none focus:ring-2 focus:ring-[#C8AFF0] transition text-xs">Save</button>
    <button type="button" id="cancel-payment-form" class="flex-1 bg-gray-200 text-black px-3 py-1 rounded-md hover:bg-gray-300 transition text-xs">Cancel</button>
  </div>
</form>

      </div>
    `;
    modal.classList.remove('hidden');

    document.getElementById('close-payment-form').onclick =
    document.getElementById('cancel-payment-form').onclick = () => {
      modal.classList.add('hidden');
      modal.innerHTML = '';
    };

    document.getElementById('log-payment-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const client = form.client.value;
      const date = form.date.value;
      const amount = parseFloat(form.amount.value);
      const notes = form.notes.value;
      try {
        const rawSettlementMonth = form.settlementMonth.value || "";
const normalizeMonth = (m) => {
  if (!m || typeof m !== 'string') return '';
  const [yy, mm] = m.split('-');
  if (!yy || !mm) return '';
  return `${yy}-${String(Number(mm)).padStart(2, '0')}`;
};
const settlementMonth = normalizeMonth(rawSettlementMonth);

await db.collection("payments").add({
  client,
  date,           // actual payment date (YYYY-MM-DD)
  amount,
  notes,
  settlementMonth, // normalized "YYYY-MM" or ''
  createdAt: new Date()
});


        modal.classList.add('hidden');
        modal.innerHTML = '';
        renderPaymentsDashboard();
      } catch (err) {
        alert("Failed to save payment: " + err.message);
      }
    };
  }

// --- Payment history modal: always show full list ---
/* --- UI: showPaymentHistory(client, payments)
     Opens a modal that lists all payments for a client (with delete buttons).
     Deletes call Firestore and then refresh the modal from live data.
*/
function showPaymentHistory(client, payments) {
  const modal = document.getElementById('payment-history-modal');

  // Sort newest first and use the full list (no truncation)
  const sorted = (payments || []).slice().sort((a, b) => (a.date > b.date ? -1 : 1));

  let html = `
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative animate-fadeIn border-2 border-[#C8AFF0] text-[13px]">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold" id="close-history-modal" title="Close">&times;</button>
      <h3 class="text-lg font-bold mb-3 text-black">Payment History for <span class="text-[#C8AFF0]">${client}</span></h3>
      <div class="overflow-x-auto" style="max-height: 60vh; overflow-y: auto;">
        <table class="min-w-full text-xs text-gray-800 mb-3">
          <thead>
            <tr style="background: rgba(200, 175, 240, 0.8);" class="uppercase text-[11px] tracking-wider text-black">
              <th class="p-2 text-left">Date</th>
              <th class="p-2 text-right">Amount (₹)</th>
              <th class="p-2 text-left">Notes</th>
              <th class="p-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (sorted.length === 0) {
    html += `<tr><td colspan="4" class="p-4 text-center text-gray-400">No payments logged.</td></tr>`;
  } else {
    sorted.forEach(p => {
      const safeNotes = (p.notes || '').toString();
      const displayNotes = safeNotes.length > 120 ? (safeNotes.slice(0, 117) + '…') : safeNotes;
      html += `
        <tr class="hover:bg-[#F6F2FF] transition payment-history-row">
          <td class="ph-cell ph-left">${formatDisplayDate(p.date)}</td>
          <td class="ph-cell ph-right text-green-700 font-semibold">₹${Number(p.amount || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
          <td class="ph-cell ph-left" title="${safeNotes.replace(/"/g, '&quot;')}">${displayNotes}</td>
          <td class="ph-cell ph-center">
            <button class="delete-payment-btn text-red-600 hover:underline text-xs" data-id="${p.id || ''}">Delete</button>
          </td>
        </tr>
      `;
    });
  }

  html += `
          </tbody>
        </table>
      </div>
      <div class="flex justify-end">
        <button id="close-history-modal-btn" class="bg-gray-200 text-black px-3 py-1 rounded-md hover:bg-gray-300 transition text-xs">Close</button>
      </div>
    </div>
  `;

  modal.innerHTML = html;
  modal.classList.remove('hidden');

  // Close handlers
  document.getElementById('close-history-modal').onclick =
  document.getElementById('close-history-modal-btn').onclick = () => {
    modal.classList.add('hidden');
    modal.innerHTML = '';
  };

  // Delete handlers
  document.querySelectorAll('.delete-payment-btn').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (!id) return alert("Cannot delete: missing payment ID.");
      if (!confirm("Are you sure you want to delete this payment?")) return;
      try {
        await window.db.collection("payments").doc(id).delete();
        // Refresh the modal with updated list by re-fetching from Firestore to ensure full sync
        const snapshot = await window.db.collection("payments").get();
        const refreshed = [];
        snapshot.forEach(doc => {
          const p = doc.data();
          if (p.client !== client) return;
          const dateStr = typeof p.date === 'string'
            ? p.date
            : (p.date && typeof p.date.toDate === 'function'
                ? p.date.toDate().toISOString().split('T')[0]
                : '');
          refreshed.push({ ...p, id: doc.id, date: dateStr });
        });
        showPaymentHistory(client, refreshed);
      } catch (err) {
        alert("Failed to delete payment: " + err.message);
      }
    };
  });
}

  // --- Animation and styles ---
/* --- Styles & small animations injected dynamically
     This block appends CSS rules to the document head for dashboard visuals,
     responsive behavior and small UI tweaks used by the dashboard.
*/
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to   { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn { animation: fadeIn 0.2s; }

  #payments, #payments * {
    font-size: 13px !important;
    line-height: 1.3 !important;
  }
  #payments h2, #payments h3 {
    font-size: 1.1rem !important;
  }

  /* General table cell defaults in dashboard list */
  #payments table th, #payments table td {
    white-space: normal;
    word-break: break-word;
    text-align: center;
    vertical-align: middle;
    padding: 10px 12px;
  }

  /* Payment history modal: compact rows and better alignment */
  #payment-history-modal table th,
  #payment-history-modal table td {
    padding: 6px 8px !important;
    line-height: 1.25 !important;
  }
  #payment-history-modal .ph-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #payment-history-modal .ph-left { text-align: left !important; }
  #payment-history-modal .ph-right { text-align: right !important; }
  #payment-history-modal .ph-center { text-align: center !important; }

  /* Allow notes to wrap if needed when title is present */
  #payment-history-modal td.ph-left[title] {
    white-space: normal;
  }

    /* Wider modal table and adaptive columns */
  #payment-history-modal .payment-history-row .ph-left,
  #payment-history-modal .payment-history-row .ph-right,
  #payment-history-modal .payment-history-row .ph-center {
    max-width: none;
  }
  #payment-history-modal table {
    table-layout: auto;
    width: 100%;
  }
  /* Allow notes more width but keep truncation in-row; full text via title */
  #payment-history-modal td.ph-left[title] {
    white-space: normal;
  }


  @media (max-width: 600px) {
    #payments, #payments * {
      font-size: 12px !important;
    }
    #payments h2, #payments h3 {
      font-size: 1rem !important;
    }
    #dashboard-filter-form {
      flex-direction: column !important;
      gap: 8px !important;
    }
<<<<<<< HEAD
    @media (max-width: 600px) {
      #payments, #payments * {
        font-size: 12px !important;
      }
      #payments h2, #payments h3 {
        font-size: 1rem !important;
      }
      #dashboard-filter-form {
        flex-direction: column !important;
        gap: 8px !important;
      }
    }
    .rounded-xl, .rounded-lg {
      box-shadow: 0 4px 24px 0 rgba(59,47,127,0.10);
    }
    #dashboard-filter-form label {
      margin-bottom: 0 !important;
    }
  `;
=======
    #payment-history-modal table th,
    #payment-history-modal table td {
      padding: 6px !important;
    }
  }

  .rounded-xl, .rounded-lg {
    box-shadow: 0 4px 24px 0 rgba(59,47,127,0.10);
  }
  #dashboard-filter-form label {
    margin-bottom: 0 !important;
  }
`;

>>>>>>> cd217fa (Payments module and daily log tracking has been improved)
  document.head.appendChild(style);

  // Expose the render function globally for navigation
  /* Expose renderPaymentsDashboard globally so other parts of the app can call it */
window.renderPaymentsDashboard = renderPaymentsDashboard;

  // Initial render
  renderPaymentsDashboard();
});

// Full-page payment history renderer
/* ========== Full-page: renderFullPaymentHistoryPage(explicitClient) ==========
     Renders a full page table for a single client's payment history.
     This is useful for deep-dive views and is hooked into hash routing.
*/
async function renderFullPaymentHistoryPage(explicitClient) {
  const hash = window.location.hash || '';
  const isPaymentHistoryRoute = hash.startsWith('#paymentHistory');

  // Allow direct invocation with explicit client even if hash routing isn’t set
  if (!isPaymentHistoryRoute && !explicitClient) return;


  // Ensure Firestore is ready
  const db = window.db;
  if (!db) {
    console.warn('renderFullPaymentHistoryPage: db not ready');
    return;
  }

  const paymentsSection = document.getElementById('payments');
  if (!paymentsSection) {
    console.warn('renderFullPaymentHistoryPage: #payments container not found');
    return;
  }
  // Ensure visible before injecting the full-page table
  paymentsSection.classList.remove('hidden');
  paymentsSection.classList.add('show');

  // Client: prefer explicitClient, else from hash
  let client = explicitClient;
  if (!client) {
    const paramsStr = hash.split('?')[1] || '';
    const params = new URLSearchParams(paramsStr);
    client = params.get('client') || '';
  }
  if (!client) {
    console.warn('renderFullPaymentHistoryPage: missing client');
    return;
  }


  const paymentsContainer = document.getElementById('payments');
  if (!paymentsContainer) return;

  // Fetch payments for this client
  const snapshot = await db.collection('payments').get();
  const rows = [];
  snapshot.forEach(doc => {
    const p = doc.data();
    if (p.client !== client) return;
    const dateStr = typeof p.date === 'string'
      ? p.date
      : (p.date && typeof p.date.toDate === 'function'
          ? p.date.toDate().toISOString().split('T')[0]
          : '');
    rows.push({
      id: doc.id,
      date: dateStr,
      amount: Number(p.amount || 0),
      notes: p.notes || '',
      settlementMonth: p.settlementMonth || ''
    });
  });
  rows.sort((a, b) => (a.date > b.date ? -1 : 1));

  // Render a clean SaaS-like table
  paymentsContainer.innerHTML = `
    <div class="max-w-6xl mx-auto py-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Payment History — ${client}</h2>
        <button id="backToApp" class="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-xs">Back</button>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <div class="text-sm text-gray-600">Total entries: ${rows.length}</div>
        </div>
        <div class="overflow-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-700">
                <th class="px-3 py-2 text-left">Date</th>
                <th class="px-3 py-2 text-right">Amount (₹)</th>
                <th class="px-3 py-2 text-left">Notes</th>
                <th class="px-3 py-2 text-left">Settle Month</th>
                <th class="px-3 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-3 py-2">${r.date ? formatDisplayDate(r.date) : '-'}</td>
                  <td class="px-3 py-2 text-right text-green-700 font-semibold">₹${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td class="px-3 py-2">${r.notes || ''}</td>
                  <td class="px-3 py-2">${r.settlementMonth || '-'}</td>
                  <td class="px-3 py-2 text-center">
                    <button class="delete-payment-btn text-red-600 hover:underline text-xs" data-id="${r.id}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Delete buttons
  document.querySelectorAll('.delete-payment-btn').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (!id) return alert('Cannot delete: missing payment ID.');
      if (!confirm('Are you sure you want to delete this payment?')) return;
      try {
        await db.collection('payments').doc(id).delete();
        renderFullPaymentHistoryPage(); // refresh page
      } catch (err) {
        alert('Failed to delete payment: ' + err.message);
      }
    };
  });

  // Back button
  document.getElementById('backToApp')?.addEventListener('click', () => {
    window.location.hash = '#payments';
    renderPaymentsDashboard();
  });
}

// Router hook: render full history page if hash matches
window.addEventListener('hashchange', () => renderFullPaymentHistoryPage());
window.addEventListener('load', () => renderFullPaymentHistoryPage());
