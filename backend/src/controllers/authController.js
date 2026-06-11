import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Token banane ka helper function
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 din baad expire hoga
  );
};

// ─── REGISTER ───────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Saari fields hain?
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Saari fields bharni zaroori hain' });
    }

    // 2. Email pehle se registered toh nahi?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered hai' });
    }

    // 3. Password encrypt karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. User save karo
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Token banao aur bhejo
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
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};