const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error while encrypting password' });
        }
        
        // Membuat user dengan password yang sudah terenkripsi
        const user = new User({ username, password: hashedPassword, role });
        user.save()
        .then((savedUser) => {
            res.status(201).json({ user: savedUser });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error saving user to the database' });
        });
    });
};
