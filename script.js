let expenses = [];
let totalAmount = 0;
let budget = 0;
let expenseChart; 

const categoryInput = document.getElementById('category-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const budgetInput = document.getElementById('budget-input');

addBtn.addEventListener('click', function () {
    const category = categoryInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    
    if (category === '') {
        alert('Please enter a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    expenses.push({ category, amount, date });

    totalAmount += amount;
    totalAmountCell.textContent = `₹${totalAmount.toFixed(2)}`; 

    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        expenses.splice(expenses.indexOf(expense), 1);

        totalAmount -= expense.amount;
        totalAmountCell.textContent = `₹${totalAmount.toFixed(2)}`;

        expensesTableBody.removeChild(newRow);
        updateBudget();
        updatePieChart();
    });

    const expense = expenses[expenses.length - 1];
    categoryCell.textContent = expense.category;
    amountCell.textContent = `₹${expense.amount.toFixed(2)}`;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);

    updateBudget();
    updatePieChart();
});

budgetInput.addEventListener('input', function () {
    budget = Math.max(0, Number(budgetInput.value) || 0);
    budgetInput.value = budget;
    updateBudget();
    updatePieChart();
});

function updateBudget() {
    const remainingBudget = budget - totalAmount;
    document.getElementById('remaining-budget').textContent = remainingBudget >= 0 ? `Remaining Budget: ₹${remainingBudget.toFixed(2)}` : 'Exceeded';
}

function updatePieChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    const categories = expenses.map(expense => expense.category);
    const amounts = expenses.map(expense => expense.amount);
    const uniqueCategories = [...new Set(categories)];

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: uniqueCategories,
            datasets: [{
                data: calculateCategoryAmounts(uniqueCategories, categories, amounts),
                backgroundColor: generateRandomColors(uniqueCategories.length),
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue);
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = ((currentValue / total) * 100).toFixed(2);
                        return `₹${currentValue.toFixed(2)} (${percentage}%)`;
                    },
                },
            },
        },
    });
}

function calculateCategoryAmounts(uniqueCategories, categories, amounts) {
    const categoryAmounts = Array(uniqueCategories.length).fill(0);

    for (let i = 0; i < categories.length; i++) {
        const index = uniqueCategories.indexOf(categories[i]);
        categoryAmounts[index] += amounts[i];
    }

    return categoryAmounts;
}

function generateRandomColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`;
        colors.push(randomColor);
    }
    return colors;
}