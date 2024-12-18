import { AntDesign } from '@expo/vector-icons';
import { User } from '@supabase/auth-js';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AuthError, useSession } from '~/app/ctx';

export const isAuthError = (error: User | AuthError): error is AuthError => {
  return (error as AuthError).error !== undefined;
};

const socialLogins = [
  {
    name: 'Google',
    icon: <AntDesign name="google" size={24} color="black" />,
    backgroundColor: '#F1F5F9',
  },
  {
    name: 'Apple',
    icon: <AntDesign name="apple-o" size={24} color="white" />,
    backgroundColor: '#1F2937',
  },
  {
    name: 'Facebook',
    icon: <AntDesign name="facebook-square" size={24} color="white" />,
    backgroundColor: '#2563EB',
  },
];

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-12">
          <Text className="mb-2 text-4xl font-bold text-gray-800">Welcome</Text>
          <Text className="text-lg text-gray-500">Sign in to continue</Text>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="mb-2 text-gray-700">Email Address</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <Mail color="#A0AEC0" size={20} className="mr-3" />
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
        <View className="mb-8">
          <Text className="mb-2 text-gray-700">Password</Text>
          <View className="flex-row items-center rounded-xl bg-gray-100 p-4">
            <Lock color="#A0AEC0" size={20} className="mr-3" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 text-gray-800"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye color="#A0AEC0" size={20} />
              ) : (
                <EyeOff color="#A0AEC0" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-[#FF6B6B]">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-xl bg-[#FF6B6B] p-4"
          onPress={async () => {
            setLoading(true);
            const data = await signIn(email, password);
            console.log('User:', data);

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
            {loading ? 'Loading...' : 'Sign In'}
          </Text>
          <ArrowRight color="white" size={20} />
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

        {/* Sign Up Prompt */}
        <View className="flex-row justify-center">
          <Text className="mr-2 text-gray-500">Don't have an account?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-[#FF6B6B]">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
