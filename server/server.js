//TODO: set up a server 

//imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./dbConnection.js";

//configs
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//port
const PORT = 8080;
app.listen(PORT, function () {
  console.info(`Server is running in localhost:${PORT}`);
});

//root route
app.get("/", function (request, response) {
  response.send("Guestbook API is running");
});

//==============================

//TODO: a route to READ data from the database
//root guestbktable
app.get("/guests", async (request, response) => {
  try {
    const result = await db.query("SELECT * FROM guestbktable ORDER BY id DESC");
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: "error", message: "Database query failed" });
  }
});

//TODO: a route to CREATE data in the database
app.post("/new-guest", async (request, response) => {
  try {
    const newGuest = request.body.formValues;
    if (!newGuest.name || !newGuest.message) {
      return response.status(400).json({ error: "Name and message are required" });
    }
    const query = `
      INSERT INTO guestbktable (name, message, photo_url, socials)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      newGuest.name,
      newGuest.message,
      newGuest.photo_url || "",
      newGuest.socials || ""
    ];
    const result = await db.query(query, values);
    response.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to post message" });
  }
});
