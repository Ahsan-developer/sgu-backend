import express, { Application } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swaggerConfig";

dotenv.config();
const app: Application = express();
const PORT = 3000;

app.use(express.json());
const swaggerDocs = swaggerJsDoc(swaggerConfig);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", routes); // All routes are now prefixed with /api

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
