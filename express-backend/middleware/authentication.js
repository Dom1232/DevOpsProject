import jwt from 'jsonwebtoken';

const authentication = {
    verifyAdminToken: (req, res, next) => {
        const token = req.cookies.token;
    
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: Admins only' });
            }
            req.admin = decoded;
    
            next();
        } catch (error) {
            res.status(403).json({ message: 'Invalid token' });
        }
    },
    
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default authentication;