const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/customers.json');

const getCustomers = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const saveCustomers = (customers) => {
    fs.writeFileSync(dataPath, JSON.stringify(customers, null, 4));
};

router.get('/', (req, res) => {
    const customers = getCustomers();
    res.json(customers);
});

router.post('/', (req, res) => {
    const customers = getCustomers();
    const newCustomer = {
        id: Date.now(),
        ...req.body
    };
    customers.push(newCustomer);
    saveCustomers(customers);
    res.status(201).json(newCustomer);
});

router.put('/:id', (req, res) => {
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));

    if (index !== -1) {
        customers[index] = { ...customers[index], ...req.body };
        saveCustomers(customers);
        res.json(customers[index]);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});

router.delete('/:id', (req, res) => {
    let customers = getCustomers();
    const initialLength = customers.length;
    customers = customers.filter(c => c.id !== parseInt(req.params.id));

    if (customers.length !== initialLength) {
        saveCustomers(customers);
        res.json({ message: 'Customer removed' });
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});

module.exports = router;
