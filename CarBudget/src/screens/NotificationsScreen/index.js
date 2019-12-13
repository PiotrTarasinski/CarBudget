import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-ionicons';

import firebase from 'firebase';
import 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import NotificationListElement from '../../components/NotificationListElement';

export default class NotificationsScreen extends React.Component {
  state = {
    notifications: [],
  };

  componentDidMount() {
    console.disableYellowBox = true;
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getNotifications();
    });
  }

  getNotifications = () => {
    firebase
      .firestore()
      .collection('userInfo')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(res => {
        if (res.data().selectedCar) {
          firebase
            .firestore()
            .collection('notifications')
            .where('carId', '==', res.data().selectedCar)
            .get()
            .then(querySnapshot => {
              let notifications = [];
              querySnapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
              });
              this.setState({ notifications });
            })
            .catch(error => {
              ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
            });
        }
      });
  };

  render() {
    const { notifications } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Icon name="alert" size={32} color="#E9446A" />
            <Text style={styles.headerTitleText}>Notifications</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              this.props.navigation.navigate('AddNotificationModal')
            }>
            <Icon name="add" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {notifications.map(notification => {
            return <NotificationListElement notification={notification} />;
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB',
  },
  headerTitle: {
    flexDirection: 'row',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#B8BBC4',
    lineHeight: 30,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  headerButton: {
    paddingHorizontal: 6,
  },
});
