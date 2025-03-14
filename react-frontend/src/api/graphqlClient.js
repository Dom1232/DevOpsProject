import { GraphQLClient } from 'graphql-request';

const getGraphQLClient = (role) => {
  const endpoint = role === 'admin' 
    ? 'http://localhost:5000/admin' 
    : 'http://localhost:5000/student';

  return new GraphQLClient(endpoint, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default getGraphQLClient;