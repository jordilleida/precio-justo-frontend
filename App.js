import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { globalStyles } from './src/styles/styles';
import Header from './src/components/Header';
import Menu from './src/components/Menu';
import LoginModal from './src/components/LoginModal';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const App = () => {
    const [isLoginModalVisible, setLoginModalVisible] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('Home');

    const handleRegisterPress = () => {
        setLoginModalVisible(false);
        setCurrentScreen('Register');
    };

    const handlePrecioJustoPress = () => {
      setCurrentScreen('Home');
  };
    return (
        <View style={{ flex: 1 }}>
            <View style={globalStyles.headerMenuContainer}>
                <Menu 
                    onMenuItemSelect={(screen) => setCurrentScreen(screen)} 
                    onPrecioJustoPress={handlePrecioJustoPress} 
                />
                <Header onLoginPress={() => setLoginModalVisible(true)} />
            </View>

            {currentScreen === 'Home' && <HomeScreen />}
            {currentScreen === 'Register' && <RegisterScreen />}

            <Modal
                visible={isLoginModalVisible}
                onRequestClose={() => setLoginModalVisible(false)}
            >
                <LoginModal onClose={() => setLoginModalVisible(false)} onRegisterPress={handleRegisterPress} />
            </Modal>
        </View>
    );
};

export default App;