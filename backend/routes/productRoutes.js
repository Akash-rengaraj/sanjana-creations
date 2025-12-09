const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

// Helper to read data
const getProducts = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// Helper to save data
const saveProducts = (products) => {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 4));
};

// GET all products
router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

// GET product by ID
router.get('/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// POST new product
router.post('/', (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: Date.now(), // Simple ID generation
        ...req.body
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));

    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        saveProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// DELETE product
router.delete('/:id', (req, res) => {
    let products = getProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== parseInt(req.params.id));

    if (products.length !== initialLength) {
        saveProducts(products);
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;
