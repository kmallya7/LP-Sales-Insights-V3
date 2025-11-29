// invoices.js

// ===============================
// INVOICE GENERATOR APP MAIN FILE
// ===============================
//
// This file renders the invoice generator UI, handles all logic for
// adding/editing/saving invoices, and manages the "All Invoices" list.
//
// --- SECTIONS ---
// 1. Render Invoice Generator UI
// 2. Add/Remove Invoice Items
// 3. Calculate Totals
// 4. Save Invoice to Firestore
// 5. Download as PNG (dom-to-image)
// 6. Print Invoice
// 7. All Invoices Table (view, print, delete, filter, sort, search, pagination)
// 8. Initial Load
//
// Make sure Firebase is initialized before this script runs!
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // 1. RENDER INVOICE GENERATOR UI
  // ------------------------------
  const invoicePrintArea = document.getElementById("invoicePrintArea");
  if (invoicePrintArea) {
    invoicePrintArea.innerHTML = `
      <!-- Invoice Generator Section -->
      <section class="bg-white p-6 rounded shadow max-w-5xl mx-auto">
        <header class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold text-orange-900">Lush Patisserie</h1>
            <p class="text-sm text-gray-700">Wow By Urban Tree, Medavakkam<br>Chennai, 600100<br>Phone: +91 877 896 7179</p>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-bold text-orange-900 border-b-2 border-orange-300 inline-block">INVOICE</h2>
          </div>
        </header>
        <div class="flex flex-col lg:flex-row print:flex-row justify-between gap-6 bg-gray-50 print:bg-gray-200 p-6 rounded-lg border border-gray-300 print:border-gray-400 mb-6">
          <div class="w-full md:w-1/2 space-y-2">
            <label class="text-sm font-medium text-gray-600">Invoice #</label>
            <input type="text" id="invoiceNumber" class="w-full p-2 border rounded" placeholder="INV-2025-001">
            <label class="text-sm font-medium text-gray-600">Invoice Date</label>
            <input type="date" id="invoiceDate" class="w-full p-2 border rounded">
            <label class="text-sm font-medium text-gray-600">Due Date</label>
            <input type="date" id="dueDate" class="w-full p-2 border rounded">
          </div>
          <div class="w-full md:w-1/2 space-y-2">
            <label class="text-sm font-medium text-gray-600">Bill To</label>
            <input type="text" id="clientName" class="w-full p-2 border rounded" placeholder="Client Name">
            <textarea id="clientAddress" class="w-full p-2 border rounded" placeholder="Client Address"></textarea>
            <input type="text" id="clientPhone" class="w-full p-2 border rounded" placeholder="Client Phone">
            <input type="email" id="clientEmail" class="w-full p-2 border rounded" placeholder="Contact">

          </div>
        </div>
        <table class="w-full text-sm border mb-4">
          <thead class="bg-blue-100 text-gray-800">
            <tr>
              <th class="p-2 border">Item</th>
              <th class="p-2 border">Qty</th>
              <th class="p-2 border">Price (₹)</th>
              <th class="p-2 border">Amount</th>
              <th class="p-2 border print:hidden png-hide">Action</th>
            </tr>
          </thead>
          <tbody id="invoiceItems"></tbody>
        </table>
        <button id="addItemBtn" class="mt-2 mb-6 px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-900 print:hidden png-hide">+ Add Item</button>
        <div class="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <textarea id="invoiceNotes" class="w-full md:w-2/3 p-2 border rounded" placeholder="Notes: payment terms, delivery info, etc."></textarea>
          <div class="bg-yellow-50 print:bg-yellow-100 p-4 rounded shadow-sm md:w-1/3 space-y-2 border border-yellow-200 print:border-yellow-400">
            <div class="flex justify-between text-sm text-gray-800">
              <span>Subtotal:</span>
              <span id="subtotal">₹0.00</span>
            </div>
            <hr class="border-gray-300">
            <div class="flex justify-between text-xl font-bold text-gray-900">
              <span>Invoice Total:</span>
              <span id="total">₹0.00</span>
            </div>
          </div>
        </div>
        <div class="mt-8 text-center print:block avoid-break print:mt-4 print:pb-4">
          <div class="inline-block">
            <p class="text-sm text-gray-600 italic">Signature</p>
            <p class="text-xl mt-2 font-signature">Vaishnavi</p>
            <p class="text-xs text-gray-500">Owner</p>
            <p class="text-base italic text-orange-800 font-medium mt-4">Thank you for your business! ❤️</p>
          </div>
        </div>
      </section>
      <!-- Invoice Actions Section (Save/Print/PNG) -->
      <section id="invoiceActionsSection" class="bg-white p-6 rounded shadow max-w-5xl mx-auto my-6 flex flex-col items-center print:hidden png-hide">
        <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <button id="newInvoiceBtn" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 print:hidden png-hide">New Invoice</button>
          <button id="downloadPngBtn" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 png-hide">Download as PNG</button>
          <button id="printInvoiceBtn" class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 png-hide">Print / Save PDF</button>
          <button id="saveInvoiceBtn" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 print:hidden png-hide">Save Invoice</button>
        </div>
      </section>
      <!-- All Invoices Section -->
      <section id="allInvoicesSection" class="bg-white p-6 rounded shadow max-w-5xl mx-auto mt-10 print:hidden">
  <h2 class="text-xl font-bold mb-4 text-orange-900">All Invoices</h2>
  <div id="invoiceControlsRow" class="flex flex-row gap-4 mb-4 items-end w-full">
    <input
      type="month"
      id="filterMonthYear"
      class="p-2 border rounded flex-1 min-w-[160px] max-w-[200px] h-10"
      style="height: 40px;"
      aria-label="Filter by month"
    />
    <input
      type="text"
      id="invoiceSearchBox"
      class="p-2 border rounded flex-1 min-w-[180px] max-w-[260px] h-10"
      placeholder="Search by invoice #, client, date..."
      style="height: 40px;"
      aria-label="Search invoices"
    />
    <select
      id="sortInvoicesBy"
      class="p-2 border rounded flex-1 min-w-[160px] max-w-[220px] h-10"
      style="height: 40px;"
      aria-label="Sort invoices"
    >
      <option value="invoiceNumber-desc">Invoice # (desc)</option>
      <option value="invoiceNumber-asc">Invoice # (asc)</option>
      <option value="invoiceDate-desc" selected>Date (newest)</option>
      <option value="invoiceDate-asc">Date (oldest)</option>
      <option value="client-asc">Client (A-Z)</option>
      <option value="client-desc">Client (Z-A)</option>
      <option value="total-desc">Total (high-low)</option>
      <option value="total-asc">Total (low-high)</option>
    </select>
  </div>

  <div id="pendingInvoicesCard" class="mt-2 p-3 rounded border bg-orange-50 text-sm">
    <div class="flex items-center justify-between">
      <div><strong>Pending invoices</strong> (Daily Logs not invoiced for this month): <span id="pendingCount">0</span></div>
      <button id="openPendingList" class="px-3 py-1 bg-orange-600 text-white rounded text-xs">Review</button>
    </div>
    <div id="pendingList" class="mt-2 hidden"></div>
  </div>

  <div id="invoicesList" class="overflow-x-auto"></div>
</section>
    `;
  }

  const notyf = new Notyf({
    duration: 2500,
    position: { x: 'Center', y: 'top' }
  });

  // Re-run prefill when arriving via hash navigation (from Daily Logs)
window.addEventListener("hashchange", () => {
  if (window.location.hash.startsWith("#invoicePrintArea")) {
    // Delay slightly to ensure invoice UI is rendered
    setTimeout(() => {
      if (typeof window.prefillInvoiceFromDailyLog === "function") {
        window.prefillInvoiceFromDailyLog();
      }
    }, 100);
  }
});


  // 1A. ADD PRINT-SAFE AND RESPONSIVE CSS
  // -------------------------------------
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      .avoid-break {
        break-inside: avoid;
        page-break-inside: avoid;
        page-break-before: auto;
      }
      .avoid-break * {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
    #filterMonthYear, #invoiceSearchBox, #sortInvoicesBy {
  height: 40px;
  min-width: 160px;
  max-width: 260px;
  font-size: 1rem;
  box-sizing: border-box;
}
#filterMonthYear:focus, #invoiceSearchBox:focus, #sortInvoicesBy:focus {
  border-color: #fb923c;
  box-shadow: 0 0 0 1px #fb923c;
}

    thead {
      position: sticky;
      top: 0;
      background: #f3f4f6;
      z-index: 1;
    }
    #invoiceItems textarea.item-name {
      width: 100%;
      min-height: 2.2em;
      max-height: 12em;
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 1em;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
      resize: none;
      box-sizing: border-box;
      line-height: 1.4;
    }
      .glass-loader {
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  background: rgba(255,255,255,0.6);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  transition: background 0.3s, backdrop-filter 0.3s;
  min-height: 80px;
  min-width: 200px;
  margin: 0 auto;

  .spinner {
  width: 32px;
  height: 32px;
  border: 4px solid rgba(255,255,255,0.5);
  border-top: 4px solid #fb923c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}
#invoicesList {
  overflow-y: visible !important;
  max-height: none !important;
  min-height: unset !important;
  scrollbar-width: none; /* Firefox */
}
#invoicesList::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}


@keyframes spin {
  to { transform: rotate(360deg); }
}

}

  `;
  document.head.appendChild(style);

  // Center invoice on screen and print, and set max width
  const centerInvoiceStyle = document.createElement("style");
  centerInvoiceStyle.innerHTML = `
    #invoicePrintArea > section {
      max-width: 800px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
    }
    @media (max-width: 850px) {
      #invoicePrintArea > section {
        max-width: 98vw;
        margin: 1vw;
      }
    }
    @media print {
      html, body {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      #invoicePrintArea > section {
        width: 190mm !important;
        max-width: 190mm !important;
        min-width: 0 !important;
        margin: 10mm auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        background: white !important;
      }
      .print\\:hidden {
        display: none !important;
      }
      .print\\:block {
        display: block !important;
      }
    }
  `;
  document.head.appendChild(centerInvoiceStyle);

  // 2. ADD/REMOVE INVOICE ITEMS
  // ---------------------------
  const db = firebase.firestore();

  // --- CLIENT AUTOFILL & INVOICE NUMBER AUTOGENERATE ---
  function incrementInvoiceNumber(lastInvoiceNo) {
    // Example: Z-08 → Z-09
    const match = lastInvoiceNo.match(/^([A-Za-z]+)-(\d+)$/);
    if (!match) return ""; // fallback
    const prefix = match[1];
    const num = parseInt(match[2], 10) + 1;
    return `${prefix}-${String(num).padStart(2, "0")}`;
  }

  document.getElementById("clientName").addEventListener("blur", async function() {
    const clientName = this.value.trim();
    if (!clientName) return;

    // 1. Fetch client details from Firestore
    let clientDoc = null;
    try {
      const clientSnap = await db.collection("clients")
        .where("name", "==", clientName)
        .limit(1)
        .get();
      if (!clientSnap.empty) {
        clientDoc = clientSnap.docs[0].data();
        document.getElementById("clientAddress").value = clientDoc.address || "";
        document.getElementById("clientPhone").value = clientDoc.phone || "";
        document.getElementById("clientEmail").value = clientDoc.email || "";
      }
    } catch (err) {
      console.error("Error fetching client:", err);
    }

    // 2. Fetch last invoice for this client
    try {
      const invoiceSnap = await db.collection("invoices")
        .where("client.name", "==", clientName)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
      if (!invoiceSnap.empty) {
        const lastInvoice = invoiceSnap.docs[0].data();
        const lastInvoiceNo = lastInvoice.invoiceNumber || "";
        const newInvoiceNo = incrementInvoiceNumber(lastInvoiceNo);
        if (newInvoiceNo) {
          document.getElementById("invoiceNumber").value = newInvoiceNo;
        }
      } else {
        // If no previous invoice, generate first invoice number
        // Example: Zonkk → Z-01
        const prefix = clientName[0].toUpperCase();
        document.getElementById("invoiceNumber").value = `${prefix}-01`;
      }
    } catch (err) {
      console.error("Error fetching last invoice:", err);
    }
  });

  const itemsBody = document.getElementById("invoiceItems");

  function addRow(item = {}) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border p-1 align-middle">
        <textarea class="item-name" placeholder="Item" rows="1">${item.name || ""}</textarea>
      </td>
      <td class="border p-1 text-center align-middle">
        <input type="number" class="w-full p-1 border rounded qty text-center" value="${item.qty || 1}">
      </td>
      <td class="border p-1 text-center align-middle">
        <input type="number" class="w-full p-1 border rounded price text-center" value="${item.price || 0}">
      </td>
      <td class="border p-1 text-center align-middle text-gray-700 font-semibold amount">₹${item.amount || "0.00"}</td>
      <td class="border p-1 text-center align-middle print:hidden png-hide">
        <button class="text-red-600 deleteBtn png-hide">🗑️</button>
      </td>
    `;
    row.querySelector(".qty").addEventListener("input", updateTotals);
    row.querySelector(".price").addEventListener("input", updateTotals);
    row.querySelector(".deleteBtn").addEventListener("click", () => {
      row.remove();
      updateTotals();
    });

    // --- AUTO-EXPAND TEXTAREA ---
    const itemTextarea = row.querySelector(".item-name");
    function autoExpandTextarea(el) {
      el.style.height = "auto";
      el.style.height = (el.scrollHeight) + "px";
    }
    itemTextarea.addEventListener("input", function() {
      autoExpandTextarea(this);
    });
    // Set initial height
    autoExpandTextarea(itemTextarea);

    itemsBody.appendChild(row);
    updateTotals();
  }

  // Add first row by default
  document.getElementById("addItemBtn").addEventListener("click", () => addRow());
  addRow();

  // 3. CALCULATE TOTALS
  // -------------------
  function updateTotals() {
    let subtotal = 0;
    itemsBody.querySelectorAll("tr").forEach(row => {
      const qty = parseFloat(row.querySelector(".qty").value) || 0;
      const price = parseFloat(row.querySelector(".price").value) || 0;
      const amt = qty * price;
      subtotal += amt;
      row.querySelector(".amount").textContent = `₹${amt.toFixed(2)}`;
    });
    document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `₹${subtotal.toFixed(2)}`;
  }

  // 4. SAVE INVOICE TO FIRESTORE
  // ----------------------------
  document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "saveInvoiceBtn") {
    const selectedDailyLogId = window.currentDailyLogIdForInvoice || null;

    const invoiceData = {
      invoiceNumber: document.getElementById("invoiceNumber").value.trim(),
      invoiceDate: document.getElementById("invoiceDate").value,
      dueDate: document.getElementById("dueDate").value,
      client: {
        name: document.getElementById("clientName").value.trim(),
        address: document.getElementById("clientAddress").value.trim(),
        phone: document.getElementById("clientPhone").value.trim(),
        email: document.getElementById("clientEmail").value.trim()
      },
      items: [],
      notes: document.getElementById("invoiceNotes").value.trim(),
      subtotal: document.getElementById("subtotal").textContent,
      total: document.getElementById("total").textContent,
      createdAt: new Date(),
      dailyLogId: selectedDailyLogId || window.currentDailyLogIdForInvoice || null
    };

    itemsBody.querySelectorAll("tr").forEach(row => {
      const item = {
        name: row.querySelector("textarea.item-name").value,
        qty: parseFloat(row.querySelector(".qty").value) || 0,
        price: parseFloat(row.querySelector(".price").value) || 0,
        amount: row.querySelector(".amount").textContent
      };
      invoiceData.items.push(item);
    });

    db.collection("invoices").add(invoiceData)
      .then(async (docRef) => {
        notyf.success("Invoice saved successfully!");
        document.getElementById("successSound")?.play();
        loadAllInvoices();
        resetInvoiceForm();

        // Link back to dailyLog if set
        if (invoiceData.dailyLogId) {
          await db.collection("dailyLogs").doc(invoiceData.dailyLogId).update({
            invoiceId: docRef.id
          });
          window.currentDailyLogIdForInvoice = null;
        }
      })
      .catch(err => {
        console.error("Error saving invoice:", err);
        notyf.error("Failed to save invoice.");
      });
  }
});


  // 5. DOWNLOAD AS PNG (dom-to-image)
  // ---------------------------------
  const setupPngDownload = () => {
    const downloadBtn = document.getElementById("downloadPngBtn");
    if (downloadBtn && window.domtoimage) {
      downloadBtn.addEventListener("click", function() {
        const invoiceSection = document.querySelector("#invoicePrintArea > section");
        const toHide = document.querySelectorAll(".png-hide");

        // Save original styles
        const originalMaxWidth = invoiceSection.style.maxWidth;
        const originalMarginLeft = invoiceSection.style.marginLeft;
        const originalMarginRight = invoiceSection.style.marginRight;
        const originalWidth = invoiceSection.style.width;

        // Hide UI controls
        toHide.forEach(el => el.style.visibility = "hidden");

        // Remove centering and max-width for PNG, set a fixed width
        invoiceSection.style.maxWidth = "none";
        invoiceSection.style.marginLeft = "0";
        invoiceSection.style.marginRight = "0";
        invoiceSection.style.width = "700px";

        setTimeout(function() {
          window.domtoimage.toPng(invoiceSection)
            .then(function(dataUrl) {
              // Restore UI controls and styles
              toHide.forEach(el => el.style.visibility = "");
              invoiceSection.style.maxWidth = originalMaxWidth;
              invoiceSection.style.marginLeft = originalMarginLeft;
              invoiceSection.style.marginRight = originalMarginRight;
              invoiceSection.style.width = originalWidth;

              const link = document.createElement('a');
              link.download = 'invoice.png';
              link.href = dataUrl;
              link.click();
            })
            .catch(function(error) {
              toHide.forEach(el => el.style.visibility = "");
              invoiceSection.style.maxWidth = originalMaxWidth;
              invoiceSection.style.marginLeft = originalMarginLeft;
              invoiceSection.style.marginRight = originalMarginRight;
              invoiceSection.style.width = originalWidth;
              alert('Could not generate image: ' + error);
            });
        }, 100);
      });
    }
  };

  if (window.domtoimage) {
    setupPngDownload();
  } else {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/dom-to-image@2.6.0/src/dom-to-image.min.js";
    script.onload = setupPngDownload;
    document.head.appendChild(script);
  }

  // 6. PRINT INVOICE
  // ----------------
  document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "printInvoiceBtn") {
      window.print();
    }
  });

  async function loadCandidateDailyLogs() {
  const date = document.getElementById("invoiceDate")?.value || "";
  const client = document.getElementById("clientName")?.value?.trim() || "";
  const select = document.getElementById("linkDailyLogSelect");
  if (!select || !date || !client) return;

  // Fetch logs for date range around selected date and same client
  try {
    const snap = await db.collection("dailyLogs")
      .where("date", "==", date)
      .get();

    const options = [];
    snap.forEach(doc => {
      const d = doc.data();
      // Simple client-name linkage: list logs for this date and client
const sameClient = (d.client || "").trim().toLowerCase() === client.toLowerCase();
if (sameClient) {
  const total = (d.totalRevenue ?? 0).toFixed?.(2) ?? String(d.totalRevenue ?? 0);
  options.push({ id: doc.id, date: d.date, client: d.client, total });
}
    });

    select.innerHTML = '<option value="">— Optional: select a daily log to link —</option>';
    options.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = `${o.date} • ${o.client} • ₹${o.total}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load candidate daily logs:", err);
  }
}


  // 7. ALL INVOICES TABLE (VIEW, PRINT, DELETE, FILTER, SORT, SEARCH, PAGINATION)
  // -----------------------------------------------------------------------------
  let currentPage = 1;
  const invoicesPerPage = 10;
  let filteredInvoices = [];
  let allInvoicesDocs = [];

  function renderInvoicesTable(docs) {
    const invoicesList = document.getElementById("invoicesList");
    if (!invoicesList) return;

    // Filter by search box
    const searchVal = document.getElementById("invoiceSearchBox")?.value?.toLowerCase() || "";
    filteredInvoices = docs.filter(d => {
      return (
        (d.invoiceNumber || "").toLowerCase().includes(searchVal) ||
        (d.client?.name || "").toLowerCase().includes(searchVal) ||
        (d.invoiceDate || "").toLowerCase().includes(searchVal)
      );
    });

    // Pagination
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const startIdx = (currentPage - 1) * invoicesPerPage;
    const pageDocs = filteredInvoices.slice(startIdx, startIdx + invoicesPerPage);

    // Table HTML
    let html = `
      <table class="w-full text-sm border rounded bg-white">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-center font-semibold">Invoice #</th>
            <th class="border p-2 text-center font-semibold">Date</th>
            <th class="border p-2 text-center font-semibold">Client</th>
            <th class="border p-2 text-center font-semibold">Total</th>
            <th class="border p-2 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    pageDocs.forEach(d => {
      html += `
        <tr>
          <td class="border p-2 text-center">${d.invoiceNumber || ""}</td>
          <td class="border p-2 text-center">${d.invoiceDate || ""}</td>
          <td class="border p-2 text-center">${d.client?.name || ""}</td>
          <td class="border p-2 text-center">${d.total || ""}</td>
          <td class="border p-2 text-center flex gap-2 justify-center">
            <button class="viewInvoiceBtn" data-id="${d.id}" title="View"><i data-feather="eye"></i></button>
            <button class="printInvoiceBtn" data-id="${d.id}" title="Print"><i data-feather="printer"></i></button>
            <button class="deleteInvoiceBtn" data-id="${d.id}" title="Delete"><i data-feather="trash-2"></i></button>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <div id="paginationControls" class="flex justify-center items-center gap-2 mt-4">
        ${
          totalPages > 1
            ? `
              <button ${currentPage === 1 ? "disabled" : ""} id="prevPageBtn" class="px-2 py-1 border rounded">Prev</button>
              <span>Page ${currentPage} of ${totalPages}</span>
              <button ${currentPage === totalPages ? "disabled" : ""} id="nextPageBtn" class="px-2 py-1 border rounded">Next</button>
            `
            : ""
        }
      </div>
    `;

    invoicesList.innerHTML = html;

    if (window.feather) feather.replace();

    // Pagination event listeners
    document.getElementById("prevPageBtn")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderInvoicesTable(allInvoicesDocs);
      }
    });
    document.getElementById("nextPageBtn")?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderInvoicesTable(allInvoicesDocs);
      }
    });

    // Attach event listeners for view, print, delete
    document.querySelectorAll(".viewInvoiceBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await showInvoiceDetails(id);
      });
    });
    document.querySelectorAll(".printInvoiceBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await showInvoiceDetails(id, true);
        setTimeout(() => window.print(), 500);
      });
    });
    document.querySelectorAll(".deleteInvoiceBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this invoice?")) {
          await deleteInvoice(id);
        }
      });
    });

    // Sorting
    document.getElementById("sortInvoicesBy")?.addEventListener("change", function() {
      sortAndRenderInvoices();
    });
  }

  function sortAndRenderInvoices() {
    let docs = [...allInvoicesDocs];
    const sortVal = document.getElementById("sortInvoicesBy")?.value || "invoiceDate-desc";

    docs.sort((a, b) => {
      switch (sortVal) {
        case "invoiceNumber-asc":
          return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "", undefined, { numeric: true });
        case "invoiceNumber-desc":
          return (b.invoiceNumber || "").localeCompare(a.invoiceNumber || "", undefined, { numeric: true });
        case "invoiceDate-asc":
          return (a.invoiceDate || "").localeCompare(b.invoiceDate || "");
        case "invoiceDate-desc":
          return (b.invoiceDate || "").localeCompare(a.invoiceDate || "");
        case "client-asc":
          return (a.client?.name || "").localeCompare(b.client?.name || "");
        case "client-desc":
          return (b.client?.name || "").localeCompare(a.client?.name || "");
        case "total-asc":
          return parseFloat((a.total || "0").replace(/[^\d.]/g, "")) - parseFloat((b.total || "0").replace(/[^\d.]/g, ""));
        case "total-desc":
          return parseFloat((b.total || "0").replace(/[^\d.]/g, "")) - parseFloat((a.total || "0").replace(/[^\d.]/g, ""));
        default:
          return 0;
      }
    });

    renderInvoicesTable(docs);
    if (document.getElementById("sortInvoicesBy")) document.getElementById("sortInvoicesBy").value = sortVal;
  }

  async function deleteInvoice(id) {
    try {
      await db.collection("invoices").doc(id).delete();
      notyf.success("Invoice deleted.");
      loadAllInvoices();
    } catch (err) {
      notyf.error("Failed to delete invoice.");
      console.error(err);
    }
  }

 async function loadPendingDailyLogsForMonth(monthStr) {
  const [year, month] = monthStr.split("-");
  const startDate = `${year}-${month}-01`;
  const endDate = new Date(parseInt(year, 10), parseInt(month, 10), 0);
  const endDateStr = `${year}-${month}-${String(endDate.getDate()).padStart(2, "0")}`;

  // Fetch logs for the month
  const logsSnap = await db.collection("dailyLogs")
    .where("date", ">=", startDate)
    .where("date", "<=", endDateStr)
    .get();

  const logs = [];
  logsSnap.forEach(doc => {
    logs.push({ id: doc.id, ...doc.data() });
  });

  // Fetch all invoices once
  const invSnap = await db.collection("invoices").get();
  const invoicesByClient = {};
  invSnap.forEach(doc => {
    const d = doc.data();
    const name = (d.client?.name || "").trim().toLowerCase();
    if (!name) return;
    if (!invoicesByClient[name]) invoicesByClient[name] = [];
    invoicesByClient[name].push(d);
  });

  // Pending = logs whose client has no invoices (by name)
  const pending = logs.filter(l => {
    const key = (l.client || "").trim().toLowerCase();
    return !(invoicesByClient[key] && invoicesByClient[key].length > 0);
  });

  const countEl = document.getElementById("pendingCount");
  const listEl = document.getElementById("pendingList");
  if (countEl) countEl.textContent = String(pending.length);
  if (listEl) {
    if (!pending.length) {
      listEl.innerHTML = "<div class='text-gray-600'>No pending invoices for this month.</div>";
    } else {
      listEl.innerHTML = pending.map(p => `
        <div class="flex items-center justify-between border rounded bg-white p-2 mb-1">
          <div>
            <div class="font-semibold">${p.client || ""}</div>
            <div class="text-xs text-gray-600">${p.date}</div>
          </div>
          <button class="px-2 py-1 bg-orange-600 text-white rounded text-xs" data-id="${p.id}">Create</button>
        </div>
      `).join("");

      listEl.querySelectorAll("button[data-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          if (typeof window.createInvoiceFromDailyLog === "function") {
            window.createInvoiceFromDailyLog(id);
          } else {
            (async () => {
              const doc = await firebase.firestore().collection("dailyLogs").doc(id).get();
              if (!doc.exists) return alert("Daily log not found.");
              const d = doc.data();
              localStorage.setItem("invoicePrefill", JSON.stringify({
                dailyLogId: id,
                client: d.client,
                items: d.items,
                date: d.date,
                notes: d.notes,
                total: d.totalRevenue,
              }));
              window.location.hash = "#invoicePrintArea";
              setTimeout(() => {
                if (typeof window.prefillInvoiceFromDailyLog === "function") {
                  window.prefillInvoiceFromDailyLog();
                }
              }, 150);
            })();
          }
        });
      });
    }
  }
}

document.getElementById("openPendingList")?.addEventListener("click", async () => {
  const listEl = document.getElementById("pendingList");
  if (!listEl) return;
  const isHidden = listEl.classList.toggle("hidden");
  if (!isHidden) {
    const monthStr = document.getElementById("filterMonthYear")?.value || new Date().toISOString().slice(0,7);
    await loadPendingDailyLogsForMonth(monthStr);
  }
});

// Trigger load when month filter changes and on initial load
document.addEventListener("change", async function(e) {
  if (e.target && e.target.id === "filterMonthYear") {
    await loadPendingDailyLogsForMonth(e.target.value);
  }
});
(async () => {
  const initialMonth = document.getElementById("filterMonthYear")?.value || new Date().toISOString().slice(0,7);
  await loadPendingDailyLogsForMonth(initialMonth);
})();


  function loadAllInvoices() {
    const invoicesList = document.getElementById("invoicesList");
    if (!invoicesList) return;
    invoicesList.innerHTML = `
  <div id="loadingOverlay" class="glass-loader flex flex-col items-center justify-center w-full h-32">
    <div class="spinner mb-2"></div>
    <span class="text-lg font-semibold text-gray-700">Loading...</span>
  </div>
`;

    let query = db.collection("invoices");
    let filterMonthYear = document.getElementById("filterMonthYear")?.value;
    if (!filterMonthYear) {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      filterMonthYear = `${year}-${month}`;
      if (document.getElementById("filterMonthYear")) document.getElementById("filterMonthYear").value = filterMonthYear;
    }
    const [filterYear, filterMonth] = filterMonthYear.split("-");
    const start = `${filterYear}-${filterMonth}-01`;
    const endDate = new Date(parseInt(filterYear), parseInt(filterMonth), 0);
    const end = `${filterYear}-${filterMonth}-${String(endDate.getDate()).padStart(2, "0")}`;
    query = query.where("invoiceDate", ">=", start).where("invoiceDate", "<=", end);

    query.get()
      .then(snapshot => {
        if (snapshot.empty) {
          invoicesList.innerHTML = "<p class='text-gray-500'>No invoices found.</p>";
          allInvoicesDocs = [];
          return;
        }

        let docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));

        allInvoicesDocs = docs;
        sortAndRenderInvoices();
      })
      .catch(err => {
        invoicesList.innerHTML = "<p class='text-red-500'>Failed to load invoices.</p>";
        console.error(err);
      });
  }

  async function showInvoiceDetails(invoiceId, silentPrint = false) {
    const doc = await db.collection("invoices").doc(invoiceId).get();
    if (!doc.exists) return alert("Invoice not found.");
    const d = doc.data();

    document.getElementById("invoiceNumber").value = d.invoiceNumber || "";
    document.getElementById("invoiceDate").value = d.invoiceDate || "";
    document.getElementById("dueDate").value = d.dueDate || "";
    document.getElementById("clientName").value = d.client?.name || "";
    document.getElementById("clientAddress").value = d.client?.address || "";
    document.getElementById("clientPhone").value = d.client?.phone || "";
    document.getElementById("clientEmail").value = d.client?.email || "";
    document.getElementById("invoiceNotes").value = d.notes || "";

    itemsBody.innerHTML = "";
    (d.items || []).forEach(item => addRow(item));
    updateTotals();

    if (silentPrint) {
      setTimeout(() => window.print(), 500);
    }
  }

  // --- NEW INVOICE FORM RESET ---
  function resetInvoiceForm() {
    document.getElementById("invoiceNumber").value = "";
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    document.getElementById("invoiceDate").value = formattedDate;
    document.getElementById("dueDate").value = formattedDate;
    document.getElementById("clientName").value = "";
    document.getElementById("clientAddress").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("invoiceNotes").value = "";
    itemsBody.innerHTML = "";
    addRow();
    updateTotals();
  }

  document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "newInvoiceBtn") {
      resetInvoiceForm();
    }
  });

  // --- SEARCH BOX EVENT ---
  document.addEventListener("input", function(e) {
    if (e.target && e.target.id === "invoiceSearchBox") {
      currentPage = 1;
      renderInvoicesTable(allInvoicesDocs);
    }
  });

  // --- FILTER FORM EVENTS ---
  document.addEventListener("change", function(e) {
    if (e.target && e.target.id === "filterMonthYear") {
      loadAllInvoices();
    }
    if (e.target && e.target.id === "sortInvoicesBy") {
      sortAndRenderInvoices();
    }
  });

  // 8. INITIAL LOAD
  // Set default value for month picker to current month
  const monthInput = document.getElementById("filterMonthYear");
  if (monthInput) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    monthInput.value = `${year}-${month}`;
  }

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("invoiceDate").value = formattedDate;
  document.getElementById("dueDate").value = formattedDate;

  loadAllInvoices();
});

// --- CLIENT AUTOCOMPLETE ---
let allClients = [];
async function fetchClients() {
  const snap = await firebase.firestore().collection("clients").get();
  allClients = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
fetchClients();


// Create dropdown element
const clientNameInput = document.getElementById("clientName");
const dropdown = document.createElement("div");
dropdown.style.position = "absolute";
dropdown.style.background = "#fff";
dropdown.style.border = "1px solid #ccc";
dropdown.style.zIndex = 1000;
dropdown.style.display = "none";
dropdown.className = "autocomplete-dropdown";
clientNameInput.parentNode.appendChild(dropdown);

clientNameInput.addEventListener("input", function() {
  const val = this.value.trim().toLowerCase();
  if (!val) {
    dropdown.style.display = "none";
    return;
  }
  // Filter clients
  const matches = allClients.filter(c => c.name && c.name.toLowerCase().startsWith(val));
  if (matches.length === 0) {
    dropdown.style.display = "none";
    return;
  }
  // Show dropdown
  dropdown.innerHTML = matches.map(c => `
    <div class="autocomplete-item" style="padding:6px;cursor:pointer;" data-id="${c.id}">
      <b>${c.name}</b> <span style="color:#888;">${c.contactPerson || ""}</span>
    </div>
  `).join("");
  dropdown.style.display = "block";
  dropdown.style.width = clientNameInput.offsetWidth + "px";
});

// Handle selection
dropdown.addEventListener("mousedown", async function(e) {
  const item = e.target.closest(".autocomplete-item");
  if (!item) return;
  const client = allClients.find(c => c.id === item.dataset.id);
  if (client) {
    clientNameInput.value = client.name;
    document.getElementById("clientAddress").value = client.address || "";
    document.getElementById("clientPhone").value = client.phone || "";
    document.getElementById("clientEmail").value = client.contactPerson || ""; // Or use a separate field for contact person
    dropdown.style.display = "none";

    // --- Fetch and increment last invoice number for this client ---
    try {
      const invoiceSnap = await db.collection("invoices")
        .where("client.name", "==", client.name)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
      if (!invoiceSnap.empty) {
        const lastInvoice = invoiceSnap.docs[0].data();
        const lastInvoiceNo = lastInvoice.invoiceNumber || "";
        const newInvoiceNo = incrementInvoiceNumber(lastInvoiceNo);
        if (newInvoiceNo) {
          document.getElementById("invoiceNumber").value = newInvoiceNo;
        }
      } else {
        // If no previous invoice, generate first invoice number
        // Use first two letters of client name as prefix, or customize as needed
        const prefix = client.name
          .split(" ")
          .map(w => w[0])
          .join("")
          .toUpperCase();
        document.getElementById("invoiceNumber").value = `${prefix}-01`;
      }
    } catch (err) {
      console.error("Error fetching last invoice:", err);
    }
  }
});

// Hide dropdown on blur
clientNameInput.addEventListener("blur", function() {
  setTimeout(() => { dropdown.style.display = "none"; }, 150);
});
// --- 0. Prefill invoice from dailyLog ---
window.prefillInvoiceFromDailyLog = function() {
  const prefill = JSON.parse(localStorage.getItem("invoicePrefill") || "{}");
  if (!prefill.dailyLogId) return;

  // If addRow or invoiceItems aren’t ready yet, retry shortly
  if (typeof addRow !== "function" || !document.getElementById("invoiceItems")) {
    setTimeout(window.prefillInvoiceFromDailyLog, 100);
    return;
  }

  document.getElementById("clientName").value = prefill.client || "";
  document.getElementById("invoiceDate").value = prefill.date || "";
  document.getElementById("invoiceNotes").value = prefill.notes || "";

  const itemsTbody = document.getElementById("invoiceItems");
  itemsTbody.innerHTML = "";

  (prefill.items || []).forEach(item => addRow({
    name: item.name,
    qty: item.qty,
    price: item.revenue, // Use revenue as price for invoice
    amount: (item.qty * item.revenue).toFixed(2)
  }));

  updateTotals();

  window.currentDailyLogIdForInvoice = prefill.dailyLogId;
  localStorage.removeItem("invoicePrefill");
};



