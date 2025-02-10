import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { getConnection, initConnection } from "./dbConnection";
import { FieldPacket, RowDataPacket } from "mysql2";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(json());

app.get("/check", (_, res) => {
  res.status(200).json({ message: "Hello" });
});

app.get("/polls", async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `SELECT * FROM weVote.polls;`;

    const [polls]: [RowDataPacket[], FieldPacket[]] = await connection.promise().query(query);

    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Couldn't fetch polls from database." });
  }
});

async function init() {
  await initConnection();
  app.listen(PORT, () =>
    console.log(`Server Listening on http://localhost:${PORT}`)
  );
}

init();
