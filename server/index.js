import http from "node:http";
import { createServerApplication } from "./app/app.js";
import { connectDB } from "./db/index.js";
import { configDotenv } from "dotenv";

configDotenv({ path: './.env' });

async function main() {
  await connectDB();

  const server = http.createServer(createServerApplication());
  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
  });
}

main();