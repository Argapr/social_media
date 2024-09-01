import dbConnect from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.headers;
    const { content } = req.body;

    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user_id = decoded.user_id;

      const connection = await dbConnect();
      const query = 'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())';
      await connection.execute(query, [user_id, content]);

      res.status(201).json({ success: true, message: 'Post created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create post', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
