import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//                        Token Generate

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } 
  );
};

//                          REGISTER

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
 

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please fill all required fields' 
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email is already registered'
      });
    }

    //                   Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ 
        message: 'Server error: ' + error.message
    });
  }
};

//                                        LOGIN 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please fill all required fields'
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password'
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid email or password'
      });
    }

    
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ 
        message: 'Server error: ' + error.message
    });
  }
};

//                                       GET PROFILE 

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error: ' + error.message
    });
  }
};