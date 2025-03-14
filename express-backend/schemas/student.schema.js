import { buildSchema } from "graphql";

const studentSchema = buildSchema(`
type Admin {
  id: ID!
  username: String!
}

type Student {
  id: ID!
  number: String!
  firstName: String!
  lastName: String!
  address: String!
  city: String!
  phoneNumber: String!
  email: String!
  program: String!
  favProf: String
  favClass: String
}

type Course {
  id: ID!
  code: String!
  name: String!
  section: Int!
  semester: String!
  students: [Student]
}

type Query {
  getOpenCourses(code: String!): [Course]
  listEnrollCourses: [Course]
  getCoursesByStudent(studentId: ID!): [Course]
}

type UpdateCourseResponse {
  message: String
  originalCourse: Course
  newCourse: Course
}

type Mutation {
  addCourseToStudent(studentId: ID!, courseId: ID!): Course
  updateCourse(studentId: ID!, courseId: ID!, section: Int!): UpdateCourseResponse
  dropCourse(studentId: ID!, courseId: ID!): Course
}
`);

export default studentSchema;