import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import useThemeColors from "../hooks/themeColors";
import React, { useState, useEffect } from 'react';
import PetPopup from "../modals/createPetPopup";
import Icon from 'react-native-vector-icons/AntDesign';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {getFirestore, collection, onSnapshot} from "firebase/firestore";

export default function Home({ userPets, navigation, userID }) {
  const colors = useThemeColors();
  const viewStyles = [styles.container, { backgroundColor: colors.background }];
  const nameStyles = [styles.petNameStyle, { color: colors.textPrimary }];
  const profilePictureStyle = [styles.profilepic, { backgroundColor: colors.border }];
  const buttonStyle = [styles.createButton, { backgroundColor: colors.primary }];
  const petContainerStyle = [styles.petContainer];

  const [cppVIsible, setCPPVisible] = useState(false);
  const [petData, setPetData] = useState(null);
  const [pets, setPets] = useState([]);
  const [petPictures, setPetPictures] = useState({});
  
  const openPetPage = (id, name, img) => {
    navigation.push('Pet', { petID: id, petName: name, petImage: img });
  };

  const createNewPet = () => {
    setCPPVisible(true);
  };

  const handleNewPetData = (data) => {
    setPetData(data);
    if (!pets.find(pet => pet.id === data.id)) {
      setPets(prevPets => [...prevPets, { key: prevPets.length + 1, petName: data.petName, petPicture: data.petPicture }]);
    }
      setCPPVisible(false);
  };

  useEffect(() => {
    const loadPets = () => {
      userPets.forEach(pet => {
        handleNewPetData(pet);
      });
    };
    loadPets();
  }, [userPets]);

  const fetchPetPic = async (location) => {
    try {
      const storage = getStorage();
      const url = await getDownloadURL(ref(storage, location));
      setPetPictures(prevPics => ({ ...prevPics, [location]: url }));
    } catch (error) {
      console.error('Error fetching image URL: ', error);
    }
  };

  useEffect(() => {
    const db = getFirestore();
    const userPetsRef = collection(db, `users/${userID}/pets`);

    const unsubscribe = onSnapshot(userPetsRef, snapshot => {
      const newPets = [];
      snapshot.forEach(doc => {
        const petData = doc.data();
        petData.id = doc.id; // Add the document ID to the pet data
        newPets.push(petData);
        if (petData.petPicture && !petPictures[petData.petPicture]) {
          console.log("users/" + userID + "/" + petData.petName + "/" + petData.petPicture);
          fetchPetPic(petData.petPicture);
          // fetchPetPic("zora-pic.jpeg");
        }
      });
      setPets(newPets);
    });

    return () => unsubscribe();
  }, [userID]);

  return (
    <View style={viewStyles}>
      <View style={petContainerStyle}>
        {pets.map(pet => (
          <TouchableOpacity
            key={pet.key}
            onPress={() => openPetPage(pet.key, pet.petName, petPictures[pet.petPicture])}
            style={styles.petprofile}
          >
            <Image
              style={profilePictureStyle}
              source={{ uri: petPictures[pet.petPicture] }}
            />
            <Text style={nameStyles}>{pet.petName}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={createNewPet} style={buttonStyle}>
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
      <PetPopup modalVisible={cppVIsible} setModalVisible={setCPPVisible} onSubmit={handleNewPetData} userID={userID} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petContainer: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 50,
    flexWrap: 'wrap',
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'flex-start'
  },
  petprofile: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  },
  petNameStyle: {
    fontSize: 20,
  },
  profilepic: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  createButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 25,
    marginBottom: 50,
    marginRight: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
