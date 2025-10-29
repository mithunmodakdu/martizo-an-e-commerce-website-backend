import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT_SECRET: string;
  JWT_EXPIRE_TIME: string;
}

const loadEnvVars = () : IEnvVars => {

  const requiredEnvVars : string[] = [
    "PORT", 
    "DB_URL", 
    "NODE_ENV", 
    "BCRYPT_SALT_ROUND",
    "JWT_SECRET",
    "JWT_EXPIRE_TIME"
  
  ];

  requiredEnvVars.forEach((key) => {
    if(!process.env[key]){
      throw new Error(`Required environment variable ${key} is missing.`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME as string
  };
};

export const envVars = loadEnvVars();
