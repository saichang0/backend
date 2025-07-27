import express, { Request, Response } from "express";
import { User } from "../users/user.entity";
import { AppDataSource } from "../../database/dbConnecte";
import { handleSuccesOneRespones } from "../../utils";

const basicApiroute = express();

basicApiroute.get("/api", (req: Request, res: Response) => {
  res.json(handleSuccesOneRespones({
    code:"Succes",
    message:"Succes response",
    data:{},
    status:200
  }))
})

let userDatas: any[] = [];

basicApiroute.get("/users",async (req: Request, res: Response) => {
  try{
    const query = "select * from User"
    const results = await AppDataSource.query(query)

    res.json({
      total: results.length,
      users:results,
    })
  }catch(err){
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

basicApiroute.post("/users",async (req: Request, res: Response) => {
  try{
    const {fullname, email } = req.body;

    const UserRepo = AppDataSource.getRepository(User)

    const Newuser = UserRepo.create({
      fullname,
      email
    })

    await UserRepo.save(Newuser)

    res.status(201).json({
      message:"Create user succesfull",
      user:Newuser,
    })
  }catch(error){
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

basicApiroute.put("/users/:id", (req: Request, res: any) => {
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

basicApiroute.delete("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const index = userDatas.findIndex(user => user.id == userId);
    userDatas.splice(index, 1);
    res.status(200).json({ message: "User deleted successfully" });
}); 

export default basicApiroute;