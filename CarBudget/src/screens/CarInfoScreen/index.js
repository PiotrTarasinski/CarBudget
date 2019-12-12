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
import CarListElement from '../../components/CarListElement';
import { ScrollView } from 'react-native-gesture-handler';

export default class CarInfoScreen extends React.Component {
  state = {
    carList: [],
  };

  componentDidMount() {
    console.disableYellowBox = true;
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getCarList();
    });
  }

  getCarList = () => {
    firebase
      .firestore()
      .collection('cars')
      .where('uid', '==', firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        let carList = [];
        querySnapshot.forEach(doc => {
          const carId = doc.id;
          const carData = doc.data();
          carList.push({ id: carId, ...carData });
        });
        this.setState({ carList });
      })
      .catch(error => {
        ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Icon name="list-box" size={32} color="#E9446A" />
            <Text style={styles.headerTitleText}>Car List</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => this.props.navigation.navigate('addCarModal')}>
            <Icon name="add" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {this.state.carList.map(car => {
            return (
              <TouchableOpacity
                onPress={() => console.log(car)}
                onLongPress={() => alert('elo')}>
                <CarListElement car={car} />
              </TouchableOpacity>
            );
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
    paddingHorizontal: 12,
  },
  headerButton: {
    paddingHorizontal: 6,
  },
});
