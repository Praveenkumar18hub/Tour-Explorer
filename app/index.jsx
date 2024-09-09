import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import { CustomButton } from '../components';
import { router } from 'expo-router';

export default function App() {
    return (
    <SafeAreaView className="bg-primary flex-1 ">
        <View className="items-center w-full h-full top-20">

          <Image 
              source={images.main}
              className="h-[250px]"
              resizeMode='contain'
          />

          <View className="items-center rounded-border-inherit">
            <Text className="text-white font-psemibold text-5xl mt-5 py-3">
            Escape to New 
            </Text>
            <Text className="text-white font-psemibold text-5xl py-2">
            Adventures
            </Text>
            <Text className="text-xl font-pregular text-gray-100 mt-5 text-center ml-8 mr-8">
            Discover wonders beyond the skyline, where the journey never ends.
            </Text>
          </View>

          <View>
            <CustomButton 
              title="Let's Explore -->"
              handlePress={() => router.push('/explore')}
              containerStyles="mt-7"
            />
          </View>
          
        </View>
        <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
}