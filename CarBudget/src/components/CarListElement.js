import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';

export default class CarListElement extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;
  }

  render() {
    const { car } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.carHeader}>
          <Icon name="logo-model-s" size={28} color={'#585858'} />
          <Text style={styles.carName}>{car.name}</Text>
        </View>
        <View style={styles.carInfoText}>
          <Text style={styles.carInfoHeader}>Brand: </Text>
          <Text style={styles.carInfoDetail}>{car.brand}</Text>
        </View>
        <View style={styles.carInfoText}>
          <Text style={styles.carInfoHeader}>Model: </Text>
          <Text style={styles.carInfoDetail}>{car.model}</Text>
        </View>
        <View style={styles.carInfoText}>
          <Text style={styles.carInfoHeader}>Mileage: </Text>
          <Text style={styles.carInfoDetail}>
            {car.mileage.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}
          </Text>
          <Text> km</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  carHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: 'bold',
    color: '#585858',
  },
  carInfoText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  carInfoHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#585858',
  },
  carInfoDetail: {
    fontSize: 16,
    color: '#585858',
  },
});
