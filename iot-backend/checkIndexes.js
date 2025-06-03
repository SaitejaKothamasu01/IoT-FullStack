require('dotenv').config();
const mongoose = require('mongoose');

async function checkIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const collection = mongoose.connection.collection('devices');
    const indexes = await collection.indexes();
    console.log("Indexes on 'devices' collection:");
    console.log(indexes);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkIndexes();
