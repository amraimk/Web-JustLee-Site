import oracledb from "oracledb";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve('../server/.env') });

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION,
};

export async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}
