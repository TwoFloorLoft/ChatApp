import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDMtD19daCj_1HN24Ic29Lk6DkkMuXbC8Q",
    authDomain: "chatapp-5a447.firebaseapp.com",
    projectId: "chatapp-5a447",
    storageBucket: "chatapp-5a447.appspot.com",
    messagingSenderId: "222626576523",
    appId: "1:222626576523:web:21f0c2f5ddfd46fbd53c8e"
};

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
        };
        //initializing firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        // reference to the Firestore message collection
        this.referenceChatMessages = firebase
            .firestore()
            .collection("messages");
        this.refMsgsUser = null;
    }

    componentDidMount() {
        // Set the page title once Chat is loaded
        let { name } = this.props.route.params
        // Adds the name to top of screen
        this.props.navigation.setOptions({ title: name })

        // Checks the user's connection status
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {

                // listens for updates in the collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);

                // user authentication performed first
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    //update user state with currently active user data
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any",
                        },
                        isConnected: true
                    })

                })
                // system message when user enters chat room
                const systemMsg = {
                    _id: `sys-${Math.floor(Math.random() * 100000)}`,
                    text: `${name} has entered the chat`,
                    createdAt: new Date(),
                    system: true

                };

                this.referenceChatMessages.add(systemMsg)
            } else {
                this.setState({ isConnected: false })
                // get saved messages from local AsyncStorage
                this.getMessages()
            }
        })
    };

    componentWillUnmount() {

        //Unsubscribe from collection updates
        this.authUnsubscribe();
        this.unsubscribe();
    }

    // Calback function for when user sends a message
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages();
            this.saveMessages();
        })
    }

    // When updated set the messages state with the current data 
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        })
        this.setState({
            messages
        })
        // save messages to local AsyncStorage
        this.saveMessages()
    };

    // Add messages to database
    addMessages() {
        const message = this.state.messages[0];
        // Add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
        });
    }

    getMessages = async () => {
        // load messages from local AsyncStorage 
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || []
            this.setState({
                messages: JSON.parse(messages)
            })
        } catch (error) {
            console.log(error.message)
        }
    };

    saveMessages = async () => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    deleteMessages = async () => {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    renderInputToolbar = (props) => {
        if (this.state.isConnected == false) {
        } else {
            return <InputToolbar {...props} />;
        }
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#1982FC'
                    }
                }}
            />
        )
    }



    render() {

        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        let bgColor = this.props.route.params.bgColor;

        return (
            <View style={styles.container}>
                <View
                    style={{
                        backgroundColor: bgColor,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <GiftedChat
                        renderInputToolbar={this.renderInputToolbar}
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        user={this.state.user}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: this.state.user._id,
                            name: this.state.name,
                            avatar: this.state.user.avatar
                        }}
                    />
                    {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="height" /> : null
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    giftedChat: {
        color: '#000',
    },
});