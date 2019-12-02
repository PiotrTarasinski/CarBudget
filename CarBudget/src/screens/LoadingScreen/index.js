import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import firebase from 'firebase';

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" hidden={true} />
        <Image
          source={require('../../assets/authHeader.png')}
          style={{ marginTop: -120, marginLeft: -50 }}
        />
        <Image
          source={require('../../assets/authFooter.png')}
          style={{ position: 'absolute', bottom: -285, right: -105 }}
        />
        <View style={styles.loadingIndicator}>
          <Image source={require('../../assets/loginLogo.png')} />
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color="#E9446A"
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingIndicator: {
    position: 'relative',
    marginTop: -110,
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 60,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: -46,
  },
});
