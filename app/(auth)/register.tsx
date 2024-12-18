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

  const socialLogins = [
    {
      name: 'Google',
      icon: <FontAwesome6 name="google" iconStyle="brand" size={24} />,
      backgroundColor: '#F1F5F9',
    },
    {
      name: 'Apple',
      icon: <FontAwesome6 name="apple" iconStyle="brand" size={24} color="#fff" />,
      backgroundColor: '#1F2937',
    },
    {
      name: 'Facebook',
      icon: <FontAwesome6 name="facebook" iconStyle="brand" size={24} color="#fff" />,
      backgroundColor: '#2563EB',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-12">
          <Text className="mb-2 text-4xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-lg text-gray-500">Sign up to get started</Text>
        </View>

        {/* Full Name Input */}
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">Full Name</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="user" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Enter your full name"
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
          <Text className="mb-2 text-gray-700">Email Address</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="envelope" iconStyle="regular" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Enter your email"
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
          <Text className="mb-2 text-gray-700">Password</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="lock" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Create a strong password"
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
          <Text className="mb-2 text-gray-700">Confirm Password</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <FontAwesome6 name="lock" iconStyle="solid" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Confirm your password"
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
              console.log('Passwords do not match');
              Alert.alert('Error', 'Passwords do not match');
              setLoading(false);
              return;
            }

            const data = await signUp(fullName, email, password);
            console.log('User:', data);

            if (isAuthError(data)) {
              console.log('Sign Up Error:', data.error);
              Alert.alert('Sign Up Error', data.error);
              setLoading(false);
              return;
            }

            if (data) {
              router.replace('/login');
            }
          }}
          disabled={loading}>
          <Text className="mr-3 text-lg font-bold text-white">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
          {!loading && (
            <FontAwesome6 name="arrow-right" iconStyle="solid" size={20} color="white" />
          )}
        </TouchableOpacity>

        {/* Social Login */}
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-center">
            <View className="mr-4 h-[1px] flex-1 bg-gray-300" />
            <Text className="text-gray-500">Or continue with</Text>
            <View className="ml-4 h-[1px] flex-1 bg-gray-300" />
          </View>

          <View className="flex-row justify-center space-x-4">
            {socialLogins.map((social) => (
              <TouchableOpacity
                key={social.name}
                className="items-center justify-center rounded-xl p-3"
                style={{ backgroundColor: social.backgroundColor }}>
                {social.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Login Prompt */}
        <View className="flex-row justify-center">
          <Text className="mr-2 text-gray-500">Already have an account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-[#FF6B6B]">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
