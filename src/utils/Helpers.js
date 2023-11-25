import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTokenAccess = async () => {
    return await AsyncStorage.getItem('accessToken');
};