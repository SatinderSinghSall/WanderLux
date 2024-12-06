const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/listing.js");
const MongoDB_Database_URL = "mongodb://127.0.0.1:27017/Airbnb_Clone_Database";

async function main() {
  await mongoose.connect(MongoDB_Database_URL);
}
main()
  .then(() => {
    console.log("MongoDB database connection successful!\n");
  })
  .catch((err) => {
    console.log(`DATABASE ERROR CAUGHT: ${err}`);
  });
//

const initDatabase = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67419c3d973e587300c1980d",
  }));
  await Listing.insertMany(initData.data);

  console.log("\nData was initialized and saved in MongoDB database!\n");
};

initDatabase();
