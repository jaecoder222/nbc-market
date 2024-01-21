import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.get("/", (req, res) => {
  return res.json({ message: "Hi" });
});

app.use("/api", [router]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버 실행중...");
});
