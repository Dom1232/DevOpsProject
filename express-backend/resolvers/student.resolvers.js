import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import Admin from '../models/admin.js';
import Course from '../models/course.js';

dotenv.config();

const studentResolvers = {

    getOpenCourses: async ({ code }, _) => {
        return await Course.find({ code, section: { $gte: 1 } });
    },

    listEnrollCourses: async () => {
        const courses = await Course.find();
        return courses.map(course => {
            return {
                id: course._id,
                code: course.code,
                name: course.name,
                section: course.section,
                semester: course.semester,
            };
        });
        
    },

    getCoursesByStudent: async ({ studentId }, _) => {
        const courses = await Course.find({ students: studentId });

        if (courses.length === 0) {
            throw new Error('No courses found for this student');
        }

        return courses;
    },

    addCourseToStudent: async ({ studentId, courseId }, _) => {
        console.log(studentId, courseId);
        try {
            const student = await Student.findById(studentId);
            const course = await Course.findById(courseId);

            if (!student || !course) {
                throw new Error('Student or Course not found');
            }

            if (course.students.includes(studentId)) {
                throw new Error('Student is already enrolled in this course');
            }

            course.students.push(student._id);
            await course.save();
            return {
                id: course.id,
                code: course.code,
                name: course.name,
                section: course.section,
                semester: course.semester
            };
        } catch (error) {
            console.error('Error adding student to course:', error);
        }
    },

    updateCourse: async ({ studentId, courseId, section }, _) => {
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            throw new Error('Student or Course not found');
        }

        const studentIndex = course.students.indexOf(studentId);
        if (studentIndex === -1) {
            throw new Error('Student not found in the current course');
        }

        course.students.splice(studentIndex, 1);
        await course.save();

        const newCourse = await Course.findOne({
            code: course.code,
            section: section,
            semester: course.semester
        });

        if (!newCourse) {
            throw new Error('New course section not found');
        }

        newCourse.students.push(studentId);
        await newCourse.save();

        return {
            message: 'Student successfully moved to the new course section',
            originalCourse: {
                id: course._id.toString(),
                code: course.code,
                section: course.section,
                semester: course.semester
            },
            newCourse: {
                id: newCourse._id.toString(),
                code: newCourse.code,
                section: newCourse.section,
                semester: newCourse.semester
            }
        };

    },

    dropCourse: async ({ studentId, courseId }, _) => {
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            throw new Error('Student or Course not found');
        }

        const studentIndex = course.students.indexOf(studentId);
        if (studentIndex === -1) {
            throw new Error('Student not enrolled in this course');
        }

        course.students.splice(studentIndex, 1);
        await course.save();

        return course;
    }
};

export default studentResolvers;