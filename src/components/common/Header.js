// Import libraries for making a component
import React from 'react';
import { Text, View, Button } from 'react-native';
import firebase from 'firebase';

// Make a component
const Header = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>
      { firebase.auth().currentUser &&
        <View style={{position: 'absolute', right: 0 }}>
          <Button title="logout" onPress={() => firebase.auth().signOut()} />
        </View>
      }
    </View>
  );
};

const styles = {
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20,
    textAlign: 'right'
  }
};

// Make the component available to other parts of the app
export { Header };
