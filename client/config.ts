import Constants from 'expo-constants';

const { extra } = Constants.expoConfig || {};

export const LOCAL_IP_ADDRESS: string = extra?.localIpAddress || '192.168.0.73';
export const GOOGLE_MAPS_API_KEY: string = extra?.googleMapsApiKey || '';
export const SERVER_PORT: number | string = extra?.serverPort || 3001;
