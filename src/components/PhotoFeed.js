import React, { Component } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';

class PhotoFeed extends Component {
    constructor(props) {
      super(props);
      this.state = {
        photo: null,
      };
    };

  onChooseImagePress = async () => {
    const options = { quality: 0 };
    ImagePicker.showImagePicker(options, response => {
      console.log("response", response);
      if (response.uri) {
        this.uploadImage(response.uri, "test-image")
          .then(() => {
            Alert.alert("Success");
          })
      }
    })
  }

  uploadImage = async (uri, imageName) => {
    const { currentUser } = firebase.auth()
    const response = await fetch(uri);

    console.log(response)
    const blob = await response.blob();
    console.log(blob)
    var ref = firebase.storage().ref().child(`userssfa/` + imageName);
    ref.put(blob);
    ref.put(blob).snapshot.ref.getDownloadURL().then(function(downloadURL){
      firebase.database().ref(`users/${currentUser.uid}/photos`)
        .push({ photo: downloadURL })
    })
  }

  render(){
    return(
      <View>
        <Text>Hello World</Text>
        <Text>{JSON.stringify(this.props)}</Text>
        <Button title="Choose image..." onPress={this.onChooseImagePress} />

        <Button title="Fetch Photo" onPress={this.handleFetchPhoto} />

      </View>
    );
  }
};

export default PhotoFeed;
