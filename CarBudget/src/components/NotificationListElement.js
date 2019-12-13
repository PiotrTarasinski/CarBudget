import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class NotificationListElement extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;
  }

  render() {
    const { notification } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{notification.title}</Text>
        {notification.dateNotification && (
          <View style={styles.inline}>
            <Text style={styles.bolder}>Date: </Text>
            <Text>
              {notification.date.toDate().getDate() +
                '-' +
                (notification.date.toDate().getMonth() + 1) +
                '-' +
                notification.date.toDate().getFullYear()}
            </Text>
          </View>
        )}
        {notification.mileageNotification && (
          <View style={styles.inline}>
            <Text style={styles.bolder}>Mileage: </Text>
            <Text>
              {notification.mileage.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') +
                ' km'}
            </Text>
          </View>
        )}
        {notification.description !== '' && (
          <View style={{ marginTop: 8 }}>
            <Text>{notification.description}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    marginVertical: 4,
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#585858',
    marginBottom: 6,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bolder: {
    fontWeight: 'bold',
    color: '#585858',
    fontSize: 14,
  },
  cost: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ef4339',
  },
});
