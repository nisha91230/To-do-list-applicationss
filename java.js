const socket = io();

let stockData = {};

function renderStock(stock) {
    stockData[stock.symbol] = stockData[stock.symbol] || {};
    const oldPrice = stockData[stock.symbol].price || stock.price;
    const changePercent = (((stock.price - oldPrice) / oldPrice) * 100).toFixed(2);

    stockData[stock.symbol] = stock;

    let row = document.getElementById(stock.symbol);
    if (!row) {
        row = document.createElement("tr");
        row.id = stock.symbol;
        row.innerHTML = `
            <td>${Object.keys(stockData).length}</td>
            <td>${stock.symbol}</td>
            <td>${stock.price}</td>
            <td>${changePercent}%</td>
            <td>${new Date().toLocaleTimeString()}</td>
        `;
        document.getElementById("stocks-body").appendChild(row);
    } else {
        row.cells[2].innerText = stock.price;
        row.cells[3].innerText = changePercent + "%";
        row.cells[4].innerText = new Date().toLocaleTimeString();
    }
}

// Load initial stocks
fetch("/stocks")
    .then(res => res.json())
    .then(stocks => stocks.forEach(renderStock));

// Listen for updates
socket.on("stock-update", (stock) => {
    renderStock(stock);
});

socket.on("new-stock", (stock) => {
    renderStock(stock);
});

function addStock() {
    const symbol = document.getElementById("symbol").value.toUpperCase();
    const price = parseFloat(document.getElementById("price").value);
    if (!symbol || isNaN(price)) {
        alert("Enter valid stock symbol and price");
        return;
    }
    fetch("/add-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, price }),
    });
}