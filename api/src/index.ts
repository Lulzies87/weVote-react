import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { initConnection } from "./dbConnection";

import tenantRoutes from "./routes/tenantRoutes";
import pollRoutes from "./routes/pollRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT ?? 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(json());

app.use("/tenants", tenantRoutes);
app.use("/polls", pollRoutes);
app.use("/login", authRoutes);

async function init() {
  await initConnection();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

init();
