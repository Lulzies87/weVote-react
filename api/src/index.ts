import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { getConnection, initConnection } from "./dbConnection";
import { FieldPacket, RowDataPacket } from "mysql2";
import jwt, { JwtPayload } from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(json());

app.get("/check", (_, res) => {
  res.status(200).json({ message: "Hello" });
});

app.get("/tenants/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded || typeof decoded.id !== "number") {
      res.status(401).json({ error: "Invalid token payload." });
      return;
    }

    const connection = await getConnection();
    const [tenant]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query("SELECT * FROM tenants WHERE id = ?", [decoded.id]);

    if (tenant.length === 0) {
      res.status(404).json({ error: "Tenant not found." });
      return;
    }

    res.json(tenant[0]);
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
});

app.get("/polls", async (req, res) => {
  try {
    const connection = await getConnection();
    const [apartmentCount]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query(
        "SELECT COUNT(DISTINCT apartment) AS total_apartments FROM tenants"
      );

    const [polls]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query("SELECT * FROM polls;");

    const [votes]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query("SELECT * FROM votes;");

    const pollVotes: Record<number, number[]> = votes.reduce(
      (acc: Record<number, number[]>, vote) => {
        if (!acc[vote.poll_id]) {
          acc[vote.poll_id] = [];
        }
        acc[vote.poll_id].push(vote.apartment);
        return acc;
      },
      {}
    );

    const updatedPolls = polls.map((poll) => ({
      ...poll,
      votedApartments: pollVotes[poll.id] || [],
    }));

    res.status(200).json({
      polls: updatedPolls,
      totalApartments: apartmentCount[0].total_apartments,
    });
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

    const [poll] = await connection
      .promise()
      .query<RowDataPacket[]>(query, [id]);

    const [apartmentCount]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query(
        "SELECT COUNT(DISTINCT apartment) AS total_apartments FROM tenants"
      );

    if (poll.length === 0) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }

    res.status(200).json({
      poll: poll[0],
      totalApartments: apartmentCount[0].total_apartments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch polls from database." });
  }
});

app.post("/polls", async (req, res) => {
  const { title, deadline, cost, details } = req.body;

  const newPoll = {
    title,
    status: "Open",
    cost,
    deadline,
    details,
  };

  try {
    const connection = await getConnection();
    const query = `INSERT INTO polls (title, status, cost, deadline, details) VALUES (?, ?, ?, ?, ?);`;

    await connection.execute(query, [
      newPoll.title,
      newPoll.status,
      newPoll.cost,
      newPoll.deadline,
      newPoll.details,
    ]);

    res.status(201).json(newPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new poll." });
  }
});

app.post("/polls/:pollID/votes", async (req, res) => {
  const { apartment, vote } = req.body;
  const { pollID } = req.params;

  try {
    const connection = await getConnection();

    const [apartmentCheck] = await connection
      .promise()
      .query<RowDataPacket[]>(
        `SELECT * FROM votes WHERE poll_id = ? AND apartment = ?`,
        [pollID, apartment]
      );
    if (apartmentCheck.length > 0) {
      res
        .status(409)
        .json({ message: "Apartment already voted for this poll." });
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

app.post("/login", async (req, res) => {
  const { phone } = req.body;

  try {
    const connection = getConnection();
    const query = `SELECT * FROM tenants WHERE phone = ?;`;

    const [tenant]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query(query, [phone]);

    if (tenant.length === 0) {
      res.status(404).json({ error: "Phone number is not registered." });
      return;
    }

    const token = jwt.sign(
      { id: tenant[0].id, phone: tenant[0].phone },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token, tenant: tenant[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login." });
  }
});

async function init() {
  await initConnection();
  app.listen(PORT, () =>
    console.log(`Server Listening on http://localhost:${PORT}`)
  );
}

init();
