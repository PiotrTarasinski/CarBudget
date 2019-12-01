import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: null,
  };

  handleRegister = () => {
    const { email, password, confirmPassword } = this.state;

    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(error => {
          this.setState({ errorMessage: error.message });
        });
    } else {
      this.setState({ errorMessage: "Passwords doesn't match" });
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" hidden={true} />
        <Image
          source={require('../../assets/authHeader.png')}
          style={{ marginTop: -196, marginLeft: -50 }}
        />
        <Image
          source={require('../../assets/authFooter.png')}
          style={{ position: 'absolute', bottom: -325, right: -225 }}
        />
        <Image
          source={require('../../assets/loginLogo.png')}
          style={{ marginTop: -110, alignSelf: 'center' }}
        />
        <Text style={styles.greeting}>Sign up to get started</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Enter your password"
              autoCapitalize="none"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Confirm your password"
              autoCapitalize="none"
              onChangeText={confirmPassword =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 18 }}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: 'center', marginVertical: 32 }}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={{ color: '#414959', fontSize: 14 }}>
            Already have an account?{' '}
            <Text style={{ fontWeight: '500', color: '#E9446A' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: -32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
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
  form: {
    marginHorizontal: 30,
    marginBottom: 36,
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 4,
    marginHorizontal: 30,
    backgroundColor: '#E9446A',
  },
});
