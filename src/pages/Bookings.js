import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import { Icon, Button, Input } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import { Dynatrace, Platform } from '@dynatrace/react-native-plugin';
import Environment from '../common/Environment';

export default class Bookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      date: '',
      movieId: 0,
    };
  }

  getShowtimesByMovieId(id, date){
    fetch(Environment.backend_enpoint+'showtime/search?movieId='+id+'&date='+date, {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin'
      })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.length);
        this.setState({ data: json });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }


  //TODO: getMovies data
  componentDidMount() {
    //console.log("set today date")
    //Getting the current date-time with required format and UTC
    var date = moment().format('LL');
    this.setState({ time: date });
    var movie = this.props.route.params.item;
    this.setState({movieId: movie.id});
    //const { id, title, genre, description, rating, director, icon, duration } = movie;
    //console.log("movie is: "+movie.id);
    //console.log(moment().toISOString());
    this.getShowtimesByMovieId(movie.id, moment().toISOString());
  };


  getPreviousDate = () => {
    let myAction = Dynatrace.enterAction("Touch Previus day");
    myAction.leaveAction();
    //console.log("prev date");
    //Prev Day

    var yesterday = moment(this.state.time).subtract(1, 'day').format('LL');
    this.setState({ time: yesterday });
    //Set loading icon true
    this.setState({isLoading: true});

    //Search Showtime by Date and Movie ID
    this.getShowtimesByMovieId(this.state.movieId, moment(this.state.time).subtract(1, 'day').toISOString());


  };

  getNextDate = () => {
    let myAction = Dynatrace.enterAction("Touch Next day");
    myAction.leaveAction();
    //console.log("next date");
    //Next Day
    var tomorrow = moment(this.state.time).add(1, 'day').format('LL');
    this.setState({ time: tomorrow });

    //Set loading icon true
    this.setState({isLoading: true});
    //Search Showtime by Date and Movie ID
    this.getShowtimesByMovieId(this.state.movieId, moment(this.state.time).add(1, 'day').toISOString());
  };

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <Button title={moment(item.startTime).format('LT')} type="outline" onPress={() => { this.props.navigation.navigate('BookingTickets', { item: item })}}/>
  );

  render() {
    const { route, navigation } = this.props;
    const { item } = route.params;
    const { id, title, genre, description, rating, director, icon, duration } = item;
    //this.getShowtimesByMovieId(item.id);
    const { data, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <Image source={{ uri: icon }} style={styles.images} PlaceholderContent={<ActivityIndicator />}/>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Genre: {genre}</Text>
          <Text style={styles.cardText}>Rating: {rating}</Text>
          <Text style={styles.cardText}>Duration: {duration}</Text>
        </View>

        <Text style={styles.text}>Select Date</Text>
        <View style={{flexDirection: 'row'}}>
          <Input style={styles.input} placeholder='Select Date' disabled={true} value={this.state.time} leftIcon={<Icon raised name='ios-arrow-dropleft' type='ionicon' color='#f50' onPress={() => this.getPreviousDate()} />} rightIcon={<Icon raised name='ios-arrow-dropright' type='ionicon' color='#f50' onPress={() => this.getNextDate()} />} />
        </View>

        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}} >
          {
            data.length ?  data.map((item, i) => (
            isLoading ? <ActivityIndicator/> : (
              <View style={{padding: 3}}>
                <Button title="Proceed" key={i} style={styles.button} title={moment(item.startTime).format('LT')} type="outline" onPress={() => { this.props.navigation.navigate('BookingTickets', { item: item })}}/>
              </View>
            )
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    alignSelf: 'stretch',
    //width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  input:{
    textAlign: 'center',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold'
  },
  card: {
    width: 350,
    //height: 100,
    borderRadius: 10,
    backgroundColor: '#101010',
    margin: 2,
    //padding: 10,
    alignItems: 'center'
  },
  cardText: {
    fontSize: 17,
    color: '#ffd700',
    marginBottom: 3
  },
  button:{
    margin: 5,
    borderRadius: 10,
  }
})
