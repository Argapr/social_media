import dbConnect from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.headers;

    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user_id = decoded.user_id;

      const connection = await dbConnect();
      const query = 'SELECT id, username, email FROM users WHERE id = ?';
      const [rows] = await connection.execute(query, [user_id]);

      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch user details', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}