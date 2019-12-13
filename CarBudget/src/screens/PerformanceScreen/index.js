import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firebase from 'firebase';
import RNLocation from 'react-native-location';
import Icon from 'react-native-ionicons';

export default class PerformanceScreen extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: null,
    };
  }

  componentWillMount() {
    RNLocation.configure({
      distanceFilter: 1.0,
    });

    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Location permission',
          message: 'We use your location to demo the library',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    }).then(granted => {
      if (granted) {
        this._startUpdatingLocation();
      }
    });
  }

  _startUpdatingLocation = () => {
    this.locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        this.setState({ location: locations[0] });
      },
    );
  };

  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    this.setState({ location: null });
  };

  render() {
    const { location } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Icon name="speedometer" size={32} color="#E9446A" />
            <Text style={styles.headerTitleText}>Performance</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => firebase.auth().signOut()}>
            <Icon name="log-out" size={32} color="#161F3D" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {location && (
            <View>
              <View style={styles.row}>
                <View>
                  <Text style={styles.headerValue}>Latitude: </Text>
                  <Text style={styles.value}>{location.latitude}</Text>
                </View>
                <View>
                  <Text style={styles.headerValue}>Longitude: </Text>
                  <Text style={styles.value}>{location.longitude}</Text>
                </View>
              </View>
              <Text style={styles.speed}>{location.speed} km/h</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  headerValue: {
    fontSize: 18,
    color: '#B8BBC4',
  },
  value: {
    fontSize: 16,
  },
  speed: {
    textAlign: 'center',
    fontSize: 48,
    color: '#E9446A',
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
    marginHorizontal: 12,
    marginTop: 24,
  },
  headerButton: {
    paddingHorizontal: 6,
  },
});
