import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/styles';

const HomeScreen = () => {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.text}>Bienvenido a la Aplicación de subastas de Inmuebles entre particulares nº 1 (la única que hay)</Text>
        </View>
    );
};

export default HomeScreen;