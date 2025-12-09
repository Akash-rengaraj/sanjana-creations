const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/orders.json');

const getOrders = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const saveOrders = (orders) => {
    fs.writeFileSync(dataPath, JSON.stringify(orders, null, 4));
};

router.get('/', (req, res) => {
    const orders = getOrders();
    res.json(orders);
});

router.put('/:id', (req, res) => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === req.params.id);

    if (index !== -1) {
        orders[index] = { ...orders[index], ...req.body };
        saveOrders(orders);
        res.json(orders[index]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = router;
