import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import Header from './src/components/Header';
import Menu from './src/components/Menu';
import LoginModal from './src/components/LoginModal';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // Asumiendo que tienes este componente

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
            <Header onLoginPress={() => setLoginModalVisible(true)} />
             <Menu 
                onMenuItemSelect={(screen) => setCurrentScreen(screen)} 
                onPrecioJustoPress={handlePrecioJustoPress} 
            />

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