const productForm = document.getElementById('productForm')

const { remote } = require('electron')
const main = remote.require('./main')

const productName = document.getElementById('name')
const productPrice = document.getElementById('price')
const productDescription = document.getElementById('description')
const listProducts = document.getElementById('products')


let products = [];
let editingStatus = false;
let editproductId = '';

productForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    const newProducto = {
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }
    if (!editingStatus) {
        const result = await main.createProduct(newProducto)
        console.log(result);
    } else {
        await main.updateProduct(editproductId, newProducto)
        editingStatus = false;
        editproductId = '';
    }

    productForm.reset()
    productName.focus()

    getProducts()
})

async function deleteProduct(id) {
    const response = confirm('Esta seguro de eliminar este producto?')
    if (response) {
        await main.deleteProduct(id)
        getProducts()
    }
    return
}

const editProduct = async(id) => {
    const product = await main.getProductById(id)
    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description

    editingStatus = true
    editproductId = product.id
}

function renderProducts(products) {
    listProducts.innerHTML = '';
    products.forEach(product => {
        listProducts.innerHTML += `
            <div class="card card-body my-2 animated fadeInLeft">
                <h4>${product.name}</h4>
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                    <button class="btn btn-primary" onclick="editProduct('${product.id}')">Edit</button>
                </p>
            </div>
        
        `
    });
}

const getProducts = async() => {
    products = await main.getProduct()
    renderProducts(products)
}


async function init() {
    getProducts();
}

init()