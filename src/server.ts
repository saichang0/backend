import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api", (req: Request, res: Response) => {
  console.log("Received a request at /");
  res.send("Hello World!!");
});

let userDatas: any[] = [];

app.get("/users", (req: Request, res: Response) => {
  res.send({ total: userDatas.length, users: userDatas });
});

app.post("/users", (req: Request, res: Response) => {
  const user = req.body;
  userDatas.push(user);
  res.send({ message: "User created successfully", user });
});

app.put("/users/:id", (req: Request, res: any) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const userIndex = userDatas.findIndex((user) => (user.id == userId));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  userDatas[userIndex] = updatedUser;
  return res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err: any) => {
    console.error("Failed to start server:", err);
  });
