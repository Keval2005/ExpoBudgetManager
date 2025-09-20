import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  isPassword,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-slate-700 font-pmedium mb-1.5">{title}</Text>

      <View className={`w-full h-16 px-4 rounded-2xl border-2 ${isFocused ? 'border-emerald-500' : 'border-blue-400'} flex flex-row items-center`}>
        <TextInput
          className="flex-1 text-slate-800 font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#111827"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
