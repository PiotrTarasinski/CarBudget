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

export default class EditCarScreen extends React.Component {
  state = {
    errorMessage: null,
    name: this.props.navigation.getParam('name'),
    brand: this.props.navigation.getParam('brand'),
    model: this.props.navigation.getParam('model'),
    mileage: this.props.navigation.getParam('mileage'),
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

  saveChanges = () => {
    const { name, brand, model, mileage } = this.state;
    if (this.validation(name, brand, model, mileage)) {
      firebase
        .firestore()
        .collection('cars')
        .doc(this.props.navigation.getParam('id'))
        .set({
          uid: firebase.auth().currentUser.uid,
          name,
          brand,
          model,
          mileage,
        })
        .then(res => {
          this.selectCar(this.props.navigation.getParam('id'));
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
        ToastAndroid.show('Car Edited Successfully!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log(error.message);
        ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
      });
  };

  deleteCar = () => {
    firebase
      .firestore()
      .collection('cars')
      .doc(this.props.navigation.getParam('id'))
      .delete()
      .then(() => {
        ToastAndroid.show('Car Deleted Successfully!', ToastAndroid.LONG);
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
          <Text style={styles.headerTitleText}>Edit Car</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.saveChanges}>
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
              value={this.state.name}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Car Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your car brand"
              autoCapitalize="none"
              onChangeText={brand => this.setState({ brand })}
              value={this.state.brand}
            />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.inputTitle}>Car Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your car model"
              autoCapitalize="none"
              onChangeText={model => this.setState({ model })}
              value={this.state.model}
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
              value={this.state.mileage.replace(
                /(\d)(?=(\d{3})+(?!\d))/g,
                '$1 ',
              )}
            />
          </View>
          <TouchableOpacity
            style={styles.saveChangesbutton}
            onPress={this.saveChanges}>
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 18 }}>
              Save Changes
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <TouchableOpacity
            style={styles.deleteCarbutton}
            onPress={this.deleteCar}>
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 18 }}>
              Delete Car
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
  saveChangesbutton: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 4,
    backgroundColor: '#161F3D',
  },
  orText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d3d3d3',
    paddingVertical: 8,
  },
  deleteCarbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 4,
    backgroundColor: '#E9446A',
  },
});
