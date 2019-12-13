import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Picker,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'firebase';
import Icon from 'react-native-ionicons';

export default class AddExpenseScreen extends React.Component {
  state = {
    errorMessage: null,
    selectedCar: null,
    mode: 'date',
    show: false,
    date: new Date(),
    type: 'Fuel',
    mileage: '',
    cost: '',
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

  handleCostChange = cost => {
    if (!isNaN(cost)) {
      this.setState({
        cost: cost,
      });
    }
  };

  validate = () => {
    const { date, mileage, cost } = this.state;
    if (!date) {
      this.setState({
        errorMessage: 'Date is required',
      });
      return false;
    }
    if (!mileage) {
      this.setState({
        errorMessage: 'Mileage is required',
      });
      return false;
    }
    if (!cost) {
      this.setState({
        errorMessage: 'Cost is required',
      });
      return false;
    }
    return true;
  };

  addExpense = () => {
    const { date, type, mileage, cost, description, selectedCar } = this.state;

    console.log(date);

    if (this.validate()) {
      firebase
        .firestore()
        .collection('expenses')
        .add({
          uid: firebase.auth().currentUser.uid,
          carId: selectedCar.id,
          date,
          type,
          mileage,
          cost,
          description,
        })
        .then(res => {
          this.updateCarMileage();
        })
        .catch(error => {
          ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
        });
    }
  };

  updateCarMileage = () => {
    const { mileage, selectedCar } = this.state;
    if (mileage > selectedCar.mileage) {
      firebase
        .firestore()
        .collection('cars')
        .doc(selectedCar.id)
        .update({ mileage })
        .then(() => {
          ToastAndroid.show('Added Expense!', ToastAndroid.LONG);
          this.props.navigation.goBack();
        });
    } else {
      ToastAndroid.show('Added Expense!', ToastAndroid.LONG);
      this.props.navigation.goBack();
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
      type,
      mileage,
      cost,
      description,
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
          <Text style={styles.headerTitleText}>Add Expense</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.addExpense}>
            <Icon name="checkmark" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.errorMessage}>
            {errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <Text style={styles.inputTitle}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={itemValue => this.setState({ type: itemValue })}>
              <Picker.Item label="Fuel" value="Fuel" />
              <Picker.Item label="Parking" value="Parking" />
              <Picker.Item label="Car Wash" value="Car Wash" />
              <Picker.Item label="Repair" value="Repair" />
              <Picker.Item label="Service" value="Service" />
              <Picker.Item label="Mandate" value="Mandate" />
              <Picker.Item label="Tuning" value="Tuning" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
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
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Cost</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the cost"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={val => this.handleCostChange(val)}
              value={cost}
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
        </View>
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
  pickerContainer: {
    borderColor: '#8A8F9E',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
