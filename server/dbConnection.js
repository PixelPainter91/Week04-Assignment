//TODO: set up a pool to connect server with database
//imports
import pg from "pg";
//config
import dotenv from "dotenv";
dotenv.config();
//pool
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  
});