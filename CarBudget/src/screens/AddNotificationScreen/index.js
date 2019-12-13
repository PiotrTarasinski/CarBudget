import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  CheckBox,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'firebase';
import Icon from 'react-native-ionicons';

export default class AddNotificationScreen extends React.Component {
  state = {
    errorMessage: null,
    selectedCar: null,
    mode: 'date',
    show: false,
    date: new Date(),
    dateNotification: true,
    mileageNotification: false,
    mileage: '',
    title: '',
    description: '',
  };

  getSelectedCar = () => {
    firebase
      .firestore()
      .collection('userInfo')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(res => {
        if (res.data().selectedCar) {
          firebase
            .firestore()
            .collection('cars')
            .doc(res.data().selectedCar)
            .get()
            .then(res => {
              if (res.data()) {
                this.setState({ selectedCar: { id: res.id, ...res.data() } });
                this.setState({ mileage: res.data().mileage });
              }
            });
        }
      });
  };

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: false,
      date,
    });
  };

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };

  timepicker = () => {
    this.show('time');
  };

  handleMileageChange = mileage => {
    if (/^\d+$/.test(mileage) || mileage === '') {
      this.setState({
        mileage: mileage,
      });
    }
  };

  validate = () => {
    const {
      date,
      mileage,
      title,
      dateNotification,
      mileageNotification,
    } = this.state;
    if (!date && dateNotification) {
      this.setState({
        errorMessage: 'Date is required',
      });
      return false;
    }
    if (!mileage && mileageNotification) {
      this.setState({
        errorMessage: 'Mileage is required',
      });
      return false;
    }
    if (!title) {
      this.setState({
        errorMessage: 'Title is required',
      });
      return false;
    }
    if (!mileageNotification && !dateNotification) {
      this.setState({
        errorMessage: 'You must check at least one checbkox',
      });
      return false;
    }
    return true;
  };

  AddNotification = () => {
    const {
      date,
      mileage,
      description,
      title,
      mileageNotification,
      dateNotification,
      selectedCar,
    } = this.state;

    if (this.validate()) {
      firebase
        .firestore()
        .collection('notifications')
        .add({
          uid: firebase.auth().currentUser.uid,
          carId: selectedCar.id,
          date,
          title,
          mileage,
          description,
          mileageNotification,
          dateNotification,
        })
        .then(res => {
          ToastAndroid.show(
            'Notification Added Successfully!',
            ToastAndroid.LONG,
          );
          this.props.navigation.goBack();
        })
        .catch(error => {
          ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
        });
    }
  };

  componentDidMount() {
    console.disableYellowBox = true;
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getSelectedCar();
    });
  }

  render() {
    const {
      show,
      date,
      mode,
      errorMessage,
      mileage,
      title,
      description,
      dateNotification,
      mileageNotification,
    } = this.state;

    return (
      <View style={styles.container}>
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={this.setDate}
          />
        )}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={32} color="#E9446A" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Add Notification</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.AddNotification}>
            <Icon name="checkmark" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.errorMessage}>
            {errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title notification"
              autoCapitalize="none"
              onChangeText={value => this.setState({ title: value })}
              value={title}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the description"
              autoCapitalize="none"
              onChangeText={value => this.setState({ description: value })}
              value={description}
            />
          </View>
          <View>
            <Text style={styles.notificateOn}>Notificate on:</Text>
            <View style={styles.inline}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={dateNotification}
                  onValueChange={dateNotification =>
                    this.setState({ dateNotification })
                  }
                />
                <Text>Date</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={mileageNotification}
                  onValueChange={mileageNotification =>
                    this.setState({ mileageNotification })
                  }
                />
                <Text>Mileage</Text>
              </View>
            </View>
          </View>
          {dateNotification && (
            <View style={styles.dateTimeInfo}>
              <View style={styles.dateContainer}>
                <Text style={styles.inputTitle}>Date</Text>
                <Text style={styles.dateInfo} onPress={this.datepicker}>
                  {date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear()}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.inputTitle}>Time</Text>
                <Text style={styles.dateInfo} onPress={this.timepicker}>
                  {(date.getHours() <= 9
                    ? '0' + date.getHours()
                    : date.getHours()) +
                    ':' +
                    (date.getMinutes() <= 9
                      ? '0' + date.getMinutes()
                      : date.getMinutes())}
                </Text>
              </View>
            </View>
          )}
          {mileageNotification && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.inputTitle}>Car Mileage</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your car mileage"
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={value =>
                  this.handleMileageChange(value.replace(/\ /g, ''))
                }
                value={mileage.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificateOn: {
    color: '#8A8F9E',
    fontSize: 16,
    paddingVertical: 8,
  },
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
    color: '#B8BBC4',
    lineHeight: 30,
  },
  headerButton: {
    paddingHorizontal: 6,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  errorMessage: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
    color: '#161F3D',
  },
  dateTimeInfo: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInfo: {
    paddingVertical: 8,
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
    color: '#161F3D',
  },
  dateContainer: {
    width: '48%',
  },
  timeContainer: {
    width: '48%',
  },
});
