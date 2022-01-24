import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import backgroundImg from '../assets/bgimage.png';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ImageBackground source={backgroundImg} resizeMode="cover" style={styles.bgImage} >

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Chat App</Text>
                    </View>
                    <TextInput
                        style={{ height: 40, borderColor: "white", borderWidth: 1 }}
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        placeholder="Type here..."
                    />
                    <View>
                        <Text style={styles.colorsTitle}>Choose background color</Text>
                    </View>
                    <View style={styles.colorsList}>
                        <TouchableOpacity style={styles.black}
                            onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name })}>
                            <View style={styles.black}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.purple}
                            onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name })}>
                            <View style={styles.purple}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grey}
                            onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name })}>
                            <View style={styles.grey}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.green}
                            onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name })}>
                            <View style={styles.green}></View>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title="Go to Chat"
                        onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name })}
                    />
                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    titleText: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 16,
        fontWeight: '300',
        opacity: 0.5,
        color: '#757083',
    },
    colorsTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 100,
        marginBottom: 10,
    },
    colorsList: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    black: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#090C08',
    },
    purple: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#474056',
    },
    grey: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8A95A5',
    },
    green: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#B9C6AE',
    },
    button: {
        width: '88%',
        height: 60,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#757083',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});