import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar, Button } from 'react-native';
import { getAccessToken, getUser, clearTokens, isAuthenticated, getUserFromIdToken, signOut, EventEmitter } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from '../common/Error';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      user: null,
      progress: true,
      error: '',
      authenticated: false,
      context: null,
    };

    this.logout = this.logout.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.clearTokens = this.clearTokens.bind(this);
    console.log("username: "+this.state.user);
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () =>
        <Text onPress={this.logout} style={styles.logoutButton}>Logout</Text>
    });

    this.setState({ progress: true });
    this.getUserFromIdToken();


    this.signInSuccess = EventEmitter.addListener('signInSuccess', function(e: Event) {
      console.log(e.access_token);
      // Do something ...
    });
    this.signOutSuccess = EventEmitter.addListener('signOutSuccess', function(e: Event) {
      //...
    });
  }

  async componentWillUnmount() {
    this.signInSuccess.remove();
    this.signOutSuccess.remove();
  }

  async getUserFromIdToken() {
    await getUserFromIdToken()
    .then(user => {
      this.setState({ progress: false, user: user });
    }).catch(e => {
        this.setState({ progress: false, error: e.message });
    });
  }

  async checkAuthentication() {
    const result = await isAuthenticated();
    console.log("result:: "+result);
    if (result.authenticated !== this.state.authenticated) {
      this.setState({authenticated: result.authenticated});
    }
  }

  async getAccessToken() {
    this.setState({ progress: false });
    getAccessToken()
      .then(token => {
        this.setState({
          progress: false,
          accessToken: token.access_token
        });
      })
      .catch(e => {
        this.setState({ progress: false, error: e.message });
      })
    console.log(this.state.accessToken);
  }

  async logout() {
    signOut();
    //await this.props.logout();
    this.clearTokens();
  }

  async clearTokens() {
    await clearTokens()
      .then(() => {
        this.props.navigation.navigate('Sigin');
      })
      .catch(e => {
        this.setState({ error: e.message })
      });
  }
  render() {
    const { user, accessToken, error, progress } = this.state;
    //console.log("user: "+user);
    //console.log("accesstoken: "+accessToken);
    //console.log("error: "+error);
    //console.log("progress: "+progress);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Error error={error} />
          { user && (
            <View style={{ paddingLeft: 20, paddingTop: 20 }}>
              <Text style={styles.titleHello}>Hello {user.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text>Name: </Text>
                <Text>{user.name}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>Locale: </Text>
                <Text>{user.locale}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>Zone Info: </Text>
                <Text>{user.zoneinfo}</Text>
              </View>
            </View>
          )}
          <View style={{ flexDirection: 'column', marginTop: 20, paddingLeft: 20, width: 300 }}>
            <Button
              style={styles.button}
              testID="logoutButton"
              onPress={async () => { this.logout() }}
              title="Logout"
            />
          </View>
          <View style={{ flexDirection: 'column', marginTop: 20, paddingLeft: 20, width: 300 }}>
            <Button style={{ marginTop:40 }} title="Get access token" onPress={this.getAccessToken} />
            { accessToken &&
              <View style={styles.tokenContainer}>
                <Text style={styles.tokenTitle}>Access Token:</Text>
                <Text style={{ marginTop: 20 }} numberOfLines={5}>{accessToken}</Text>
              </View>
            }
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  logoutButton: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#0066cc',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  titleHello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40
  },
  titleDetails: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 15,
    textAlign: 'center',
  },
  tokenContainer: {
    marginTop: 20
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
