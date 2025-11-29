// orders.js

document.addEventListener("DOMContentLoaded", () => {
  const ordersSection = document.getElementById("orders");
  const db = window.db; // Firestore instance

  // Color palette with #C8AFF0 as theme, no glossy, each card a different color but theme is #C8AFF0
  const COLORS = {
    background: "#F6F8FA",
    primary: "#C8AFF0", // App theme color
    secondary: "#64748B",
    success: "#22C55E",
    warning: "#F59E42",
    danger: "#EF4444",
    text: "#1E293B",
    rowAlt: "#F1F5F9",
    badgeReceived: "#E0E7FF",
    badgeBaked: "#FEF9C3",
    badgeDelivered: "#DCFCE7",
    badgeCancelled: "#F3F4F6",
    cardReceived: "#C8AFF0",      // Theme color
    cardBaked: "#FDE68A",         // Soft yellow
    cardDelivered: "#BBF7D0",     // Soft green
    cardCancelled: "#E5E7EB"      // Soft gray
  };

  function getCurrentMonthYear() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  function formatDate(dateStr) {
    // Expects 'YYYY-MM-DD', returns '4-Jul-2025'
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${parseInt(day, 10)}-${months[parseInt(month, 10) - 1]}-${year}`;
  }

  function showToast(message, type = "success") {
    let toast = document.getElementById("orders-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "orders-toast";
      toast.style.position = "fixed";
      toast.style.bottom = "40px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.zIndex = "9999";
      toast.style.padding = "12px 24px";
      toast.style.borderRadius = "10px";
      toast.style.fontWeight = "bold";
      toast.style.fontSize = "0.98rem";
      toast.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
      toast.style.letterSpacing = "0.02em";
      toast.style.transition = "opacity 0.3s";
      toast.style.opacity = "0";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = type === "error" ? COLORS.danger : COLORS.primary;
    toast.style.color = "#fff";
    toast.style.display = "block";
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 2200);
    setTimeout(() => { toast.style.display = "none"; }, 2500);
  }

  function showLoader(show) {
    let loader = document.getElementById("orders-loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "orders-loader";
      loader.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
        <svg class="animate-spin" style="height:32px;width:32px;color:${COLORS.primary};" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="${COLORS.primary}" stroke-width="4"></circle>
          <path class="opacity-75" fill="${COLORS.primary}" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>`;
      loader.style.position = "fixed";
      loader.style.top = "0";
      loader.style.left = "0";
      loader.style.width = "100vw";
      loader.style.height = "100vh";
      loader.style.background = "rgba(246,248,250,0.7)";
      loader.style.zIndex = "9998";
      loader.style.display = "none";
      loader.style.backdropFilter = "blur(2px)";
      document.body.appendChild(loader);
    }
    loader.style.display = show ? "block" : "none";
  }

  async function renderOrdersTable(selectedMonthYear = getCurrentMonthYear()) {
    if (!ordersSection) return;
    showLoader(true);

    if (!db || typeof db.collection !== "function") {
      ordersSection.innerHTML = `
        <div class="max-w-2xl mx-auto py-12 text-center" style="color:${COLORS.danger};">
          Firestore is not initialized. Please check your Firebase setup.
        </div>
      `;
      showLoader(false);
      return;
    }

    let ordersSnapshot;
    try {
      ordersSnapshot = await db.collection("orders").get();
    } catch (err) {
      ordersSection.innerHTML = `
        <div class="max-w-2xl mx-auto py-12 text-center" style="color:${COLORS.danger};">
          Error loading orders: ${err.message}
        </div>
      `;
      showLoader(false);
      return;
    }
    const orders = [];
    ordersSnapshot.forEach(doc => {
      const d = doc.data();
      if (!d.date || !d.customer || !d.item) return;
      if (!d.date.startsWith(selectedMonthYear)) return;
      orders.push({ id: doc.id, ...d });
    });

    const statusCounts = { Received: 0, Baked: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach(o => {
      statusCounts[o.status || "Received"] = (statusCounts[o.status || "Received"] || 0) + 1;
    });

    let monthPickerHtml = `
      <form id="orders-month-filter-form" class="mb-4 flex flex-wrap gap-3 items-center" style="font-size:0.89rem;">
        <label class="font-medium" style="color:${COLORS.text};">Show for:</label>
        <input type="month" id="orders-month-filter" name="month" value="${selectedMonthYear}" class="border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" />
      </form>
    `;

    // Card stack: theme color for Received, others are soft but not glossy, all text black, centered
    let cardStackHtml = `
      <div class="flex flex-wrap gap-3 mb-6" style="font-size:0.91rem;">
        <div class="flex-1 min-w-[120px] rounded-xl shadow p-4 flex flex-col items-center border border-indigo-100 hover:scale-105 transition" style="background:${COLORS.cardReceived}; color:#000; text-align:center;">
          <div class="text-2xl font-extrabold mb-1" style="color:#000;">${statusCounts.Received}</div>
          <div class="text-xs font-medium" style="color:#000;">Received</div>
        </div>
        <div class="flex-1 min-w-[120px] rounded-xl shadow p-4 flex flex-col items-center border border-yellow-100 hover:scale-105 transition" style="background:${COLORS.cardBaked}; color:#000; text-align:center;">
          <div class="text-2xl font-extrabold mb-1" style="color:#000;">${statusCounts.Baked}</div>
          <div class="text-xs font-medium" style="color:#000;">Baked</div>
        </div>
        <div class="flex-1 min-w-[120px] rounded-xl shadow p-4 flex flex-col items-center border border-green-100 hover:scale-105 transition" style="background:${COLORS.cardDelivered}; color:#000; text-align:center;">
          <div class="text-2xl font-extrabold mb-1" style="color:#000;">${statusCounts.Delivered}</div>
          <div class="text-xs font-medium" style="color:#000;">Delivered</div>
        </div>
        <div class="flex-1 min-w-[120px] rounded-xl shadow p-4 flex flex-col items-center border border-gray-200 hover:scale-105 transition" style="background:${COLORS.cardCancelled}; color:#000; text-align:center;">
          <div class="text-2xl font-extrabold mb-1" style="color:#000;">${statusCounts.Cancelled}</div>
          <div class="text-xs font-medium" style="color:#000;">Cancelled</div>
        </div>
      </div>
    `;

    let html = `
      <div class="max-w-4xl mx-auto py-6" style="font-size:0.91rem;">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-3xl font-extrabold flex items-center gap-2" style="color:${COLORS.text}; letter-spacing:0.01em; font-size:1.5rem;">
            <span style="font-size:1.7rem;">🧁</span> Orders Tracker
          </h2>
          <button id="add-order-btn" class="px-4 py-2 rounded-lg shadow font-semibold transition hover:bg-indigo-600 hover:scale-105"
            style="background:${COLORS.primary}; color:white; border:none; font-size:0.98rem;">
            + New Order
          </button>
        </div>
        ${monthPickerHtml}
        ${cardStackHtml}
        <div class="overflow-x-auto rounded-xl shadow bg-white border" style="border-color:${COLORS.rowAlt};">
          <table class="min-w-full text-base" style="color:${COLORS.text}; border-radius:1.2rem; overflow:hidden; font-size:0.91rem;">
            <thead>
              <tr style="background:${COLORS.background}; color:${COLORS.text}; text-transform:uppercase; letter-spacing:0.07em;">
                <th class="p-3 text-center">Date</th>
                <th class="p-3 text-center">Customer</th>
                <th class="p-3 text-center">Item</th>
                <th class="p-3 text-center">Qty</th>
                <th class="p-3 text-center">Status</th>
                <th class="p-3 text-center">Update</th>
                <th class="p-3 text-center">Details</th>
                <th class="p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (orders.length === 0) {
      html += `
        <tr>
          <td colspan="8" class="p-8 text-center" style="color:${COLORS.secondary};">
            <div style="font-size:0.98rem;margin-bottom:8px;">No orders found for this month.</div>
            <div>
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f370.svg" alt="cake" style="width:36px;height:36px;opacity:0.25;">
            </div>
            <div style="margin-top:8px;color:${COLORS.text};font-size:0.91rem;">Click <b>+ New Order</b> to add your first order!</div>
          </td>
        </tr>
      `;
    } else {
      orders.sort((a, b) => b.date.localeCompare(a.date)).forEach((order, idx) => {
        html += `
          <tr style="background:${idx % 2 === 0 ? COLORS.background : COLORS.rowAlt}; transition:background 0.2s;">
            <td class="p-3 text-center">${formatDate(order.date)}</td>
            <td class="p-3 text-center" style="font-weight:500; font-size:0.97rem;">${order.customer}</td>
            <td class="p-3 text-center">${order.item}</td>
            <td class="p-3 text-center">${order.quantity || 1}</td>
            <td class="p-3 text-center">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                style="
                  background:${
                    order.status === "Delivered" ? COLORS.badgeDelivered :
                    order.status === "Baked" ? COLORS.badgeBaked :
                    order.status === "Cancelled" ? COLORS.badgeCancelled :
                    COLORS.badgeReceived
                  };
                  color:${
                    order.status === "Delivered" ? COLORS.success :
                    order.status === "Baked" ? COLORS.warning :
                    order.status === "Cancelled" ? COLORS.secondary :
                    COLORS.primary
                  };
                  min-width:70px;
                  text-align:center;
                  font-size:0.91rem;
                  letter-spacing:0.01em;
                ">
                ${order.status || "Received"}
              </span>
            </td>
            <td class="p-3 text-center">
              <button class="update-status-btn px-3 py-1 rounded-lg font-semibold shadow-sm hover:bg-indigo-500 hover:scale-105 transition"
                style="background:${COLORS.secondary}; color:#fff; border:none; font-size:0.91rem;"
                data-id="${order.id}" data-status="${order.status || "Received"}">
                Update
              </button>
            </td>
            <td class="p-3 text-center">
              <button class="show-order-details-btn font-medium underline hover:text-indigo-600 transition" style="color:${COLORS.primary}; background:none; border:none; font-size:0.91rem;" data-id="${order.id}">
                Details
              </button>
            </td>
            <td class="p-3 text-center">
              <button class="delete-order-btn px-3 py-1 rounded-lg font-semibold shadow-sm hover:bg-red-600 hover:scale-105 transition"
                style="background:${COLORS.danger}; color:#fff; border:none; font-size:0.91rem;"
                data-id="${order.id}">
                🗑️
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
        <div id="order-form-modal" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(30,41,59,0.18); display:none"></div>
        <div id="order-details-modal" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(30,41,59,0.18); display:none"></div>
      </div>
    `;

    ordersSection.innerHTML = html;

    document.getElementById('orders-month-filter-form').onsubmit = e => e.preventDefault();
    document.getElementById('orders-month-filter').onchange = (e) => {
      renderOrdersTable(e.target.value);
    };

    document.querySelectorAll('.update-status-btn').forEach(btn => {
      btn.onclick = () => {
        showUpdateStatusForm(btn.dataset.id, btn.dataset.status, selectedMonthYear);
      };
    });

    document.querySelectorAll('.show-order-details-btn').forEach(btn => {
      btn.onclick = () => {
        showOrderDetails(btn.dataset.id, selectedMonthYear);
      };
    });

    document.querySelectorAll('.delete-order-btn').forEach(btn => {
      btn.onclick = () => {
        if (confirm("Are you sure you want to delete this order?")) {
          db.collection("orders").doc(btn.dataset.id).delete().then(() => {
            showToast("Order deleted");
            renderOrdersTable(selectedMonthYear);
          });
        }
      };
    });

    document.getElementById('add-order-btn').onclick = () => {
      showOrderForm(selectedMonthYear);
    };

    showLoader(false);
  }

  function showOrderForm(selectedMonthYear) {
    const modal = document.getElementById('order-form-modal');
    const today = new Date();
    const defaultDateStr = today.toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-7 w-full max-w-md relative animate-fadeIn" style="border:1px solid ${COLORS.rowAlt}; font-size:0.91rem;">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" id="close-order-form" title="Close" style="background:none; border:none;">&times;</button>
        <h3 class="text-xl font-extrabold mb-4" style="color:${COLORS.text}; letter-spacing:0.01em;">Add New Order</h3>
        <form id="add-order-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" for="order-date" style="color:${COLORS.text};">Date</label>
            <input type="date" name="date" id="order-date" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" required value="${defaultDateStr}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="order-customer" style="color:${COLORS.text};">Customer</label>
            <input type="text" name="customer" id="order-customer" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="order-item" style="color:${COLORS.text};">Item</label>
            <input type="text" name="item" id="order-item" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="order-quantity" style="color:${COLORS.text};">Quantity</label>
            <input type="number" name="quantity" id="order-quantity" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" required min="1" value="1" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="order-notes" style="color:${COLORS.text};">Notes (optional)</label>
            <input type="text" name="notes" id="order-notes" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" />
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="flex-1 px-3 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition" style="background:${COLORS.primary}; color:#fff; border:none;">Save</button>
            <button type="button" id="cancel-order-form" class="flex-1 px-3 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition" style="background:${COLORS.rowAlt}; color:${COLORS.text}; border:1px solid ${COLORS.secondary};">Cancel</button>
          </div>
        </form>
      </div>
    `;
    modal.style.display = "flex";

    document.getElementById('close-order-form').onclick =
    document.getElementById('cancel-order-form').onclick = () => {
      modal.style.display = "none";
      modal.innerHTML = '';
    };

    document.getElementById('add-order-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const date = form.date.value;
      const customer = form.customer.value.trim();
      const item = form.item.value.trim();
      const quantity = parseInt(form.quantity.value, 10);
      const notes = form.notes.value.trim();
      await db.collection("orders").add({
        date, customer, item, quantity, notes, status: "Received", createdAt: new Date()
      });
      modal.style.display = "none";
      modal.innerHTML = '';
      showToast("Order added");
      renderOrdersTable(date.slice(0, 7));
    };
  }

  function showUpdateStatusForm(orderId, currentStatus, selectedMonthYear) {
    const modal = document.getElementById('order-form-modal');
    const statuses = ["Received", "Baked", "Delivered", "Cancelled"];
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-7 w-full max-w-md relative animate-fadeIn" style="border:1px solid ${COLORS.rowAlt}; font-size:0.91rem;">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" id="close-update-status" title="Close" style="background:none; border:none;">&times;</button>
        <h3 class="text-xl font-extrabold mb-4" style="color:${COLORS.text}; letter-spacing:0.01em;">Update Order Status</h3>
        <form id="update-status-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" for="order-status" style="color:${COLORS.text};">Status</label>
            <select name="status" id="order-status" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-300 transition" style="border-color:${COLORS.secondary}; color:${COLORS.text}; background:${COLORS.background};" required>
              ${statuses.map(s => `<option value="${s}"${s === currentStatus ? " selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="flex-1 px-3 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition" style="background:${COLORS.primary}; color:#fff; border:none;">Save</button>
            <button type="button" id="cancel-update-status" class="flex-1 px-3 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition" style="background:${COLORS.rowAlt}; color:${COLORS.text}; border:1px solid ${COLORS.secondary};">Cancel</button>
          </div>
        </form>
      </div>
    `;
    modal.style.display = "flex";

    document.getElementById('close-update-status').onclick =
    document.getElementById('cancel-update-status').onclick = () => {
      modal.style.display = "none";
      modal.innerHTML = '';
    };

    document.getElementById('update-status-form').onsubmit = async (e) => {
      e.preventDefault();
      const status = e.target.status.value;
      await db.collection("orders").doc(orderId).update({ status });
      modal.style.display = "none";
      modal.innerHTML = '';
      showToast("Status updated");
      renderOrdersTable(selectedMonthYear);
    };
  }

  async function showOrderDetails(orderId, selectedMonthYear) {
    const modal = document.getElementById('order-details-modal');
    const doc = await db.collection("orders").doc(orderId).get();
    if (!doc.exists) return;
    const o = doc.data();
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-7 w-full max-w-lg relative animate-fadeIn" style="border:1px solid ${COLORS.rowAlt}; font-size:0.91rem;">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" id="close-order-details" title="Close" style="background:none; border:none;">&times;</button>
        <h3 class="text-xl font-extrabold mb-4" style="color:${COLORS.text}; letter-spacing:0.01em;">Order Details</h3>
        <div class="mb-4 space-y-1">
          <div><span class="font-medium" style="color:${COLORS.text};">Date:</span> ${formatDate(o.date)}</div>
          <div><span class="font-medium" style="color:${COLORS.text};">Customer:</span> ${o.customer}</div>
          <div><span class="font-medium" style="color:${COLORS.text};">Item:</span> ${o.item}</div>
          <div><span class="font-medium" style="color:${COLORS.text};">Quantity:</span> ${o.quantity || 1}</div>
          <div><span class="font-medium" style="color:${COLORS.text};">Status:</span> ${o.status || "Received"}</div>
          <div><span class="font-medium" style="color:${COLORS.text};">Notes:</span> ${o.notes || "-"}</div>
        </div>
        <div class="flex justify-end gap-2">
          <button id="delete-order-details-btn" class="px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 transition" style="background:${COLORS.danger}; color:#fff; border:none;">Delete</button>
          <button id="close-order-details-btn" class="px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition" style="background:${COLORS.rowAlt}; color:${COLORS.text}; border:1px solid ${COLORS.secondary};">Close</button>
        </div>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById('close-order-details').onclick =
    document.getElementById('close-order-details-btn').onclick = () => {
      modal.style.display = "none";
      modal.innerHTML = '';
    };
    document.getElementById('delete-order-details-btn').onclick = async () => {
      if (confirm("Are you sure you want to delete this order?")) {
        await db.collection("orders").doc(orderId).delete();
        modal.style.display = "none";
        modal.innerHTML = '';
        showToast("Order deleted");
        renderOrdersTable(selectedMonthYear || getCurrentMonthYear());
      }
    };
  }

  // Animation for modals and loader
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98);}
      to   { opacity: 1; transform: scale(1);}
    }
    .animate-fadeIn { animation: fadeIn 0.18s; }
    #orders-loader .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg);}
    }
    /* Custom scrollbar for table */
    .overflow-x-auto::-webkit-scrollbar {
      height: 8px;
    }
    .overflow-x-auto::-webkit-scrollbar-thumb {
      background: #e0e7ef;
      border-radius: 8px;
    }
    .overflow-x-auto::-webkit-scrollbar-track {
      background: #f6f8fa;
    }
    /* Responsive tweaks */
    @media (max-width: 700px) {
      .max-w-4xl { max-width: 99vw !important; }
      .p-7 { padding: 1rem !important; }
      .p-8 { padding: 1rem !important; }
      .p-4 { padding: 0.7rem !important; }
      .p-3 { padding: 0.5rem !important; }
    }
    /* Reduce font size for all table and card content */
    .max-w-4xl, .max-w-4xl * {
      font-size: 0.91rem !important;
    }
    th, td {
      font-size: 0.91rem !important;
    }
    /* Make everything more compact */
    table th, table td {
      padding-top: 0.5rem !important;
      padding-bottom: 0.5rem !important;
    }
    .shadow, .shadow-md, .shadow-xl, .shadow-lg {
      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.07) !important;
    }
  `;
  document.head.appendChild(style);

  window.renderOrdersTable = renderOrdersTable;
  renderOrdersTable();
});
