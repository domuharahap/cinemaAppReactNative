import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import Environment from '../common/Environment';
import AsyncStorage from '@react-native-community/async-storage';

export default class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      username:"",
      password:"",
      isLoading: false,
      message:"",
      authenticated: false,
    }
  }

  componentDidMount() {
    this.login();
  }
  login = async () => {
    //console.log("login method call");
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      //console.log(username);
      //console.log(password);
      if(username && password){
        //console.log("username:: "+username);
        //console.log("pass:: "+password);

        this.setState({username: username});
        this.setState({password: password});

        this.setState({authenticated: true});
      }
  }

  onLogout = async () => {
    //console.log("logout");
    try{
       await AsyncStorage.clear();
       this.setState({username: ""});
       this.setState({password: ""});
       this.setState({authenticated: false});
    }catch (err) {
      console.log(err);
    }
  }

  authenticate=(username, password)=>{
    //console.log('username:'+username+", pass:"+password);
    this.setState({isLoading:true,message:""})

    fetch(Environment.backend_enpoint+'auth/signin', {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          username: username,
          password: password
        }),
      })
      .then((response) => response.json())
      .then(async (json) => {
        //console.log("response");
        //console.log(json.token);
        //console.log(json.type);
        await AsyncStorage.setItem('jwt', json.token);
        await AsyncStorage.setItem('type', json.type);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("password", password);
        this.props.navigation.navigate("Home");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render(){
    const { navigation } = this.props;
    const { isLoading } = this.state;

    return(
      <View style={styles.container}>
        <Text style={styles.logo}>MovieApps</Text>
        { isLoading ? <ActivityIndicator/> : (
          <>
            <View style={styles.inputView} >
              <TextInput
                editable={this.state.authenticated ? false : true}
                value={this.state.username}
                style={styles.inputText}
                placeholder="Username..."
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({username:text})}/>
            </View>
            <View style={styles.inputView} >
              <TextInput
                editable={this.state.authenticated ? false : true}
                value={this.state.password}
                secureTextEntry
                style={styles.inputText}
                placeholder="Password..."
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({password:text})}/>
            </View>
            {this.state.authenticated ? (
              <TouchableOpacity style={styles.loginBtn} onPress={this.onLogout}>
                <Text style={{color:"#fff"}}>LOGOUT</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.loginBtn} onPress={()=>this.authenticate(this.state.username, this.state.password)}>
                  <Text style={{color:"#fff"}}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  navigation.navigate('Signup')
                }}>
                  <Text style={styles.loginText}>Signup</Text>
                </TouchableOpacity>
              </>
            )}

          </>
      )}

      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:30,
    color:"black",
    marginBottom:40
  },
  inputView:{
    width:"90%",
    backgroundColor:"#F5F5F5",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"black"
  },
  forgot:{
    color:"black",
    fontSize:11
  },
  loginBtn:{
    width:"90%",
    backgroundColor:"#FFD700",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"black"
  },
  logoutButton: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#0066cc',
    backgroundColor: '#FFFFFF',
  },
});
