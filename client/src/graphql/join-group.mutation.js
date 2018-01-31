import gql from 'graphql-tag';

export default gql`
  mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
    addUserToGroup(groupUpdate: $groupUpdate) {
      id
      name
      tags {
         name
         id
       }
       users {
         username
         id
       }
       events {
         id
         name
         details
       }
       schedules {
         id
         name
         details
         startTime
         endTime
       }
    }
  }
`;
