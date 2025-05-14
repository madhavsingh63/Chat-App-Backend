import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DBConnect = async () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.log("Database Connection Failed", error.message);
        process.exit(1);
    })

}

export default DBConnect;