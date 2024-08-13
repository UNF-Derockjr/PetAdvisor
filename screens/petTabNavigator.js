import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import PetInformation from './petInformation'; // A new component to show pet info
import PetFiles from './petFiles'; // A new component to show pet activities
import PetChat from './petChat'; // A new component to show pet activities
import useThemeColors, { Colors } from "../hooks/themeColors";

const Tab = createBottomTabNavigator();

const PetTabNavigator = ({ route }) => {
    const { petID, petName, petImage } = route.params;
    const colors = useThemeColors();

    return (
        <Tab.Navigator screenOptions={{
            showIcon: false, 
            tabBarStyle: {backgroundColor: colors.surfaceBase, borderTopWidth: 0},
            headerShown: false,
        }}>
            <Tab.Screen name="PetInformation"> 
                {(props) => <PetInformation {...props} petID={petID} petName={petName} petImage={petImage} />}
            </Tab.Screen>
            {/* <Tab.Screen name="PetFiles">
                {(props) => <PetFiles {...props} petID={petID} petName={petName} />}
            </Tab.Screen> */}
            <Tab.Screen name="PetChat">
                {(props) => <PetChat {...props} petID={petID} petName={petName} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    nav: {
        backgroundColor: "red"
    }
})

export default PetTabNavigator;
