import app from "./app";
import { load } from "ts-dotenv";
const env = load({
  PORT: Number,
});

app.listen(env.PORT || 3000, () => {
  console.log("server start.");
});
