// Firestore setup
const db = window.firebase.firestore();
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
  const name = document.getElementById("ingredientName").value.trim();
  const cost = parseFloat(document.getElementById("ingredientCost").value);
  const size = parseFloat(document.getElementById("ingredientSize").value);
  const unit = document.getElementById("ingredientUnit").value;
  if (!name || isNaN(cost) || isNaN(size) || !unit) {
    alert("Please fill all fields.");
    return;
  }
  const data = {
    name, packageCost: cost, packageSize: size, packageUnit: unit,
    allowedUnits: unit === "g" || unit === "kg" ? ["g", "kg"] : ["ml", "L"]
  };
  if (editIngredientId) {
    await db.collection("ingredients").doc(editIngredientId).set(data);
    // Update costRows if any entry matches the edited ingredient
    costRows = costRows.map(row => {
      if (row.ingredient === name) {
        // Recalculate cost with updated ingredient details
        const updatedCost = window.BakingCalculator.calculateCost(name, row.amount, row.unit);
        return { ...row, cost: updatedCost };
      }
      return row;
    });
    renderCostTable(); // Re-render the table to show updated cost
    editIngredientId = null;
    document.getElementById("ingredientFormTitle").textContent = "Add Ingredient";
    document.getElementById("ingredientFormBtn").textContent = "Add Ingredient";
    document.getElementById("cancelEditBtn").style.display = "none";
  } else {
    await db.collection("ingredients").add(data);
  }
  document.getElementById("addEditIngredientForm").reset();
  loadIngredients();
});

document.getElementById("cancelEditBtn").addEventListener("click", function() {
  editIngredientId = null;
  document.getElementById("addEditIngredientForm").reset();
  document.getElementById("ingredientFormTitle").textContent = "Add Ingredient";
  document.getElementById("ingredientFormBtn").textContent = "Add Ingredient";
  this.style.display = "none";
});

async function loadIngredients() {
  const snapshot = await db.collection("ingredients").get();
  const tableBody = document.getElementById("ingredientsTableBody");
  const select = document.getElementById("ingredientSelect");
  window.BakingCalculator.ingredients = [];
  tableBody.innerHTML = "";
  select.innerHTML = '<option value="">Select ingredient</option>';
  snapshot.forEach(doc => {
    const ing = doc.data();
    ing.id = doc.id;
    window.BakingCalculator.ingredients.push(ing);
    // Table row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2 px-4">${ing.name}</td>
      <td class="py-2 px-4">${ing.packageSize}</td>
      <td class="py-2 px-4">${ing.packageUnit}</td>
      <td class="py-2 px-4">${ing.packageCost}</td>
      <td class="py-2 px-4 flex gap-2">
        <button class="editBtn bg-indigo-500 text-white px-2 py-1 rounded" data-id="${ing.id}">Edit</button>
        <button class="deleteBtn bg-red-500 text-white px-2 py-1 rounded" data-id="${ing.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
    // Dropdown option
    const opt = document.createElement("option");
    opt.value = ing.name;
    opt.textContent = ing.name;
    select.appendChild(opt);
  });
  // Delete logic
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = async function() {
      await db.collection("ingredients").doc(btn.getAttribute("data-id")).delete();
      loadIngredients();
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
      document.getElementById("ingredientFormBtn").textContent = "Update Ingredient";
      document.getElementById("cancelEditBtn").style.display = "inline-block";
    };
  });
}

// --- Recipe Calculator Logic ---

// Allowed units logic for calculator
document.getElementById("ingredientSelect").addEventListener("change", function() {
  const units = window.BakingCalculator.getAllowedUnits(this.value);
  const unitSelect = document.getElementById("usedUnit");
  unitSelect.innerHTML = '<option value="">Select unit</option>';
  units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    unitSelect.appendChild(opt);
  });
});

// Add to calculation summary table
document.getElementById("calcBtn").addEventListener("click", function() {
  const ingredient = document.getElementById("ingredientSelect").value;
  const amount = parseFloat(document.getElementById("usedAmount").value);
  const unit = document.getElementById("usedUnit").value;
  if (!ingredient || isNaN(amount) || amount <= 0 || !unit) {
    alert("Please fill all fields with valid values.");
    return;
  }
  // Check if ingredient already exists in costRows for the same unit
  const existingIdx = costRows.findIndex(row => row.ingredient === ingredient && row.unit === unit);
  const cost = window.BakingCalculator.calculateCost(ingredient, amount, unit);
  if (existingIdx !== -1) {
    // Update the existing row
    costRows[existingIdx] = { ingredient, amount, unit, cost };
  } else {
    // Add new row
    costRows.push({ ingredient, amount, unit, cost });
  }
  renderCostTable();
  document.getElementById("recipeForm").reset();
  document.getElementById("usedUnit").innerHTML = '<option value="">Select unit</option>';
});

// Render calculation summary table
function renderCostTable() {
  const tbody = document.getElementById("costTableBody");
  tbody.innerHTML = "";
  let total = 0;
  costRows.forEach((row, idx) => {
    total += row.cost;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.ingredient}</td>
      <td>${row.amount}</td>
      <td>${row.unit}</td>
      <td>₹${row.cost}</td>
      <td>
        <button class="bg-red-500 text-white px-2 py-1 rounded removeRowBtn" data-idx="${idx}">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.querySelectorAll(".removeRowBtn").forEach(btn => {
    btn.onclick = function() {
      costRows.splice(parseInt(btn.getAttribute("data-idx")), 1);
      renderCostTable();
    };
  });
  // Show total below table, styled
  document.getElementById("calcSummaryTotal").innerHTML = costRows.length
    ? `<div class="bg-slate-100 text-slate-700 rounded-md px-6 py-4 font-semibold shadow-sm inline-block">
        <span class="text-base">Total Cost:</span>
        <span class="text-xl font-bold ml-2">₹${total.toFixed(2)}</span>
      </div>`
    : "";
}

// Reset calculations
document.getElementById("resetCalcBtn").addEventListener("click", function() {
  costRows = [];
  renderCostTable();
  document.getElementById("recipeForm").reset();
  document.getElementById("usedUnit").innerHTML = '<option value="">Select unit</option>';
});

// Final summary with all extra costs and profit %
document.getElementById("calcFinalBtn").addEventListener("click", function() {
  let total = costRows.reduce((sum, row) => sum + row.cost, 0);
  let labour = parseFloat(document.getElementById("labourCost").value) || 0;
  let maintenance = parseFloat(document.getElementById("maintenanceCost").value) || 0;
  let licensing = parseFloat(document.getElementById("licensingCost").value) || 0;
  let packaging = parseFloat(document.getElementById("packagingCost").value) || 0;
  let electricity = parseFloat(document.getElementById("electricityCost").value) || 0;
  let profitPercent = parseFloat(document.getElementById("profitPercent").value) || 0;

  let baseTotal = total + labour + maintenance + licensing + packaging + electricity;
  let profitAmount = (profitPercent / 100) * baseTotal;
  let finalTotal = baseTotal + profitAmount;

  document.getElementById("finalSummary").innerHTML = `
    <div class="bg-indigo-50 text-indigo-700 rounded-lg px-6 py-4 font-semibold shadow text-center">
      <div>Base Total: <span class="font-bold">₹${baseTotal.toFixed(2)}</span></div>
      <div>Profit (${profitPercent}%): <span class="font-bold">₹${profitAmount.toFixed(2)}</span></div>
      <div class="mt-2 text-xl">Final Cost: <span class="text-indigo-900 font-extrabold">₹${finalTotal.toFixed(2)}</span></div>
    </div>
  `;
});

// Reset Final Summary
document.getElementById("resetFinalBtn").addEventListener("click", function() {
  document.getElementById("labourCost").value = 0;
  document.getElementById("maintenanceCost").value = 0;
  document.getElementById("licensingCost").value = 0;
  document.getElementById("packagingCost").value = 0;
  document.getElementById("electricityCost").value = 0;
  document.getElementById("profitPercent").value = 0;
  document.getElementById("finalSummary").innerHTML = "";
});

// Initial load
document.addEventListener("DOMContentLoaded", loadIngredients);
