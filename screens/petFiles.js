import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ViewStyle, Image, TouchableOpacity } from 'react-native';
import useThemeColors, { Colors } from "../hooks/themeColors";
import Constants from 'expo-constants';


export default function PetFiles({petID, petName}) {
  const colors = useThemeColors();
  const viewStyles = [
    styles.container,
    { backgroundColor: colors.background },
  ]
  const nameStyles = [styles.petNameStyle, { color: colors.textPrimary }]
  const profilePictureStyle = [styles.profilepic, { backgroundColor: colors.border }]

  return (
    <View style={viewStyles}>
      <StatusBar style="auto"/>
      <Text style={nameStyles}>{petName}'s Files</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petNameStyle: {
    fontSize: 20,
  },
  profilepic: {
    width: "100%",
    height: "100%",
    borderRadius: "100%"
  }
});
