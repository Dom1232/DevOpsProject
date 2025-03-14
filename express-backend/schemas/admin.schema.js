import { buildSchema } from "graphql";

const adminSchema = buildSchema(`
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
  getCourses: [Course]
  getStudents: [Student]
  getStudentsByCourse(courseId: ID!): [Student]
}

type Mutation { 
  createCourse(code: String!, name: String!, section: Int!, semester: String!): Course
  createStudent(number: String!, firstName: String!, lastName: String!, address: String!, city: String!, phoneNumber: String!, email: String!, program: String!, favProf: String, favClass: String): Student
}
`);

export default adminSchema;