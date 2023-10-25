// Initialize dataPro array from local storage or create an empty array if it doesn't exist
let dataPro = localStorage.getItem("productData") ? JSON.parse(localStorage.getItem("productData")) : [];

// Get references to HTML elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let seralNumber = document.getElementById("seral_number");
let stroge = document.getElementById("stroge");
let submit = document.getElementById("submit");
let mood = 'create';
let tmp;
let searchMode = 'searchtitle'; // Default search mode

// Add event listener to calculate total
document.querySelectorAll('.price input').forEach(function (input) {
    input.addEventListener("keyup", calculateTotal);
});

// Function to calculate total
function calculateTotal() {
    let priceValue = parseFloat(price.value) || 0;
    let taxesValue = parseFloat(taxes.value) || 0;
    let adsValue = parseFloat(ads.value) || 0;
    let discountValue = parseFloat(discount.value) || 0;

    if (priceValue !== 0) {
        var result = priceValue - taxesValue + adsValue - discountValue;
        total.style.backgroundColor = "#040";
        total.textContent = result.toFixed(2);
    } else {
        total.textContent = "";
        total.style.backgroundColor = "#a00d02";
    }
}

// Function to handle form submission (create or update product)
submit.onclick = function () {
    let newPro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.textContent,
        count: count.value,
        category: category.value,
        seral_number: seralNumber.value,
        stroge: stroge.value,
    };

    if (mood === 'create') {
        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push({ ...newPro });
            }
        } else {
            dataPro.push(newPro);
        }
    } else {
        dataPro[tmp] = { ...newPro };
        mood = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
    }

    localStorage.setItem("productData", JSON.stringify(dataPro));
    clearData();
    showData();
};

// Function to clear input fields
function clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.textContent = "";
    count.value = "";
    category.value = "";
    seralNumber.value = "";
    stroge.value = "";
    total.style.backgroundColor = "#a00d02";
}

// Function to display products in the table
function showData() {
    let table = "";

    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td>${dataPro[i].seral_number}</td>
                <td>${dataPro[i].stroge}</td>
                <td><button onclick="editData(${i})">Edit</button></td>
                <td><button onclick="deleteData(${i})">Delete</button></td>
            </tr>`;
    }
    document.getElementById("tbody").innerHTML = table;

    let btnDeleteAll = document.getElementById("deleteall");

    if (dataPro.length > 0) {
        btnDeleteAll.innerHTML = `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
    } else {
        btnDeleteAll.innerHTML = '';
    }
}

// Function to edit a product by index
function editData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    category.value = dataPro[i].category;
    count.value = dataPro[i].count;
    seralNumber.value = dataPro[i].seral_number;
    stroge.value = dataPro[i].stroge;

    calculateTotal();
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Function to delete a product by index
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem("productData", JSON.stringify(dataPro));
    showData();
}

// Function to delete all products and clear local storage
function deleteAll() {
    localStorage.clear();
    dataPro = [];
    showData();
}

// Initial display of data
showData();

// Function to switch search mode (title or seral_number)
function getSearchMood(mood) {
    searchMode = mood;
}

// Function to search products by title or seral_number
function searchdata(searchValue) {
    if (!searchValue) {
        showData();
        return;
    }

    let searchResults;
    if (searchMode === 'searchtitle') {
        searchResults = dataPro.filter(product => product.title.toLowerCase().includes(searchValue.toLowerCase()));
    } else if (searchMode === 'searchseralnumber') {
        searchResults = dataPro.filter(product => product.seral_number.toLowerCase().includes(searchValue.toLowerCase()));
    }

    const searchTable = searchResults.map((product, i) => `
        <tr>
            <td>${i}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td>${product.seral_number}</td>
            <td>${product.stroge}</td>
            <td><button onclick="editData(${dataPro.indexOf(product)})">Edit</button></td>
            <td><button onclick="deleteData(${dataPro.indexOf(product)})">Delete</button></td>
        </tr>
    `).join("");
    document.getElementById("tbody").innerHTML = searchTable;
}
