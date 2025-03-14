import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
        type: String,
        required: true, 
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    favProf: {
        type: String
    },
    favClass: {
        type: String
    },
});


const Student = mongoose.model('Student', studentSchema);

export default Student;