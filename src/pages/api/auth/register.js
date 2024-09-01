import dbConnect from '@/lib/mysql';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await dbConnect();
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      await connection.execute(query, [username, email, hashedPassword]);

      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to register user', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
