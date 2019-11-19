import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

 class ListItem extends Component {
    render() {
      return(
        <View>
          <Image source={{uri: this.props.data.photo}} style = {{ width: 300, height: 300 }} />
        </View>
      );
    }
  }

export default ListItem;
