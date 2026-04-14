
import { createApp } from "./app.js";
import { connectDB } from "./lib/db.js";
import { env } from "./config/env.js";

const app = createApp();
await connectDB();

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
