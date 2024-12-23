import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { User } from '@supabase/auth-js';
import * as Linking from 'expo-linking';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AuthError, useSession } from '~/components/ctx';

export const isAuthError = (error: User | AuthError): error is AuthError => {
  return (error as AuthError).error !== undefined;
};

// Create a new URL for the login page (can be used in other applications)
Linking.createURL('login');

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 pt-12">
        {/* Header */}
        <View className="mb-12">
          <Text className="mb-2 text-4xl font-bold text-gray-800">Welkom! 👋</Text>
          <Text className="text-lg text-gray-500">Log in om door te gaan.</Text>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">E-mailadres</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6
              name="envelope"
              iconStyle="regular"
              size={20}
              color="#A0AEC0"
              className="mr-3"
            />
            {/*<Mail color="#A0AEC0" size={20} className="mr-3" />*/}
            <TextInput
              id="email"
              placeholder="Voer je e-mailadres in"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
              className="flex-1 text-gray-800"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-8">
          <Text className="mb-2 text-gray-700">Wachtwoord</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="lock" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              id="password"
              placeholder="Voer je wachtwoord in"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 text-gray-800"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FontAwesome6 name="eye" iconStyle="regular" size={20} color="#A0AEC0" />
              ) : (
                <FontAwesome6 name="eye-slash" iconStyle="regular" size={20} color="#A0AEC0" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-[#FF6B6B]">Wachtwoord vergeten?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-xl bg-[#FF6B6B] p-4"
          onPress={async () => {
            setLoading(true);
            const data = await signIn(email, password);

            if (isAuthError(data)) {
              console.log('Sign Up Error:', data.error);
              Alert.alert('Sign Up Error', data.error);
              setLoading(false);
              return;
            }

            if (data) {
              router.replace('/');
              return;
            }

            setLoading(false);
          }}
          disabled={loading}>
          <Text className="mr-3 text-lg font-bold text-white">
            {loading ? 'Inloggen...' : 'Inloggen'}
          </Text>
          <FontAwesome6
            name="arrow-right"
            iconStyle="solid"
            size={20}
            color="#fff"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        {/* Sign Up Prompt */}
        <View className="flex-row justify-center">
          <Text className="mr-2 text-gray-500">Nog geen account?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-[#FF6B6B]">Registreer nu</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
