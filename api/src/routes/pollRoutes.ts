import express from "express";
import { getConnection } from "../dbConnection";
import { FieldPacket, RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/", async (req, res) => {
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
      .query("SELECT pollId, apartment, vote FROM votes;");

    const updatedPolls = polls.map((poll) => ({
      ...poll,
      votes: votes
        .filter((vote) => vote.pollId === poll.id)
        .map(({ apartment, vote }) => ({ apartment, vote })),
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

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await getConnection();

    const [[{ count: totalApartments }]]: [RowDataPacket[], FieldPacket[]] =
      await connection
        .promise()
        .query("SELECT COUNT(DISTINCT apartment) AS count FROM tenants");

    const [[poll]]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query("SELECT * FROM polls WHERE id = ?", [id]);

    if (!poll) {
      res.status(404).json({ error: "Poll not found." });
      return;
    }

    const [votes]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query("SELECT apartment, vote FROM votes WHERE pollId = ?", [id]);

    const updatedPoll = { ...poll, votes };

    res.status(200).json({ totalApartments, poll: updatedPoll });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Failed to fetch poll from database. Please contact an administrator.",
    });
  }
});

router.post("/", async (req, res) => {
  const { title, deadline, cost, details } = req.body;

  const newPoll = {
    title,
    cost,
    deadline,
    details,
    isActive: true,
  };

  try {
    const connection = await getConnection();
    const query = `INSERT INTO polls (title, cost, deadline, details, isActive) VALUES (?, ?, ?, ?, ?);`;

    await connection.execute(query, [
      newPoll.title,
      newPoll.cost,
      newPoll.deadline,
      newPoll.details,
      newPoll.isActive,
    ]);

    res.status(201).json(newPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create a new poll. Please contact an administrator.",
    });
  }
});

router.post("/:pollID/votes", async (req, res) => {
  const { apartment, vote } = req.body;
  const { pollID } = req.params;

  try {
    const connection = await getConnection();

    const [apartmentCheck] = await connection
      .promise()
      .query<RowDataPacket[]>(
        `SELECT * FROM votes WHERE pollId = ? AND apartment = ?`,
        [pollID, apartment]
      );
    if (apartmentCheck.length > 0) {
      res
        .status(409)
        .json({ message: "Apartment already voted for this poll." });
      return;
    }

    const query = `INSERT INTO votes (pollId, apartment, vote) VALUES (?, ?, ?);`;
    await connection.execute(query, [pollID, apartment, vote]);
    res.status(201).json({ message: "Vote registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register the vote." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await getConnection();
    const query = `DELETE FROM polls WHERE id = ?;`;
    await connection.execute(query, [id]);
    res.status(200).json({ message: "Poll deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the poll." });
  }
});

export default router;
