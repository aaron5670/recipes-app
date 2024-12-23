import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from '~/components/ctx';

import '../global.css';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <StatusBar key="root-status-bar-light" style="light" />
      <SessionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="(auth)" options={DEFAULT_OPTIONS} />
            <Stack.Screen name="(recipes)" options={DEFAULT_OPTIONS} />
          </Stack>
        </GestureHandlerRootView>
      </SessionProvider>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
  headerShown: false,
} as const;

const DEFAULT_OPTIONS = {
  headerShown: false,
} as const;
