import express, { Application } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swaggerConfig";
import path from "path";
import cors from "cors";

dotenv.config();
const app: Application = express();
const PORT = 3000;

app.use(express.json());
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth token when refreshing
    },
  })
);
app.use("/api", routes);

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
