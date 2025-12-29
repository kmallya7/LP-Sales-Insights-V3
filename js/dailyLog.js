// js/dailyLog.js

/**
 * Modern Daily Logs Manager (Unified "Slate" Theme)
 * Updated with Glassmorphism Loader & Aesthetic UI
 * Fixes: Full width table, Minimalist Icons, Notes Display, Dark Mode Support
 */

// --- Global Font Injection ---
if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Helper: Format date ---
  function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${parseInt(day, 10)}-${months[parseInt(month, 10) - 1]}-${year}`;
  }

  // --- 1. Render UI ---
  const dailyLogSection = document.getElementById("dailyLog");
  
  dailyLogSection.innerHTML = `
    <style>
      .font-inter { font-family: 'Inter', sans-serif; }
      
      /* Polished Input Styling (Matches Batch.js) */
      .input-slate {
        background-color: #f8fafc; /* slate-50 */
        border: 1px solid #e2e8f0; /* slate-200 */
        border-radius: 0.75rem; /* rounded-xl */
        padding: 0.75rem 1rem;
        color: #1e293b; /* slate-800 */
        font-weight: 500;
        transition: all 0.2s;
        width: 100%;
        outline: none;
      }
      
      /* Dark Mode Overrides for Input */
      .dark .input-slate {
        background-color: #0f172a; /* slate-900 */
        border-color: #334155; /* slate-700 */
        color: #f8fafc; /* slate-50 */
      }

      .input-slate:focus {
        background-color: #ffffff;
        border-color: #3b82f6; /* blue-500 */
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        transform: translateY(-1px);
      }
      
      .dark .input-slate:focus {
        background-color: #1e293b; /* slate-800 */
        border-color: #3b82f6;
      }
      
      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
    </style>

    <div id="daily-loading" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md hidden transition-opacity duration-300">
      <div class="relative w-16 h-16 mb-4">
         <div class="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
         <img src="assets/Flowr Logo.png" class="relative w-full h-full rounded-full animate-breath shadow-lg">
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 font-semibold animate-pulse tracking-wide">Syncing Daily Logs...</p>
    </div>

    <button id="fab-add-entry" class="fixed bottom-6 right-6 z-40 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl shadow-xl p-4 hover:bg-slate-800 dark:hover:bg-blue-700 transition md:hidden transform active:scale-95" title="Add Entry">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>

    <section class="font-inter max-w-[95%] xl:max-w-7xl mx-auto mt-10 mb-8 px-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-start transition hover:-translate-y-1 hover:shadow-md">
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Total Revenue</span>
          <span id="summary-revenue" class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">₹0.00</span>
        </div>
        <div class="p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-start transition hover:-translate-y-1 hover:shadow-md">
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Total Cost</span>
          <span id="summary-cost" class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">₹0.00</span>
        </div>
        <div class="p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex flex-col items-start transition hover:-translate-y-1 hover:shadow-md">
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Net Profit</span>
          <span id="summary-profit" class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">₹0.00</span>
        </div>
      </div>
    </section>

    <section class="font-inter max-w-[95%] xl:max-w-7xl mx-auto px-4 pb-20">
      <div class="flex items-center gap-3 mb-8">
        <div class="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Daily Logs</h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Track your daily sales, costs, and margins.</p>
        </div>
      </div>

      <div class="flex flex-col xl:flex-row gap-8">
        
        <div class="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <form id="daily-log-form" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex flex-col">
                <label for="log-date" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
                <input type="date" id="log-date" class="input-slate" required />
              </div>
              <div class="flex flex-col">
                <label for="client" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Client Name</label>
                <input type="text" id="client" placeholder="e.g. John Doe" class="input-slate" required />
              </div>
              <div class="flex flex-col">
                <label for="invoice-number" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Invoice # (Opt)</label>
                <input type="text" id="invoice-number" placeholder="INV-001" class="input-slate" />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-end mb-3">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Line Items</span>
              </div>
              <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table id="items-table" class="w-full text-sm text-left">
                  <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th class="px-4 py-3 w-1/3">Item Name</th>
                      <th class="px-4 py-3 w-20">Qty</th>
                      <th class="px-4 py-3">Revenue</th>
                      <th class="px-4 py-3">Cost (Ing)</th>
                      <th class="px-4 py-3">Cost (Pkg)</th>
                      <th class="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody id="items-tbody" class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900"></tbody>
                </table>
              </div>
              <button type="button" id="add-item-row" class="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Item Row
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
               <div>
                  <button type="button" id="toggle-notes" class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span id="notes-label">Add Note</span>
                  </button>
                  <textarea id="notes" placeholder="Additional details..." class="input-slate hidden bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 focus:border-yellow-400 dark:text-yellow-100"></textarea>
               </div>
               <div>
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Est. Profit</label>
                  <input type="number" id="calculatedProfit" class="input-slate bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold" readonly placeholder="0.00" />
               </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
              <button type="submit" id="btn-add-entry" data-action="add" class="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-slate-700 dark:hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Save Entry
              </button>
              
              <button type="submit" id="btn-update-entry" data-action="update" class="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-emerald-700 hover:text-white hidden transition-all flex justify-center items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                Update Entry
              </button>
              
              <button type="button" id="btn-new-entry" class="px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-xl font-semibold transition-colors">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section id="entries-layer" class="font-inter max-w-[95%] xl:max-w-7xl mx-auto mt-2 px-4">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div class="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">History</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Viewing: <span id="log-date-display" class="text-blue-600 dark:text-blue-400">--</span></p>
          </div>
          
          <div class="flex flex-wrap gap-3 w-full lg:w-auto">
            <input type="month" id="summary-month" class="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 outline-none focus:border-blue-500 transition shadow-sm text-slate-600 dark:text-slate-200" />
            <input type="date" id="summary-date" class="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 outline-none focus:border-blue-500 transition shadow-sm text-slate-600 dark:text-slate-200" />
            <input type="text" id="client-search" placeholder="Search Client..." class="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 flex-grow outline-none focus:border-blue-500 transition shadow-sm text-slate-600 dark:text-slate-200" />
            <select id="invoice-filter" class="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 outline-none focus:border-blue-500 transition shadow-sm text-slate-600 dark:text-slate-200">
              <option value="all">All Invoices</option>
              <option value="not">Not Invoiced</option>
              <option value="yes">Verified</option>
            </select>
            <span id="not-invoiced-count" class="hidden"></span>
          </div>
        </div>

        <div id="log-entries" class="p-0 min-h-[200px]"> 
  <div class="flex flex-col items-center justify-center h-[200px] text-slate-400 dark:text-slate-500 text-sm font-medium">
    Loading entries...
  </div>
</div>
    </section>

    <div id="confirm-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900 bg-opacity-60 backdrop-blur-sm hidden transition-all duration-200">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all scale-100 border border-slate-100 dark:border-slate-700">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-bold text-slate-900 dark:text-white text-center mb-2">Delete Entry?</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Are you sure you want to remove this log? This cannot be undone.
        </p>
        <div class="flex gap-3">
          <button id="cancel-delete" class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-sm font-semibold rounded-xl transition">
            Cancel
          </button>
          <button id="confirm-delete" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-md transition">
            Delete
          </button>
        </div>
      </div>
    </div>

    <style>
      #confirm-modal:not(.hidden) { animation: fadeInModal 0.2s ease-out; }
      @keyframes fadeInModal {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    </style>
  `;

  // --- 2. State Variables ---
  let editingId = null;
  let lastSelectedMonth = null;
  let lastSelectedDate = null;
  let currentFilter = "month";
  let deleteEntryId = null;
  let deleteEntryDate = null;
  const db = firebase.firestore();

  // --- 3. Helpers ---
  function showLoading(show = true) {
    const loader = document.getElementById("daily-loading");
    if (show) {
      loader.classList.remove("hidden");
    } else {
      loader.classList.add("hidden");
    }
  }

  function addItemRow(item = {}) {
    const tbody = document.getElementById('items-tbody');
    const tr = document.createElement('tr');
    tr.className = "group hover:bg-slate-50 dark:hover:bg-slate-800 transition";
    tr.innerHTML = `
      <td class="px-4 py-2">
        <input type="text" class="item-name w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-700 dark:text-slate-200 font-medium placeholder-slate-400 dark:placeholder-slate-500" placeholder="Item Name" value="${item.name || ''}" required>
      </td>
      <td class="px-4 py-2">
        <input type="number" class="item-qty w-full min-w-[4rem] bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-700 dark:text-slate-200 font-medium" placeholder="1" value="${item.qty || ''}" min="1" required />
      </td>
      <td class="px-4 py-2">
        <input type="number" class="item-revenue w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-700 dark:text-slate-200 font-medium" placeholder="0.00" value="${item.revenue || ''}" min="0" step="0.01" required />
      </td>
      <td class="px-4 py-2">
        <input type="number" class="item-ingredients w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-500 dark:text-slate-400" placeholder="0.00" value="${item.ingredients || ''}" min="0" step="0.01" required />
      </td>
      <td class="px-4 py-2">
        <input type="number" class="item-packaging w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-500 dark:text-slate-400" placeholder="0.00" value="${item.packaging || ''}" min="0" step="0.01" required />
      </td>
      <td class="px-4 py-2 text-right">
        <button type="button" class="remove-item text-slate-400 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20" title="Remove Item">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
    updateProfit();
  }

  function ensureAtLeastOneItemRow() {
    const tbody = document.getElementById('items-tbody');
    if (tbody.children.length === 0) addItemRow();
  }

  document.getElementById('add-item-row').addEventListener('click', () => addItemRow());

  document.getElementById('items-tbody').addEventListener('click', function(e) {
    if (e.target.closest('.remove-item')) {
      e.target.closest('tr').remove();
      ensureAtLeastOneItemRow();
      updateProfit();
    }
  });

  document.getElementById('items-tbody').addEventListener('input', function(e) {
    if (e.target.matches('.item-name, .item-qty, .item-revenue, .item-ingredients, .item-packaging')) {
      updateProfit();
    }
  });

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
  }

  document.getElementById("toggle-notes").addEventListener("click", function(e) {
    e.preventDefault();
    const notes = document.getElementById("notes");
    notes.classList.toggle("hidden");
    const label = document.getElementById("notes-label");
    label.innerText = notes.classList.contains("hidden") ? "Add Note" : "Hide Note";
  });


  // --- 4. Render Table (Fixed Width) ---
async function renderEntriesTable(entries, emptyMsg) {
  if (!entries.length) {
    return `
      <div class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
         <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-3">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-50"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
         </div>
         <p class="text-sm font-medium">${emptyMsg || "No entries found."}</p>
      </div>`;
  }

  const clientNames = new Set(entries.map(e => (e.d.client || "").trim().toLowerCase()).filter(Boolean));
  const validInvoiceNumbers = new Set();
  const invoicesByClient = {}; 

  try {
    const allInvoicesSnap = await db.collection("invoices").get();
    allInvoicesSnap.forEach(doc => {
      const data = doc.data();
      if (data.invoiceNumber) validInvoiceNumbers.add(data.invoiceNumber.trim());
      const name = (data.client?.name || "").trim().toLowerCase();
      if (name) {
        if (!invoicesByClient[name]) invoicesByClient[name] = [];
        invoicesByClient[name].push(data);
      }
    });
  } catch(e) { console.error("Error fetching invoices", e); }

  // Added 'w-full' to the wrapper div below
  let html = `
    <div class="overflow-x-auto min-h-[300px] w-full"> 
    <table id="main-entries-table" class="w-full text-sm text-left border-collapse">
      <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th class="px-6 py-4 w-1/5">Client</th>
          <th class="px-4 py-4 w-32">Date</th>
          <th class="px-6 py-4 w-1/4">Item & Notes</th>
          <th class="px-4 py-4 text-right">Revenue</th>
          <th class="px-4 py-4 text-right">Cost</th>
          <th class="px-4 py-4 text-right">Profit</th>
          <th class="px-4 py-4 whitespace-nowrap">Invoice #</th>
          <th class="px-4 py-4 text-center">Status</th>
          <th class="px-6 py-4 text-right w-24">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
  `;

  entries.forEach(({ docId, d }) => {
    const clientKey = (d.client || "").trim().toLowerCase();
    const manualInvNum = (d.invoiceNumber || "").trim();
    const isVerified = manualInvNum && validInvoiceNumbers.has(manualInvNum);
    const hasClientMatch = !manualInvNum && (invoicesByClient[clientKey] || []).length > 0;

    let statusHtml = "";
    if (isVerified) {
      statusHtml = `<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">Verified</span>`;
    } else if (manualInvNum && !isVerified) {
      statusHtml = `<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800">Invalid</span>`;
    } else if (hasClientMatch) {
       statusHtml = `<span class="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Has Inv</span>`;
    } else {
       statusHtml = `<button onclick="createInvoiceFromDailyLog('${docId}')" class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline">Create</button>`;
    }

    const noteHtml = d.notes 
      ? `<div class="text-xs text-slate-500 dark:text-slate-500 italic mt-1 line-clamp-1 max-w-[200px]" title="${d.notes}">By: ${d.notes}</div>` 
      : "";

    (d.items || []).forEach((item, index) => {
      const itemRev = item.revenue || 0;
      const totalCost = (item.ingredients || 0) + (item.packaging || 0);
      const itemProf = itemRev - totalCost;
      const displayNote = index === 0 ? noteHtml : "";

      html += `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition group border-b border-slate-50 dark:border-slate-800 last:border-0">
          <td class="px-6 py-4 client-cell font-bold text-slate-700 dark:text-slate-200">${d.client || ""}</td>
          <td class="px-4 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">${formatDisplayDate(d.date) || ""}</td>
          <td class="px-6 py-4 text-slate-700 dark:text-slate-300">
             <div class="font-semibold text-slate-800 dark:text-white">${item.name || "Item"}</div>
             <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Qty: ${item.qty}</span>
                ${displayNote}
             </div>
          </td>
          <td class="px-4 py-4 text-right font-medium text-slate-700 dark:text-slate-200 rev-cell">₹${itemRev.toFixed(2)}</td>
          <td class="px-4 py-4 text-right text-slate-500 dark:text-slate-400 ing-cell" data-full-cost="${totalCost}">₹${totalCost.toFixed(2)}</td>
          <td class="px-4 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 prof-cell">₹${itemProf.toFixed(2)}</td>
          
          <td class="px-4 py-4 text-xs font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">${d.invoiceNumber || "-"}</td>
          
          <td class="px-4 py-4 status-cell text-center">${statusHtml}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-4">
              <button onclick="editEntry('${docId}', ${JSON.stringify(d).replace(/"/g, '&quot;')})" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition transform hover:scale-110" title="Edit">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button onclick="showDeleteModal('${docId}', '${d.date}')" class="text-red-400 hover:text-red-600 transition transform hover:scale-110" title="Delete">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
  });

  html += `</tbody>
      <tfoot class="bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-700">
        <tr>
          <td colspan="3" class="px-6 py-4 text-right uppercase text-xs tracking-wider text-slate-400 dark:text-slate-500">Totals (Visible):</td>
          <td id="tbl-total-revenue" class="px-4 py-4 text-right">₹0.00</td>
          <td id="tbl-total-cost" class="px-4 py-4 text-right">₹0.00</td>
          <td id="tbl-total-profit" class="px-4 py-4 text-right text-emerald-700 dark:text-emerald-400">₹0.00</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
    </div>`;

  return html;
}

  function updateVisibleTotals() {
    const table = document.getElementById("main-entries-table");
    if (!table) return;

    let sumRev = 0, sumCost = 0, sumProf = 0;
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      if (row.style.display !== "none") {
        const parse = (selector) => {
            const txt = row.querySelector(selector)?.textContent?.replace(/[^0-9.-]+/g,"");
            return parseFloat(txt) || 0;
        }
        sumRev += parse(".rev-cell");
        sumCost += (row.querySelector(".ing-cell") ? parseFloat(row.querySelector(".ing-cell").dataset.fullCost) : 0);
        sumProf += parse(".prof-cell");
      }
    });

    const fmt = (num) => "₹" + num.toFixed(2);
    document.getElementById("tbl-total-revenue").textContent = fmt(sumRev);
    document.getElementById("tbl-total-cost").textContent = fmt(sumCost);
    document.getElementById("tbl-total-profit").textContent = fmt(sumProf);
  }

  // --- 5. Data Loading Logic ---
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
          });
        }
        totalProfit = totalRevenue - totalCost;
        entries.push({ docId: doc.id, d });
      });

      document.getElementById("summary-revenue").innerText = `₹${totalRevenue.toFixed(2)}`;
      document.getElementById("summary-cost").innerText = `₹${totalCost.toFixed(2)}`;
      document.getElementById("summary-profit").innerText = `₹${totalProfit.toFixed(2)}`;
      
      document.getElementById("log-entries").innerHTML = await renderEntriesTable(entries, "No entries found for this month.");
      updateVisibleTotals(); 
      filterEntriesByClient(); 
    } catch (err) {
      console.error(err);
      document.getElementById("log-entries").innerHTML = `<div class="p-4 text-red-500 text-center">Failed to load entries.</div>`;
    } finally {
      showLoading(false);
    }
  }

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
        });
      }
      totalProfit = totalRevenue - totalCost;
      entries.push({ docId: doc.id, d });
    });

    document.getElementById("summary-revenue").innerText = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById("summary-cost").innerText = `₹${totalCost.toFixed(2)}`;
    document.getElementById("summary-profit").innerText = `₹${totalProfit.toFixed(2)}`;
    
    document.getElementById("log-entries").innerHTML = await renderEntriesTable(entries, "No entries for this date.");
    updateVisibleTotals();
    filterEntriesByClient();
    showLoading(false);
  }

  function applyInvoiceFilterToTable() {
    const table = document.querySelector("#log-entries table");
    if (!table) return;

    const filter = document.getElementById("invoice-filter")?.value || "all";
    let notInvoiced = 0;

    table.querySelectorAll("tbody tr").forEach(row => {
      const statusCell = row.querySelector(".status-cell");
      const isVerified = statusCell?.textContent?.includes("Verified");
      const clientCell = row.querySelector(".client-cell");
      const clientName = clientCell ? clientCell.textContent.trim().toLowerCase() : "";
      const searchVal = (document.getElementById("client-search")?.value || "").trim().toLowerCase();
      const matchesClient = clientName.includes(searchVal);

      let show = matchesClient; 
      if (show) {
         if (filter === "yes") show = !!isVerified;
         else if (filter === "not") show = !isVerified;
      }
      row.style.display = show ? "" : "none";
      if (!isVerified && matchesClient) notInvoiced += 1;
    });

    const pill = document.getElementById("not-invoiced-count");
    if (pill) {
      if(notInvoiced > 0) {
        pill.textContent = `${notInvoiced} Not Invoiced`;
        pill.className = "ml-auto inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 rounded-full leading-none whitespace-nowrap shadow-sm border border-orange-200 dark:border-orange-800";
        pill.classList.remove("hidden");
      } else {
        pill.classList.add("hidden");
      }
    }
    updateVisibleTotals();
  }

  document.getElementById("invoice-filter")?.addEventListener("change", applyInvoiceFilterToTable);
  document.getElementById("client-search").addEventListener("input", applyInvoiceFilterToTable);
  const filterEntriesByClient = applyInvoiceFilterToTable;

  document.getElementById("summary-month").addEventListener("change", (e) => {
    if (e.target.value) loadMonthlySummary(e.target.value);
  });

  document.getElementById("summary-date").addEventListener("input", (e) => {
    const value = e.target.value;
    if (value) loadDailySummary(value);
    else {
      const monthStr = new Date().toISOString().slice(0, 7);
      loadMonthlySummary(monthStr);
    }
  });


  // --- 6. Form Handlers ---
  document.getElementById("daily-log-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoading(true);

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
      if (confirm("Entry added. Create invoice now?")) {
        await window.createInvoiceFromDailyLog(addResult.id);
      }
      setAddMode();
    }

    document.getElementById("daily-log-form").reset();
    document.getElementById("items-tbody").innerHTML = "";
    document.getElementById("calculatedProfit").value = "";
    addItemRow();
    document.getElementById("log-date").value = new Date().toISOString().split("T")[0];

    // Reload view
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
    document.getElementById("btn-new-entry").innerText = "Cancel Edit";
  }

  function setAddMode() {
    editingId = null;
    document.getElementById("btn-update-entry")?.classList.add("hidden");
    document.getElementById("btn-add-entry")?.classList.remove("hidden");
    document.getElementById("btn-new-entry").innerText = "Reset";
  }

  // --- 7. Init ---
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("log-date").value = today;
  document.getElementById("summary-month").value = today.slice(0, 7);
  document.getElementById("summary-date").value = today;

  addItemRow();
  loadDailySummary(today);


  // --- 8. Global Exports ---
  window.editEntry = function (id, data) {
    editingId = id;
    document.getElementById("log-date").value = data.date;
    document.getElementById("client").value = data.client;
    document.getElementById("notes").value = data.notes || "";
    document.getElementById("invoice-number").value = data.invoiceNumber || "";
    if(data.notes) {
       document.getElementById("notes").classList.remove("hidden");
       document.getElementById("notes-label").innerText = "Hide Note";
    }

    document.getElementById("items-tbody").innerHTML = "";
    (data.items || []).forEach(item => addItemRow(item));
    ensureAtLeastOneItemRow();
    updateProfit();
    setUpdateMode();
    document.getElementById("daily-log-form").scrollIntoView({ behavior: "smooth" });
  };

  document.getElementById("btn-new-entry").addEventListener("click", () => {
    setAddMode();
    document.getElementById("daily-log-form").reset();
    document.getElementById("items-tbody").innerHTML = "";
    document.getElementById("calculatedProfit").value = "";
    addItemRow();
    document.getElementById("log-date").value = new Date().toISOString().split("T")[0];
  });

  document.getElementById("fab-add-entry")?.addEventListener("click", () => {
    document.getElementById("daily-log-form").scrollIntoView({ behavior: "smooth" });
  });

  // Delete Modal
  window.showDeleteModal = function (id, date) {
    deleteEntryId = id;
    deleteEntryDate = date;
    document.getElementById("confirm-modal").classList.remove("hidden");
  };
  document.getElementById("cancel-delete").addEventListener("click", function () {
    document.getElementById("confirm-modal").classList.add("hidden");
  });
  document.getElementById("confirm-delete").addEventListener("click", async function () {
    if (!deleteEntryId) return;
    showLoading(true);
    await db.collection("dailyLogs").doc(deleteEntryId).delete();
    document.getElementById("confirm-modal").classList.add("hidden");
    
    if (currentFilter === "date") {
      const dayToShow = lastSelectedDate || new Date().toISOString().split("T")[0];
      loadDailySummary(dayToShow);
    } else {
      const monthToShow = lastSelectedMonth || new Date().toISOString().slice(0, 7);
      loadMonthlySummary(monthToShow);
    }
    setAddMode();
    showLoading(false);
  });
});

window.createInvoiceFromDailyLog = async function(dailyLogId) {
  const db = firebase.firestore();
  const docRef = db.collection("dailyLogs").doc(dailyLogId);
  const doc = await docRef.get();
  if (!doc.exists) return alert("Daily log not found.");
  const d = doc.data();

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