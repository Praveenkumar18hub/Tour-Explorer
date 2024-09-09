import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Linking, } from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";


const screen = () => {

  const params = useLocalSearchParams();  
  const data = params?.param ? JSON.parse(params.param) : null;
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary relative">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-2xl ">
          <Image
              source={{
                uri: data?.photo?.images?.large?.url
                  ? data?.photo?.images?.large?.url
                  : "https://static.thenounproject.com/png/1077596-200.png",
              }}
              className="w-full h-72 object-cover rounded-2xl mt-"
          />

          <View className="absolute flex-row inset-x-0 top-8 justify-between px-6">
            <TouchableOpacity
              onPress={() => router.push('/explore')}
              className="w-10 h-10 rounded-lg items-center justify-center bg-white"
              activeOpacity={0.5}
            >
              <FontAwesome5 name="chevron-left" size={24} color="#161622" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFavorite}
              className="w-10 h-10 rounded-lg items-center justify-center border border-black"
              activeOpacity={0.5}
              style={{ backgroundColor: isFavorited ? 'white' : 'white' }}
            >
              <FontAwesome
                name={isFavorited ? 'heart' : 'heart-o'}
                size={24}
                color={isFavorited ? '#D2042D' : '#000'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between">
              <View>
              <Text className="text-secondary text-[24px] font-pbold">
              {data?.name}
              </Text>
            </View>

            <View className="px-2 py-1 rounded-md">
                <Text className="text-white font-pextrabold">{data?.open_now_text}</Text>
              </View>
            </View>
          
          <View className="flex-row items-center space-x-2 mt-1">
            <FontAwesome name="map-marker" size={25} color="#fff" />
            <Text className="text-white text-[20px] font-pregular">
              {data?.location_string}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-md">
                <FontAwesome name="star" size={24} color="black" />
              </View>
              <View> 
                <Text className="text-secondary font-pregular">Ratings</Text>
                <Text className="text-secondary font-pbold">{data?.rating}</Text>
              </View>
            </View>
          )}

          {data?.price && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-md">
              <FontAwesome name="inr" size={24} color="black" />
              </View>
              <View>
                <Text className="text-secondary font-pregular">Price Level</Text>
                <Text className="text-secondary font-pbold">{data?.price}</Text>
              </View>
            </View>
          )}

          {data?.distance_string && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-md">
                <FontAwesome5 name="map-signs" size={24} color="black" />
              </View>
              <View>
               <Text className="text-secondary font-pregular">Distance</Text>
                <Text className="text-secondary font-pbold capitalize">
                  {data?.distance_string}
                </Text>
                
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-pregular text-gray-100">
            {data?.description}
          </Text>
        )}

        {data?.cuisine && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.cuisine.slice(0, 4).map((n) => (
              <TouchableOpacity
                key={n.key}
                className="px-1 py-1 rounded-md bg-secondary"
                activeOpacity={0.5}
              >
                <Text className="font-psemibold text-primary" >{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className=" space-y-2 mt-4 mb-7 bg-white rounded-2xl px-4 py-2">
          {data?.phone && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="phone" size={24} color="#161622" />
              <Text className="text-lg text-primary font-pmedium">{data?.phone}</Text>
            </View>
          )}
          {data?.email && (
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${data.email}`)}>
                <View className="items-center flex-row space-x-6">
                  <FontAwesome name="envelope" size={24} color="#161622" />
                  <Text className="text-lg text-primary font-pmedium">{data.email}</Text>
                </View>
              </TouchableOpacity>
          )}
          {data?.website && (
              <TouchableOpacity onPress={() => Linking.openURL(data.website)}>
                <View className="items-center flex-row space-x-6">
                 <MaterialCommunityIcons name="web" size={24} color="#161622" />
                  <Text className="text-lg text-primary font-pmedium">{data.website}</Text>
                </View>
              </TouchableOpacity>
            )}
          {data?.address && (
            <View className="items-center flex-row space-x-8">
              <FontAwesome name="map-pin" size={24} color="#161622" />
              <Text className="text-lg text-primary font-pmedium">{data?.address}</Text>
            </View>
          )}
          
        </View>

      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
};

export default screen;