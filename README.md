# Monthly Expense Tracker

A simple, beginner-friendly web application to track monthly income and expenses. This project was developed as a BCA mini project to demonstrate the basics of web development using vanilla HTML, CSS, and JavaScript.

## 🎯 Project Objective
The goal of this project is to create an easy-to-use application where users can log their financial transactions. It aims to showcase fundamental concepts of DOM manipulation, form validation, and data persistence without relying on complex backend systems or frameworks.

## 🌟 Features
- **Dashboard:** A clear overview of Total Income, Total Expense, and Remaining Balance.
- **Add Transactions:** Easily log new transactions with details like Amount, Type, Category, Description, and Date.
- **Categorization:** Classify expenses and incomes correctly (Food, Rent, Salary, etc.).
- **Transaction List:** A structured HTML table displaying all saved transactions in descending date order.
- **Delete Transactions:** Remove incorrect or outdated entries with a convenient delete action.
- **Data Persistence:** Uses the browser's Local Storage to ensure data remains saved even when the page is refreshed or closed.
- **Responsive Layout:** Automatically adapts to desktops, tablets, and smartphones using Flexbox media queries.

## 💻 Technologies Used
This project is built purely with standard web technologies:
- **HTML5:** Structures the webpage components effortlessly.
- **CSS3:** Styles the interface professionally, using clean layout techniques (Flexbox) and standard hover effects.
- **JavaScript (Vanilla):** Handles everything from arithmetic calculations and Local Storage management to dynamic DOM manipulation.

## 🚀 How It Works
1. **Adding a Transaction:** When a user dictates the amount, category, date, and description, submitting the form activates the `addTransaction()` function.
2. **Validation:** Basic HTML `required` attributes and JavaScript conditionals verify completeness of the data before logging it.
3. **Persisting Data:** Passing the list to `saveData()` serializes the transaction array using `JSON.stringify` and archives it via `localStorage.setItem`.
4. **Presenting Information:** `displayTransactions()` rebuilds the table displaying detailed entries, whilst `updateSummary()` adjusts numerical displays dynamically.
5. **Deleting Iterations:** A delete button click propagates to the `deleteTransaction(id)` function, isolating the array against the id and synchronizing the changes backward to local storage.
6. **Initializing Protocol:** On primary execution (`DOMContentLoaded`), `loadData()` de-serializes and updates arrays and interface states identically to prior active sessions.

## 🔮 Future Enhancements
- Data Visualization (Charts/Graphs for expense analysis)
- Specific time-frame filtering (Last week, last month)
- Data export features (CSV/PDF)
- Dark Mode toggle for varied aesthetic preferences

---
*Created for a simplistic 5-10 minute presentation prioritizing web fundamentals.*
# Monthly-Expense-Tracker
