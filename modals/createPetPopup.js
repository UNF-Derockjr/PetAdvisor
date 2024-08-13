import React, { useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import useThemeColors from '../hooks/themeColors';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import BlankPFP from "../assets/blank-pfp.png";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const PetPopup = ({ modalVisible, setModalVisible, onSubmit, userID }) => {
    const colors = useThemeColors();
    const modalStyle = [styles.modalView, { backgroundColor: colors.surfaceCard }];
    const textStyle = [styles.modalText, { color: colors.textPrimary }];
    const inputStyle = [styles.modalInput, { color: colors.textPrimary, backgroundColor: colors.surfaceBase }];

    const [name, setPetName] = useState('');
    const [image, setSelectedImage] = useState(Image.resolveAssetSource(BlankPFP).uri);
    const [imageChanged, setImageChanged] = useState(false);

    const addNewPet = async (petData) => {
        const db = getFirestore();
        const userPetsRef = collection(db, `users/${userID}/pets`);
        try {
            if (imageChanged && image) {
                await uploadImage(image, `users/${userID}/${name}/${name}-pic.${image.split('.').pop().split('?')[0].split('#')[0]}`);
            }
            await addDoc(userPetsRef, petData);
            console.log('New pet added successfully!');
        } catch (error) {
            console.error('Error adding new pet: ', error);
        }
    };

    const uploadImage = async (uri, fileName) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            await uploadBytes(ref(storage, fileName), blob);
            CreateChatLog();
            console.log('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    };

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageChanged(true);
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting image: ', error);
        }
    };

    const handleSubmit = () => {
        if (imageChanged && name !== '') {
            addNewPet({
                petName: name,
                petPicture: `users/${userID}/${name}/${name}-pic.${image.split('.').pop().split('?')[0].split('#')[0]}`,
                key: Math.floor(Math.random() * (1000 - 1 + 1)) + 1
            });
            setPetName('');
            setSelectedImage(Image.resolveAssetSource(BlankPFP).uri);
            setImageChanged(false);
        } else {
            console.log("Error: Name and image are required.");
        }
    };

    const CreateChatLog = async () => {
        try {
            const content = "Start\n";
            const blob = new Blob([content], { type: 'text/plain' });
            const storage = getStorage();
            const storageRef = ref(storage, `users/${userID}/${name}/${name}-chat.txt`);
            await uploadBytes(storageRef, blob);
            console.log('Text file uploaded successfully!');
        } catch (error) {
            console.error('Error uploading text file: ', error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={modalStyle}>
                    <Text style={textStyle}>Type the name of your pet</Text>
                    <View style={styles.imageContainer}>
                        <ImageBackground style={styles.previewImage} imageStyle={{ borderRadius: "100%" }} source={{ uri: image }}>
                            <TouchableOpacity style={styles.imageIcon} onPress={selectImage}>
                                <Icon name="camera" size={20} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                    <TextInput require value={name} onChangeText={setPetName} style={inputStyle}></TextInput>
                    <View style={styles.footer} >
                        <Button
                            title="Cancel"
                            onPress={() => {
                                setModalVisible(false);
                                setPetName('');
                                setImageChanged(false);
                            }}
                        />
                        <Button
                            title="Confirm"
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    imageContainer: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    imageIcon: {
        borderWidth: 5,
        borderRadius: "100%",
        borderColor: "black",
        width: 40,
        height: 40,
        backgroundColor: "black",
        alignItems: 'center',
        justifyContent: "center",
        right: 0,
        bottom: 0,
        position: "absolute",
    },
    modalInput: {
        width: 180,
        height: 30,
        borderRadius: "70%",
        padding: 5,
        paddingLeft: 10,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
    },
});

export default PetPopup;
