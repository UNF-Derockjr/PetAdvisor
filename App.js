import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/home';
import Pet from './screens/petTabNavigator';
import { db } from './fireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Stack = createStackNavigator();

function MyStack() {

  const [pets, setPets] = React.useState([]);

  React.useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'users', 'Derockjr', 'pets');
        const petsSnapshot = await getDocs(petsCollection);

        const petsList = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPets(petsList);
      } catch (error) {
        console.error('Error getting pets: ', error);
      }
    };

    fetchPets();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerMode: 'none',
      }}
    >
      <Stack.Screen name="Home">
        {(props) => <Home {...props} userPets={pets} userID={"Derockjr"} />}
      </Stack.Screen>
      <Stack.Screen name="Pet" component={Pet} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
