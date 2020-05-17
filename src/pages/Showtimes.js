import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Environment from '../common/Environment';
import moment from 'moment';

export default class Showtimes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      isLoading: true,
      search: '',
      minDate: '',
      maxDate: '',
      data: [],
      selectedMovie: '',
      showtimes: [],
    };
  }

  async componentDidMount() {
    this.setState({minDate: moment().format('LL')});
    this.setState({date: moment().format('LL')});
    this.setState({maxDate: moment().add(30, 'days').format('LL')});

    this.searchShowtimesByDate(moment().toISOString());
  }

  //Todo: Change search
  async searchShowtimesByDate (date) {
    //Load movies
    let dataitem = [];
    try {
      let response = await fetch(Environment.backend_enpoint+'showtime/search?movieId=&date='+date, {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin'
      });
      let json = await response.json();

      for(let i = 0; i < json.length; i++){
        var id = json[i].id;
        try {
          let responsev = await fetch(Environment.headers+'movies/'+id, {
            method: 'GET', // or 'PUT'
            headers: Environment.headers,
            credentials: 'same-origin'
          });
          let jsonv = await responsev.json();
          dataitem = dataitem.concat({id: id, name: jsonv.title});
          //console.log(dataitem);
        } catch (error) {
          console.error(error);
        }
      }
      //console.log(dataitem);
      this.setState({data: dataitem});
      //console.log(this.state.data);
      return dataitem;
    } catch (error) {
      console.error(error);
    }
    //console.log(this.state.data);
  }

  searchShowtimes () {
    console.log("search movie");
    this.setState({ isLoading: true });
    this.searchShowtimesByDateAndMovie(moment(this.state.date).toISOString(), this.state.selectedMovie.id);
  }

  async searchShowtimesByDateAndMovie(date, movieId) {
      //Load movies
    try {
      let response = await fetch(Environment.backend_enpoint+'showtime/search?movieId='+movieId+'&date='+date, {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin'
      });

      let json = await response.json();
      console.log(json);
      this.setState({showtimes: json});

    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  keyExtractor = (item, index) => index.toString();
  render() {
    const { route, navigation } = this.props;

    const { showtimes, isLoading } = this.state;
    return (
      <View style={styles.container}>
          <Text> Select Date </Text>
            <DatePicker
              style={styles.date}
              date={this.state.date} //initial date from state
              mode="date" //The enum of date, datetime and time
              placeholder="select date"
              format="MMM DD, YYYY"
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({date: date})}}
            />
          <Text> Select Movie </Text>
          <SearchableDropdown
            onTextChange={text => console.log(text)}
            onItemSelect={(item) => {this.setState({selectedMovie: item})}}
            containerStyle={styles.containerStyle} textInputStyle={styles.inputStyle}
            itemStyle={styles.itemStyle}
            items={this.state.data} defaultIndex={2} placeholder="Select an Item..." resetValue={false} underlineColorAndroid="transparent"
            //setSort={(item, searchedText)=> item.title.toLowerCase().startsWith(searchedText.toLowerCase())}
          />
          <Button title="Proceed" style={styles.button} title="Search" onPress={(value) => this.searchShowtimes(this.state.date, this.state.selectedMovie)}/>

          <View style={styles.showtimes} >
          {
            showtimes.length ? showtimes.map((item, i) => (
              <View style={styles.showtimebtn}>
                <Button title="Proceed" style={styles.button} title={moment(item.startTime).format('LT')} onPress={() => { this.props.navigation.navigate('BookingTickets', { item: item })}}/>
              </View>
            )) : <Text> No available showtimes. Please select another date </Text>
          }
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ebebeb',
    marginTop: 10,
    flexDirection: 'column',
    padding: 3,
  },
  itemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FAF9F8',
    borderColor: '#bbb',
    borderWidth: 0,
    borderRadius: 1,
  },
  inputStyle: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FAF7F6',
    borderRadius: 5,
  },
  containerStyle: {
     padding: 0,
  },
  date:{
    width: "100%",
    padding: 3,
    borderColor: '#ccc',
    backgroundColor: '#FAF7F6',
    borderRadius: 3,
  },
  button: {
    padding: 5,
    borderColor: 'black',
    borderRadius: 3,
    backgroundColor: '#FAF7F6',
  },
  showtimes: {
    paddingTop: 40,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  showtimebtn: {
    padding: 3,
    alignItems: 'center'
  }
})
