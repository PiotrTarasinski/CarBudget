import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-ionicons';

import { PieChart } from 'react-native-chart-kit';

import firebase from 'firebase';
import 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import ExpenseListElement from '../../components/ExpenseListElement';

export default class BudgetScreen extends React.Component {
  state = {
    totalCost: 0,
    expenses: [],
    data: [],
  };

  componentDidMount() {
    console.disableYellowBox = true;
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getExpenses();
    });
  }

  getExpenses = () => {
    firebase
      .firestore()
      .collection('userInfo')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(res => {
        if (res.data().selectedCar) {
          firebase
            .firestore()
            .collection('expenses')
            .orderBy('date', 'desc')
            .where('carId', '==', res.data().selectedCar)
            .get()
            .then(querySnapshot => {
              let expenses = [];
              let totalCost = 0;
              let data = [
                {
                  name: 'Fuel',
                  cost: 0,
                  color: '#C3423F',
                },
                {
                  name: 'Repair',
                  cost: 0,
                  color: '#6D696A',
                },
                {
                  name: 'Service',
                  cost: 0,
                  color: '#5BC0EB',
                },
                {
                  name: 'Tuning',
                  cost: 0,
                  color: '#E36588',
                },
                {
                  name: 'Parking',
                  cost: 0,
                  color: '#FDE74C',
                },
                {
                  name: 'Car Wash',
                  cost: 0,
                  color: '#0B2545',
                },
                {
                  name: 'Mandate',
                  cost: 0,
                  color: '#46237A',
                },
                {
                  name: 'Other',
                  cost: 0,
                  color: '#A0A4B8',
                },
              ];
              const currentMonth = new Date().getMonth();
              querySnapshot.forEach(doc => {
                if (
                  currentMonth ===
                  doc
                    .data()
                    .date.toDate()
                    .getMonth()
                ) {
                  expenses.push({ id: doc.id, ...doc.data() });
                  const type = doc.data().type;
                  const cost = doc.data().cost;
                  totalCost = totalCost + parseFloat(cost);
                  data.forEach((el, i) => {
                    if (type === el.name) {
                      data[i].cost = data[i].cost + parseFloat(cost);
                    }
                  });
                }
              });
              this.setState({ expenses });
              this.setState({ totalCost });
              this.setState({ data });
            })
            .catch(error => {
              ToastAndroid.show('Server Error Occurred!', ToastAndroid.LONG);
            });
        }
      });
  };

  render() {
    const { expenses, data, totalCost } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Icon name="wallet" size={32} color="#E9446A" />
            <Text style={styles.headerTitleText}>Budget</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => this.props.navigation.navigate('addExpenseModal')}>
            <Icon name="add" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View>
            <Text style={styles.title}>Current month expense:</Text>
            <PieChart
              data={data}
              width={Dimensions.get('window').width - 12}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              accessor="cost"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          <View style={styles.inline}>
            <Text style={styles.total}>Total: </Text>
            <Text style={styles.totalAmount}>
              {parseFloat(totalCost).toFixed(2)} zł{' '}
            </Text>
          </View>
          {expenses.map(expense => {
            return (
              <TouchableOpacity>
                <ExpenseListElement expense={expense} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 6,
  },
  inline: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 18,
    color: '#ef4339',
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
