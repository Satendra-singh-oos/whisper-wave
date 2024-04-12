import mongoose from "mongoose";

type ConnectionObject = {
  isCoonected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isCoonected) {
    console.log("Already Connected to database...");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    // console.log("Db=> ", db);

    connection.isCoonected = db.connections[0].readyState;

    // console.log("connection=> ", db.connections[0]);

    console.log("Db Connected Sucessfully.....");
  } catch (error) {
    console.log("Db Coonection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
