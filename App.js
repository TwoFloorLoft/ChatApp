import React, { Component } from 'react'
import 'react-native-gesture-handler';
// import react native gesture handler
import { NavigationContainer } from '@react-navigation/native';
// import react Navigation
import { createStackNavigator } from '@react-navigation/stack';
// import the Screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the Navigator
const Stack = createStackNavigator();

export default class App extends React.Component {

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Start"
                >
                    <Stack.Screen
                        name="Start"
                        component={Start}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={Chat}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}