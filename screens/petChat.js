import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useState, useRef } from 'react';
import useThemeColors, { Colors } from "../hooks/themeColors";
import Constants from 'expo-constants';
import Icon from "react-native-vector-icons/AntDesign";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";


import { API_KEY } from "@env";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(API_KEY);

export default function PetChat({ petID, petName, petImage }) {
  const colors = useThemeColors();
  const viewStyles = [
    styles.container,
    { backgroundColor: colors.background },
  ]
  const messageStyle = [styles.message, { color: colors.textPrimary }]
  const messageContainerStyle = [styles.messageContainer, { backgroundColor: colors.surfaceBase }]
  const inputContainerStyle = [styles.inputContainer, { backgroundColor: colors.surfaceCard }]
  const inputStyle = [styles.input, { color: colors.textPrimary }]
  const selectionOptionsStyle = [styles.selectionOptions, { backgroundColor: colors.surfaceCard }]

  const [fileHolder, setFileHolder] = useState([]);
  const [soVisible, setSOVisible] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const [messages, setMessages] = useState([
    // Test messages
    // {
    //   key: 0,
    //   user: false,
    //   text: `Hello, my name is ${petName}`
    // },
    // {
    //   key: 1,
    //   user: false,
    //   text: "I can help you with general pet care advice, like choosing the right pet, providing information about different breeds, and answering questions about nutrition, training, and behavior."
    // }
  ])

  const flatListRef = useRef(null);

  const sendMessage = async () => {
    const question = messageInput;
    if (question.trim() !== '') {
      const newMessage = { key: Date.now(), user: true, text: messageInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // For file inputs
      // if (fileHolder != []) {
      //   for (let i = 0; i < fileHolder.length; i++) {
      //     const item = fileHolder[i];
      //     console.log(item);
      //     const fileName = petName + "-file-" + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(1) + 1)) + Math.ceil(1) + "." + item.split('.').pop().split('?')[0].split('#')[0];
      //     await uploadFiles(fileHolder[i], fileName);
      //   }
      // }
      // setFileHolder([]);
      run(question);
    }
  };

  const run = async (question) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `As a pet advisor, your role is to provide precise and reliable advice about pet care, health, behavior, and training. You should respond concisely, focusing on delivering actionable and correct information to ensure the well-being of pets. Utilize the context available in the Firebase storage to address specific queries with tailored and accurate recommendations. Always prioritize clarity and correctness, as your guidance directly impacts the health and happiness of pets and their owners.
      `,
    });

    const chatSession = model.startChat({
      history: [],
    });

    let messageContent = question;
    const result = await chatSession.sendMessage(messageContent);
    const aiMessage = { key: Date.now(), user: false, text: await result.response.text().trim() };

    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    editTextFile("User: " + messageInput + "\n AI: " + result.response.text().trim() + "\n");
    setMessageInput('');
    flatListRef.current.scrollToEnd({ animated: true });
  };

  //HANDLE FILE INPUT

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFileHolder((prevFiles) => [...prevFiles, result.assets[0].uri]);
      // Image.resolveAssetSource(exampleImage).uri
    }
  };

  const SelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // all files
        copyToCacheDirectory: false, // iOS only
      });

      if (!result.canceled) {
        setFileHolder((prevFiles) => [...prevFiles, result.assets[0].uri]);
        console.log(fileHolder);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const toggleSOVisibility = () => {
    setSOVisible(prevState => !prevState)
  }

  //END HANDLE FILE INPUT

  // EDIT CHATLOG

  // Function to download a file from Firebase Storage
  const downloadFile = async (fileName) => {
    const storage = getStorage();
    const fileRef = ref(storage, fileName);

    try {
      // Get the download URL of the file
      const url = await getDownloadURL(fileRef);
      // Fetch the file content
      const response = await fetch(url);
      return response.text(); // Return the file content as text
    } catch (error) {
      console.error('Error downloading file: ', error);
      throw error;
    }
  };

  // Function to upload a new version of the file
  const uploadTextFile = async (content, fileName) => {
    try {
      // Create a Blob from the updated content
      const blob = new Blob([content], { type: 'text/plain' });

      // Get a reference to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, fileName);

      // Upload the Blob to Firebase Storage
      await uploadBytes(storageRef, blob);
      console.log('Text file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading text file: ', error);
    }
  };

  // Main function to edit a text file
  const editTextFile = async (newContent) => {
    const filePath = `users/Derockjr/${petName}/${petName}-chat.txt`;

    try {
        // Download the existing file content
        const existingContent = await downloadFile(filePath);
        console.log('Existing content:', existingContent);

        // Combine existing content with new content
        const updatedContent = existingContent + newContent; // Example: appending new content

        // Upload the updated content
        await uploadTextFile(updatedContent, filePath);
        console.log('Text file edited successfully!');
    } catch (error) {
        console.error('Error editing text file: ', error);
    }
};


  //END EDIT CHATLOG

  const uploadFiles = async (uri, fileName) => {
    const location = "users/" + "Derockjr" + "/" + petName + "/"
    console.log("uploading...");
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `${location}${fileName}`);

    try {
      await uploadBytes(storageRef, blob);
      console.log('File uploaded successfully!');
      toggleSOVisibility();
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };


  return (
    <View style={viewStyles}>
      <StatusBar style="auto" />
      {/* <ScrollView style={styles.messageList}>
        {messages.map((message) => {
          return (
            <View key={message.key} style={[messageContainerStyle, { alignItems: message.user ? "flex-end" : "flex-start" }]}>
              <Text style={messageStyle} >{message.text}</Text>
            </View>
          );
        })}
      </ScrollView> */}
      <FlatList
        style={styles.messageList}
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) =>
          <View key={item.key} style={[messageContainerStyle, { alignItems: item.user ? "flex-end" : "flex-start" }]}>
            <Text style={messageStyle} >{item.text}</Text>
          </View>

        }
        keyExtractor={item => item.key}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      >

      </FlatList>
      <View style={inputContainerStyle}>
        <TouchableOpacity onPress={toggleSOVisibility}>
          {/* <Icon name="paperclip" size={30} color={colors.textSecondary} /> */}
        </TouchableOpacity>
        <TextInput onSubmitEditing={sendMessage} value={messageInput} onChangeText={setMessageInput} style={inputStyle}></TextInput>
        {/* Below is a popup for attachments */}
        {soVisible && (
          <View style={selectionOptionsStyle} hidden>
            <TouchableOpacity onPress={SelectFiles}>
              <Icon name="folderopen" size={40} color={colors.textSecondary} /></TouchableOpacity>
            <TouchableOpacity onPress={selectImage}>
              <Icon name="picture" size={40} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    marginTop: 80,
    height: "93%",
    width: "100%",
  },
  messageContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15
  },
  message: {
    fontSize: 25,
  },
  inputContainer: {
    height: "7%",
    flexDirection: "row",
    width: "100%",
    postion: "absolute",
    bottom: 0,
    borderRadius: 30,
    marginBottom: 20,
    paddingLeft: 10,
    alignItems: "center"
  },

  input: {
    flex: 8,
    marginHorizontal: 10,
    fontSize: 30,
    height: "100%"
  },
  selectionOptions: {
    width: 80,
    height: 100,
    position: "absolute",
    transform: [{ translateY: -100 }, { translateX: 20 }],
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});
