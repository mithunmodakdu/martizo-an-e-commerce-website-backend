import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVars = () : IEnvVars => {

  const requiredEnvVars : string[] = ["PORT", "DB_URL", "NODE_ENV" ];

  requiredEnvVars.forEach((key) => {
    if(!process.env[key]){
      throw new Error(`Required environment variable ${key} is missing.`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVars();
