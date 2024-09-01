import dbConnect from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.headers;
    const { post_id, content } = req.body;

    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user_id = decoded.user_id;

      const connection = await dbConnect();
      const query = 'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())';
      await connection.execute(query, [post_id, user_id, content]);

      res.status(201).json({ success: true, message: 'Comment created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create comment', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
