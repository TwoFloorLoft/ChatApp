import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends React.Component {

    //Pick an Image from the Library
    pickImage = async () => {
        ///Permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        try {
            if (status === "granted") {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch((error) => {
                    console.error(error);
                });
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Allow Users to take a Photo from the Camera
    takePhoto = async () => {
        //Permission to access the Camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        try {
            if (status === "granted") {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                }).catch((error) => {
                    console.error(error);
                });
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Allow Users to get their Location using GPS
    getLocation = async () => {
        //Permission to access the user's Location 
        const { status } = await Location.requestForegroundPermissionsAsync();
        try {
            if (status === "granted") {
                let result = await Location.getCurrentPositionAsync({}).catch(
                    (error) => {
                        console.error(error);
                    }
                );
                // Send latitude and longitude to locate the position on the map
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Store uploaded images to Firebase as blobs
    uploadImage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().refFromURL("gs://chatapp-5a447.appspot.com").child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    };


    //function that handles communication features
    onActionPress = () => {
        const options = [
            "Choose Image From Library",
            "Use Camera",
            "Send Location",
            "Cancel",
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log("user wants to pick an image");
                        return this.pickImage();
                    case 1:
                        console.log("user wants to take a photo");
                        return this.takePhoto();
                    case 2:
                        console.log("user wants to get their location");
                        return this.getLocation();
                }
            }
        );
    };

    render() {
        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 16,
        backgroundColor: "transparent",
        textAlign: "center",
    },
});

//setting CustomActions props types to function
CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};