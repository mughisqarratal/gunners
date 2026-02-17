import mysql from "mysql2/promise";

export const db = mysql.createPool({
  // Mencoba membaca dari server (Hostinger), jika tidak ada pakai 'localhost' (Laragon)
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gunners",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});