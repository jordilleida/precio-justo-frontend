import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { globalStyles } from '../styles/styles';

const Header = ({ onLoginPress }) => {
    return (
        <View style={globalStyles.header}>
            <Button 
                title="Inicio sesion" 
                onPress={onLoginPress} 
                buttonStyle={globalStyles.loginButton}
            />
        </View>
    );
};

export default Header;