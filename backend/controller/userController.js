import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = 'your_jwt_secret_key';

export const registerUser = async (req, res) => {
    

    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).send('All fields are required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
         db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('User created successfully');
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {   
            return res.status(400).send('All fields are required');
        }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(400).send('User not found');

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.send('Login successful');
    });   
    } 
    catch (error) {
        console.log(error, " loginUser function" )
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');  // Clear the JWT token cookie
    res.send('Logout successful');
};

