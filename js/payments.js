// js/payments.js
/**
 * payments.js
 * Logic: Monthly Statement + Calibration + Spaced UI Tabs + Aesthetic UI
 */

// Global state
let paymentsState = {
  clients: [],
  payments: [],
  dailyLogs: [], 
  ledger: [] 
};

// ==========================================
// 1. Initialization & Rendering
// ==========================================

window.renderPaymentsTable = async function() {
  const container = document.getElementById('payments');
  
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  container.innerHTML = `
    <div id="payment-loading" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md hidden transition-opacity duration-300">
      <div class="relative w-16 h-16 mb-4">
         <div class="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
         <img src="assets/Flowr Logo.png" class="relative w-full h-full rounded-full animate-breath shadow-lg">
      </div>
      <p class="text-sm text-slate-500 font-semibold animate-pulse tracking-wide">Reconciling Ledger...</p>
    </div>

    <div class="max-w-7xl mx-auto flex flex-col gap-8 px-4 md:px-8 py-8 animate-fade-in">
      
      <div class="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <i data-feather="book" class="w-6 h-6 text-blue-600"></i> Financial Ledger
          </h1>
          <p class="text-slate-500 text-sm mt-1">Monthly Statement & Carry-over Tracking.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative group">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <i data-feather="calendar" class="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition"></i>
             </div>
             <input type="month" id="ledgerMonthFilter" value="${currentMonth}" 
                    class="pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer hover:border-blue-300 transition"
                    onchange="refreshLedgerData()">
          </div>

          <button onclick="openPaymentModal()" class="group bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-slate-200 flex items-center gap-2 transition-all text-sm font-medium hover:-translate-y-0.5">
            <i data-feather="plus-circle" class="w-4 h-4 text-slate-300 group-hover:text-white transition"></i>
            Record Payment
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <i data-feather="file-text" class="w-3 h-3"></i> Total Billed (Month)
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <h2 class="text-2xl font-bold text-slate-800" id="statMonthlyBilled">₹0.00</h2>
            <span class="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">Daily Logs</span>
          </div>
        </div>
        
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <i data-feather="check-circle" class="w-3 h-3"></i> Collected (Month)
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <h2 class="text-2xl font-bold text-emerald-600" id="statMonthlyCollected">₹0.00</h2>
            <span class="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Received</span>
          </div>
        </div>

        <div class="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <i data-feather="alert-circle" class="w-3 h-3"></i> Total Pending (All Time)
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <h2 class="text-2xl font-bold text-rose-600" id="statTotalOutstanding">₹0.00</h2>
            <span class="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">To Collect</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[500px] flex flex-col">
        
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
          <div class="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl gap-1">
            <button id="tabBalances" onclick="switchPaymentTab('balances')" class="px-5 py-2 text-sm font-bold rounded-lg shadow-sm bg-white text-slate-800 transition-all border border-slate-100 ring-1 ring-black/5">
              Monthly Statement
            </button>
            <button id="tabHistory" onclick="switchPaymentTab('history')" class="px-5 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-all">
              Payment Log
            </button>
          </div>

          <div class="text-xs text-slate-400 italic hidden sm:flex items-center gap-1">
            <i data-feather="info" class="w-3 h-3"></i> Click "Previous Due" amounts to calibrate
          </div>
        </div>

        <div id="paymentTabContent" class="flex-1 overflow-x-auto p-0">
           </div>
      </div>
    </div>

    ${getModalsHTML()}
  `;

  if(window.feather) feather.replace();
  await refreshLedgerData();
};

function getModalsHTML() {
  return `
    <div id="paymentModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-95 opacity-0 border border-white/20" id="paymentModalContent">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold text-slate-800">Record Payment</h3>
            <p class="text-xs text-slate-500 mt-1">Log money received from a client.</p>
          </div>
          <button onclick="closePaymentModal()" class="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition">
            <i data-feather="x" class="w-4 h-4"></i>
          </button>
        </div>
        <form id="paymentForm" onsubmit="handlePaymentSubmit(event)">
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Client</label>
              <div class="relative">
                <select id="payClientSelect" required class="w-full appearance-none text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-700 font-medium">
                    <option value="">Loading...</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <i data-feather="chevron-down" class="w-4 h-4 text-slate-400"></i>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Amount</label>
                <div class="relative">
                   <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span class="text-slate-400 font-semibold">₹</span>
                   </div>
                   <input type="number" id="payAmount" required min="1" step="0.01" 
                          class="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-800" 
                          placeholder="0.00">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Date</label>
                <input type="date" id="payDate" required class="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-600 font-medium">
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Method</label>
              <div class="grid grid-cols-4 gap-2">
                 <select id="payMethod" class="col-span-4 w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700">
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                 </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Notes</label>
              <textarea id="payNotes" rows="2" class="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-600 resize-none" placeholder="Reference No, etc."></textarea>
            </div>
          </div>
          <div class="mt-8 flex gap-3">
             <button type="button" onclick="closePaymentModal()" class="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition">Cancel</button>
             <button type="submit" class="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition transform active:scale-95">Save Payment</button>
          </div>
        </form>
      </div>
    </div>
    
    <div id="updateBilledModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 border border-white/20">
        <div class="flex items-center gap-3 mb-4 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
            <i data-feather="tool" class="w-5 h-5"></i>
            <h3 class="text-sm font-bold uppercase tracking-wide">Calibrate Ledger</h3>
        </div>
        
        <p class="text-xs text-slate-500 mb-6 leading-relaxed px-1">
          The system calculated <strong>₹<span id="modalCurrentCalc" class="text-slate-800">0</span></strong> based on log history.
          Enter the <span class="text-indigo-600 font-bold">True Amount</span> below if this is incorrect (e.g. older debts cleared).
        </p>
        
        <input type="hidden" id="editBilledClientId">
        <input type="hidden" id="editSystemHistory">
        
        <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">True Previous Due</label>
        <div class="relative mb-6">
            <span class="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
            <input type="number" id="editBilledAmount" class="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pl-6 py-2 focus:border-indigo-500 focus:outline-none transition bg-transparent placeholder-slate-200" placeholder="0.00">
        </div>
        
        <div class="flex gap-3">
          <button onclick="document.getElementById('updateBilledModal').classList.add('hidden')" class="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition">Cancel</button>
          <button onclick="saveManualBilled()" class="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">Update</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. Data Logic
// ==========================================

function showLoading(show = true) {
    const loader = document.getElementById("payment-loading");
    if (show) loader.classList.remove("hidden");
    else loader.classList.add("hidden");
}

async function refreshLedgerData() {
  try {
    showLoading(true);
    const monthInput = document.getElementById('ledgerMonthFilter').value; // "YYYY-MM"
    if(!monthInput) { showLoading(false); return; }

    // 1. Calculate Date Ranges
    const [yr, mo] = monthInput.split('-');
    const startOfMonth = `${monthInput}-01`;
    const endOfMonth = new Date(parseInt(yr), parseInt(mo), 0).toISOString().split('T')[0];

    // 2. Fetch Data
    const [clientsSnap, paymentsSnap, logsSnap] = await Promise.all([
      db.collection('clients').get(),
      db.collection('payments').orderBy('date', 'desc').get(),
      db.collection('dailyLogs').get() 
    ]);

    paymentsState.clients = clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    paymentsState.payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    paymentsState.dailyLogs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Process Ledger per Client
    let ledgerMap = {};

    paymentsState.clients.forEach(c => {
      ledgerMap[c.id] = { 
        id: c.id, 
        name: c.name || 'Unknown', 
        manualBilled: parseFloat(c.openingBalance) || 0,
        previousDue: parseFloat(c.openingBalance) || 0,
        monthBilled: 0, 
        monthPaid: 0,
        totalPending: 0,
        pureHistory: 0, 
        isActive: false
      };
    });

    // 4. Process Daily Logs
    paymentsState.dailyLogs.forEach(log => {
      const clientName = (log.client || "").trim();
      const clientObj = paymentsState.clients.find(c => 
        (c.name || "").trim().toLowerCase() === clientName.toLowerCase()
      );

      if (clientObj) {
        const amount = parseFloat(log.totalRevenue || 0);
        const cId = clientObj.id;

        if (log.date < startOfMonth) {
           ledgerMap[cId].previousDue += amount;
           ledgerMap[cId].pureHistory += amount;
        } else if (log.date >= startOfMonth && log.date <= endOfMonth) {
           ledgerMap[cId].monthBilled += amount;
           ledgerMap[cId].isActive = true;
        }
      }
    });

    // 5. Process Payments
    paymentsState.payments.forEach(pay => {
      const cId = pay.clientId;
      const amount = parseFloat(pay.amount || 0);

      if (ledgerMap[cId]) {
        if (pay.date < startOfMonth) {
           ledgerMap[cId].previousDue -= amount;
           ledgerMap[cId].pureHistory -= amount;
        } else if (pay.date >= startOfMonth && pay.date <= endOfMonth) {
           ledgerMap[cId].monthPaid += amount;
           ledgerMap[cId].isActive = true;
        }
      }
    });

    // 6. Calculate Finals
    Object.values(ledgerMap).forEach(item => {
      item.totalPending = (item.previousDue + item.monthBilled) - item.monthPaid;
      if (Math.abs(item.previousDue) > 1 || Math.abs(item.totalPending) > 1 || item.monthBilled > 0 || item.monthPaid > 0) {
        item.isActive = true;
      }
    });

    // 7. Filter & Render
    paymentsState.ledger = Object.values(ledgerMap).filter(item => item.isActive);

    updatePaymentStats(Object.values(ledgerMap));
    
    const isHistory = document.getElementById('tabHistory').classList.contains('bg-white');
    if(isHistory) renderPaymentHistoryTable();
    else renderBalancesTable();
    
    updatePaymentModalDropdown();
    
    if(window.feather) feather.replace();

  } catch (error) {
    console.error("Error loading ledger:", error);
  } finally {
    showLoading(false);
  }
}

function updatePaymentStats(fullLedgerList) {
  let monthBilled = 0;
  let monthPaid = 0;
  let totalOutstanding = 0;

  fullLedgerList.forEach(item => {
    monthBilled += item.monthBilled;
    monthPaid += item.monthPaid;
    totalOutstanding += item.totalPending;
  });

  document.getElementById('statMonthlyBilled').innerText = `₹${monthBilled.toLocaleString('en-IN')}`;
  document.getElementById('statMonthlyCollected').innerText = `₹${monthPaid.toLocaleString('en-IN')}`;
  document.getElementById('statTotalOutstanding').innerText = `₹${totalOutstanding.toLocaleString('en-IN')}`;
}

// Helper: Format Date String YYYY-MM -> "Dec-2025"
function getFormattedMonthLabel() {
  const val = document.getElementById('ledgerMonthFilter').value;
  if(!val) return "Current Month";
  const [y, m] = val.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1);
  return date.toLocaleString('default', { month: 'short' }) + '-' + y;
}

window.switchPaymentTab = function(tabName) {
  const btnBalances = document.getElementById('tabBalances');
  const btnHistory = document.getElementById('tabHistory');
  
  // Style: Active = White Card + Shadow, Inactive = Transparent + Gray Text
  const activeClass = "px-5 py-2 text-sm font-bold rounded-lg shadow-sm bg-white text-slate-800 transition-all border border-slate-100 ring-1 ring-black/5";
  const inactiveClass = "px-5 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-all";

  if (tabName === 'balances') {
    btnBalances.className = activeClass;
    btnHistory.className = inactiveClass;
    renderBalancesTable();
  } else {
    btnHistory.className = activeClass;
    btnBalances.className = inactiveClass;
    renderPaymentHistoryTable();
  }
};

// --- View 1: Monthly Statement ---
function renderBalancesTable() {
  const content = document.getElementById('paymentTabContent');
  const monthLabel = getFormattedMonthLabel();
  const sortedLedger = [...paymentsState.ledger].sort((a, b) => b.totalPending - a.totalPending);

  let html = `
    <table class="w-full text-left border-collapse min-w-[900px]">
      <thead>
        <tr class="text-xs text-slate-400 border-b border-slate-100 uppercase tracking-wider bg-slate-50/50">
          <th class="py-4 px-6 font-semibold w-1/4">Client</th>
          <th class="py-4 px-6 font-semibold text-right text-slate-500">Previous Due</th>
          <th class="py-4 px-6 font-semibold text-right text-indigo-900 bg-indigo-50/30">+ Billed (${monthLabel})</th>
          <th class="py-4 px-6 font-semibold text-right text-emerald-900 bg-emerald-50/30">- Paid (${monthLabel})</th>
          <th class="py-4 px-6 font-semibold text-right w-1/6">Total Pending</th>
          <th class="py-4 px-6 font-semibold text-right">Action</th>
        </tr>
      </thead>
      <tbody class="text-slate-600 text-sm">
  `;

  if (sortedLedger.length === 0) {
    html += `
        <tr><td colspan="6">
            <div class="flex flex-col items-center justify-center py-16 text-slate-400">
               <div class="bg-slate-50 p-4 rounded-full mb-3 border border-slate-100">
                 <i data-feather="check-circle" class="w-8 h-8 opacity-30"></i>
               </div>
               <p class="text-sm font-medium">All balanced! No outstanding dues found.</p>
            </div>
        </td></tr>`;
  } else {
    sortedLedger.forEach(c => {
      const prevDue = c.previousDue.toLocaleString('en-IN');
      const billed = c.monthBilled.toLocaleString('en-IN');
      const paid = c.monthPaid.toLocaleString('en-IN');
      const pending = c.totalPending.toLocaleString('en-IN');
      
      let pendingClass = 'text-slate-600 font-bold';
      if(c.totalPending > 1) pendingClass = 'text-rose-600 font-bold'; 
      else if(c.totalPending < -1) pendingClass = 'text-indigo-600 font-bold';

      html += `
        <tr class="border-b border-slate-50 hover:bg-slate-50/80 transition group">
          <td class="py-4 px-6 font-medium text-slate-800">${c.name}</td>
          
          <td class="py-4 px-6 text-right">
             <div class="cursor-pointer text-slate-500 border-b border-dashed border-slate-300 hover:text-indigo-600 hover:border-indigo-600 inline-block transition"
                  title="Click to Calibrate"
                  onclick="openCalibrationModal('${c.id}', ${c.previousDue}, ${c.pureHistory})">
               ₹${prevDue}
             </div>
          </td>
          
          <td class="py-4 px-6 text-right bg-indigo-50/10 font-medium text-indigo-700">₹${billed}</td>
          <td class="py-4 px-6 text-right bg-emerald-50/10 font-medium text-emerald-700">₹${paid}</td>
          
          <td class="py-4 px-6 text-right text-lg ${pendingClass}">
            ₹${pending}
          </td>
          
          <td class="py-4 px-6 text-right">
            <button onclick="openPaymentModal('${c.id}')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-lg text-xs font-bold transition border border-indigo-200 shadow-sm">
              Pay
            </button>
          </td>
        </tr>
      `;
    });
  }
  html += `</tbody></table>`;
  content.innerHTML = html;
  if(window.feather) feather.replace();
}

// --- View 2: Payment History ---
function renderPaymentHistoryTable() {
  const content = document.getElementById('paymentTabContent');
  const monthInput = document.getElementById('ledgerMonthFilter').value;
  const monthLabel = getFormattedMonthLabel();
  
  const [yr, mo] = monthInput.split('-');
  const startOfMonth = `${monthInput}-01`;
  const endOfMonth = new Date(parseInt(yr), parseInt(mo), 0).toISOString().split('T')[0];
  
  const filteredPayments = paymentsState.payments.filter(pay => {
    return pay.date >= startOfMonth && pay.date <= endOfMonth;
  });

  let html = `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs text-slate-400 border-b border-slate-100 uppercase tracking-wider bg-slate-50/50">
          <th class="py-3 px-6 font-semibold">Date</th>
          <th class="py-3 px-6 font-semibold">Client</th>
          <th class="py-3 px-6 font-semibold">Method</th>
          <th class="py-3 px-6 font-semibold text-right">Amount</th>
          <th class="py-3 px-6 font-semibold text-right">Action</th>
        </tr>
      </thead>
      <tbody class="text-slate-600 text-sm">
  `;

  if (filteredPayments.length === 0) {
    html += `
        <tr><td colspan="5">
            <div class="flex flex-col items-center justify-center py-16 text-slate-400">
               <div class="bg-slate-50 p-4 rounded-full mb-3 border border-slate-100">
                 <i data-feather="credit-card" class="w-8 h-8 opacity-30"></i>
               </div>
               <p class="text-sm font-medium">No payments recorded in ${monthLabel}.</p>
            </div>
        </td></tr>`;
  } else {
    filteredPayments.forEach(pay => {
      html += `
        <tr class="border-b border-slate-50 hover:bg-slate-50/80 transition">
          <td class="py-3 px-6 text-slate-500 font-medium">${pay.date}</td>
          <td class="py-3 px-6 font-bold text-slate-800">${pay.clientName}</td>
          <td class="py-3 px-6">
            <span class="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-500 shadow-sm">${pay.method}</span>
          </td>
          <td class="py-3 px-6 text-right font-bold text-emerald-600 bg-emerald-50/10">+₹${(parseFloat(pay.amount)||0).toLocaleString('en-IN')}</td>
          <td class="py-3 px-6 text-right">
             <button onclick="deletePayment('${pay.id}')" class="text-slate-400 hover:text-rose-600 transition p-2 hover:bg-rose-50 rounded-full" title="Delete Entry">
               <i data-feather="trash-2" class="w-4 h-4"></i>
             </button>
          </td>
        </tr>
      `;
    });
  }
  html += `</tbody></table>`;
  content.innerHTML = html;
  if(window.feather) feather.replace();
}

// ==========================================
// 4. Interaction Logic
// ==========================================

function updatePaymentModalDropdown() {
  const select = document.getElementById('payClientSelect');
  if(!select) return;
  
  let html = `<option value="">Select client...</option>`;
  const sortedClients = [...paymentsState.clients].sort((a,b) => (a.name||'').localeCompare(b.name||''));
  sortedClients.forEach(c => { html += `<option value="${c.id}">${c.name}</option>`; });
  select.innerHTML = html;
}

window.deletePayment = async function(paymentId) {
  if (!confirm("Remove this payment entry? The client's balance will increase.")) return;
  try {
    showLoading(true);
    await db.collection('payments').doc(paymentId).delete();
    new Notyf().success("Entry deleted.");
    refreshLedgerData();
  } catch (error) {
    console.error(error);
    showLoading(false);
    new Notyf().error("Delete failed.");
  }
};

window.openCalibrationModal = function(clientId, currentVal, pureHistory) {
  document.getElementById('editBilledClientId').value = clientId;
  document.getElementById('editSystemHistory').value = pureHistory; 
  document.getElementById('modalCurrentCalc').innerText = currentVal.toLocaleString('en-IN');
  document.getElementById('editBilledAmount').value = currentVal;
  
  const modal = document.getElementById('updateBilledModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if(window.feather) feather.replace();
};

window.saveManualBilled = async function() {
  const clientId = document.getElementById('editBilledClientId').value;
  const targetValue = parseFloat(document.getElementById('editBilledAmount').value) || 0;
  const pureHistory = parseFloat(document.getElementById('editSystemHistory').value) || 0;
  
  // Offset = targetValue - pureHistory.
  const offsetToSave = targetValue - pureHistory;

  try {
    const btn = document.querySelector('#updateBilledModal button:last-child');
    const ogText = btn.innerText;
    btn.innerText = "Calibrating...";
    
    await db.collection('clients').doc(clientId).update({ openingBalance: offsetToSave });
    
    new Notyf().success("Ledger calibrated successfully.");
    document.getElementById('updateBilledModal').classList.add('hidden');
    document.getElementById('updateBilledModal').classList.remove('flex');
    btn.innerText = ogText;
    refreshLedgerData();
  } catch (err) {
    console.error(err);
    new Notyf().error("Update failed.");
  }
};

window.openPaymentModal = function(preselectId = '') {
  updatePaymentModalDropdown();
  const modal = document.getElementById('paymentModal');
  const modalContent = document.getElementById('paymentModalContent');
  const select = document.getElementById('payClientSelect');
  if(preselectId) select.value = preselectId;

  document.getElementById('payDate').valueAsDate = new Date();
  document.getElementById('payAmount').value = '';
  document.getElementById('payNotes').value = '';
  document.getElementById('payMethod').value = 'Cash';
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // Feather icons inside modal
  if(window.feather) feather.replace();

  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
};

window.closePaymentModal = function() {
  const modal = document.getElementById('paymentModal');
  const content = document.getElementById('paymentModalContent');
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 200);
};

window.handlePaymentSubmit = async function(e) {
  e.preventDefault();
  const select = document.getElementById('payClientSelect');
  const amount = parseFloat(document.getElementById('payAmount').value);
  const clientId = select.value;
  const clientName = select.options[select.selectedIndex].text;
  if (!clientId || isNaN(amount)) return;

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="animate-spin inline-block mr-2">⏳</span> Saving...`;
    btn.disabled = true;
    
    await db.collection('payments').add({
      clientId, clientName, amount,
      date: document.getElementById('payDate').value,
      method: document.getElementById('payMethod').value,
      notes: document.getElementById('payNotes').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    new Notyf().success("Payment Recorded!");
    closePaymentModal();
    btn.innerHTML = originalText;
    btn.disabled = false;
    refreshLedgerData();
  } catch (err) {
    new Notyf().error("Error saving.");
    console.error(err);
  }
};