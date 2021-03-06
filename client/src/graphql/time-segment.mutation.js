import gql from 'graphql-tag';

export const CREATE_TIME_SEGMENT_MUTATION = gql`
  mutation createTimeSegment($timeSegment: createTimeSegmentInput!) {
    createTimeSegment(timeSegment: $timeSegment) {
      id
      status
      startTime
      endTime
    }
  }
`;

export const REMOVE_TIME_SEGMENT_MUTATION = gql`
  mutation removeTimeSegment($timeSegment: removeTimeSegmentInput!) {
    removeTimeSegment(timeSegment: $timeSegment)
  }
`;

export const UPDATE_TIME_SEGMENT_MUTATION = gql`
  mutation updateTimeSegment($timeSegment: updateTimeSegmentInput!) {
    updateTimeSegment(timeSegment: $timeSegment) {
      id
      status
      startTime
      endTime
    }
  }
`;
