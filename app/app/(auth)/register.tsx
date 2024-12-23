import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isAuthError } from '~/app/(auth)/login';
import { useSession } from '~/components/ctx';

const RegisterScreen = () => {
  const { signUp } = useSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 pt-12">
        {/* Header */}
        <View className="mb-12">
          <Text className="mb-2 text-4xl font-bold text-gray-800">Account aanmaken</Text>
          <Text className="text-lg text-gray-500">Meld je aan om te beginnen.</Text>
        </View>

        {/* Full Name Input */}
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">Voornaam</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="user" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Voer je voornaam in"
              placeholderTextColor="#A0AEC0"
              value={fullName}
              onChangeText={setFullName}
              className="flex-1 text-gray-800"
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">E-mailadres</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="envelope" iconStyle="regular" size={20} color="#A0AEC0" />
            <TextInput
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
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">Wachtwoord</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="lock" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Voer je wachtwoord in"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 text-gray-800"
            />
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className="mb-8">
          <Text className="mb-2 text-gray-700">Bevestig wachtwoord</Text>
          <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="lock" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Bevestig je wachtwoord"
              placeholderTextColor="#A0AEC0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="flex-1 text-gray-800"
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-xl bg-[#FF6B6B] p-4"
          onPress={async () => {
            setLoading(true);
            if (password !== confirmPassword) {
              Alert.alert('Error', 'Wachtwoorden komen niet overeen');
              setLoading(false);
              return;
            }

            const data = await signUp(fullName, email, password);

            if (isAuthError(data)) {
              console.log('Sign Up Error:', data.error);
              Alert.alert('Sign Up Error', data.error);
              setLoading(false);
              return;
            }

            if (data) {
              Alert.alert(
                'Controleer je e-mail!',
                'Account aangemaakt, controleer je e-mail voor verificatie',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/login'),
                  },
                ]
              );
            }
          }}
          disabled={loading}>
          <Text className="mr-3 text-lg font-bold text-white">
            {loading ? 'Registreren...' : 'Registreren'}
          </Text>
          {!loading && (
            <FontAwesome6 name="arrow-right" iconStyle="solid" size={20} color="white" />
          )}
        </TouchableOpacity>

        {/* Login Prompt */}
        <View className="flex-row justify-center">
          <Text className="mr-2 text-gray-500">Heb je al een account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-[#FF6B6B]">Inloggen</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
