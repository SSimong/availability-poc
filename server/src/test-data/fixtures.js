import { DISTANT_FUTURE, DISTANT_PAST } from '../constants';
import { DEFAULT_USER_ID } from '../config';

const getMonday = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  if (day !== 1) { now.setHours(-24 * (day - 1)); }
  return Math.floor(now.getTime() / 1000);
};

const minFromNow = (min) => {
  const now = new Date();
  return Math.floor(now.getTime() / 1000) + (60 * min);
};

const MONDAY = getMonday();

export const DEFAULT_USERNAME = 'test';
export const DEFAULT_GROUP = 'Kiama';

export const ORG_NAME = 'NSW SES';

export const CAPABILITIES = [
  'Road Crash Rescue',
  'Vertical Rescue',
  'Flood Rescue',
  'Chainsaw',
];

export const TAGS = [
  'Tag1',
  'Tag2',
  'Tag3',
];

export const USERS = [
  {
    id: DEFAULT_USER_ID,
    username: DEFAULT_USERNAME,
    password: 'test',
    name: 'Paddy Platypus',
    email: 'test@example.com',
  },
  {
    id: 11,
    username: 'kiama1',
    password: 'test',
    name: 'Alex Alpha',
    email: 'kiama1@example.com',
  },
  {
    id: 12,
    username: 'kiama2',
    password: 'test',
    name: 'Bob Bravo',
    email: 'kiama2@example.com',
  },
  {
    id: 13,
    username: 'kiama3',
    password: 'test',
    name: 'Caroline Charlie',
    email: 'kiama3@example.com',
  },
  {
    id: 14,
    username: 'kiama4',
    password: 'test',
    name: 'David Delta',
    email: 'kiama4@example.com',
  },
  {
    id: 15,
    username: 'kiama5',
    password: 'test',
    name: 'Erin Echo',
    email: 'kiama4@example.com',
  },
  {
    id: 16,
    username: 'kiama6',
    password: 'test',
    name: 'Fabio Foxtrot',
    email: 'kiama6@example.com',
  },
  {
    id: 17,
    username: 'kiama7',
    password: 'test',
    name: 'Greg Golf',
    email: 'kiama7@example.com',
  },
  {
    id: 18,
    username: 'kiama8',
    password: 'test',
    name: 'Heather Hotel',
    email: 'kiama8@example.com',
  },
  {
    id: 21,
    username: 'paramatta1',
    password: 'test',
    name: 'Tim Dykes',
    email: 'paramatta1@example.com',
  },
];

export const GROUPS = [
  {
    name: 'Parramatta',
    users: [
      'test',
      'paramatta1',
    ],
  },
  {
    name: DEFAULT_GROUP,
    users: [
      'test',
      'kiama1',
      'kiama2',
      'kiama3',
      'kiama4',
      'kiama5',
      'kiama6',
      'kiama7',
      'kiama8',
    ],
  },
];

export const SCHEDULES = [
  {
    name: 'Kiama Rescue',
    details: 'Ongoing availability for RCR, VR, GLR',
    startTime: DISTANT_PAST,
    endTime: DISTANT_FUTURE,
    group: 'Kiama',
    timeSegmentUsers: [
      'kiama1',
      'kiama2',
      'kiama3',
    ],
  },
  {
    name: 'Kiama Storm Team',
    details: 'Non-urgent availability for storm jobs during this week',
    startTime: MONDAY,
    endTime: MONDAY + (60 * 60 * 24 * 6),
    group: 'Kiama',
    timeSegmentUsers: [
      'kiama3',
      'kiama4',
      'kiama5',
      'kiama8',
    ],
  },
];

export const EVENTS = [
  {
    name: 'VR at Gerringong Falls',
    details: '2 climbers stranded 50m from top of cliff.',
    group: 'Kiama',
    responses: [
      {
        user: 'test',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(15),
      },
      {
        user: 'kiama1',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(15),
      },
      {
        user: 'kiama2',
        status: 'unavailable',
        detail: 'out of area',
      },
      {
        user: 'kiama3',
        status: 'unavailable',
        detail: 'at work',
      },
      {
        user: 'kiama4',
        status: 'responding',
        detail: 'coming from work',
        destination: 'HQ',
        eta: minFromNow(30),
      },
    ],
  },
  {
    name: 'RCR - Princes Highway, Gerringong',
    details: '2 car MVA. Head on collision. 3 people trapped.',
    group: 'Kiama',
    responses: [
      {
        user: 'kiama1',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(13),
      },
      {
        user: 'kiama5',
        status: 'responding',
        destination: 'scene',
      },
      {
        user: 'kiama6',
        status: 'unavailable',
        detail: 'at work',
      },
      {
        user: 'kiama7',
        status: 'responding',
        destination: 'scene',
        eta: minFromNow(12),
      },
      {
        user: 'kiama8',
        status: 'responding',
        detail: '',
        destination: 'HQ',
        eta: minFromNow(6),
      },
    ],
  },
];