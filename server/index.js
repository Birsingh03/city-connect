import http from "node:http";
import dotenv from "dotenv";
import { createServerApplication } from "./app/app.js";
import reportsRoute from "./routes/reports.js";

dotenv.config();

async function main() {
  try {
    const app = createServerApplication();
    app.use('/api/reports', reportsRoute);

    const server = http.createServer(app);
    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on PORT http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();