import express from "express";

const app = express();

app.use("/api/test", (req, res) => {
  res.send("Hello World");
});

const port = 18080;

app.listen(port, () => console.log(`Server running on port ${port}`));
