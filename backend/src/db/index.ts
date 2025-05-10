import mongoose from "mongoose";

const db = {
  connect: async function () {
    const options = {
      maxPoolSize: 10,
    };

    const connectWithRetry = async () => {
      try {
        await mongoose.connect(
          process.env.DB_CONNECTION_STRING as string,
          options
        );
        console.log("Connected to MongoDB");
      } catch (error) {
        console.log("Error connecting to MongoDB", error);
        console.log("Retrying in 2 seconds");
        setTimeout(connectWithRetry, 2000);
      }
    };

    await connectWithRetry();
  },
};

export default db;
