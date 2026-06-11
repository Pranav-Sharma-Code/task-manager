import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. Please login again' 
    });
    }

    const token = authHeader.split(' ')[1];

    // Token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.user = decoded;

    next(); 

  } catch (error) {
    res.status(401).json({ 
        message: 'Authentication failed. Please login again'
    });
  }
};

export default protect;