import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  email: string;
  password: string; // Hashed
  role: string;
}

// Mock database with bcrypt-hashed passwords
const users: User[] = [
  {
    email: 'admin@example.com',
    password: '$2b$10$vbcgo5AOJpdaShWUnay7QeiO.XuuKi17bTVtarqn5z4.8qTO6mj.e', // bcrypt hash for '12345678'
    role: 'admin',
  },
  {
    email: 'user@example.com',
    password: '$2b$10$XJuD9AIDtzJwAVYUJq/YruMoF5UsgrhjRL0MQEUoaZGhYFljb6CKC', // bcrypt hash for 'password123'
    role: 'user',
  },
];

const JWT_SECRET = 'your-secret-key';

class AuthService {
  static async authenticate(
    email: string,
    password: string,
  ): Promise<User | null> {
    console.log('Authenticating email:', email);

    // Find the user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
      console.error('User not found');
      return null;
    }

    console.log('User found:', user);

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.error('Invalid password');
      return null;
    }

    return user;
  }

  static generateToken(user: User): string {
    return jwt.sign(
      { email: user.email, role: user.role }, // Include role in the token
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
    );
  }
}

export default AuthService;
