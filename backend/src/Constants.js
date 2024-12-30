import dotenv from "dotenv";

dotenv.config();

export const DB_NAME = "DB1";
export const JWT_CONFIG = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "&+{u@0du3,W;a(KaD.b9a",
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "AA3683L$[VX_rhhPgTZDB",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d"
};
