import { StyleSheet, View, Text } from "react-native";
import React from 'react';
import useThemeColors, { Colors } from "../hooks/themeColors";


const UpcomingDates = ({ title }) => {
    const colors = useThemeColors();
    const containerStyle = [styles.container, { backgroundColor: colors.surfaceBase }]
    const labelStyle = [styles.label, { backgroundColor: colors.primary }]
    const titleStyle = [styles.title, { color: colors.textPrimary }]
    const textStyle = [styles.text, { color: colors.textSecondary }]
    const reminderStyle = [styles.reminder]
    const dayContainerStyle = [styles.dayContainer]

    return (
        <View style={containerStyle}>
            <View style={dayContainerStyle}>
                <Text style={textStyle}>Fri</Text>
                <Text style={textStyle}>20</Text>
            </View>
            <View style={reminderStyle}>
                <Text style={textStyle} numberOfLines={1} ellipsizeMode='tail' >Check up</Text>
                <Text style={[textStyle, {fontSize: 10, marginTop: 5}]}>Monthly check up at the vet on 25th</Text>
            </View>
            <View style={labelStyle}>
                <Text style={titleStyle}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderRadius: 20,
        width: 150,
        height: 150,
        padding: 15,
        justifyContent: "center"
    },
    label: {
        position: "absolute",
        bottom: 10,
        width: "100%",
        height: 20,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    title: {
        fontSize: 13,
        fontWeight: "bold"
    },
    text: {
        fontSize: 20,
    },
    reminder: {
        width: 90,
        height: 90,
    },
    dayContainer: {
        position: "absolute",
        right: 10,
        top: 10,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default UpcomingDates;