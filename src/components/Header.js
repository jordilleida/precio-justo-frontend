import React from 'react';
import { View, Text, Button } from 'react-native';

const Header = ({ onLoginPress }) => {
    return (
        <View>
            <Button title="Login" onPress={onLoginPress} />
        </View>
    );
};

export default Header;