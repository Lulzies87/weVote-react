import express from "express";
import { getConnection } from "../dbConnection";
import { FieldPacket, RowDataPacket } from "mysql2";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.get("/me", async (req, res) => {
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

router.get("/random", async (_, res) => {
  try {
    const connection = await getConnection();
    const query = "SELECT phone FROM tenants ORDER BY RAND() LIMIT 1;";
    const [randomTenant]: [RowDataPacket[], FieldPacket[]] = await connection
      .promise()
      .query(query);

    if (randomTenant.length === 0) {
      res.status(404).json({ error: "Couldn't find a random tenant" });
      return;
    }

    res.json(randomTenant[0].phone);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch random tenant. Please try again later.",
    });
  }
});

export default router;
