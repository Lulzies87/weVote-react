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
    res.status(500).json({ error: "Failed to fetch polls from database." });
  }
});

app.get("/poll/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await getConnection();
    const query = `SELECT * FROM weVote.polls WHERE id = ?`;

    const [poll] = await connection.promise().query<RowDataPacket[]>(query, [id]);

    if (poll.length === 0) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }

    res.status(200).json(poll[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch polls from database." });
  }
});

app.post("/poll", async (req, res) => {
  const { title, deadline, cost, details } = req.body;

  const newPoll = {
    title,
    status: 'Open',
    cost,
    votes: 0,
    deadline,
  }

  try {
    const connection = await getConnection();
    const query = `INSERT INTO polls (title, status, cost, votes, deadline) VALUES (?, ?, ?, ?, ?);`;

    await connection.execute(query, [newPoll.title, newPoll.status, newPoll.cost, newPoll.votes, newPoll.deadline]);

    res.status(200).json(newPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new poll." })
  }
});

async function init() {
  await initConnection();
  app.listen(PORT, () =>
    console.log(`Server Listening on http://localhost:${PORT}`)
  );
}

init();
