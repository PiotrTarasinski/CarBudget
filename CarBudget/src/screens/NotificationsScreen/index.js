import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import firebase from 'firebase';

export default class NotificationsScreen extends React.Component {
  signOut = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>NotificationsScreen</Text>
        <TouchableOpacity onPress={this.signOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
