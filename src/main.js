const { BrowserWindow, Notification } = require('electron')
const { getConnection } = require('./database')


async function getProduct() {
    try {
        const conn = await getConnection()
        const results = await conn.query('SELECT * FROM product order by id desc')
            // console.log(results);
        return results
    } catch (error) {
        console.log(error);
    }
}

async function getProductById(id) {
    try {
        const conn = await getConnection()
        const result = await conn.query('SELECT * FROM product where id=?', id)
        return result[0]
    } catch (error) {
        console.log(error);
    }
}


async function createProduct(product) {
    try {
        const conn = await getConnection()
        product.price = parseFloat(product.price)
        const result = await conn.query('insert into product set ?', product)

        //notificaciones sistema
        new Notification({
            title: 'electron Mysql',
            body: 'New Product Saved Successfully'
        }).show()

        product.id = result.insertId

        return product

    } catch (error) {
        console.log(error);
    }
}

async function updateProduct(id, product) {
    const conn = await getConnection()
    const result = await conn.query('update product set ? where id=?', [product, id])
    console.log(result);
}

async function deleteProduct(id) {
    const conn = await getConnection()
    const result = await conn.query('delete from product where id=?', id)
    console.log(result);
    return result
}



let window

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/ui/index.html')
}

module.exports = {
    createWindow,
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}