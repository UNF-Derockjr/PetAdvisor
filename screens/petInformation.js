import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ViewStyle, Image, TouchableOpacity } from 'react-native';
import useThemeColors, { Colors } from "../hooks/themeColors";
import Constants from 'expo-constants';
import UpcomingDates from '../components/upcomingDates';


export default function PetInformation({ petID, petName, petImage }) {
  const colors = useThemeColors();
  const viewStyles = [
    styles.container,
    { backgroundColor: colors.background },
  ]
  const headerStyle = [styles.header, { backgroundColor: colors.surfaceBase }]
  const widgetContainerStyle = [styles.widgetContainer, { backgroundColor: colors.surfaceCard }]
  const nameStyles = [styles.petNameStyle, { color: colors.textPrimary }]
  const profilePictureStyle = [styles.profilepic, { backgroundColor: colors.border }]
  return (
    <View style={viewStyles}>
      <StatusBar style="auto" />

      <View style={headerStyle}>
        <Image source={{ uri: petImage }} style={profilePictureStyle}></Image>
        <Text style={nameStyles}>{petName}</Text>
      </View>
      <View style={widgetContainerStyle}>
        <UpcomingDates title="Appointments" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  header: {
    width: "100%",
    flex: 1,
    marginTop: 20,
    marginBottom: 30,
    flexDirection: "row",
    padding: 20,
    borderRadius: 30
  },
  widgetContainer: {
    width: "100%",
    flex: 5,
    padding: 15,
    borderRadius: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  petNameStyle: {
    fontSize: 20,
  },
  widget: {},
  profilepic: {
    width: "auto",
    height: "100%",
    aspectRatio: 1,
    borderRadius: "100%"
  },
});
