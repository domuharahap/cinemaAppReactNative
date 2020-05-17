import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import Environment from '../common/Environment';
import AsyncStorage from '@react-native-community/async-storage';

export default class Signup extends React.Component {
  state={
    email:"",
    password:"",
    name: "",
    username: "",
    loading: false,
    message:""
  }
  componentDidMount(){
      //this.login()
  }

  signup=(email, password, name, username)=>{
    this.setState({isLoading:true,message:""})

    fetch(Environment.backend_enpoint+'signup', {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          username: username
        }),
      })
      .then((response) => response.json())
      .then(async (json) => {
        console.log("Register Success");
        this.navigation.navigate("Signin")

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
        <Text style={styles.logo}>SignUp</Text>
        { isLoading ? <ActivityIndicator/> : (
        <>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText}
              placeholder="Full Name..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({name:text})}/>
          </View>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({email:text})}/>
          </View>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText}
              placeholder="Username..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({username:text})}/>
          </View>
          <View style={styles.inputView} >
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({password:text})}/>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={()=>this.signup(this.state.email, this.state.password,  this.state.name,  this.state.username)}>
            <Text style={{color:"#fff"}}>SignUp</Text>
          </TouchableOpacity>
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
  }
});
