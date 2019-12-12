import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-ionicons';

import firebase from 'firebase';
import 'firebase/firestore';

export default class AddCarScreen extends React.Component {
  state = {
    errorMessage: null,
    name: '',
    brand: '',
    model: '',
    mileage: '',
  };

  componentDidMount() {
    console.disableYellowBox = true;
  }

  handleMileageChange = mileage => {
    if (/^\d+$/.test(mileage) || mileage === '') {
      this.setState({
        mileage: mileage,
      });
    }
  };

  validation = (name, brand, model, mileage) => {
    if (!name) {
      this.setState({
        errorMessage: 'Car name is required',
      });
      return false;
    }
    if (!brand) {
      this.setState({
        errorMessage: 'Car brand is required',
      });
      return false;
    }
    if (!model) {
      this.setState({
        errorMessage: 'Car model is required',
      });
      return false;
    }
    if (!mileage) {
      this.setState({
        errorMessage: 'Car mileage is required',
      });
      return false;
    }
    return true;
  };

  addCar = () => {
    const { name, brand, model, mileage } = this.state;
    if (this.validation(name, brand, model, mileage)) {
      firebase
        .firestore()
        .collection('cars')
        .add({
          uid: firebase.auth().currentUser.uid,
          name,
          brand,
          model,
          mileage,
        })
        .then(res => {
          this.selectCar(res.id);
        })
        .catch(error => {
          console.log(error.message);
          ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
        });
    }
  };

  selectCar = carId => {
    firebase
      .firestore()
      .collection('userInfo')
      .doc(firebase.auth().currentUser.uid)
      .set({ selectedCar: carId })
      .then(() => {
        ToastAndroid.show('Car Added Successfully!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log(error.message);
        ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={32} color="#E9446A" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Add Car</Text>
          <TouchableOpacity style={styles.headerButton} onPress={this.addCar}>
            <Icon name="checkmark" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <View>
            <Text style={styles.inputTitle}>Car Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name your car"
              autoCapitalize="none"
              onChangeText={name => this.setState({ name })}
              value={this.state.email}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Car Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your car brand"
              autoCapitalize="none"
              onChangeText={brand => this.setState({ brand })}
              value={this.state.email}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Car Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your car model"
              autoCapitalize="none"
              onChangeText={model => this.setState({ model })}
              value={this.state.email}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Car Mileage</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your car mileage"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={mileage =>
                this.handleMileageChange(mileage.replace(/\ /g, ''))
              }
              // onChangeText={mileage => this.setState({ mileage })}
              value={this.state.mileage.replace(
                /(\d)(?=(\d{3})+(?!\d))/g,
                '$1 ',
              )}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={this.addCar}>
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 18 }}>
              Add Car
            </Text>
          </TouchableOpacity>
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
  button: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 4,
    backgroundColor: '#E9446A',
  },
});
