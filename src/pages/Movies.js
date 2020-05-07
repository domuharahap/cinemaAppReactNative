import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, FlatList} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';

export default class Movies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      search: ''
    };
  }

  //TODO: getMovies data
  componentDidMount() {
    //Load movies
    fetch('http://192.168.56.139:8080/api/movies', {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
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

  //Render Itemsd
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      subtitle={"Rating: " + item.rating + ". Genre: "+item.genre+". Duration: "+item.duration+" Minutes."}
      leftAvatar={{ source: { uri: item.icon } }}
      onPress={() => { this.props.navigation.navigate('Bookings', { item: item })}}
      bottomDivider
      chevron
    />
  );


  render() {
    const { navigation } = this.props;
    const { data, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          style={styles.search}
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Type Here..."
          value={this.state.search}
          lightTheme
        />
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={data}
            renderItem={this.renderItem}
          />
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //padding: 3
    //alignItems: 'center',
    //backgroundColor: '#ebebeb'
  },
  search: {
    alignSelf: 'stretch',
    //flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
