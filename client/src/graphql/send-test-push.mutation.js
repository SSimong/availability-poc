import gql from 'graphql-tag';

export default gql`
  mutation sendTestPush($vars: SendTestPushInput) {
    sendTestPush(vars: $vars)
  }
`;
