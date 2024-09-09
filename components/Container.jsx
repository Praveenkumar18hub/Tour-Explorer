import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Container = ({ title, icon, type, setType}) => {
    const handlePress = () => {
        setType(title.toLowerCase())
    }
  return (
    <TouchableOpacity 
        className="items-center justify-between"
        activeOpacity={0.7}
        onPress={handlePress}
    >
        <View className={`w-24 h-24 shadow-lg rounded-full`}>
            <Image 
            source={icon}
            className="w-full h-full object-contain"
            />
        </View>

        <Text className={`text-lg font-psemibold text-white  ${type === title.toLowerCase() ? "text-secondary-100" : ""} `}> {title} </Text>

    </TouchableOpacity>
  )
}

export default Container