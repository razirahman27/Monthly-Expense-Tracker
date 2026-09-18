let transactions = [],
  currentEditId = null,
  trendsChart = null,
  transactionForm = document.getElementById("transaction-form"),
  amountInput = document.getElementById("amount"),
  typeInput = document.getElementById("type"),
  categoryInput = document.getElementById("category"),
  descriptionInput = document.getElementById("description"),
  dateInput = document.getElementById("date"),
  transactionTbody = document.getElementById("transaction-tbody"),
  formTitle = document.getElementById("form-title"),
  submitBtn = transactionForm.querySelector('button[type="submit"]'),
  totalIncomeEl = document.getElementById("total-income"),
  totalExpenseEl = document.getElementById("total-expense"),
  remainingBalanceEl = document.getElementById("remaining-balance"),
  btnExportCsv = document.getElementById("btn-export-csv"),
  btnImportCsv = document.getElementById("btn-import-csv"),
  filterMonthSelect = document.getElementById("filter-month"),
  filterYearSelect = document.getElementById("filter-year"),
  fileImportCsv = document.getElementById("file-import-csv");
function addTransaction(e) {
  e.preventDefault();
  let amountValue = amountInput.value,
    descriptionValue = descriptionInput.value,
    typeValue = typeInput.value,
    categoryValue = categoryInput.value,
    dateValue = dateInput.value;
  if ("" !== amountValue && "" !== descriptionValue) {
    if (currentEditId) {
      for (let i = 0; i < transactions.length; i++)
        if (transactions[i].id === currentEditId) {
          ((transactions[i].amount = Number(amountValue)),
            (transactions[i].type = typeValue),
            (transactions[i].category = categoryValue),
            (transactions[i].description = descriptionValue),
            (transactions[i].date = dateValue));
          break;
        }
      ((currentEditId = null),
        (formTitle.textContent = "Add Transaction"),
        (submitBtn.textContent = "Add Transaction"));
    } else {
      let newTransaction = {
        id: Date.now(),
        amount: Number(amountValue),
        type: typeValue,
        category: categoryValue,
        description: descriptionValue,
        date: dateValue,
      };
      transactions.push(newTransaction);
    }
    (saveData(), refreshUI(), transactionForm.reset(), setDefaultDate());
  } else alert("Please enter both Amount and Description!");
}
function editTransaction(id) {
  let transaction = transactions.find((t) => t.id === id);
  transaction &&
    ((amountInput.value = transaction.amount),
    (descriptionInput.value = transaction.description),
    (typeInput.value = transaction.type),
    (categoryInput.value = transaction.category),
    (dateInput.value = transaction.date),
    (currentEditId = id),
    (formTitle.textContent = "Edit Transaction"),
    (submitBtn.textContent = "Update Transaction"),
    document
      .querySelector(".add-transaction")
      .scrollIntoView({ behavior: "smooth" }));
}
function getFilteredTransactions() {
  let monthVal = filterMonthSelect.value;
  let yearVal = filterYearSelect.value;
  return transactions.filter((t) => {
    let [tYear, tMonth] = t.date.split("-");
    let monthMatch = monthVal ? tMonth === monthVal : true;
    let yearMatch = yearVal ? tYear === yearVal : true;
    return monthMatch && yearMatch;
  });
}
function displayTransactions() {
  transactionTbody.innerHTML = "";
  let filteredTransactions = getFilteredTransactions();
  for (let i = 0; i < filteredTransactions.length; i++) {
    let currentItem = filteredTransactions[i],
      row = document.createElement("tr"),
      styleClass =
        "income" === currentItem.type ? "type-income" : "type-expense";
    ((row.innerHTML =
      "<td>" +
      currentItem.date +
      "</td><td>" +
      currentItem.description +
      "</td><td>" +
      currentItem.category +
      "</td><td class='" +
      styleClass +
      "'>" +
      currentItem.type +
      "</td><td class='" +
      styleClass +
      "'>₹" +
      currentItem.amount +
      "</td><td><button class='btn-edit' onclick='editTransaction(" +
      currentItem.id +
      ")'>Edit</button><button class='btn-delete' onclick='deleteTransaction(" +
      currentItem.id +
      ")'>Delete</button></td>"),
      transactionTbody.appendChild(row));
  }
}
function deleteTransaction(id) {
  let updatedTransactions = [];
  for (let i = 0; i < transactions.length; i++)
    transactions[i].id !== id && updatedTransactions.push(transactions[i]);
  ((transactions = updatedTransactions),
    currentEditId === id &&
      ((currentEditId = null),
      (formTitle.textContent = "Add Transaction"),
      (submitBtn.textContent = "Add Transaction"),
      transactionForm.reset(),
      setDefaultDate()),
    saveData(),
    refreshUI());
}
function updateSummary() {
  let totalIncome = 0,
    totalExpense = 0,
    filteredTransactions = getFilteredTransactions();
  for (let i = 0; i < filteredTransactions.length; i++) {
    let currentItem = filteredTransactions[i];
    "income" === currentItem.type
      ? (totalIncome += currentItem.amount)
      : "expense" === currentItem.type && (totalExpense += currentItem.amount);
  }
  let remainingBalance = totalIncome - totalExpense;
  ((totalIncomeEl.textContent = "₹" + totalIncome),
    (totalExpenseEl.textContent = "₹" + totalExpense),
    (remainingBalanceEl.textContent = "₹" + remainingBalance));
}
function updateChart() {
  let filteredTransactions = getFilteredTransactions(),
    expenseByCategory = {};
  for (let i = 0; i < filteredTransactions.length; i++) {
    let t = filteredTransactions[i];
    "expense" === t.type &&
      (expenseByCategory[t.category]
        ? (expenseByCategory[t.category] += t.amount)
        : (expenseByCategory[t.category] = t.amount));
  }
  let labels = Object.keys(expenseByCategory),
    data = Object.values(expenseByCategory),
    ctx = document.getElementById("trendsChart").getContext("2d");
  (trendsChart && trendsChart.destroy(),
    (trendsChart =
      0 !== labels.length
        ? new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0",
                    "#9966ff",
                    "#ff9f40",
                    "#8e44ad",
                    "#2ecc71",
                  ],
                },
              ],
            },
            options: {
              responsive: !0,
              maintainAspectRatio: !1,
              plugins: { legend: { position: "right" } },
            },
          })
        : new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: ["No expenses"],
              datasets: [{ data: [1], backgroundColor: ["#ecf0f1"] }],
            },
            options: { responsive: !0, maintainAspectRatio: !1 },
          })));
}
function updateYearOptions() {
  let selectedYear = filterYearSelect.value;
  let years = [...new Set(transactions.map((t) => t.date.substring(0, 4)))].sort();
  filterYearSelect.innerHTML = '<option value="">All Years</option>';
  years.forEach((year) => {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    if (year === selectedYear) option.selected = true;
    filterYearSelect.appendChild(option);
  });
}
function refreshUI() {
  updateYearOptions();
  displayTransactions();
  updateSummary();
  updateChart();
}
function exportCSV() {
  let filteredTransactions = getFilteredTransactions();
  if (0 === filteredTransactions.length)
    return void alert("No transactions to export.");
  let csvContent = "Date,Description,Category,Type,Amount\n";
  filteredTransactions.forEach((t) => {
    let desc = '"' + t.description.replace(/"/g, '""') + '"';
    csvContent += `${t.date},${desc},${t.category},${t.type},${t.amount}\n`;
  });
  let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
    url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.setAttribute("href", url);
  let monthVal = filterMonthSelect.value,
    yearVal = filterYearSelect.value,
    monthText = monthVal ? filterMonthSelect.options[filterMonthSelect.selectedIndex].text.toLowerCase() : "all_months",
    yearText = yearVal || "all_years",
    fileName = `expenses_${yearText}_${monthText}.csv`;
  (link.setAttribute("download", fileName),
    document.body.appendChild(link),
    link.click(),
    document.body.removeChild(link));
}
function parseCSVRow(row) {
  let result = [],
    current = "",
    inQuotes = !1;
  for (let i = 0; i < row.length; i++) {
    let char = row[i];
    inQuotes
      ? '"' === char
        ? i + 1 < row.length && '"' === row[i + 1]
          ? ((current += '"'), i++)
          : (inQuotes = !1)
        : (current += char)
      : '"' === char
        ? (inQuotes = !0)
        : "," === char
          ? (result.push(current), (current = ""))
          : (current += char);
  }
  return (result.push(current), result);
}
function importCSV(e) {
  let file = e.target.files[0];
  if (!file) return;
  if (
    file.type &&
    "text/csv" !== file.type &&
    "application/vnd.ms-excel" !== file.type &&
    !file.name.toLowerCase().endsWith(".csv")
  )
    return (
      alert("Please select a valid CSV file."),
      void (fileImportCsv.value = "")
    );
  let reader = new FileReader();
  ((reader.onload = function (event) {
    let text = event.target.result;
    if (!text)
      return (
        alert("The selected file is empty."),
        void (fileImportCsv.value = "")
      );
    let lines = text.split(/\r\n|\n/);
    if (lines.length < 2)
      return (
        alert("No valid data rows found in the CSV."),
        void (fileImportCsv.value = "")
      );
    let header = parseCSVRow(lines[0]);
    if (
      !["date", "description", "category", "type", "amount"].every(
        (col, idx) => header[idx] && header[idx].trim().toLowerCase() === col,
      )
    )
      return (
        alert(
          "CSV missing valid headers. Expected: date,description,category,type,amount",
        ),
        void (fileImportCsv.value = "")
      );
    let importedCount = 0,
      skippedCount = 0,
      baseTime = Date.now();
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      let row = parseCSVRow(line);
      if (row.length < 5) {
        skippedCount++;
        continue;
      }
      let rowDate = row[0].trim(),
        rowDesc = row[1].trim(),
        rowCat = row[2].trim(),
        rowType = row[3].trim().toLowerCase(),
        rowAmountStr = row[4].trim(),
        rowAmount = Number(rowAmountStr);
      if (!rowDate || isNaN(new Date(rowDate).getTime())) {
        skippedCount++;
        continue;
      }
      if (!rowDesc) {
        skippedCount++;
        continue;
      }
      if (!rowCat) {
        skippedCount++;
        continue;
      }
      if ("income" !== rowType && "expense" !== rowType) {
        skippedCount++;
        continue;
      }
      if (isNaN(rowAmount) || rowAmount <= 0) {
        skippedCount++;
        continue;
      }
      if (
        transactions.some(
          (t) =>
            t.date === rowDate &&
            t.description === rowDesc &&
            t.category === rowCat &&
            t.type === rowType &&
            t.amount === rowAmount,
        )
      ) {
        skippedCount++;
        continue;
      }
      let newTransaction = {
        id: baseTime + i,
        amount: rowAmount,
        type: rowType,
        category: rowCat,
        description: rowDesc,
        date: rowDate,
      };
      (transactions.push(newTransaction), importedCount++);
    }
    (alert(
      `Import Complete!\nSuccessfully imported: ${importedCount}\nSkipped (invalid/duplicates): ${skippedCount}`,
    ),
      saveData(),
      refreshUI(),
      (fileImportCsv.value = ""));
  }),
    (reader.onerror = function () {
      (alert("An error occurred while reading the file."),
        (fileImportCsv.value = ""));
    }),
    reader.readAsText(file));
}
function saveData() {
  let jsonString = JSON.stringify(transactions);
  localStorage.setItem("expense_tracker_data", jsonString);
}
function loadData() {
  let savedData = localStorage.getItem("expense_tracker_data");
  ((transactions = null !== savedData ? JSON.parse(savedData) : []),
    refreshUI());
}
function setDefaultDate() {
  let today = new Date(),
    year = today.getFullYear(),
    month = ("0" + (today.getMonth() + 1)).slice(-2),
    day = ("0" + today.getDate()).slice(-2);
  dateInput.value = year + "-" + month + "-" + day;
}
function initializeApp() {
  (setDefaultDate(), loadData());
}
((window.onload = initializeApp),
  transactionForm.addEventListener("submit", addTransaction),
  filterMonthSelect.addEventListener("change", refreshUI),
  filterYearSelect.addEventListener("change", refreshUI),
  btnExportCsv.addEventListener("click", exportCSV),
  btnImportCsv.addEventListener("click", () => {
    fileImportCsv.click();
  }),
  fileImportCsv.addEventListener("change", importCSV));
