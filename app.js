import express from "express";
import connect from "./schemas/index.js";
import ProductsSchema from "./routes/products.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi" });
});

app.use("/api", [router, ProductsSchema]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버 실행중...");
});
