// js/inventory.js

document.addEventListener("DOMContentLoaded", () => {
  // Inject glassmorphism and animation styles
  const glassStyle = document.createElement("style");
  glassStyle.innerHTML = `
    .glass-bg {
      background: rgba(255,255,255,0.25) !important;
      box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border-radius: 18px !important;
      border: 1px solid rgba(255,255,255,0.18) !important;
    }
    .glass-card {
      background: rgba(255,255,255,0.35) !important;
      box-shadow: 0 4px 16px 0 rgba(31,38,135,0.12) !important;
      backdrop-filter: blur(8px) !important;
      border-radius: 14px !important;
      border: 1px solid rgba(255,255,255,0.16) !important;
    }
    .glass-table th, .glass-table td {
      background: rgba(255,255,255,0.45) !important;
      border-bottom: 1px solid rgba(200,200,200,0.18) !important;
    }
    .glass-table tr:nth-child(even) td {
      background: rgba(240,248,255,0.35) !important;
    }
    .glass-btn {
      background: rgba(0,0,0,0.7) !important;
      color: #fff !important;
      border-radius: 8px !important;
      padding: 0.5em 1em !important;
      transition: background 0.2s !important;
      min-width: 120px !important;
      font-size: 1rem !important;
      margin-bottom: 0 !important;
    }
    .glass-btn:hover, .glass-btn:focus {
      background: rgba(0,0,0,0.9) !important;
    }
    input, select, textarea {
      background: rgba(255,255,255,0.7) !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      padding: 0.5em !important;
      outline: none !important;
      transition: border 0.2s !important;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #2563eb !important;
    }
    .glass-table tr { transition: background 0.2s; }
    .glass-table tr[style] { animation: fadeIn 0.5s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .sort-header { cursor: pointer; user-select: none; }
    .sort-header.active { text-decoration: underline; font-weight: bold; }
    .kpi-card { transition: transform 0.18s, box-shadow 0.18s; }
    .kpi-card:hover { transform: scale(1.04); box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18); z-index: 2; }
    .bg-kpi-blue { background: rgba(59,130,246,0.18) !important; }
    .bg-kpi-green { background: rgba(34,197,94,0.18) !important; }
    .bg-kpi-red { background: rgba(239,68,68,0.18) !important; }
  `;
  document.head.appendChild(glassStyle);

  // Add Chart.js CDN
  const chartScript = document.createElement("script");
  chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
  document.head.appendChild(chartScript);

  // Date formatting utility
  function formatDate(dateStr) {
    if (!dateStr) return "--";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}-${months[parseInt(m,10)-1]}-${y}`;
  }

  // Sorting state
  let sortField = "product";
  let sortDir = "asc";

  // Get the main container where the inventory UI will be rendered
  const container = document.getElementById("inventory");

  // Render the main Inventory Tracker UI with your requested fields
  container.innerHTML = `
    <section class="glass-bg p-6 max-w-7xl mx-auto">
      <!-- Header Section -->
      <h2 class="text-2xl font-bold text-orange-500 flex items-center mb-1">
        <span class="mr-2">📦</span> Inventory Tracker
      </h2>
      <p class="text-sm text-gray-500 mb-6">Track your product purchases and stock levels</p>

      <!-- Inventory Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card kpi-card bg-kpi-blue p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p id="inv-total-items" class="text-2xl font-bold text-blue-900">0</p>
          </div>
          <span class="text-blue-400 text-3xl">📦</span>
        </div>
        <div class="glass-card kpi-card bg-kpi-green p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Inventory Value</p>
            <p id="inv-value" class="text-2xl font-bold text-green-800">₹0.00</p>
          </div>
          <span class="text-green-400 text-3xl">📈</span>
        </div>
        <div class="glass-card kpi-card bg-kpi-red p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Low Stock Products</p>
            <p id="inv-low-stock" class="text-2xl font-bold text-red-700">0</p>
          </div>
          <span class="text-red-400 text-3xl">⚠️</span>
        </div>
      </div>

      <!-- Add/Edit Product Form and Money Spent Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Add/Edit Product Form -->
        <div class="md:col-span-2 space-y-4 glass-card p-4">
          <h3 class="text-lg font-semibold text-gray-700">Add New Product</h3>
          <form id="inv-form" autocomplete="off">
            <div class="mb-2">
              <input id="inv-product" type="text" placeholder="Product Name" class="w-full p-2 border rounded" required autocomplete="off" />
              <div id="error-product" class="error text-red-600 text-xs mt-1 hidden"></div>
            </div>
            <div class="flex gap-4 mb-2">
              <div class="w-full">
                <input id="inv-qty" type="number" placeholder="Quantity" class="w-full p-2 border rounded" min="1" required />
                <div id="error-qty" class="error text-red-600 text-xs mt-1 hidden"></div>
              </div>
              <div class="w-full">
                <input id="inv-unit" type="text" placeholder="Unit (e.g., kg, g, pcs)" class="w-full p-2 border rounded" required />
                <div id="error-unit" class="error text-red-600 text-xs mt-1 hidden"></div>
              </div>
            </div>
            <div class="flex gap-4 mb-2">
              <div class="w-full">
                <input id="inv-mrp" type="number" placeholder="MRP (₹)" class="w-full p-2 border rounded" min="0" step="0.01" required />
                <div id="error-mrp" class="error text-red-600 text-xs mt-1 hidden"></div>
              </div>
              <div class="w-full">
                <input id="inv-rate" type="number" placeholder="Rate (₹)" class="w-full p-2 border rounded" min="0" step="0.01" required />
                <div id="error-rate" class="error text-red-600 text-xs mt-1 hidden"></div>
              </div>
            </div>
            <div class="mb-2">
              <input id="inv-notes" type="text" placeholder="Notes (optional)" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-2">
              <input id="inv-date" type="date" class="w-full p-2 border rounded" required />
              <div id="error-date" class="error text-red-600 text-xs mt-1 hidden"></div>
            </div>
            <p class="text-green-700 font-semibold bg-green-50 p-2 rounded mb-4">Amount: <span id="inv-amount">₹0.00</span></p>
            <div class="md:col-span-2 flex flex-wrap gap-2 justify-center">
              <button id="add-inv-btn" type="submit" class="glass-btn px-4 py-2">+ Add Product</button>
              <button id="update-inv-btn" type="button" class="glass-btn px-4 py-2 hidden bg-blue-600">Update Product</button>
              <button id="cancel-edit-btn" type="button" class="glass-btn px-4 py-2 hidden bg-gray-300 text-black">Cancel Edit</button>
            </div>
          </form>
          <div id="success-msg" class="success text-green-800 text-sm hidden"></div>
        </div>

        <!-- Total Money Spent Card and Chart -->
        <div class="glass-card p-4 flex flex-col items-center justify-center">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Money Spent</h3>
          <p class="text-3xl font-bold text-green-700" id="total-money-spent">₹0.00</p>
          <canvas id="moneySpentChart" width="300" height="180" style="margin-top:1em;"></canvas>
        </div>
      </div>

      <!-- Minimal Excel-like Inventory Table Section -->
      <div class="glass-card rounded p-4">
        <div class="flex items-center mb-2 gap-2">
          <h3 class="text-lg font-semibold text-gray-700">Inventory Products</h3>
          <input id="search-inv" type="text" placeholder="Search products..." class="ml-auto p-2 glass-card text-sm w-48 border-none focus:ring-2 focus:ring-blue-400" />
          <button id="toggle-used-btn" class="glass-btn ml-2 text-sm">Show Used Products</button>
        </div>
        <div class="overflow-x-auto">
          <table id="inventory-table" class="glass-table min-w-full text-center rounded-lg">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-2 py-2 border sort-header" data-field="product">Product</th>
                <th class="px-2 py-2 border sort-header" data-field="qty">Qty</th>
                <th class="px-2 py-2 border sort-header" data-field="unit">Unit</th>
                <th class="px-2 py-2 border sort-header" data-field="mrp">MRP</th>
                <th class="px-2 py-2 border sort-header" data-field="rate">Rate</th>
                <th class="px-2 py-2 border sort-header" data-field="amount">Amount</th>
                <th class="px-2 py-2 border">Notes</th>
                <th class="px-2 py-2 border sort-header" data-field="date">Date</th>
                <th class="px-2 py-2 border">Used?</th>
                <th class="px-2 py-2 border">Edit</th>
                <th class="px-2 py-2 border">Delete</th>
              </tr>
            </thead>
            <tbody id="inventory-list">
              <tr><td colspan="11" class="py-4 text-gray-400">No inventory products recorded yet. Add your first product above!</td></tr>
            </tbody>
          </table>
        </div>
        <div id="used-products-section" style="display:none; margin-top:2em;">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Used Products</h3>
          <table id="used-products-table" class="glass-table min-w-full text-center rounded-lg">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-2 py-2 border">Product</th>
                <th class="px-2 py-2 border">Qty</th>
                <th class="px-2 py-2 border">Unit</th>
                <th class="px-2 py-2 border">MRP</th>
                <th class="px-2 py-2 border">Rate</th>
                <th class="px-2 py-2 border">Amount</th>
                <th class="px-2 py-2 border">Notes</th>
                <th class="px-2 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody id="used-products-list">
              <tr><td colspan="8" class="py-4 text-gray-400">No used products yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <style>
      .error.hidden, .success.hidden { display: none; }
      .success { background: #d1fae5; color: #065f46; padding: 0.7em 1em; border-radius: 6px; margin-bottom: 1em; }
      th, td { text-align: center; }
      .edit-btn, .delete-btn, .mark-used-btn { background: none; border: none; cursor: pointer; font-size: 1.1em; }
      .edit-btn { color: #2563eb; }
      .delete-btn { color: #dc2626; }
      .mark-used-btn { color: #059669; font-weight: bold; }
      .edit-btn:focus, .delete-btn:focus, .mark-used-btn:focus { outline: 2px solid #2563eb; }
    </style>
  `;

  // Reference to the database (assumed to be set up elsewhere)
  const db = window.db;
  let editingId = null;
  let chartInstance = null;

  // Helper functions to get values from input fields
  function getProduct() { return document.getElementById("inv-product").value.trim(); }
  function getQty() { return parseFloat(document.getElementById("inv-qty").value) || 0; }
  function getUnit() { return document.getElementById("inv-unit").value.trim(); }
  function getMRP() { return parseFloat(document.getElementById("inv-mrp").value) || 0; }
  function getRate() { return parseFloat(document.getElementById("inv-rate").value) || 0; }
  function getNotes() { return document.getElementById("inv-notes").value.trim(); }
  function getDate() { return document.getElementById("inv-date").value; }

  // Validate form fields and show inline errors
  function validateForm() {
    let valid = true;
    if (!getProduct()) { showError("product", "Product name is required."); valid = false; } else { hideError("product"); }
    if (!getQty() || getQty() < 1) { showError("qty", "Quantity must be at least 1."); valid = false; } else { hideError("qty"); }
    if (!getUnit()) { showError("unit", "Unit is required."); valid = false; } else { hideError("unit"); }
    if (getMRP() < 0) { showError("mrp", "MRP cannot be negative."); valid = false; } else { hideError("mrp"); }
    if (getRate() < 0) { showError("rate", "Rate cannot be negative."); valid = false; } else { hideError("rate"); }
    if (!getDate()) { showError("date", "Date is required."); valid = false; } else { hideError("date"); }
    return valid;
  }
  function showError(field, msg) {
    const el = document.getElementById("error-" + field);
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  function hideError(field) {
    const el = document.getElementById("error-" + field);
    el.textContent = "";
    el.classList.add("hidden");
  }

  // Update the product summary and amount display
  function updateSummary(product, qty, unit, mrp, rate, notes, date) {
    const amount = qty * rate;
    document.getElementById("inv-amount").innerText = `₹${amount.toFixed(2)}`;
  }

  // Update summary in real-time as the user types
  ["inv-product", "inv-qty", "inv-unit", "inv-mrp", "inv-rate", "inv-notes", "inv-date"].forEach(id => {
    document.getElementById(id).addEventListener("input", () =>
      updateSummary(getProduct(), getQty(), getUnit(), getMRP(), getRate(), getNotes(), getDate())
    );
  });

  // Autofocus: move to next field on Enter, and allow Enter to submit on last field
  ["inv-product", "inv-qty", "inv-unit", "inv-mrp", "inv-rate", "inv-notes", "inv-date"].forEach((id, idx, arr) => {
    document.getElementById(id).addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (idx < arr.length - 1) {
          document.getElementById(arr[idx + 1]).focus();
        } else {
          document.getElementById("add-inv-btn").focus();
        }
      }
    });
  });

  // Handle Add Product (submit form)
  document.getElementById("inv-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingId) return; // Prevent add while editing
    const product = getProduct();
    const qty = getQty();
    const unit = getUnit();
    const mrp = getMRP();
    const rate = getRate();
    const notes = getNotes();
    const date = getDate();
    const amount = qty * rate;
    await db.collection("inventory").add({ product, qty, unit, mrp, rate, notes, amount, date, used: false });
    showSuccess(`${product} added to inventory!`);
    document.getElementById("inv-form").reset();
    updateSummary("", 0, "", 0, 0, "", "");
    document.getElementById("inv-date").value = "";
    renderInventory();
    document.getElementById("inv-product").focus();
  });

  // Handle Update Product (edit mode)
  document.getElementById("update-inv-btn").addEventListener("click", async () => {
    if (!editingId) return;
    if (!validateForm()) return;
    const product = getProduct();
    const qty = getQty();
    const unit = getUnit();
    const mrp = getMRP();
    const rate = getRate();
    const notes = getNotes();
    const date = getDate();
    const amount = qty * rate;
    await db.collection("inventory").doc(editingId).update({ product, qty, unit, mrp, rate, notes, amount, date });
    showSuccess(`${product} updated!`);
    editingId = null;
    document.getElementById("add-inv-btn").classList.remove("hidden");
    document.getElementById("update-inv-btn").classList.add("hidden");
    document.getElementById("cancel-edit-btn").classList.add("hidden");
    document.getElementById("inv-form").reset();
    updateSummary("", 0, "", 0, 0, "", "");
    document.getElementById("inv-date").value = "";
    renderInventory();
    document.getElementById("inv-product").focus();
  });

  // Handle Cancel Edit
  document.getElementById("cancel-edit-btn").addEventListener("click", () => {
    editingId = null;
    document.getElementById("add-inv-btn").classList.remove("hidden");
    document.getElementById("update-inv-btn").classList.add("hidden");
    document.getElementById("cancel-edit-btn").classList.add("hidden");
    document.getElementById("inv-form").reset();
    updateSummary("", 0, "", 0, 0, "", "");
    document.getElementById("inv-date").value = "";
    document.getElementById("inv-product").focus();
  });

  // Show a temporary success message
  function showSuccess(msg) {
    const el = document.getElementById("success-msg");
    el.textContent = msg;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 2000);
  }

  // Search/filter inventory
  document.getElementById("search-inv").addEventListener("input", () => renderInventory());

  // Toggle used products section with smooth scroll
  document.getElementById("toggle-used-btn").addEventListener("click", () => {
    const section = document.getElementById("used-products-section");
    if (section.style.display === "none") {
      section.style.display = "block";
      document.getElementById("toggle-used-btn").innerText = "Hide Used Products";
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
  section.style.display = "none";
  document.getElementById("toggle-used-btn").innerText = "Show Used Products";
  // Smooth scroll to inventory table
  setTimeout(() => {
    document.getElementById("inventory-table").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

  });

  // Render the inventory table and update stats (with edit/delete buttons)
  async function renderInventory() {
    const search = document.getElementById("search-inv").value.trim().toLowerCase();
    const snapshot = await db.collection("inventory").get();
    let totalItems = 0;
    let totalValue = 0;
    let lowStock = 0;
    let html = "";
    let usedHtml = "";
    let usedCount = 0;

    // For chart: group by month
    const monthTotals = {};
    let docs = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      d._id = doc.id;
      docs.push(d);
    });

    // Filter by search
    docs = docs.filter(d => !search || (d.product && d.product.toLowerCase().includes(search)));

    // Sort
    docs.sort((a, b) => {
      let v1 = a[sortField], v2 = b[sortField];
      if (sortField === "date") {
        v1 = a.date || "";
        v2 = b.date || "";
      }
      if (typeof v1 === "string") v1 = v1.toLowerCase();
      if (typeof v2 === "string") v2 = v2.toLowerCase();
      if (v1 < v2) return sortDir === "asc" ? -1 : 1;
      if (v1 > v2) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    docs.forEach(d => {
      const qty = d.qty ?? 0;
      const rate = d.rate ?? 0;
      const amount = d.amount ?? (qty * rate);

      // For chart: group by month
      if (d.date) {
        const month = d.date.slice(0,7); // "YYYY-MM"
        monthTotals[month] = (monthTotals[month] || 0) + amount;
      }

      if (!d.used) {
        totalItems++;
        totalValue += amount;
        if (qty < 5) lowStock++;
        html += `
          <tr${qty < 5 ? ' style="background:#fff1f2;"' : ''}>
            <td class="border px-2 py-1">${d.product}</td>
            <td class="border px-2 py-1">${qty}</td>
            <td class="border px-2 py-1">${d.unit}</td>
            <td class="border px-2 py-1">₹${(d.mrp ?? 0).toFixed(2)}</td>
            <td class="border px-2 py-1">₹${(d.rate ?? 0).toFixed(2)}</td>
            <td class="border px-2 py-1">₹${amount.toFixed(2)}</td>
            <td class="border px-2 py-1">${d.notes || ""}</td>
            <td class="border px-2 py-1">${formatDate(d.date)}</td>
            <td class="border px-2 py-1">
              <button class="mark-used-btn" data-id="${d._id}">Mark as Used</button>
            </td>
            <td class="border px-2 py-1">
              <button class="edit-btn" title="Edit" data-id="${d._id}">✏️</button>
            </td>
            <td class="border px-2 py-1">
              <button class="delete-btn" title="Delete" data-id="${d._id}">🗑️</button>
            </td>
          </tr>
        `;
      } else {
        usedCount++;
        usedHtml += `
          <tr style="background:#e5e7eb; color:#888; text-decoration:line-through;">
            <td class="border px-2 py-1">${d.product}</td>
            <td class="border px-2 py-1">${qty}</td>
            <td class="border px-2 py-1">${d.unit}</td>
            <td class="border px-2 py-1">₹${(d.mrp ?? 0).toFixed(2)}</td>
            <td class="border px-2 py-1">₹${(d.rate ?? 0).toFixed(2)}</td>
            <td class="border px-2 py-1">₹${amount.toFixed(2)}</td>
            <td class="border px-2 py-1">${d.notes || ""}</td>
            <td class="border px-2 py-1">${formatDate(d.date)}</td>
          </tr>
        `;
      }
    });

    document.getElementById("inventory-list").innerHTML = html || `<tr><td colspan="11" class="py-4 text-gray-400">No inventory products recorded yet. Add your first product above!</td></tr>`;
    document.getElementById("used-products-list").innerHTML = usedHtml || `<tr><td colspan="8" class="py-4 text-gray-400">No used products yet.</td></tr>`;
    document.getElementById("inv-total-items").innerText = totalItems;
    document.getElementById("inv-value").innerText = `₹${totalValue.toFixed(2)}`;
    document.getElementById("inv-low-stock").innerText = lowStock;

    // Calculate total money spent (sum of all products, including used)
    let totalSpent = 0;
    docs.forEach(d => { totalSpent += d.amount ?? 0; });
    document.getElementById("total-money-spent").innerText = `₹${totalSpent.toFixed(2)}`;

    // Draw chart (money spent per month)
    function drawChart() {
      const ctx = document.getElementById('moneySpentChart').getContext('2d');
      const months = Object.keys(monthTotals).sort();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const labels = months.map(m => {
        const [y, mo] = m.split('-');
        return `${monthNames[parseInt(mo,10)-1]}-${y}`;
      });
      const values = months.map(m => monthTotals[m]);
      if (chartInstance) chartInstance.destroy();
      chartInstance = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Money Spent (₹)',
            data: values,
            backgroundColor: 'rgba(34,197,94,0.6)',
            borderColor: 'rgba(34,197,94,1)',
            borderWidth: 1,
            borderRadius: 6,
          }]
        },
        options: {
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "#e5e7eb" } }
          }
        }
      });
    }
    // Wait for Chart.js to load
    if (window.Chart) drawChart();
    else chartScript.onload = drawChart;

    // Attach mark as used event listeners
    document.querySelectorAll(".mark-used-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-id");
        await db.collection("inventory").doc(id).update({ used: true, qty: 0 });
        showSuccess("Marked as fully used!");
        renderInventory();
      };
    });

    // Attach edit event listeners
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-id");
        const docSnap = await db.collection("inventory").doc(id).get();
        const d = docSnap.data();
        document.getElementById("inv-product").value = d.product;
        document.getElementById("inv-qty").value = d.qty;
        document.getElementById("inv-unit").value = d.unit;
        document.getElementById("inv-mrp").value = d.mrp;
        document.getElementById("inv-rate").value = d.rate;
        document.getElementById("inv-notes").value = d.notes || "";
        document.getElementById("inv-date").value = d.date || "";
        updateSummary(d.product, d.qty, d.unit, d.mrp, d.rate, d.notes, d.date);
        editingId = id;
        document.getElementById("add-inv-btn").classList.add("hidden");
        document.getElementById("update-inv-btn").classList.remove("hidden");
        document.getElementById("cancel-edit-btn").classList.remove("hidden");
        document.getElementById("inv-product").focus();
      };
    });

    // Attach delete event listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this product?")) {
          await db.collection("inventory").doc(id).delete();
          showSuccess("Product deleted!");
          renderInventory();
        }
      };
    });

    // Attach sort header click events
    document.querySelectorAll(".sort-header").forEach(th => {
      th.classList.remove("active");
      if (th.getAttribute("data-field") === sortField) th.classList.add("active");
      th.onclick = () => {
        const field = th.getAttribute("data-field");
        if (sortField === field) {
          sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
          sortField = field;
          sortDir = "asc";
        }
        renderInventory();
      };
    });
  }

  // Initial render of the inventory table and stats
  renderInventory();
});
