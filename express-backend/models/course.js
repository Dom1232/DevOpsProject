import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true
    },
    name: {
        type: String,
        required: true
    },
    section: {
        type: Number,
        required: true,
    },
    semester: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }]
});

courseSchema.index({ code: 1, section: 1, semester: 1 }, { unique: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;