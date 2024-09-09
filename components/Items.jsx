import { Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'


const Items = ({ icon,title, data }) => {

    return (
    <TouchableOpacity
    onPress={() => router.push({
      pathname: '/screen',
      params: { param: JSON.stringify(data) } 
    })}
    className="rounded-md space-y-2 px-2 my-2 py-1 bg-white w-[170px] h-[200px]"
    activeOpacity={0.5}
    >

    <Image
      source={{uri:icon}}
      className="w-full h-40 rounded-md"
      resizeMode='contain'
    />
    
    {title ? (
        <>
        <Text className="text-primary text-[15px] font-psemibold">
          {title?.length > 14 ? `${title.slice(0, 14)}..` : title}
        </Text>
        </>
    ) : (
        <></>
    )}
     
  </TouchableOpacity>
  )
}

export default Items