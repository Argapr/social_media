import mysql from 'mysql2/promise';

export default async function dbConnect() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social_media',
  });

  return connection;
}
