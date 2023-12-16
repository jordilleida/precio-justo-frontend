import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/styles';

const Header = ({ onLoginPress, onPrecioJustoPress }) => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onPrecioJustoPress();
    };

    return (
        <View style={globalStyles.header}>
            {isAuthenticated ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[globalStyles.headerText, { marginRight: 10 }]}>
                        Hola, {user.name.toUpperCase()}
                    </Text>
                    <Button 
                        title="Logout" 
                        onPress={handleLogout} 
                        buttonStyle={globalStyles.loginButton}
                        titleStyle={{ fontSize: 14 }}
                    />             
                </View>
            ) : (
                <Button 
                    title="Inicio sesión" 
                    onPress={onLoginPress} 
                    buttonStyle={globalStyles.loginButton}
                    titleStyle={{ fontSize: 14 }}
                />
            )}
        </View>
    );
};

export default Header;
