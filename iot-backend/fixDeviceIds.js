const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DeviceSchema = new mongoose.Schema({}, { strict: false });
const Device = mongoose.model('Device', DeviceSchema, 'devices'); // 'devices' is your collection name

async function fixMissingDeviceIds() {
  try {
    // Step 1: Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Step 2: Fetch all devices and check them
    const devices = await Device.find({});
    console.log('Fetched devices:', devices.length); // Log the number of devices found

    if (devices.length === 0) {
      console.log('No devices found in the database');
    }

    // Step 3: Check for devices missing _id
    const devicesWithNoId = devices.filter(device => !device._id);
    console.log('Devices missing _id:', devicesWithNoId.length);

    if (devicesWithNoId.length > 0) {
      for (const device of devicesWithNoId) {
        console.log(`Assigning new _id to device: ${device.deviceId || 'Unknown Device'}`);
        
        const newId = new mongoose.Types.ObjectId(); // generate a new ObjectId
        await Device.updateOne(
          { _id: device._id }, // Find the document
          { $set: { _id: newId } } // Set a new _id
        );
        console.log(`Assigned new _id to device: ${device.deviceId || 'Unknown Device'}`);
      }
    } else {
      console.log('No devices missing _id');
    }

    // Step 4: Check for devices missing deviceId
    const devicesWithNoDeviceId = await Device.find({ deviceId: { $exists: false } });
    console.log('Devices missing deviceId:', devicesWithNoDeviceId.length);

    if (devicesWithNoDeviceId.length > 0) {
      for (const device of devicesWithNoDeviceId) {
        // If the device still has no _id, skip it
        if (!device._id) {
          console.log(`Skipping device with missing _id: ${device._id}`);
          continue; // Skip devices without _id
        }

        console.log('Updating device with missing deviceId:', device._id);
        const newDeviceId = device._id.toString(); // Use _id as deviceId
        await Device.updateOne(
          { _id: device._id },
          { $set: { deviceId: newDeviceId } }
        );
        console.log(`Updated device with _id ${device._id} to deviceId ${newDeviceId}`);
      }
    } else {
      console.log('No devices missing deviceId');
    }

    // Step 5: Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err);
  }
}

fixMissingDeviceIds();
