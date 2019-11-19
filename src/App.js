import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './components/common';
import LoginForm from './components/LoginForm';
import PhotoFeed from './components/PhotoFeed';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      userId: ''
    };
  };

  componentDidMount() {
    // Initialize Firebase
      const firebaseConfig = {
      apiKey: "AIzaSyBNYIW07Bq5pKwqGxmorO4Ka7a471jBOcw",
      authDomain: "tonygram.firebaseapp.com",
      databaseURL: "https://tonygram.firebaseio.com",
      projectId: "tonygram",
      storageBucket: "tonygram.appspot.com",
      messagingSenderId: "967676689647",
      appId: "1:967676689647:web:559e449ac7fbfa7cb66f1a",
      measurementId: "G-078J66YEJP"
    };
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          userId: user.uid
        });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

    renderContent() {
      switch (this.state.loggedIn) {
        case true:
          return (
            <View style={{ justifyContent: 'center', height: 400}}>
              <PhotoFeed userId = { this.state.userId } />
              <Text>{this.state.userId}</Text>
              <Button onPress={() => firebase.auth().signOut()}>
                Log Out
              </Button>
            </View>
          );
        case false:
          return <LoginForm />;
        default:
          return <Spinner size="large" />;
      }
    }

    render() {
      return (
        <View>
          <Header headerText="TonyGram" />
          {this.renderContent()}
        </View>
      );
    }
  }

  export default App;
