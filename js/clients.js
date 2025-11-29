// clients.js

window.renderClientsSection = function() {
  // --- 1. Render UI ---
  const clientsSection = document.getElementById("clients");
  clientsSection.innerHTML = `
    <section class="glass-section p-7 rounded-3xl shadow-2xl max-w-6xl mx-auto mt-10 border border-gray-200 relative">
      <!-- KPI Summary Boxes -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="kpi-box bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl p-6 shadow flex flex-col gap-2 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div class="text-xs text-gray-500 font-semibold">Total Clients</div>
          <div class="text-2xl font-bold text-indigo-700" id="kpi-total-clients">0</div>
        </div>
        <div class="kpi-box bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 shadow flex flex-col gap-2 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div class="text-xs text-gray-500 font-semibold">New Clients This Month</div>
          <div class="text-2xl font-bold text-green-700" id="kpi-new-clients">0</div>
        </div>
        <div class="kpi-box bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 shadow flex flex-col gap-2 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div class="text-xs text-gray-500 font-semibold">In Pipeline</div>
          <div class="text-2xl font-bold text-yellow-700" id="kpi-pipeline">0</div>
        </div>
        <div class="kpi-box bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow flex flex-col gap-2 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div class="text-xs text-gray-500 font-semibold">Converted This Month</div>
          <div class="text-2xl font-bold text-purple-700" id="kpi-converted">0</div>
        </div>
      </div>
      <!-- Pipeline Section -->
      <div class="mb-8">
  <div class="flex items-center justify-between mb-2">
    <h3 class="text-lg font-bold text-gray-800">Pipeline (Prospects)</h3>
    <button id="show-add-prospect-form"
      class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold shadow-sm transition text-base focus:outline-none focus:ring-2 focus:ring-indigo-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span>Add Prospect</span>
    </button>
  </div>
  <div id="pipeline-list" class="overflow-x-auto rounded-2xl shadow"></div>
</div>
<!-- Table Controls -->
<div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
  <h2 class="text-2xl font-bold text-gray-900 flex-1">Clients List</h2>
  <div class="flex gap-2 items-center">
    <input id="client-search" type="text" placeholder="Search clients..." class="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition w-full md:w-64" />
    <select id="client-status-filter" class="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition text-gray-700">
      <option value="Active">Active</option>
      <option value="Lost">Lost</option>
    </select>
    <button id="show-add-client-form"
      class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold shadow-sm transition text-base focus:outline-none focus:ring-2 focus:ring-indigo-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span>Add Client</span>
    </button>
  </div>
</div>

      <!-- Table -->
      <div id="client-list" class="overflow-x-auto rounded-2xl shadow"></div>
      <div id="pagination" class="flex justify-center items-center gap-2 mt-6"></div>
    </section>
    <!-- Overlay Form (shared for both client and prospect) -->
    <div id="client-form-overlay" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center hidden">
      <form id="client-form" class="rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-lg relative animate-fade-in glass-form">
        <button type="button" id="client-cancel-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <h3 class="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span id="client-form-title">Add Client</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="client-name" class="block text-xs font-semibold text-gray-700 mb-1">Client Name <span class="text-red-500">*</span></label>
            <input type="text" id="client-name" placeholder="e.g. Zonkk" class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
          </div>
          <div>
            <label for="client-contact-person" class="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
            <input type="text" id="client-contact-person" placeholder="e.g. Priya Sharma" class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label for="client-phone" class="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
            <input type="text" id="client-phone" placeholder="e.g. 9876543210" class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label for="client-address" class="block text-xs font-semibold text-gray-700 mb-1">Address</label>
            <input type="text" id="client-address" placeholder="e.g. 123, MG Road, Bangalore" class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label for="client-status" class="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select id="client-status" class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
              <option value="Prospect">Prospect</option>
              <option value="Active">Active</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label for="client-notes" class="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea id="client-notes" placeholder="Add notes..." class="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-7">
          <button type="submit" id="client-submit-btn" class="bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold transition w-full flex items-center justify-center gap-2 text-base shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span id="client-submit-label">Add Client</span>
          </button>
        </div>
      </form>
    </div>
    <style>
      @keyframes fade-in { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
      .animate-fade-in { animation: fade-in 0.2s ease; }
      .glass-section {
        background: rgba(255,255,255,0.25);
        backdrop-filter: blur(16px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow: 0 8px 32px 0 rgba(60,72,88,0.18), 0 1.5px 6px 0 rgba(99,102,241,0.08);
      }
      .glass-form {
  background: rgba(255,255,255,0.85) !important; /* More opaque */
  backdrop-filter: blur(2px) saturate(120%);     /* Less blur, less saturation */
  border: 1px solid rgba(99,102,241,0.10);
  box-shadow: 0 4px 16px 0 rgba(99,102,241,0.10), 0 1.5px 6px 0 rgba(99,102,241,0.08); /* Softer shadow */
}

      .kpi-box {
        min-width: 0;
      }
      .table-view {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255,255,255,0.35);
        backdrop-filter: blur(10px) saturate(180%);
        border-radius: 1rem;
        overflow: hidden;
      }
      .table-view th, .table-view td {
        padding: 1rem 0.75rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
        font-size: 1rem;
      }
      .table-view th {
        background: rgba(99,102,241,0.08);
        font-weight: 600;
        color: #6366f1;
      }
      .table-view tr:hover td {
        background: rgba(99,102,241,0.06);
      }
      .avatar {
        background: linear-gradient(135deg, #6366f1 0%, #60a5fa 100%);
        color: white;
        font-weight: bold;
        font-size: 1.1rem;
        border-radius: 9999px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px 0 rgba(99,102,241,0.12);
      }
      .badge {
        display: inline-block;
        padding: 0.25em 0.75em;
        border-radius: 9999px;
        font-size: 0.85em;
        font-weight: 600;
        color: #fff;
      }
      .badge-prospect { background: linear-gradient(90deg,#fbbf24,#f59e42); }
      .badge-active { background: linear-gradient(90deg,#34d399,#3b82f6); }
      .badge-lost { background: linear-gradient(90deg,#f87171,#a78bfa); }
    </style>
  `;

  // --- 2. Variables ---
  const db = window.db;
  let editingClientId = null;
  let editingMode = "client"; // or "prospect"
  let searchTerm = '';
  let statusFilter = 'Active'; // Default to Active
  let currentPage = 1;
  const pageSize = 10;

  // --- 3. UI Elements ---
  const addBtn = document.getElementById("show-add-client-form");
  const addProspectBtn = document.getElementById("show-add-prospect-form");
  const overlay = document.getElementById("client-form-overlay");
  const form = document.getElementById("client-form");
  const cancelBtn = document.getElementById("client-cancel-btn");
  const formTitle = document.getElementById("client-form-title");
  const submitLabel = document.getElementById("client-submit-label");
  const searchInput = document.getElementById("client-search");
  const statusFilterInput = document.getElementById("client-status-filter");
  const pagination = document.getElementById("pagination");

  // --- 4. Overlay Add/Edit Client/Prospect Form ---
  addBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    form.reset();
    editingClientId = null;
    editingMode = "client";
    formTitle.textContent = "Add Client";
    submitLabel.textContent = "Add Client";
    document.getElementById("client-status").value = "Active";
  });

  addProspectBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    form.reset();
    editingClientId = null;
    editingMode = "prospect";
    formTitle.textContent = "Add Prospect";
    submitLabel.textContent = "Add Prospect";
    document.getElementById("client-status").value = "Prospect";
  });

  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    form.reset();
    editingClientId = null;
    formTitle.textContent = "Add Client";
    submitLabel.textContent = "Add Client";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      form.reset();
      editingClientId = null;
      formTitle.textContent = "Add Client";
      submitLabel.textContent = "Add Client";
    }
  });

  // --- 5. Add/Update Client/Prospect ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("client-name").value.trim();
    const contactPerson = document.getElementById("client-contact-person").value.trim();
    const phone = document.getElementById("client-phone").value.trim();
    const address = document.getElementById("client-address").value.trim();
    const status = document.getElementById("client-status").value;
    const notes = document.getElementById("client-notes").value.trim();

    if (!name) {
      showToast("Client name is required.", "error");
      return;
    }

    if (editingClientId) {
      await db.collection("clients").doc(editingClientId).update({ name, contactPerson, phone, address, status, notes });
      editingClientId = null;
      showToast("Client updated!", "success");
    } else {
      await db.collection("clients").add({ name, contactPerson, phone, address, status, notes, createdAt: new Date() });
      showToast("Client added!", "success");
    }

    e.target.reset();
    overlay.classList.add("hidden");
    loadClients();
  });

  // --- 6. Search Input ---
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    loadClients();
  });

  // --- 7. Status Filter Input ---
  statusFilterInput.addEventListener("change", (e) => {
    statusFilter = e.target.value;
    currentPage = 1;
    loadClients();
  });

  // --- 8. Load & Display Clients ---
  async function loadClients() {
    const list = document.getElementById("client-list");
    const pipelineList = document.getElementById("pipeline-list");
    const snapshot = await db.collection("clients").orderBy("createdAt", "desc").get();

    // Filter by search
    let clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (searchTerm) {
      clients = clients.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(searchTerm)) ||
        (c.phone && c.phone.toLowerCase().includes(searchTerm)) ||
        (c.address && c.address.toLowerCase().includes(searchTerm))
      );
    }

    // --- KPI Calculations ---
    // Total Clients (Active only)
    const activeClients = clients.filter(c => c.status === "Active");
    document.getElementById("kpi-total-clients").textContent = activeClients.length;

    // New Clients This Month (Active, created this month)
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const newClients = activeClients.filter(c => {
      let d = c.createdAt;
      if (d && typeof d.toDate === 'function') d = d.toDate();
      else d = new Date(d);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    document.getElementById("kpi-new-clients").textContent = newClients.length;

    // Pipeline (Prospect)
    const pipelineClients = clients.filter(c => c.status === "Prospect");
    document.getElementById("kpi-pipeline").textContent = pipelineClients.length;

    // Converted This Month (Active, created this month)
    document.getElementById("kpi-converted").textContent = newClients.length;

    // --- Pipeline Table ---
    if (pipelineClients.length === 0) {
      pipelineList.innerHTML = `<div class="text-center text-gray-400 py-6 text-base">No prospects in pipeline.<br><span class="text-gray-300">Click <b>Add Prospect</b> to get started.</span></div>`;
    } else {
      pipelineList.innerHTML = `
        <table class="table-view w-full rounded-2xl overflow-hidden fade-in">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pipelineClients.map(c => `
              <tr>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar">${c.name ? c.name[0].toUpperCase() : '?'}</div>
                    <span class="font-semibold text-gray-900">${c.name}</span>
                  </div>
                </td>
                <td>${c.contactPerson || '-'}</td>
                <td><a href="tel:${c.phone}" class="text-indigo-500 hover:underline">${c.phone || '-'}</a></td>
                <td>${c.address || '-'}</td>
                <td><span class="badge badge-prospect">Prospect</span></td>
                <td>${c.notes || '-'}</td>
                <td>${c.createdAt ? formatDate(c.createdAt) : '-'}</td>
                <td>
                  <button
                    class="edit-btn p-1.5 rounded hover:bg-indigo-100 transition"
                    title="Edit"
                    data-id="${c.id}"
                    data-name="${escapeStr(c.name)}"
                    data-contact-person="${escapeStr(c.contactPerson)}"
                    data-phone="${escapeStr(c.phone)}"
                    data-address="${escapeStr(c.address)}"
                    data-status="${c.status}"
                    data-notes="${escapeStr(c.notes)}"
                  >✏️</button>
                  <button
                    class="convert-btn p-1.5 rounded hover:bg-green-100 transition"
                    title="Mark as Client"
                    data-id="${c.id}"
                  >✅</button>
                  <button
                    class="lost-btn p-1.5 rounded hover:bg-red-100 transition"
                    title="Mark as Lost"
                    data-id="${c.id}"
                  >❌</button>
                  <button
                    class="delete-btn p-1.5 rounded hover:bg-red-100 transition"
                    title="Delete"
                    data-id="${c.id}"
                  >🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // --- Main Clients Table (Active/Lost) ---
    let mainClients = clients.filter(c => 
  c.status === statusFilter || typeof c.status === "undefined" || c.status === null || c.status === ""
);

    const totalPages = Math.ceil(mainClients.length / pageSize);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const pagedClients = mainClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (mainClients.length === 0) {
      list.innerHTML = `<div class="text-center text-gray-400 py-12 text-base col-span-2">No clients found.<br><span class="text-gray-300">Try a different search or filter.</span></div>`;
      pagination.innerHTML = "";
      return;
    }

    list.innerHTML = `
      <table class="table-view w-full rounded-2xl overflow-hidden fade-in">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pagedClients.map(c => `
            <tr>
              <td>
                <div class="flex items-center gap-2">
                  <div class="avatar">${c.name ? c.name[0].toUpperCase() : '?'}</div>
                  <span class="font-semibold text-gray-900">${c.name}</span>
                </div>
              </td>
              <td>${c.contactPerson || '-'}</td>
              <td><a href="tel:${c.phone}" class="text-indigo-500 hover:underline">${c.phone || '-'}</a></td>
              <td>${c.address || '-'}</td>
              <td>
                <span class="badge ${c.status === "Active" ? "badge-active" : "badge-lost"}">${c.status === "Active" ? "Active" : "Lost"}</span>
              </td>
              <td>${c.notes || '-'}</td>
              <td>${c.createdAt ? formatDate(c.createdAt) : '-'}</td>
              <td>
                <button
                  class="edit-btn p-1.5 rounded hover:bg-indigo-100 transition"
                  title="Edit"
                  data-id="${c.id}"
                  data-name="${escapeStr(c.name)}"
                  data-contact-person="${escapeStr(c.contactPerson)}"
                  data-phone="${escapeStr(c.phone)}"
                  data-address="${escapeStr(c.address)}"
                  data-status="${c.status}"
                  data-notes="${escapeStr(c.notes)}"
                >✏️</button>
                <button
                  class="delete-btn p-1.5 rounded hover:bg-red-100 transition"
                  title="Delete"
                  data-id="${c.id}"
                >🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // --- Attach edit/delete/convert/lost events ---
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const { id, name, contactPerson, phone, address, status, notes } = btn.dataset;
        editClient(id, name, contactPerson, phone, address, status, notes);
      });
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const { id } = btn.dataset;
        await deleteClient(id);
      });
    });
    document.querySelectorAll(".convert-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const { id } = btn.dataset;
        await db.collection("clients").doc(id).update({ status: "Active" });
        showToast("Prospect marked as Client!", "success");
        loadClients();
      });
    });
    document.querySelectorAll(".lost-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const { id } = btn.dataset;
        await db.collection("clients").doc(id).update({ status: "Lost" });
        showToast("Prospect marked as Lost.", "success");
        loadClients();
      });
    });

    // --- Pagination controls ---
    renderPagination(currentPage, totalPages);
  }

  // --- 9. Pagination Controls ---
  function renderPagination(page, totalPages) {
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    let html = '';
    if (page > 1) {
      html += `<button class="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold" id="prev-page">Prev</button>`;
    }
    html += `<span class="px-3 py-1 text-gray-700">Page ${page} of ${totalPages}</span>`;
    if (page < totalPages) {
      html += `<button class="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold" id="next-page">Next</button>`;
    }
    pagination.innerHTML = html;
    if (page > 1) {
      document.getElementById("prev-page").onclick = () => { currentPage--; loadClients(); };
    }
    if (page < totalPages) {
      document.getElementById("next-page").onclick = () => { currentPage++; loadClients(); };
    }
  }

  // --- 10. Utility: Escape HTML ---
  function escapeStr(str) {
    return (str || "")
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- 11. Format Date ---
  function formatDate(dateObj) {
    // If Firestore Timestamp
    if (dateObj && typeof dateObj.toDate === 'function') {
      dateObj = dateObj.toDate();
    }
    if (!(dateObj instanceof Date)) dateObj = new Date(dateObj);
    return dateObj.toLocaleDateString('en-IN');
  }

  // --- 12. Edit Client Handler ---
  function editClient(id, name, contactPerson, phone, address, status, notes) {
    overlay.classList.remove("hidden");
    document.getElementById("client-name").value = name;
    document.getElementById("client-contact-person").value = contactPerson;
    document.getElementById("client-phone").value = phone;
    document.getElementById("client-address").value = address;
    document.getElementById("client-status").value = status || "Active";
    document.getElementById("client-notes").value = notes || "";
    formTitle.textContent = "Edit Client";
    submitLabel.textContent = "Update Client";
    editingClientId = id;
  }

  // --- 13. Delete Client Handler ---
  async function deleteClient(id) {
    if (confirm("Are you sure you want to delete this client? This cannot be undone.")) {
      await db.collection("clients").doc(id).delete();
      showToast("Client deleted.", "success");
      loadClients();
    }
  }

  // --- 14. Toast Notification ---
  function showToast(message, type = "info") {
    let toast = document.getElementById("toast-message");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-message";
      toast.className = "fixed top-6 right-6 z-50 px-5 py-2.5 rounded-lg shadow-lg text-white font-semibold text-base transition opacity-0 pointer-events-none";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className =
      "fixed top-6 right-6 z-50 px-5 py-2.5 rounded-lg shadow-lg text-white font-semibold text-base transition toast " +
      (type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-gray-800");
    toast.style.opacity = "1";
    toast.style.pointerEvents = "auto";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.pointerEvents = "none";
    }, 2000);
  }

    // --- 15. Initial Load ---
  loadClients();
};

