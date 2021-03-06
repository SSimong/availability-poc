import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ButtonText = ({ title, description, icon }) => (
  <View style={styles.buttonRow}>
    <View>
      <Text style={styles.buttonRowTitle}>{title.toUpperCase()}</Text>
      <Text style={styles.buttonRowDescription}>{description}</Text>
    </View>
    {icon && <Icon name="angle-right" size={40} color="#EEE" />}
  </View>
);

ButtonText.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.bool,
};

export default ButtonText;
