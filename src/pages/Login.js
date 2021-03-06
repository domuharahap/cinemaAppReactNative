import React from 'react';
import { SafeAreaView, Button, StyleSheet, Text, View, StatusBar, TextInput, } from 'react-native';
import { signIn } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from '../common/Error';
import { Dynatrace, Platform } from '@dynatrace/react-native-plugin';


export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      progress: false,
      error: '',
    };

    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ progress: true });

    const { username, password } = this.state;
    const { navigation } = this.props;
    Dynatrace.identifyUser(username);

    signIn({ username: username, password: password })
      .then(token => {
        this.setState({
          progress: false,
          username: '',
          password: '',
          error: ''
        }, () => navigation.navigate('Home'));
      })
      .catch(e => {
        this.setState({ progress: false, error: e.message });
      });
  }

  render() {
    const { progress, error } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Text style={styles.title}>Native Sign-In</Text>
          <Error error={error} />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TextInput
                style={styles.textInput}
                placeholder="User Name"
                onChangeText={username => this.setState({ username })}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />
              <View style={{marginTop: 40, height: 40}}>
                <Button
                  testID="loginButton"
                  onPress={this.login}
                  title="Login"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  textInput: {
    marginTop: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  }
});
