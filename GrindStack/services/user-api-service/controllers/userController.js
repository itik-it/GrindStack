const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log("Received user data:", req.body);
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error("Error during user registration:", err); 
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ 
      token, 
      userId: user.userId,
      username: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
