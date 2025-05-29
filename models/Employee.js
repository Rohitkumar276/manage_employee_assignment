import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  firstName: String,
  lastName: String,
  middleName: String,
  loginId: { type: String, unique: true },
  dob: Date,
  department: String,
  salary: Number,
  permanentAddress: String,
  currentAddress: String,
  idProof: String, // store file path
});

export default mongoose.model('Employee', employeeSchema);
