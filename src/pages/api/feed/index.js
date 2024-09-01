import dbConnect from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.headers;

    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user_id = decoded.user_id;

      const connection = await dbConnect();
      const query = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = ?';
      const [rows] = await connection.execute(query, [user_id]);

      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch feed', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}