import express, { Request, Response } from "express";
import basicApiroute from './modules/basicApi/routes';
import { AppDataSource } from "./database/dbConnecte";
import userRoute from "./modules/users/routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// import routes
app.use("/", basicApiroute);

// use route user
app.use("/user",userRoute)

// connect to batabase
AppDataSource.initialize().then(()=>{
  console.log("Connected database succesfull");

  app
    .listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
    .on("error", (err: any) => {
      console.error("Failed to start server:", err);
    });
    
}).catch((error:Error) => {
  console.log("error while connect data");
})

