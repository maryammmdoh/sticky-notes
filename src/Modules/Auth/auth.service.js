import User from '../../DB/Models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signup(bodyData) {

    const { email, password} = bodyData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    // Hash password
    // This make the password unreadable and secure in case of data breach, as it cannot be reversed back to the original password.
    // The number 10 is the salt rounds, which determines how many times the hashing algorithm will be applied. A higher number means more security but also more time to hash.
    // Hashing the password before storing it in the database is crucial for security. It ensures that even if the database is compromised, attackers cannot easily retrieve users' original passwords.
    const hashedPassword = await bcrypt.hash(password, 10);
    bodyData.password = hashedPassword;

    /*
        Encrypt vs Hash:
        - Encryption is reversible, allowing you to retrieve the original data using a key. Hashing is one-way and cannot be reversed.
        - Encryption is used when you need to access the original data later, while hashing is used for securely storing data like passwords. 
    */

    // Create user
    const [user] = await User.create([bodyData]);

    return user;
};

export async function login(bodyData) {
    const { email, password} = bodyData;
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
}