import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
} from '../../graphql/time-segment.mutation';

import { EMPTY, AVAILABLE, UNAVAILABLE, URGENT } from '../../constants';

import { selectSchedules } from '../../selectors/schedules';

import Colors from '../../themes/Colors';

import { Button, ButtonNavBar } from '../../components/Button';
import { Center, Container, Holder } from '../../components/Container';
import { DateRange, TimePicker, TimeSelect } from '../../components/DateTime';
import { Modal } from '../../components/Modal';
import { Progress } from '../../components/Progress';
import { Message, Text } from '../../components/Text';

const defaultSegmentState = [
  { startTime: 0, endTime: 86400, label: 'All Day', status: '' },
  { startTime: 32400, endTime: 61200, label: 'Business Hours', status: '' },
  { startTime: 0, endTime: 32400, label: 'Before Business Hrs', status: '' },
  { startTime: 61200, endTime: 86400, label: 'After Business Hrs', status: '' },
];

class Detail extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <ButtonNavBar onPress={() => navigation.state.params.handleThis()} icon="info" />,
    title: `${navigation.state.params.title}`,
  });

  state = {
    selectedDays: [],
    selectionSegments: defaultSegmentState,
    showInfo: false,
    modalVisible: false,
    modalStartTime: 0,
    modalEndTime: 0,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.onShowInfo,
    });
  }

  onCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  onModalStartChange = (value) => {
    this.setState({ modalStartTime: parseInt(value, 10) });
  };

  onModalEndChange = (value) => {
    this.setState({ modalEndTime: parseInt(value, 10) });
  };

  onPressEdit = () => {
    const schedule = this.getSchedule();
    // clear existing timeSegments in selected days
    this.state.selectedDays.forEach((day) => {
      const timeSegments = this.getTimeSegments(day);
      timeSegments.forEach((timeSegment) => {
        this.props.removeTimeSegment({
          segmentId: timeSegment.id,
        });
      });
    });

    // add items
    this.state.selectedDays.forEach((day) => {
      this.state.selectionSegments.forEach((segment) => {
        if (segment.status !== '') {
          this.props.createTimeSegment({
            scheduleId: schedule.id,
            status: segment.status,
            startTime: day + segment.startTime,
            endTime: day + segment.endTime,
          });
        }
      });
    });
    // reset selected days
    this.setState({ selectedDays: [], selectionSegments: defaultSegmentState });
  };

  onPressInfo = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  onPressNewSegment = () => {
    this.setState({ modalVisible: true });
  };

  onPressSaveTimeSegment = () => {
    const updatedSegments = this.state.selectionSegments;

    updatedSegments.push({
      startTime: this.state.modalStartTime,
      endTime: this.state.modalEndTime,
      label: 'Custom',
      status: '',
    });

    this.setState({ selectionSegments: updatedSegments, modalVisible: false });
  };

  onPressSegment = (updateSegment) => {
    // update state
    const updatedSegments = this.state.selectionSegments.map((segment) => {
      if (
        segment.startTime === updateSegment.startTime &&
        segment.endTime === updateSegment.endTime
      ) {
        return { ...segment, status: this.getNextSegment(segment.status) };
      }
      return segment;
    });

    this.setState({ selectionSegments: updatedSegments });
  };

  onSelectDay = (day) => {
    let newArray = this.state.selectedDays.slice();
    if (newArray.indexOf(day) !== -1) {
      // remove
      newArray = newArray.filter(d => d !== day);

      // reset state if all elements unselected
      if (newArray.length === 0) {
        this.setState({ selectedDays: newArray, selectionSegments: defaultSegmentState });
      } else {
        this.setState({ selectedDays: newArray });
      }
    } else {
      // add
      newArray.push(day);

      if (newArray.length === 1) {
        const segments = this.getTimeSegments(day);

        if (segments.length > 0) {
          const updatedSegments = this.state.selectionSegments.map((selectionSegment) => {
            const select = segments.filter(
              segment =>
                segment.startTime === selectionSegment.startTime + day &&
                segment.endTime === selectionSegment.endTime + day,
            );

            if (select.length > 0) {
              return { ...selectionSegment, status: select[0].status };
            }

            return selectionSegment;
          });

          // Are any not part of the default stack of segments?
          segments.forEach((segment) => {
            const select = this.state.selectionSegments.filter(
              selectionSegment =>
                selectionSegment.startTime + day === segment.startTime &&
                selectionSegment.endTime + day === segment.endTime,
            );

            if (select.length === 0) {
              updatedSegments.push({
                startTime: segment.startTime - day,
                endTime: segment.endTime - day,
                label: 'Custom',
                status: segment.status,
              });
            }
          });

          this.setState({ selectedDays: newArray, selectionSegments: updatedSegments });
        } else {
          this.setState({ selectedDays: newArray });
        }
      } else {
        this.setState({ selectedDays: newArray });
      }
    }
  };

  onShowInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo,
    });
  };

  getNextSegment = (segment) => {
    switch (segment) {
      case EMPTY:
        return AVAILABLE;
      case AVAILABLE:
        return UNAVAILABLE;
      case UNAVAILABLE:
        return URGENT;
      case URGENT:
        return EMPTY;
      default:
        return EMPTY;
    }
  };

  getSchedule = () =>
    this.props.user.schedules.filter(x => x.id === this.props.navigation.state.params.id)[0];

  getSelectionSegments = day => this.getTimeSegments(day);

  getTimeSegments = (day) => {
    const schedule = this.getSchedule();

    if (day !== undefined) {
      const dayTime = 60 * 60 * 24;
      const endOfDay = day + dayTime;
      const filtered = schedule.timeSegments.filter(
        x => day <= x.startTime && endOfDay >= x.endTime,
      );
      return filtered;
    }
    const momentStartDate = moment.unix(schedule.startTime);

    const startTime = momentStartDate
      .clone()
      .isoWeekday(1)
      .startOf('isoweek')
      .unix();

    const momentEndDate = moment.unix(schedule.endTime);

    const endTime = momentEndDate
      .clone()
      .isoWeekday(1)
      .endOf('isoweek')
      .unix();

    return selectSchedules([schedule], { startTime, endTime });
  };

  render() {
    const { loading, user } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    // are they part of any groups?
    if (user.groups.length === 0) {
      return (
        <Container>
          <Center>
            <Text>You are not part of any groups.</Text>
          </Center>
        </Container>
      );
    }

    const schedule = this.getSchedule();
    const filteredItems = this.getTimeSegments();

    if (schedule.startTime === 0) {
      return (
        <Holder marginTop paddingVertical>
          <Message>Ongoing support for availability entry coming soon</Message>
        </Holder>
      );
    }

    return (
      <Container>
        <Modal visible={this.state.modalVisible} closeModal={this.onCloseModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text type="h1">New Custom Time</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
              <View style={{ flex: 0.3 }}>
                <Text>Start Hour</Text>
              </View>
              <View style={{ flex: 0.7 }}>
                <TimePicker
                  onValueChange={this.onModalStartChange}
                  selectedValue={this.state.modalStartTime}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
              <View style={{ flex: 0.3 }}>
                <Text>End Hour</Text>
              </View>
              <View style={{ flex: 0.7 }}>
                <TimePicker
                  onValueChange={this.onModalEndChange}
                  selectedValue={this.state.modalEndTime}
                />
              </View>
            </View>
          </View>
          <Holder marginTop transparent>
            <Button
              text="Save Time Segment"
              onPress={this.onPressSaveTimeSegment}
              disabled={this.state.modalStartTime >= this.state.modalEndTime}
            />
          </Holder>
        </Modal>
        <ScrollView>
          {schedule.startTime > 0 && (
            <View>
              <Holder marginTop paddingVertical>
                <Message>
                  {moment.unix(schedule.startTime).format('ll')} -{' '}
                  {moment.unix(schedule.endTime).format('ll')}
                </Message>
              </Holder>
              {this.state.showInfo && (
                <Holder marginTop paddingVertical>
                  <Message>{schedule.details}</Message>
                </Holder>
              )}
              <Holder marginTop paddingVertical>
                <DateRange
                  startTime={schedule.startTime}
                  endTime={schedule.endTime}
                  onSelect={this.onSelectDay}
                  selectedDays={this.state.selectedDays}
                  timeSegments={filteredItems}
                />
              </Holder>
            </View>
          )}
          {this.state.selectedDays.length === 0 ? (
            <Holder marginTop paddingVertical>
              <Message center>Tap multiple days to add/edit</Message>
            </Holder>
          ) : (
            <View>
              <Holder marginTop paddingVertical>
                <Message>Select time blocks below and tap to cycle between status types.</Message>
              </Holder>
              <Holder marginTop paddingVertical>
                <TimeSelect
                  selectionSegments={this.state.selectionSegments}
                  onPress={this.onPressSegment}
                  onPressNewSegment={this.onPressNewSegment}
                />
              </Holder>
              <Holder marginTop paddingVertical>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 16 }}>
                    <Icon size={18} name="check-circle" color={Colors.bgBtnAvailable} /> Available
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    <Icon size={18} name="times-circle" color={Colors.bgBtnUnavailable} />{' '}
                    Unavailable
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    <Icon size={18} name="exclamation-circle" color={Colors.bgBtnUrgent} /> Urgent
                  </Text>
                </View>
              </Holder>
              <Holder marginTop transparent>
                <Button text="Save Availability" onPress={this.onPressEdit} />
              </Holder>
            </View>
          )}
        </ScrollView>
      </Container>
    );
  }
}

Detail.propTypes = {
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        timeSegments: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number.isRequired,
            user: PropTypes.shape({
              id: PropTypes.number.isRequired,
            }),
          }),
        ),
      }),
    ),
  }),
  createTimeSegment: PropTypes.func.isRequired,
  removeTimeSegment: PropTypes.func.isRequired,
};

const createTimeSegment = graphql(CREATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    createTimeSegment: ({ scheduleId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { scheduleId, status, startTime, endTime } },
        optimisticResponse: {
          __typename: 'Mutation',
          createTimeSegment: {
            __typename: 'TimeSegment',
            id: -1,
            status,
            startTime,
            endTime,
          },
        },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const removeTimeSegment = graphql(REMOVE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    removeTimeSegment: ({ segmentId }) =>
      mutate({
        variables: { timeSegment: { segmentId } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), createTimeSegment, removeTimeSegment, userQuery)(
  Detail,
);
