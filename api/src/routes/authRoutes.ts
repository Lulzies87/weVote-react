import express from "express";
import { getConnection } from "../dbConnection";
import { FieldPacket, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
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
    res.status(500).json({
      error: "Internal server error. Please contact an administrator.",
    });
  }
});

export default router;
