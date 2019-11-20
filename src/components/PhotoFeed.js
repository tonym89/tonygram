import React, { Component } from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import ActionButton from 'react-native-action-button';
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
          }
        })
    }

  onChooseImagePress = () => {
    const options = { quality: 0 };
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        this.uploadBlob(response.uri)
      }
    })
  }

  uploadBlob(uri, mime = 'application/octet-stream') {
    const { currentUser } = firebase.auth()
    const originalXMLHttpRequest = window.XMLHttpRequest
    const originalBlob = window.Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

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


  render(){
    return(
      <View style={styles.mainContainer}>
        <View>
          <FlatList
            data={this.state.photos.reverse()}
            windowSize={80}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem data={item}/>}
          />
        </View>
        <ActionButton buttonColor="rgba(231,76,60,1)" onPress={this.onChooseImagePress} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
    mainContainer: {
      alignItems: 'center'
    },
  });

export default PhotoFeed;
