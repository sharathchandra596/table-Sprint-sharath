import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key';

export const authenticateToken = (req, res, next) => {
   try {
    const token = req.cookies.token;
    if (!token) return res.status(403).send('Access denied. No token provided.');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
   } catch (error) {
    console.log(error, "from authenticateToken function")
    next(error)
   }
};

