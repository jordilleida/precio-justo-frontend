import React, { useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { View, Modal } from 'react-native';
import { globalStyles } from './src/styles/styles';
import Header from './src/components/Header';
import Menu from './src/components/Menu';
import LoginModal from './src/components/LoginModal';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserListScreen from './src/screens/UserListScreen';
import ActiveAuctionsScreen from './src/screens/auctions/ActiveAuctionsScreen';
import ActivePropertiesScreen from './src/screens/properties/ActivePropertiesScreen';
import CreatePropertyScreen from './src/screens/properties/CreatePropertyScreen';

const App = () => {
    const [isLoginModalVisible, setLoginModalVisible] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('Home');

    const handleLoginModalVisibility = (visible) => {
        setLoginModalVisible(visible);
    };

    const handleMenuItemSelect = (selectedItem) => {
        switch (selectedItem) {
            case 'UserList':
                setCurrentScreen('UserList');
                break;
            case 'ActiveAuctions':
                setCurrentScreen('ActiveAuctions');
                break;
            case 'ActiveProperties':
                setCurrentScreen('ActiveProperties');
                break;
            case 'CreateProperty':
                setCurrentScreen('CreateProperty');
                break;
        }
    };

    const handleRegisterPress = () => {
        setLoginModalVisible(false);
        setCurrentScreen('Register');
    };

    const handlePrecioJustoPress = () => {
      setCurrentScreen('Home');
    };

    return (
      <AuthProvider>
        <View style={{ flex: 1 }}>
            <View style={globalStyles.headerMenuContainer}>
                <Menu 
                    onMenuItemSelect={handleMenuItemSelect} 
                    onPrecioJustoPress={handlePrecioJustoPress} 
                />
                <Header 
                    onLoginPress={() => setLoginModalVisible(true)} 
                    onPrecioJustoPress={handlePrecioJustoPress} 
                />
            </View>

            {currentScreen === 'Home' && <HomeScreen />}
            {currentScreen === 'Register' && <RegisterScreen />}
            {currentScreen === 'UserList' && <UserListScreen />}
            {currentScreen === 'ActiveAuctions' && <ActiveAuctionsScreen  onShowLoginModal={handleLoginModalVisibility} />}
            {currentScreen === 'ActiveProperties' && <ActivePropertiesScreen />}
            {currentScreen === 'CreateProperty' && <CreatePropertyScreen />}
            <Modal
                visible={isLoginModalVisible}
                onRequestClose={() => setLoginModalVisible(false)}
            >
                <LoginModal onClose={() => setLoginModalVisible(false)} onRegisterPress={handleRegisterPress} />
            </Modal>
        </View>
      </AuthProvider>
    );
};

export default App;
