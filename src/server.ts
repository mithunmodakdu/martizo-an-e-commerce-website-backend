/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import 'dotenv/config'

let server : Server;

const startServer = async() => {
  try {
    
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcynqnr.mongodb.net/martizoDB?retryWrites=true&w=majority&appName=Cluster0`);

    console.log("Connected to database successfully.");

    server = app.listen(5000, () => {
      console.log("Martizo server is listening on the port 5000")
    })

  } catch (error) {
    console.log(error)
  }
}

startServer();

process.on("unhandledRejection", (error) => {
  console.log("Unhandled rejection detected. Server is shutting down...", error);

  if(server){
    server.close(() => {
      process.exit(1);
    });   
  }

  process.exit(1);
})

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception occurred. Server is shutting down...", error );

  if(server){
    server.close(() => {
      process.exit(1);
    })
  }

  process.exit(1);
})

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Server is shutting down...")

  if(server){
    server.close(() => {
      process.exit(1);
    })
  }

  process.exit(1);
})

process.on("SIGINT", () => {
  console.log("SIGINT signal received. Server is shutting down... ");

  if(server){
    server.close(() => {
      process.exit(1);
    })
  }

  process.exit(1);
})

