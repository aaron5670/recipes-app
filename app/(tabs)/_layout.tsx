import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Redirect, Tabs } from 'expo-router';

import { useSession } from '~/components/ctx';
import RecipesHomeLoadingScreen from '~/components/loading';

export default function TabLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <RecipesHomeLoadingScreen />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: () => <FontAwesome6 name="house" iconStyle="solid" size={24} color="gray" />,
        }}
      />
      <Tabs.Screen
        name="single-recipe"
        options={{
          title: 'Single recipe',
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome6 name="utensils" iconStyle="solid" size={24} color="gray" />
          ),
        }}
      />
    </Tabs>
  );
}
