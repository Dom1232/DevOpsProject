import dotenv from 'dotenv';
import Student from '../models/student.js';
import Course from '../models/course.js';

dotenv.config();

const adminResolvers = {

    getCourses: async () => {
        const courses = await Course.find().populate('students', '_id');
        return courses.map(course => {
            return {
                id: course._id,
                code: course.code,
                name: course.name,
                section: course.section,
                semester: course.semester,
                students: course.students.map(student => {
                    return {
                        id: student._id.toString()
                    };
                })
            };
        });
    },

    getStudents: async () => {
        try {
            return await Student.find(); 
        } catch (error) {
            console.log("Error fetching students");
        }
    },

    createCourse: async ({ code, name, section, semester }, _) => {
        const newCourse = new Course({ code, name, section, semester });
        await newCourse.save();
        return newCourse;
    },

    createStudent: async ({ number, firstName, lastName, address, city, phoneNumber, email, program, favProf, favClass }, _) => {
        
        const password = "password";

        const newStudent = new Student({ number, password, firstName, lastName, address, city, phoneNumber, email, program, favProf, favClass });
        await newStudent.save();
        return newStudent;
    },

    getStudentsByCourse: async ({ courseId }, _) => {
        try {
            const course = await Course.findById(courseId).populate('students');
            if (!course) {
                throw new Error('Course not found');
            }
            return course.students;
        } catch (error) {
            console.error('Error getting students by course:', error);
            throw new Error(error.message);
        }
    },
};

export default adminResolvers;