const jwt = require('jsonwebtoken');
const User = require('../Model/userModel'); // Remove duplicate import

// Register new user - Improved version
const register = async (req, res) => {
    try {
        const { username, email, password, role, department } = req.body;

        // Validate required fields
        if (!username || !email || !password || !department) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password, // Password will be hashed by the pre-save hook
            role: role || 'employee',
            department
        });

        // Explicitly save and wait for completion
        const savedUser = await user.save();
        
        if (!savedUser) {
            throw new Error('User not saved');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                department: savedUser.department
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: error.message 
        });
    }
};

// Login user - Improved version
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error logging in',
            error: error.message 
        });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        // User is already attached to req by verifyToken middleware
        const user = req.user;
        
        return res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        if (!userId || !newRole) {
            return res.status(400).json({
                success: false,
                message: 'User ID and new role are required'
            });
        }

        // Validate role
        if (!['admin', 'manager', 'employee'].includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = newRole;
        await user.save();

        return res.json({
            success: true,
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Update role error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

// Export the controller functions
module.exports = {
    register,
    login,
    getProfile,
    updateUserRole
};