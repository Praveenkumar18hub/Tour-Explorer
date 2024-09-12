import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import images from '../../constants/images';
import icon from '../../constants/icon';
import Container from '../../components/Container';
import Items from '../../components/Items';
import { searchLocations, fetchPlaceDetails, getPlacesData, getWeatherData, fetchTravelAdvisorData } from '../../api';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [type, setType] = useState("restaurants");
  const [loadingg, setLoadingg] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [bl_lat, setBl_lat] = useState(null);
  const [bl_lng, setBl_lng] = useState(null);
  const [tr_lat, setTr_lat] = useState(null);
  const [tr_lng, setTr_lng] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const useFetchLocationAndWeather = () => {
    useEffect(() => {
      const getLocationAndWeather = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied. Please enable it in the settings or search manually in the search bar.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setBl_lat(latitude);
        setBl_lng(longitude);

        const weather = await getWeatherData(`${latitude},${longitude}`);
        setWeatherData(weather);
      };

      getLocationAndWeather(); 
    }, []);
  };
  useFetchLocationAndWeather();

  const fetchLocationAndData = async () => {
    setLoading(true); 
    setError('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied.');
        setLoading(false); 
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const placeDetails = await fetchPlaceDetails(latitude, longitude);
      console.log(placeDetails)
      const formattedName = `${placeDetails.name}`;
      setSearchQuery(formattedName);
      setShowSuggestions(false);

      const weather = await getWeatherData(`${latitude},${longitude}`);
      setWeatherData(weather);
      const data = await fetchTravelAdvisorData(latitude, longitude, type);
      setMainData(data);

      setBl_lat(latitude);
      setBl_lng(longitude);

    } catch (error) {
      setError('Error fetching current location details or data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAndData();
  }, []);

  const handleCurrentLocation = async () => {
    fetchLocationAndData();
  };
  
  useEffect(() => {
    if (bl_lat && bl_lng) {
      setLoadingg(true);
      getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type)
        .then((data) => setMainData(data))
        .catch(() => setError('Failed to load places data'))
        .finally(() => setLoadingg(false));
    }
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await searchLocations(query);
      if (data.length === 0) {
        setError('No location found');
        setResults([]);
      } else {
        setResults(data);
        setError('');
      }
    } catch (error) {
      setError('Error - Correct the location');
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), []);

  const handleTextChange = (text) => {
    setSearchQuery(text);
    setError('');
    if (text.length >= 2) {
      debouncedHandleSearch(text);
      setShowSuggestions(true);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  };

  const handlePlaceSelect = async (place) => {
    setLoading(true);
    const { address } = place;
    const formattedNameState = `${address.name}${address.state ? ', ' + address.state : ''}`;
  
    console.log('Selected Place:', JSON.stringify(place, null, 2));
    
    if (place.boundingbox) {
      const boundingBox = place.boundingbox;
      const bl_lat_value = parseFloat(boundingBox[0]);
      const tr_lat_value = parseFloat(boundingBox[1]);
      const bl_lng_value = parseFloat(boundingBox[2]);
      const tr_lng_value = parseFloat(boundingBox[3]);
  
      const isArea = (bl_lat_value !== tr_lat_value) && (bl_lng_value !== tr_lng_value);
  
      const latDifference = Math.abs(tr_lat_value - bl_lat_value);
      const lngDifference = Math.abs(tr_lng_value - bl_lng_value);
  
      if (!isArea || (latDifference < 0.01 && lngDifference < 0.01)) {
        setError('Selected place is too small. Please select a broader area.');
        setResults([]);
        setShowSuggestions(false);
        setLoading(false);
        return; 
      }
  
      setBl_lat(bl_lat_value);
      setBl_lng(bl_lng_value);
      setTr_lat(tr_lat_value);
      setTr_lng(tr_lng_value);
    }
  
    try {
      const location = `${place.lat},${place.lon}`;
      const weather = await getWeatherData(location);
      setWeatherData(weather);
      await fetchPlaceDetails(place.lat, place.lon);
      setSearchQuery(formattedNameState);
      setResults([]);
      setShowSuggestions(false);
    } catch (error) {
      setError('Error fetching place details or weather data');
    } finally {
      setLoading(false); 
    }
  };  

  return (
    <SafeAreaView className="flex-1 relative bg-primary">
      <View className="flex-row justify-between px-8 mt-2">
        <View>
          <Text className="text-3xl text-white font-pblack">Explore</Text>
          <Text className="text-2xl text-secondary font-plight">The Beauty of India</Text>
        </View>
        <View className="w-14 h-14 mt-2 rounded-full items-center justify-center">
          <Image
            source={images.avat}
            className="w-full h-full rounded-full"
          />
        </View>
      </View>

      <View className="flex-1 p-4">
        <View className="flex-row items-center bg-white mx-4 rounded-xl  py-1 px-4 mt-4">
          <Image 
            source={icon.black}
            resizeMode='contain'
            className="w-8 h-8 mr-2"
          />
          <TextInput 
            placeholder="Search a city..." 
            className="flex-1 py-2 text-primary font-psemibold text-lg"
            placeholderTextColor="#161622" 
            value={searchQuery}
            onChangeText={handleTextChange}
            onFocus={() => setShowSuggestions(true)}
          />
          <TouchableOpacity onPress={handleCurrentLocation}>
          <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {error !== "" && <Text className="text-secondary font-psemibold ml-4 mt-3 mb-2">{error}</Text>}

        {showSuggestions && (
          <View className="absolute top-16 left-4 right-4 mx-4 bg-white rounded-xl shadow-lg p-2 z-50">
            {loading && (
              <ActivityIndicator size="large" color="#FF9C01" />
            )}
            <ScrollView className="max-h-[190px]">
              {results.map((item, index) => {
                const { address } = item;
                const formattedNameState = `${address.name}${address.state ? ', ' + address.state : ''}`;
                
                return (
                  <TouchableOpacity key={index} onPress={() => handlePlaceSelect(item)}>
                    <View className="p-2 border-b border-gray-300">
                      <Text className="text-primary font-pmedium">{formattedNameState}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View className="flex-row justify-between mt-10 ml-3 mr-3">
          <Container 
            key={"hotels"}
            title={"Hotels"}
            icon={images.hotel}
            type={type}
            setType={setType}           
          />

          <Container 
            key={"restaurants"}
            title={"Restaurants"}
            icon={images.restaurant}
            type={type}
            setType={setType}           
          />
          <Container 
            key={"attractions"}
            title={"Attractions"}
            icon={images.attract}
            type={type}
            setType={setType}           
          />
        </View>

        <View className="mt-5 justify-between flex-row">
          <View className="">
            <Text className="text-white text-2xl font-psemibold"> Best Locations </Text>
            <Text className="text-secondary ml-4 text-lg font-pmedium"> 
              {type === 'restaurants' && 'Top Restaurants'}
              {type === 'hotels' && 'Top Hotels'}
              {type === 'attractions' && 'Top Attractions'}
            </Text>
          </View>

          <View> 
            {weatherData && (
              <View className="p-2 ml-4 mr-4 bg-secondary rounded-lg">
                {/* <Text className="text-primary text-lg font-psemibold">Current Weather:</Text> */}
                <Text className="text-primary text-sm font-pmedium">Weather: {weatherData.current.temp_c}°C</Text>
                <Text className="text-primary text-sm font-pmedium">{weatherData.location.name}, {weatherData.location.region}</Text>
                
              </View>
            )}
          </View>
        </View>
        
        { loadingg ? (
          <View className="flex-1 items-center justify-center"> 
            <ActivityIndicator size="large" color="#FF9C01"/>
          </View>
        ) : (
          <ScrollView className="mt-5">
            <View className=" flex-row flex-wrap justify-evenly items-center ">
              {mainData?.length > 0 ? (
                <>
                  {mainData
                  .filter(data => data?.name)
                  .map((data, i) => {
                    return (
                      <Items 
                        key={i} 
                        icon={
                          data?.photo?.images?.small?.url 
                          ? data?.photo?.images?.small?.url 
                          : "https://static.thenounproject.com/png/1077596-200.png"
                        } 
                        title={data?.name} 
                        data={data}
                      />
                    );
                  })}
                </> 
                ) : (
                <>
                  <View className="w-full h-[350px] items-center">
                    {searchQuery.trim() === '' ? (
                      <View className="items-center flex-col space-y-2 flex-1 justify-center">
                      <Text className="text-white text-center text-2xl font-pbold">
                        Search a City 
                      </Text>
                      <Text className="text-secondary text-center text-xl font-pregular">
                        Explore the Best spots at your Fingertips!
                      </Text>
                      </View>
                      ) : (
                      <Image 
                        source={images.oops}
                        resizeMode='contain'
                        className="w-[300px] h-[300px]"
                      />
                    )}
                  </View>
                </> 
              )}
            </View>
          </ScrollView> 
        )}

      </View>

    <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
};

export default Explore;