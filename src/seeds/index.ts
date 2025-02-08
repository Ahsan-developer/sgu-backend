import seedAdminUser from "./seedAdmin";
import { connectDB, disconnectDB } from "../config/database";

import dotenv from "dotenv";
dotenv.config();

const runSeeders = async () => {
  await connectDB();

  console.log("Starting seed process...");

  // Add all seed files here
  await seedAdminUser();

  await disconnectDB();
  console.log("Seeding completed.");
};

runSeeders();
