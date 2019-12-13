import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ExpenseListElement extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;
  }

  render() {
    const { expense } = this.props;
    console.log(expense);
    return (
      <View style={styles.container}>
        <Text style={styles.date}>
          {expense.date.toDate().getDate() +
            '-' +
            (expense.date.toDate().getMonth() + 1) +
            '-' +
            expense.date.toDate().getFullYear()}
        </Text>
        <Text style={styles.type}>{expense.type}</Text>
        <View style={styles.inline}>
          <Text style={styles.bolder}>Mileage: </Text>
          <Text>
            {expense.mileage.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' km'}
          </Text>
        </View>
        <View style={styles.test}>
          <Text style={styles.cost}>{'-' + expense.cost + ' zł'}</Text>
        </View>
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
  test: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#585858',
  },
  date: {
    fontSize: 12,
    color: '#E9446A',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bolder: {
    fontWeight: 'bold',
    color: '#585858',
  },
  cost: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ef4339',
  },
});
