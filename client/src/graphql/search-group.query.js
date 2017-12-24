import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query group($groupId: Int!){
    user {
      id
      username
      organisation {
        id
         groups(id: $groupId) {
            name
            id
            tags {
              name
              id
            }
            users {
             username
             id
            }
            schedules {
              id
              name
              details
              startTime
              endTime
            }
            events {
              id
              name
              details
            }
         }
      }
    }
  }
`;