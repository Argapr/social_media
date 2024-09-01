import dbConnect from '@/lib/mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const connection = await dbConnect();
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await connection.execute(query, [email]);

      if (rows.length > 0) {
        const user = rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const token = jwt.sign({ user_id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

          res.status(200).json({ success: true, token });
        } else {
          res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to log in', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
