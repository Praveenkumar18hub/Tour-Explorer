import axios from 'axios';

import { LOCATIONIQ_KEY, RAPIDAPI_KEY, WEATHERAPI_KEY } from '@env';

const LOCATIONIQ_BASE_URL = 'https://us1.locationiq.com/v1/';
const TRAVEL_ADVISOR_BASE_URL = 'https://travel-advisor.p.rapidapi.com/';
const WEATHERAPI_BASE_URL = 'http://api.weatherapi.com/v1/';

export const searchLocations = async (query) => {
  try {
    const { data } = await axios.get(`${LOCATIONIQ_BASE_URL}autocomplete`, {
      headers: { accept: 'application/json' },
      params: {
        q: query,
        key: LOCATIONIQ_KEY,
        format: 'json',
        countrycodes: 'IN',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching locations:', error.message);
    throw error;
  }
};

export const fetchPlaceDetails = async (lat, lon) => {
  try {
    const { data } = await axios.get(`${LOCATIONIQ_BASE_URL}reverse`, {
      headers: { accept: 'application/json' },
      params: {
        lat,
        lon,
        key: LOCATIONIQ_KEY,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    throw error;
  }
};

export const getPlacesData = async (
  bl_lat = '10.8418115',
  bl_lng = '76.802842',
  tr_lat = '11.1618115',
  tr_lng = '77.1228425',
  type = 'restaurants'
) => {
  try {
    const { data: { data } } = await axios.get(`${TRAVEL_ADVISOR_BASE_URL}${type}/list-in-boundary`, {
      params: {
        bl_latitude: bl_lat,
        tr_latitude: tr_lat,
        bl_longitude: bl_lng,
        tr_longitude: tr_lng,
        limit: '30',
        currency: 'USD',
        open_now: 'false',
        lunit: 'km',
        lang: 'en_US',
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching places data:', error.message);
    return null;
  }
};

export const getWeatherData = async (location) => {
  try {
    const { data } = await axios.get(`${WEATHERAPI_BASE_URL}current.json`, {
      params: {
        key: WEATHERAPI_KEY,
        q: location,
        aqi: 'no',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null;
  }
};
