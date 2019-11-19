import React, { Component } from 'react';
import { View, Text, Button, Image, Alert, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import ListItem from './ListItem';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;

class PhotoFeed extends Component {
    constructor(props) {
      super(props);
      this.state = {
        photos: [],
        photoCount: 0
      };
    };

    componentDidMount(){
      const { currentUser } = firebase.auth()
      firebase.database().ref(`users/${currentUser.uid}/photos`)
        .on( 'value', snapshot => {
          if (snapshot.val()) {
          this.setState({
            photos: Object.values(snapshot.val()),
            photoCount: Object.values(snapshot.val()).length
          })
          console.log(snapshot.val())
          }
        })
    }

  onChooseImagePress = async () => {
    const options = { quality: 0 };
    ImagePicker.showImagePicker(options, response => {
      console.log("response", response);
      if (response.uri) {
        this.uploadBlob(response.uri, "test-image")
          .then(() => {
            Alert.alert("Success");
          })
      }
    })
  }

  uploadBlob(uri, mime = 'application/octet-stream') {
    const { currentUser } = firebase.auth()
    const originalXMLHttpRequest = window.XMLHttpRequest
    const originalBlob = window.Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    var numberOfPhotos = firebase.storage().ref().child(`users/${currentUser.uid}/photos`);
    console.log(numberOfPhotos)


    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebase.storage().ref(`users/${currentUser.uid}/photos`).child(`image_${this.state.photoCount}`)

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          window.XMLHttpRequest = originalXMLHttpRequest;
          window.Blob = originalBlob;
          console.log(imageRef.getDownloadURL())
          imageRef.getDownloadURL().then(function(downloadURL){
            firebase.database().ref(`users/${currentUser.uid}/photos`)
              .push({ photo: downloadURL })
          })
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }

  uploadImage = async (uri, imageName) => {
    const { currentUser } = firebase.auth()
    const response = await fetch(uri);
    console.log(response)
    const blob = await response.blob();
    console.log(blob)
    var ref = firebase.storage().ref().child(`users/` + imageName);
    ref.put(blob);
    ref.put(blob).snapshot.ref.getDownloadURL().then(function(downloadURL){
      firebase.database().ref(`users/${currentUser.uid}/photos`)
        .push({ photo: downloadURL })
    })
  }

  handleFetchPhoto = () => {
    const { currentUser } = firebase.auth()
    firebase.database().ref(`users/${currentUser.uid}/photos`)
      .on( 'value', snapshot => {
        this.setState({photos: Object.values(snapshot.val())})
        console.log(snapshot.val())
      })
  }

  render(){
    return(
      <View>
        <Button title="Choose image..." onPress={this.onChooseImagePress} />
        <Button title="Fetch Photo" onPress={this.handleFetchPhoto} />
        <FlatList windowSize={80}
                   data={this.state.photos}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({item}) => <ListItem data={item}/>}
          />
      </View>
    );
  }
};

export default PhotoFeed;
