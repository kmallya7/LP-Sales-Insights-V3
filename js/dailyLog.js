// js/dailyLogs.js

/**
 * Modern Daily Logs Manager Script (2025 UI/UX)
 * - All original features preserved.
 * - UI/UX upgraded for a sleek, modern experience.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Helper: Format date as "30-Jun-2025" ---
  function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${parseInt(day, 10)}-${months[parseInt(month, 10) - 1]}-${year}`;
  }

  // --- 1. Render the Daily Logs UI Section ---
  const dailyLogSection = document.getElementById("dailyLog");
  dailyLogSection.innerHTML = `
    <!-- Loading Spinner -->
    <div id="loading-spinner" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm hidden">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
    </div>
    <!-- Floating Add Entry Button (Mobile) -->
    <button id="fab-add-entry" class="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full shadow-lg p-4 text-2xl hover:bg-blue-700 transition hidden md:hidden" title="Add Entry">
      +
    </button>
    <!-- Summary Cards Layer -->
<section class="max-w-5xl mx-auto mt-8 mb-8">
  <div class="flex flex-col sm:flex-row gap-6">
    <!-- Revenue Card -->
    <div class="flex-1 p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in bg-green-100 transition hover:scale-105">
      <span class="text-sm font-semibold text-green-700 tracking-wide">Revenue</span>
      <span id="summary-revenue" class="text-2xl font-extrabold text-green-900 mt-2">₹0.00</span>
    </div>
    <!-- Cost Card -->
    <div class="flex-1 p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in bg-red-100 transition hover:scale-105">
      <span class="text-sm font-semibold text-red-700 tracking-wide">Cost</span>
      <span id="summary-cost" class="text-2xl font-extrabold text-red-900 mt-2">₹0.00</span>
    </div>
    <!-- Profit Card -->
    <div class="flex-1 p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in bg-green-200 transition hover:scale-105">
      <span class="text-sm font-semibold text-green-800 tracking-wide">Profit</span>
      <span id="summary-profit" class="text-2xl font-extrabold text-green-900 mt-2">₹0.00</span>
    </div>
  </div>
</section>
<style>
  .animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1);
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95);}
    to { opacity: 1; transform: translateY(0) scale(1);}
  }
</style>


    <!-- Main Section: Header + Entry Form -->
    <section class="max-w-5xl mx-auto p-4">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">📒</span>
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight" style="font-family: 'Inter', sans-serif;">Daily Logs</h2>
      </div>
      <p class="text-base text-gray-500 mb-6">Track your daily sales and expenses with ease.</p>
      <div class="flex flex-col md:flex-row gap-10">
        <div class="flex-1 glass-card rounded-2xl shadow-2xl p-6 space-y-7 border border-gray-100">
          <form id="daily-log-form" class="space-y-6">

<div class="flex flex-row gap-4 justify-center items-center w-full mb-2">
  <div class="flex flex-col flex-1">
    <label for="log-date" class="text-xs text-gray-600 mb-1 font-medium">Date</label>
    <input type="date" id="log-date" class="p-2 border rounded-xl text-sm text-center focus:ring-2 focus:ring-blue-400 transition" required />
  </div>
  <div class="flex flex-col flex-1">
    <label for="client" class="text-xs text-gray-600 mb-1 font-medium">Client/Order Name</label>
    <input type="text" id="client" placeholder="Client/Order Name" class="p-2 border rounded-xl text-sm text-center focus:ring-2 focus:ring-blue-400 transition" required />
  </div>
  <div class="flex flex-col flex-1">
    <label for="invoice-number" class="text-xs text-gray-600 mb-1 font-medium">Invoice Number</label>
    <input type="text" id="invoice-number" placeholder="e.g. INV-2025-00123" class="p-2 border rounded-xl text-sm text-center focus:ring-2 focus:ring-blue-400 transition" />
  </div>
</div>

            <div>
              <div class="font-semibold text-gray-700 mb-2 text-base">Items</div>
              <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table id="items-table" class="w-full text-sm">
                  <thead>
                    <tr class="bg-gradient-to-r from-blue-50 to-blue-100">
                      <th class="p-2">Item</th>
                      <th class="p-2">Qty</th>
                      <th class="p-2">Revenue</th>
                      <th class="p-2">Ingredients</th>
                      <th class="p-2">Packaging</th>
                      <th class="p-2"></th>
                    </tr>
                  </thead>
                  <tbody id="items-tbody"></tbody>
                </table>
              </div>
              <div class="flex mt-3">
                <button type="button" id="add-item-row" class="ml-auto px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow hover:bg-blue-700 active:scale-95 transition w-full sm:w-auto">
                  + Add Item
                </button>
              </div>
            </div>
            <div>
              <label for="calculatedProfit" class="block text-sm text-gray-600 mb-1 font-medium">Calculated Profit</label>
              <input type="number" id="calculatedProfit" class="w-full p-2 border rounded-xl bg-green-50 text-green-800 font-semibold text-base" readonly />
            </div>
            <div>
  <button type="button" id="toggle-notes" class="text-blue-600 text-sm hover:underline font-medium transition flex items-center gap-1">
    <span id="notes-icon">📝</span> <span id="notes-label">Show Notes</span>
  </button>
  <textarea
    id="notes"
    placeholder="Notes (Optional)"
    class="w-full p-3 border-2 border-yellow-300 bg-yellow-50 rounded-xl mt-2 text-sm shadow transition-all duration-300 ease-in-out hidden focus:outline-none focus:ring-2 focus:ring-yellow-400"
    style="min-height: 80px;"
  ></textarea>
</div>

            <div class="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3">
  <!-- Add Entry (default visible) -->
  <button
    type="submit"
    id="btn-add-entry"
    data-action="add"
    class="flex-1 sm:flex-none min-w-[180px] bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow hover:bg-blue-900 active:scale-95 transition"
  >
    <span>+</span> Add Entry
  </button>

  <!-- Update Entry (hidden until editing) -->
  <button
    type="submit"
    id="btn-update-entry"
    data-action="update"
    class="flex-1 sm:flex-none min-w-[180px] bg-gradient-to-r from-green-700 to-green-500 text-white py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow hover:bg-green-800 active:scale-95 transition hidden"
  >
    ⟳ Update Entry
  </button>

  <!-- New Entry (switches back to add mode) -->
  <button
    type="button"
    id="btn-new-entry"
    class="flex-1 sm:flex-none min-w-[180px] bg-gray-200 text-gray-800 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-300 active:scale-95 transition"
    title="Start a fresh entry"
  >
    ✚ New Entry
  </button>
</div>


          </form>
        </div>
      </div>
    </section>
    <section id="entries-layer" class="max-w-5xl mx-auto mt-10">
      <div class="glass-card rounded-2xl shadow-2xl p-6 border border-gray-100">
        <div class="flex flex-col gap-4 mb-6">
  <!-- Title row -->
  <div class="flex items-center gap-2">
    <h3 class="text-lg font-bold">Entries for</h3>
    <span id="log-date-display" class="text-blue-700 font-semibold">[Filter]</span>
  </div>

  <!-- Filters grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <!-- Month -->
    <div class="flex items-center gap-2">
      <label for="summary-month" class="text-sm text-gray-600 font-medium">View Month:</label>
      <input
        type="month"
        id="summary-month"
        class="p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 transition w-full"
      />
    </div>

    <!-- Date -->
    <div class="flex items-center gap-2">
      <label for="summary-date" class="text-sm text-gray-600 font-medium">Date:</label>
      <input
        type="date"
        id="summary-date"
        class="p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 transition w-full"
      />
    </div>

    <!-- Client search -->
    <div class="flex items-center gap-2">
      <label for="client-search" class="text-sm text-gray-600 font-medium">Client:</label>
      <input
        type="text"
        id="client-search"
        placeholder="Search by client name..."
        class="p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 transition w-full"
      />
    </div>

    <!-- Invoice filter -->
    <div class="flex items-center gap-2">
      <label for="invoice-filter" class="text-sm text-gray-600 font-medium">Invoice:</label>
      <select id="invoice-filter" class="p-2 border rounded-xl text-sm w-full">
        <option value="all" selected>All</option>
        <option value="not">Not Invoiced</option>
        <option value="yes">Invoiced</option>
      </select>
      <span id="not-invoiced-count" class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded whitespace-nowrap">Not Invoiced: 0</span>
    </div>
  </div>
</div>


        </div>
<div id="log-entries" class="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border overflow-x-auto">No entries found. Add your first entry above!</div>
      </div>
    </section>
    <div id="confirm-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm hidden">
      <div class="glass-card bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
        <div class="text-2xl mb-4">⚠️</div>
        <div class="text-lg font-semibold mb-4">Are you sure you want to delete this entry?</div>
        <div class="flex justify-center gap-4">
          <button id="confirm-delete" class="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 active:scale-95 transition">Delete</button>
          <button id="cancel-delete" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 active:scale-95 transition">Cancel</button>
        </div>
      </div>
    </div>
    <style>
      .glass-card {
        background: rgba(255,255,255,0.7);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.18);
      }
      body, input, button, textarea, table {
        font-family: 'Inter', sans-serif;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95);}
        to { opacity: 1; transform: scale(1);}
      }
    </style>
  `;

  // --- 2. State Variables ---
  let editingId = null;
  let lastSelectedMonth = null;
  let lastSelectedDate = null;
  let allMonthEntries = [];
  let allDateEntries = [];
  let currentFilter = "month"; // or "date"
  let deleteEntryId = null;
  let deleteEntryDate = null;
  const db = firebase.firestore();


  // --- 3. Helper: Show/Hide Loading Spinner ---
  function showLoading(show = true) {
    document.getElementById("loading-spinner").classList.toggle("hidden", !show);
  }

  // --- 4. Helper: Add a new item row to the items table ---
  function addItemRow(item = {}) {
    const tbody = document.getElementById('items-tbody');
    const tr = document.createElement('tr');
    tr.className = "hover:bg-blue-50 transition";
    tr.innerHTML = `
      <td><input type="text" class="item-name p-1 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 transition" value="${item.name || ''}" required></td>
      <td><input type="number" class="item-qty p-1 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 transition" value="${item.qty || ''}" min="1" required /></td>
      <td><input type="number" class="item-revenue p-1 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 transition" value="${item.revenue || ''}" min="0" step="0.01" required /></td>
      <td><input type="number" class="item-ingredients p-1 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 transition" value="${item.ingredients || ''}" min="0" step="0.01" required /></td>
      <td><input type="number" class="item-packaging p-1 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 transition" value="${item.packaging || ''}" min="0" step="0.01" required /></td>
      <td>
        <button type="button" class="remove-item text-red-500 text-lg" title="Remove Item">
          <span class="hover:scale-125 transition" aria-label="Remove">🗑️</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
    updateProfit();
  }

  // --- 5. Helper: Ensure at least one item row exists ---
  function ensureAtLeastOneItemRow() {
    const tbody = document.getElementById('items-tbody');
    if (tbody.children.length === 0) addItemRow();
  }

  // --- 6. Event: Add item row button ---
  document.getElementById('add-item-row').addEventListener('click', () => addItemRow());

  // --- 7. Event: Remove item row button (delegated) ---
  document.getElementById('items-tbody').addEventListener('click', function(e) {
    if (e.target.closest('.remove-item')) {
      e.target.closest('tr').remove();
      ensureAtLeastOneItemRow();
      updateProfit();
    }
  });

  // --- 8. Event: Update profit on any item input change (delegated) ---
  document.getElementById('items-tbody').addEventListener('input', function(e) {
    if (
      e.target.classList.contains('item-name') ||
      e.target.classList.contains('item-qty') ||
      e.target.classList.contains('item-revenue') ||
      e.target.classList.contains('item-ingredients') ||
      e.target.classList.contains('item-packaging')
    ) {
      updateProfit();
    }
  });

  // --- 9. Helper: Calculate and update profit field in the form ---
  function updateProfit() {
    const items = Array.from(document.querySelectorAll("#items-tbody tr")).map(row => ({
      name: row.querySelector(".item-name").value,
      qty: parseInt(row.querySelector(".item-qty").value) || 0,
      revenue: parseFloat(row.querySelector(".item-revenue").value) || 0,
      ingredients: parseFloat(row.querySelector(".item-ingredients").value) || 0,
      packaging: parseFloat(row.querySelector(".item-packaging").value) || 0,
    }));
    let totalRevenue = 0, totalCost = 0;
    items.forEach(item => {
      totalRevenue += item.revenue;
      totalCost += item.ingredients + item.packaging;
    });
    const profit = totalRevenue - totalCost;
    const profitInput = document.getElementById("calculatedProfit");
    profitInput.value = profit ? profit.toFixed(2) : "";
    profitInput.placeholder = "Calculated Profit";
  }

  // --- 10. Event: Toggle notes textarea visibility with animation ---
  document.getElementById("toggle-notes").addEventListener("click", function(e) {
  e.preventDefault();
  const notes = document.getElementById("notes");
  notes.classList.toggle("hidden");
  this.innerText = notes.classList.contains("hidden") ? "Show Notes" : "Hide Notes";
});


     // --- 11. Helper: Render entries as a table (for entries list) ---
  async function renderEntriesTable(entries, emptyMsg) {
    if (!entries.length) {
      return emptyMsg || "No entries found. Add your first entry above!";
    }

    // Build a set of client names present in entries for the active view
    const clientNames = new Set(entries.map(e => (e.d.client || "").trim().toLowerCase()).filter(Boolean));

    // Fetch invoices for all those clients within the visible date range (month or date)
    // We’ll do a simple client-name match across all invoices and cache results
    const invoicesByClient = {};
    if (clientNames.size > 0) {
      const allInvoicesSnap = await db.collection("invoices").get();
      allInvoicesSnap.forEach(doc => {
        const data = doc.data();
        const name = (data.client?.name || "").trim().toLowerCase();
        if (!name) return;
        if (!invoicesByClient[name]) invoicesByClient[name] = [];
        invoicesByClient[name].push(data);
      });
    }

    let html = `
      <div class="overflow-x-auto">
      <table class="w-full text-sm border rounded-lg">
        <thead class="sticky top-0 z-10">
          <tr class="bg-gray-100">
            <th class="border p-2">Client</th>
            <th class="border p-2">Date</th>
            <th class="border p-2">Item</th>
            <th class="border p-2">Qty</th>
            <th class="border p-2">Revenue (₹)</th>
            <th class="border p-2">Ingredients (₹)</th>
            <th class="border p-2">Packaging (₹)</th>
            <th class="border p-2">Profit (₹)</th>
<th class="border p-2">Notes</th>
<th class="border p-2">Invoice No.</th>
<th class="border p-2">Invoice Status</th>
<th class="border p-2"></th>

          </tr>
        </thead>
        <tbody>
    `;

    entries.forEach(({ docId, d }, entryIdx) => {
      const clientKey = (d.client || "").trim().toLowerCase();
      const hasInvoiceForClient = (invoicesByClient[clientKey] || []).length > 0;

      (d.items || []).forEach(item => {
        html += `
          <tr class="${entryIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition">
            <td class="border p-2">${d.client || ""}</td>
            <td class="border p-2">${formatDisplayDate(d.date) || ""}</td>
            <td class="border p-2">${item.name || ""}</td>
            <td class="border p-2">${item.qty || ""}</td>
            <td class="border p-2">₹${item.revenue?.toFixed(2) ?? ""}</td>
            <td class="border p-2">₹${item.ingredients?.toFixed(2) ?? ""}</td>
            <td class="border p-2">₹${item.packaging?.toFixed(2) ?? ""}</td>
            <td class="border p-2 text-green-700 font-semibold">₹${((item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0))).toFixed(2)}</td>
            <td class="border p-2">${d.notes || ""}</td>
<td class="border p-2">${d.invoiceNumber || ""}</td>
<td class="border p-2">
  ${hasInvoiceForClient
    ? `<span class="text-green-700 font-bold">Invoiced</span>`
    : `<button onclick="createInvoiceFromDailyLog('${docId}')" class="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-orange-700">Create Invoice</button>`
  }
</td>

            <td class="border p-2 flex gap-2">
              <button onclick="editEntry('${docId}', ${JSON.stringify(d).replace(/"/g, '&quot;')})" class="text-blue-500 hover:text-blue-700 text-base" title="Edit">
                <span class="hover:scale-125 transition" aria-label="Edit">✏️</span>
              </button>
              <button onclick="showDeleteModal('${docId}', '${d.date}')" class="text-red-500 hover:text-red-700 text-base" title="Delete">
                <span class="hover:scale-125 transition" aria-label="Delete">🗑️</span>
              </button>
            </td>
          </tr>
        `;
      });
    });

    html += `</tbody></table></div>`;
    return html;
  }


  // --- 12. Load and display summary and entries for a given month ---
  async function loadMonthlySummary(monthStr) {
  try {
    showLoading(true);
    lastSelectedMonth = monthStr;
    lastSelectedDate = null;
    currentFilter = "month";
    const [year, month] = monthStr.split("-");
    document.getElementById("log-date-display").innerText = `${month ? new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short' }) : ""} ${year}`;
    document.getElementById("summary-month").value = monthStr;
    document.getElementById("summary-date").value = "";

    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, parseInt(month, 10), 0);
    const endDateStr = `${year}-${month}-${String(endDate.getDate()).padStart(2, "0")}`;

    const snapshot = await db.collection("dailyLogs")
      .where("date", ">=", startDate)
      .where("date", "<=", endDateStr)
      .get();

    let totalRevenue = 0, totalCost = 0, totalProfit = 0;
    const entries = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      if (d.items && Array.isArray(d.items)) {
        d.items.forEach(item => {
          totalRevenue += item.revenue || 0;
          totalCost += (item.ingredients || 0) + (item.packaging || 0);
          totalProfit += (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
        });
      }
      entries.push({ docId: doc.id, d });
    });

    allMonthEntries = entries;
    document.getElementById("summary-revenue").innerText = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById("summary-cost").innerText = `₹${totalCost.toFixed(2)}`;
    document.getElementById("summary-profit").innerText = `₹${totalProfit.toFixed(2)}`;
    document.getElementById("log-entries").innerHTML = await renderEntriesTable(entries, "No entries found for this month. Add your first entry above!");
    filterEntriesByClient();
  } catch (err) {
    console.error("Monthly summary failed:", err);
    document.getElementById("log-entries").innerHTML = "Failed to load entries.";
  } finally {
    showLoading(false);
  }
}

  // --- 13. Load and display summary and entries for a given date ---
  async function loadDailySummary(date) {
    showLoading(true);
    lastSelectedDate = date;
    lastSelectedMonth = null;
    currentFilter = "date";
    document.getElementById("log-date-display").innerText = formatDisplayDate(date);
    document.getElementById("summary-date").value = date;
    document.getElementById("summary-month").value = date.slice(0, 7);

    const snapshot = await db.collection("dailyLogs").where("date", "==", date).get();

    let totalRevenue = 0, totalCost = 0, totalProfit = 0;
    const entries = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      if (d.items && Array.isArray(d.items)) {
        d.items.forEach(item => {
          totalRevenue += item.revenue || 0;
          totalCost += (item.ingredients || 0) + (item.packaging || 0);
          totalProfit += (item.revenue || 0) - ((item.ingredients || 0) + (item.packaging || 0));
        });
      }
      entries.push({ docId: doc.id, d });
    });

    allDateEntries = entries;
    document.getElementById("summary-revenue").innerText = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById("summary-cost").innerText = `₹${totalCost.toFixed(2)}`;
    document.getElementById("summary-profit").innerText = `₹${totalProfit.toFixed(2)}`;
document.getElementById("log-entries").innerHTML = await renderEntriesTable(entries, "No entries found for this date. Add your first entry above!");
filterEntriesByClient();
showLoading(false);



  }

  // Keep today's entries visible regardless of invoice filter by reloading the current view first
function applyInvoiceFilterToTable() {
  // If we're in daily view, re-load today's entries to ensure we’re showing the current day first
  if (currentFilter === "date") {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("summary-date").value = today;
    lastSelectedDate = today;
    loadDailySummary(today);
  } else {
    // Month view: reload the current month (from the month control)
    const monthStr = document.getElementById("summary-month").value || new Date().toISOString().slice(0, 7);
    lastSelectedMonth = monthStr;
    loadMonthlySummary(monthStr);
  }

  // After reload, apply the invoice filter to the rendered table
  const table = document.querySelector("#log-entries table");
  if (!table) return;

  const filter = document.getElementById("invoice-filter")?.value || "all";
  let notInvoiced = 0;

  table.querySelectorAll("tbody tr").forEach(row => {
    const statusCell = row.querySelector("td:nth-child(11)");

    const isInvoiced = statusCell?.textContent?.includes("Invoiced");

    const show =
      filter === "all" ? true :
      filter === "yes" ? !!isInvoiced :
      filter === "not" ? !isInvoiced : true;

    row.style.display = show ? "" : "none";
    if (!isInvoiced) notInvoiced += 1;
  });

  const pill = document.getElementById("not-invoiced-count");
  if (pill) pill.textContent = `Not Invoiced: ${notInvoiced}`;
}

document.getElementById("invoice-filter")?.addEventListener("change", applyInvoiceFilterToTable);



  // --- 14. Filter entries by client name in the current view ---
  function filterEntriesByClient() {
    const search = (document.getElementById("client-search")?.value || "").trim().toLowerCase();
    const table = document.querySelector("#log-entries table");
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      const clientCell = row.querySelector("td");
      if (!clientCell) return;
      const client = clientCell.textContent.trim().toLowerCase();
      row.style.display = client.includes(search) ? "" : "none";
    });
  }
  document.getElementById("client-search").addEventListener("input", filterEntriesByClient);

  // --- 15. Event: Change summary month picker (loads summary for selected month) ---
  document.getElementById("summary-month").addEventListener("change", (e) => {
    if (e.target.value) {
      loadMonthlySummary(e.target.value);
    }
  });

  // --- 16. Event: Change summary date picker (loads summary for selected date) ---
  document.getElementById("summary-date").addEventListener("input", (e) => {
  const value = e.target.value;
  if (value) {
    // A specific date selected → switch to daily view
    currentFilter = "date";
    lastSelectedDate = value;
    lastSelectedMonth = null;
    loadDailySummary(value);
  } else {
    // Date cleared → show the current month's full entries
    const monthStr = new Date().toISOString().slice(0, 7);
    currentFilter = "month";
    lastSelectedMonth = monthStr;
    lastSelectedDate = null;
    document.getElementById("summary-month").value = monthStr;
    loadMonthlySummary(monthStr);
  }
});



  // --- 17. Event: Form submit (add or update entry) ---
  document.getElementById("daily-log-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoading(true);

  // Determine action based on clicked button (add/update)
  const action = e.submitter?.dataset?.action || (editingId ? "update" : "add");

  const date = document.getElementById("log-date").value;
  const client = document.getElementById("client").value;
  const notes = document.getElementById("notes").value;
  const invoiceNumber = document.getElementById("invoice-number").value.trim();


  const items = Array.from(document.querySelectorAll("#items-tbody tr")).map(row => ({
    name: row.querySelector(".item-name").value,
    qty: parseInt(row.querySelector(".item-qty").value) || 0,
    revenue: parseFloat(row.querySelector(".item-revenue").value) || 0,
    ingredients: parseFloat(row.querySelector(".item-ingredients").value) || 0,
    packaging: parseFloat(row.querySelector(".item-packaging").value) || 0,
  }));

  let totalRevenue = 0, totalCost = 0;
  items.forEach(item => {
    totalRevenue += item.revenue;
    totalCost += item.ingredients + item.packaging;
  });
  const profit = totalRevenue - totalCost;

  if (action === "update" && editingId) {
  await db.collection("dailyLogs").doc(editingId).update({
    date, client, items, totalRevenue, totalCost, profit, notes, invoiceNumber
  });
  setAddMode();
} else {
  const addResult = await db.collection("dailyLogs").add({
    date, client, items, totalRevenue, totalCost, profit, notes, invoiceNumber, createdAt: new Date()
  });

// Prompt user to create invoice now
const proceed = confirm("Entry added. Create invoice now?");
if (proceed) {
  await window.createInvoiceFromDailyLog(addResult.id);
}

// After add, remain in add mode
setAddMode();
  }

  // Reset form UI
  document.getElementById("daily-log-form").reset();
document.getElementById("items-tbody").innerHTML = "";
document.getElementById("calculatedProfit").value = "";
document.getElementById("invoice-number").value = "";
addItemRow();
const today = new Date().toISOString().split("T")[0];
document.getElementById("log-date").value = today;


  // Reload the current filter (preserve current day or month view)
if (currentFilter === "date") {
  const dayToShow = lastSelectedDate || new Date().toISOString().split("T")[0];
  loadDailySummary(dayToShow);
} else {
  const monthToShow = lastSelectedMonth || new Date().toISOString().slice(0, 7);
  loadMonthlySummary(monthToShow);
}
});

function setUpdateMode() {
  editingId = editingId || null;
  document.getElementById("btn-add-entry")?.classList.add("hidden");
  document.getElementById("btn-update-entry")?.classList.remove("hidden");
}

function setAddMode() {
  editingId = null;
  document.getElementById("btn-update-entry")?.classList.add("hidden");
  document.getElementById("btn-add-entry")?.classList.remove("hidden");
}


  // --- 18. On page load: set today's date and show today's entries by default ---
const today = new Date().toISOString().split("T")[0];
const thisMonth = today.slice(0, 7);
document.getElementById("log-date").value = today;
document.getElementById("summary-month").value = thisMonth;
// Show today's entries in the Date picker view
document.getElementById("summary-date").value = today;

addItemRow();

// Always start by showing today's entries
currentFilter = "date";
lastSelectedDate = today;
lastSelectedMonth = null;
loadDailySummary(today);


  // --- 19. Expose edit and delete functions globally for table buttons ---
  window.editEntry = function (id, data) {
  editingId = id;
  document.getElementById("log-date").value = data.date;
  document.getElementById("client").value = data.client;
  document.getElementById("notes").value = data.notes || "";
  document.getElementById("invoice-number").value = data.invoiceNumber || "";

  document.getElementById("items-tbody").innerHTML = "";
  (data.items || []).forEach(item => addItemRow(item));
  ensureAtLeastOneItemRow();
  document.getElementById("calculatedProfit").value = (data.profit ?? 0).toFixed(2);
  updateProfit();

  // Switch buttons: show Update, hide Add
  setUpdateMode();

  document.getElementById("daily-log-form").scrollIntoView({ behavior: "smooth" });
};

// New Entry button: reset to add mode and clear form
document.getElementById("btn-new-entry").addEventListener("click", () => {
  setAddMode();
  document.getElementById("daily-log-form").reset();
document.getElementById("items-tbody").innerHTML = "";
document.getElementById("calculatedProfit").value = "";
document.getElementById("invoice-number").value = "";
addItemRow();

  // Set date to today for convenience
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("log-date").value = today;
});

// Floating Add Entry FAB: make it a shortcut to New Entry
document.getElementById("fab-add-entry")?.addEventListener("click", () => {
  document.getElementById("btn-new-entry")?.click();
});


  // --- 20. Confirmation Modal for Delete ---
  window.showDeleteModal = function (id, date) {
    deleteEntryId = id;
    deleteEntryDate = date;
    document.getElementById("confirm-modal").classList.remove("hidden");
  };
  document.getElementById("cancel-delete").addEventListener("click", function () {
    document.getElementById("confirm-modal").classList.add("hidden");
    deleteEntryId = null;
    deleteEntryDate = null;
  });
  document.getElementById("confirm-delete").addEventListener("click", async function () {
  if (!deleteEntryId) return;
  showLoading(true);
  await db.collection("dailyLogs").doc(deleteEntryId).delete();
  document.getElementById("confirm-modal").classList.add("hidden");

 // After delete, reload the current filter and keep daily/month view stable
if (currentFilter === "date") {
  const dayToShow = lastSelectedDate || new Date().toISOString().split("T")[0];
  loadDailySummary(dayToShow);
} else {
  const monthToShow = lastSelectedMonth || new Date().toISOString().slice(0, 7);
  loadMonthlySummary(monthToShow);
}

  // Return UI to add mode
  setAddMode();

  showLoading(false);
  deleteEntryId = null;
  deleteEntryDate = null;
});
});


// --- 21. Expose createInvoiceFromDailyLog globally ---
window.createInvoiceFromDailyLog = async function(dailyLogId) {
  const docRef = db.collection("dailyLogs").doc(dailyLogId);
  const doc = await docRef.get();
  if (!doc.exists) return alert("Daily log not found.");
  const d = doc.data();

  // Simple client-name check: if any invoice exists for same client, open All Invoices instead of duplicating
const invSnap = await db.collection("invoices")
  .where("client.name", "==", (d.client || ""))
  .limit(1)
  .get();
if (!invSnap.empty) {
  alert("Invoice already exists for this client. Opening All Invoices.");
  window.location.hash = "#allInvoicesSection";
  return;
}


  // Prefill via localStorage (existing mechanism)
  localStorage.setItem("invoicePrefill", JSON.stringify({
  dailyLogId,
  client: d.client,
  items: d.items,
  date: d.date,
  notes: d.notes,
  total: d.totalRevenue,
  invoiceNumber: d.invoiceNumber || ""
}));


  window.location.hash = "#invoicePrintArea";
  setTimeout(() => {
    if (window.prefillInvoiceFromDailyLog) window.prefillInvoiceFromDailyLog();
  }, 300);
};

