import React from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image,  Alert, Button } from 'react-native';
import { Icon, Text  } from 'react-native-elements'
import NumericInput from 'react-native-numeric-input'
import Environment from '../common/Environment'
import moment from 'moment';

export default class BookingTickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showtime: '',
      isLoading: true,
      noTicket: 1,
      totalPrice: 0,
      price: 0,
      booking: null,
    };
  }
  //TODO: getMovies data
  componentDidMount() {
    //Get Selected Showtimes
    var item = this.props.route.params.item;
    //console.log(item);
    this.setState({showtime: item});
    this.setState({totalPrice: item.price});
    this.setState({price: item.price});
  };

  addTicket = (total) => {
    //console.log(total);
    this.setState({noTicket: total});
    //update totol price
    var price = total*this.state.price;
    this.setState({totalPrice: price})
  };

  confirmBooking() {
      fetch(Environment+backend_enpoint+'booking?noOfTickets='+this.state.noTicket, {
          method: 'POST', // or 'PUT'
          headers: Environment.headers,
          credentials: 'same-origin',
          body: JSON.stringify({
            movieId: this.state.showtime.movieId,
            showtimeId: this.state.showtime.id,
            bookingNo: '',
            username: 'react-test'
          }),
      })
      .then((response) => {
        console.log("Booking Completed");
        this.showAlertSuccesBooking();
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });

      //AFter post
      console.log("after post");
      console.log(this.state.booking);
  }

  showAlertSuccesBooking() {
      Alert.alert(
          'Confirmation!',
          'You Successfully created your booking!',
          [
              {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
          ]
      );
  }

  showAlertConfirmation(totTicket, totPrice) {
      Alert.alert(
          'Confirmation!',
          'No of Tickets: '+totTicket+'. Total Price: RM'+totPrice,
          [
              {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
              },
              {text: 'OK', onPress: () => this.confirmBooking()},
          ]
      );
  }

  render() {
    const { route, navigation } = this.props;
    const { item } = route.params;
    const { id, movieId, startTime, price} = item;
    return (
      <View style={styles.container}>
        <Image source={{ uri: "https://www.gstatic.com/tv/thumb/v22vodart/10980706/p10980706_v_v8_ab.jpg" }} style={styles.images} PlaceholderContent={<ActivityIndicator />}/>

        <View style={styles.total}>
          <Text style={styles.textlabel} h4>Select No of Tickets</Text>
          <NumericInput value={this.state.noTicket} onChange={value => this.addTicket(value)} minValue={1} maxValue={20} rounded totalWidth={340} iconSize={10} totalHeight={45} textColor='#000000' iconStyle={{ color: 'white' }}  rightButtonBackgroundColor='#006400'  leftButtonBackgroundColor='#8B0000'/>

          <Text h4> Total: RM {this.state.totalPrice}</Text>
        </View>

        <View style={styles.submitButton}>
            <Button title="Proceed" style={styles.button} onPress={(value) => this.showAlertConfirmation(this.state.noTicket, this.state.totalPrice)}/>
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
    //backgroundColor: '#ebebeb',
    marginTop: 0,
  },
  images: {
    alignSelf: 'stretch',
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  textlabel: {
    padding: 5
  },
  text: {
    alignItems: 'center'
  },
  total: {
    padding: 5,
    alignItems: 'center',
  },
  button: {
    color: '#f194ff',
    //backgroundColor: '#222',
    borderRadius: 20
  },
  submitButton: {
    flex: 1,
    borderRadius: 10,
    padding:5,
    justifyContent: 'flex-end'
    //flexDirection: 'column',
    //flexDirection: 'row',
  }
})
