import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


 class ListItem extends Component {
    render() {
      return(
        <View style={styles.postStyle}>
          <View style={styles.header}>
            <Image source={require('../assets/avatar.jpg')} style={styles.avatar} />
            <Text>Tony McShane</Text>
          </View>
          <Image source={{uri: this.props.data.photo}} style={{width: width, height: 300}} />
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    postStyle: {
    },
    header: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      height: 50,
      fontWeight: '600'
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
    }
  });

export default ListItem;
