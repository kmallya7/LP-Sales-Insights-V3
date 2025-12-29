// js/calculations.js

// Firestore setup
const db = window.firebase.firestore();

// Initialize Notification Toast
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'center', y: 'top' },
  ripple: true,
  types: [
    { type: 'error', background: '#ef4444', icon: false },
    { type: 'success', background: '#10b981', icon: false }
  ]
});

window.BakingCalculator = {
  ingredients: [],
  getAllowedUnits(name) {
    const ing = this.ingredients.find(i => i.name === name);
    if (!ing) return [];
    return ing.packageUnit === "g" || ing.packageUnit === "kg" ? ["g", "kg"] : ["ml", "L"];
  },
  calculateCost(name, amount, unit) {
    const ing = this.ingredients.find(i => i.name === name);
    if (!ing) return 0;
    // Convert to base unit
    const toBase = (val, u) => (u === "kg" || u === "L") ? val * 1000 : val;
    const usedBase = toBase(amount, unit);
    const packageBase = toBase(ing.packageSize, ing.packageUnit);
    const costPerBase = ing.packageCost / packageBase;
    return Math.round(usedBase * costPerBase * 100) / 100;
  }
};

let editIngredientId = null;
let costRows = [];

// --- Ingredient CRUD ---
document.getElementById("addEditIngredientForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const btn = document.getElementById("ingredientFormBtn");
  const ogText = btn.innerText;
  btn.innerText = "Saving...";
  btn.disabled = true;

  const name = document.getElementById("ingredientName").value.trim();
  const cost = parseFloat(document.getElementById("ingredientCost").value);
  const size = parseFloat(document.getElementById("ingredientSize").value);
  const unit = document.getElementById("ingredientUnit").value;
  
  if (!name || isNaN(cost) || isNaN(size) || !unit) {
    notyf.error("Please fill all fields correctly.");
    btn.innerText = ogText;
    btn.disabled = false;
    return;
  }
  
  const data = {
    name, packageCost: cost, packageSize: size, packageUnit: unit,
    allowedUnits: unit === "g" || unit === "kg" ? ["g", "kg"] : ["ml", "L"]
  };
  
  try {
    if (editIngredientId) {
      await db.collection("ingredients").doc(editIngredientId).set(data);
      // Update costRows if any entry matches the edited ingredient
      costRows = costRows.map(row => {
        if (row.ingredient === name) {
          const updatedCost = window.BakingCalculator.calculateCost(name, row.amount, row.unit);
          return { ...row, cost: updatedCost };
        }
        return row;
      });
      renderCostTable(); 
      editIngredientId = null;
      document.getElementById("ingredientFormTitle").textContent = "Add Ingredient";
      document.getElementById("ingredientFormBtn").textContent = "Add";
      document.getElementById("cancelEditBtn").classList.add("hidden"); 
      notyf.success("Ingredient updated.");
    } else {
      await db.collection("ingredients").add(data);
      notyf.success("Ingredient added.");
    }
    document.getElementById("addEditIngredientForm").reset();
    loadIngredients();
  } catch (error) {
    console.error(error);
    notyf.error("An error occurred.");
  } finally {
    btn.innerText = "Add";
    btn.disabled = false;
  }
});

document.getElementById("cancelEditBtn").addEventListener("click", function() {
  editIngredientId = null;
  document.getElementById("addEditIngredientForm").reset();
  document.getElementById("ingredientFormTitle").textContent = "Add Ingredient";
  document.getElementById("ingredientFormBtn").textContent = "Add";
  this.classList.add("hidden");
});

async function loadIngredients() {
  const tableBody = document.getElementById("ingredientsTableBody");
  const select = document.getElementById("ingredientSelect");
  
  // 1. Show Mini Aesthetic Loader inside Table
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="py-8 text-center">
        <div class="flex flex-col items-center justify-center gap-2">
           <div class="relative w-8 h-8">
             <div class="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20 animate-pulse"></div>
             <img src="assets/Flowr Logo.png" class="relative w-full h-full rounded-full animate-breath">
           </div>
           <span class="text-xs text-slate-400 font-medium">Loading pantry...</span>
        </div>
      </td>
    </tr>
  `;

  try {
    const snapshot = await db.collection("ingredients").orderBy("name").get();
    
    window.BakingCalculator.ingredients = [];
    tableBody.innerHTML = "";
    select.innerHTML = '<option value="">Select ingredient</option>';
    
    if (snapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="flex flex-col items-center justify-center py-8 text-slate-400">
               <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-full mb-2">
                 <i data-feather="database" class="w-5 h-5 opacity-50"></i>
               </div>
               <p class="text-xs font-medium">No ingredients found.</p>
            </div>
          </td>
        </tr>`;
    }

    snapshot.forEach(doc => {
      const ing = doc.data();
      ing.id = doc.id;
      window.BakingCalculator.ingredients.push(ing);
      
      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group";
      tr.innerHTML = `
        <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-200">${ing.name}</td>
        <td class="py-3 px-4 text-slate-500 dark:text-slate-400">${ing.packageSize}</td>
        <td class="py-3 px-4 text-slate-500 dark:text-slate-400">${ing.packageUnit}</td>
        <td class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">₹${ing.packageCost}</td>
        <td class="py-3 px-4 flex gap-2">
          <button class="editBtn p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" data-id="${ing.id}" title="Edit">
            <i data-feather="edit-2" class="w-4 h-4"></i>
          </button>
          <button class="deleteBtn p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" data-id="${ing.id}" title="Delete">
            <i data-feather="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
      
      const opt = document.createElement("option");
      opt.value = ing.name;
      opt.textContent = ing.name;
      select.appendChild(opt);
    });

    if (window.feather) window.feather.replace();

    // Delete logic
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.onclick = async function() {
        if(confirm("Delete this ingredient?")) {
          await db.collection("ingredients").doc(btn.getAttribute("data-id")).delete();
          notyf.success("Deleted.");
          loadIngredients();
        }
      };
    });

    // Edit logic
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.onclick = function() {
        const ing = window.BakingCalculator.ingredients.find(i => i.id === btn.getAttribute("data-id"));
        if (!ing) return;
        editIngredientId = ing.id;
        document.getElementById("ingredientName").value = ing.name;
        document.getElementById("ingredientCost").value = ing.packageCost;
        document.getElementById("ingredientSize").value = ing.packageSize;
        document.getElementById("ingredientUnit").value = ing.packageUnit;
        
        document.getElementById("ingredientFormTitle").textContent = "Edit Ingredient";
        document.getElementById("ingredientFormBtn").textContent = "Update";
        document.getElementById("cancelEditBtn").classList.remove("hidden");
        
        // Scroll to form
        document.getElementById("addEditIngredientForm").scrollIntoView({behavior: 'smooth'});
      };
    });

  } catch (e) {
    console.error(e);
    tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-red-400 text-sm">Error loading data.</td></tr>`;
  }
}

// --- Recipe Calculator Logic ---

document.getElementById("ingredientSelect").addEventListener("change", function() {
  const units = window.BakingCalculator.getAllowedUnits(this.value);
  const unitSelect = document.getElementById("usedUnit");
  unitSelect.innerHTML = '<option value="">Unit</option>';
  units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    unitSelect.appendChild(opt);
  });
});

document.getElementById("calcBtn").addEventListener("click", function() {
  const ingredient = document.getElementById("ingredientSelect").value;
  const amount = parseFloat(document.getElementById("usedAmount").value);
  const unit = document.getElementById("usedUnit").value;
  
  if (!ingredient || isNaN(amount) || amount <= 0 || !unit) {
    notyf.error("Please fill all calculator fields.");
    return;
  }

  const existingIdx = costRows.findIndex(row => row.ingredient === ingredient && row.unit === unit);
  const cost = window.BakingCalculator.calculateCost(ingredient, amount, unit);
  
  if (existingIdx !== -1) {
    costRows[existingIdx] = { ingredient, amount, unit, cost };
  } else {
    costRows.push({ ingredient, amount, unit, cost });
  }
  
  renderCostTable();
  document.getElementById("recipeForm").reset();
  document.getElementById("usedUnit").innerHTML = '<option value="">Unit</option>';
});

function renderCostTable() {
  const tbody = document.getElementById("costTableBody");
  tbody.innerHTML = "";
  let total = 0;
  
  if (costRows.length === 0) {
     tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="flex flex-col items-center justify-center py-8 text-slate-400">
               <div class="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full mb-2">
                 <i data-feather="shopping-cart" class="w-5 h-5 opacity-50 text-indigo-500"></i>
               </div>
               <p class="text-xs font-medium">Calculator is empty.</p>
            </div>
          </td>
        </tr>`;
  }

  costRows.forEach((row, idx) => {
    total += row.cost;
    const tr = document.createElement("tr");
    tr.className = "border-b border-indigo-50 dark:border-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors";
    tr.innerHTML = `
      <td class="p-3 text-indigo-900 dark:text-indigo-200 font-medium">${row.ingredient}</td>
      <td class="p-3 text-slate-500 dark:text-slate-400">${row.amount}</td>
      <td class="p-3 text-slate-500 dark:text-slate-400">${row.unit}</td>
      <td class="p-3 text-slate-700 dark:text-slate-200 font-bold">₹${row.cost}</td>
      <td class="p-3">
        <button class="removeRowBtn text-slate-400 hover:text-red-500 transition-colors p-1" data-idx="${idx}" title="Remove">
          <i data-feather="x" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.feather) window.feather.replace();

  document.querySelectorAll(".removeRowBtn").forEach(btn => {
    btn.onclick = function() {
      costRows.splice(parseInt(btn.getAttribute("data-idx")), 1);
      renderCostTable();
    };
  });

  // Updated Total Display with Gradient
  document.getElementById("calcSummaryTotal").innerHTML = costRows.length
    ? `<div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-blue-200 dark:shadow-none inline-flex items-center gap-4">
        <span class="text-xs font-bold opacity-80 uppercase tracking-wider">Total Cost</span>
        <span class="text-xl font-bold">₹${total.toFixed(2)}</span>
      </div>`
    : "";
}

document.getElementById("resetCalcBtn").addEventListener("click", function() {
  if(costRows.length === 0) return;
  if(confirm("Clear all items from calculator?")) {
    costRows = [];
    renderCostTable();
    document.getElementById("recipeForm").reset();
    document.getElementById("usedUnit").innerHTML = '<option value="">Unit</option>';
  }
});

// Final summary with GROSS MARGIN Logic
document.getElementById("calcFinalBtn").addEventListener("click", function() {
  let total = costRows.reduce((sum, row) => sum + row.cost, 0);
  
  if (total === 0) {
      notyf.error("Please add ingredients before calculating final price.");
      return;
  }

  let labour = parseFloat(document.getElementById("labourCost").value) || 0;
  let maintenance = parseFloat(document.getElementById("maintenanceCost").value) || 0;
  let licensing = parseFloat(document.getElementById("licensingCost").value) || 0;
  let packaging = parseFloat(document.getElementById("packagingCost").value) || 0;
  let electricity = parseFloat(document.getElementById("electricityCost").value) || 0;
  let profitPercent = parseFloat(document.getElementById("profitPercent").value) || 0;

  if (profitPercent >= 100) {
      notyf.error("Profit margin must be less than 100%");
      return;
  }

  let baseTotal = total + labour + maintenance + licensing + packaging + electricity;

  // Formula: Price = Cost / (1 - Margin%)
  let finalTotal = baseTotal / (1 - (profitPercent / 100));
  let profitAmount = finalTotal - baseTotal;

  document.getElementById("finalSummary").innerHTML = `
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <div class="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Base Cost</p>
            <p class="text-2xl font-bold text-slate-700 dark:text-slate-200">₹${baseTotal.toFixed(2)}</p>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-between">
            <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Profit (${profitPercent}%)</p>
            <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">₹${profitAmount.toFixed(2)}</p>
        </div>
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none text-white flex flex-col justify-between transform hover:-translate-y-1 transition-transform">
            <p class="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">Final Price</p>
            <p class="text-3xl font-extrabold">₹${finalTotal.toFixed(2)}</p>
        </div>
    </div>
  `;
});

document.getElementById("resetFinalBtn").addEventListener("click", function() {
  document.getElementById("labourCost").value = 0;
  document.getElementById("maintenanceCost").value = 0;
  document.getElementById("licensingCost").value = 0;
  document.getElementById("packagingCost").value = 0;
  document.getElementById("electricityCost").value = 0;
  document.getElementById("profitPercent").value = 20;
  document.getElementById("finalSummary").innerHTML = "";
});

// Initial load
document.addEventListener("DOMContentLoaded", loadIngredients);