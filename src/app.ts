import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) =>{
  res.status(400).json({
    message: "Welcome to Martizo Server."
  })
})

export default app;