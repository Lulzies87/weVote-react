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
    const query = `SELECT p.*, COALESCE(v.votes, 0) AS votes
    FROM polls p
    LEFT JOIN (
      SELECT poll_id, COUNT(*) AS votes
      FROM votes
      GROUP BY poll_id
    ) v
    ON p.id = v.poll_id;`;

    const [polls]: [RowDataPacket[], FieldPacket[]] = await connection.promise().query(query);

    const [apartmentCount]: [RowDataPacket[], FieldPacket[]] = await connection.promise().query("SELECT COUNT(DISTINCT apartment) AS total_apartments FROM tenants");

    res.status(200).json({ polls: polls, totalApartments: apartmentCount[0].total_apartments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch polls from database." });
  }
});

app.get("/polls/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await getConnection();
    const query = `SELECT p.*, COALESCE(v.votes, 0) AS votes
    FROM polls p
    LEFT JOIN (
      SELECT poll_id, COUNT(*) AS votes
      FROM votes
      GROUP BY poll_id
    ) v
    ON p.id = v.poll_id
    WHERE p.id = ?;`;

    const [poll] = await connection.promise().query<RowDataPacket[]>(query, [id]);

    const [apartmentCount]: [RowDataPacket[], FieldPacket[]] = await connection.promise().query("SELECT COUNT(DISTINCT apartment) AS total_apartments FROM tenants");

    if (poll.length === 0) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }

    res.status(200).json({ poll: poll[0], totalApartments: apartmentCount[0].total_apartments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch polls from database." });
  }
});

app.post("/polls", async (req, res) => {
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

    res.status(201).json(newPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new poll." })
  }
});

app.post("/polls/:pollID/votes", async (req, res) => {
  const { apartment, vote } = req.body;
  const { pollID } = req.params;

  try {
    const connection = await getConnection();

    const [apartmentCheck] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM votes WHERE poll_id = ? AND apartment = ?`, [pollID, apartment]);
    if (apartmentCheck.length > 0) {
      res.status(409).json({ message: "Apartment already voted for this poll." });
      return;
    }

    const query = `INSERT INTO votes (poll_id, apartment, vote) VALUES (?, ?, ?);`;
    await connection.execute(query, [pollID, apartment, vote]);
    res.status(201).json({ message: "Vote registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register the vote." });
  }
});

async function init() {
  await initConnection();
  app.listen(PORT, () =>
    console.log(`Server Listening on http://localhost:${PORT}`)
  );
}

init();
