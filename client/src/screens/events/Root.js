import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { ListItem } from '../../components/List';
import { Container } from '../../components/Container';

import { extendAppStyleSheet } from '../style-sheet';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';

const styles = extendAppStyleSheet({
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

class Event extends Component {
  goToEvent = () => {
    this.props.goToEvent(this.props.event);
  }

  render() {
    const { name, details } = this.props.event;
    return (
      <ListItem
        title={name}
        subtitle={details}
        iconRight="bullhorn"
        onPress={this.goToEvent}
      />
    );
  }
}

Event.propTypes = {
  goToEvent: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    time: PropTypes.string,
    details: PropTypes.string,
  }),
};

class Root extends Component {
  static navigationOptions = {
    title: 'My Events',
  };

  onRefresh = () => {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  goToEvent = (event) => {
    const { navigate } = this.props.navigation;
    navigate('EventDetail', { id: event.id, title: event.name });
  }

  renderItem = ({ item }) => <Event event={item} goToEvent={this.goToEvent} />;

  render() {
    const { loading, user, networkStatus } = this.props;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    const { events } = user;

    if (!events.length) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>You do not have any events.</Text>
        </View>
      );
    }

    // render list of events for user
    return (
      <Container>
        <FlatList
          data={events}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </Container>
    );
  }
}
Root.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
)(Root);
