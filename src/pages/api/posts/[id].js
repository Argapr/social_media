import dbConnect from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const connection = await dbConnect();
      const query = 'SELECT * FROM posts WHERE id = ?';
      const [rows] = await connection.execute(query, [id]);

      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ success: false, message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch post', error });
    }
  } else if (req.method === 'DELETE') {
    const { token } = req.headers;

    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user_id = decoded.user_id;

      const connection = await dbConnect();
      const deleteQuery = 'DELETE FROM posts WHERE id = ? AND user_id = ?';
      const [result] = await connection.execute(deleteQuery, [id, user_id]);

      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete post', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
