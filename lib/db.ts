import mysql from "mysql2/promise";

// Fungsi untuk menentukan konfigurasi pool
const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return { uri: process.env.DATABASE_URL };
  }
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gunners",
  };
};

export const db = mysql.createPool({
  ...getPoolConfig(),
  waitForConnections: true,
  connectionLimit: 2, // Diturunkan ke 3 untuk menghindari error Thread/Assertion di Hostinger
  queueLimit: 0,
});