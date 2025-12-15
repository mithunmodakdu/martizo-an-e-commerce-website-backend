/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server : Server;

const startServer = async() => {
  try {
    
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to database successfully.");

    server = app.listen(envVars.PORT, () => {
      console.log(`Martizo server is listening on the port ${envVars.PORT} `)
    })

  } catch (error) {
    console.log(error)
  }
}



(async() => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

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

