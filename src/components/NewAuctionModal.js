import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { globalStyles } from '../styles/styles';
import usePost from '../hooks/usePost';
import ApiConstants from '../constants/ApiConstants';
import Icon from 'react-native-vector-icons/FontAwesome';

const NewAuctionModal = ({ isVisible, onClose, propertyId, onAuctionSuccess }) => {
    const [amount, setAmount] = useState('');
    const { doPost, response, error, loading } = usePost(ApiConstants.BASE_URL + ApiConstants.AUCTION_URL + ApiConstants.CREATE_ENDPOINT);

    const handleAuction = async () => {
        const auctionData = {
            propertyId: propertyId,
            initialPrice: parseFloat(amount),
        };

        await doPost(auctionData);
    };

    const handleClose = () => {
        onAuctionSuccess();
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            onRequestClose={handleClose}
            transparent={true}
            animationType="slide"
        >
            <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                    <TouchableOpacity style={globalStyles.closeButton} onPress={handleClose}>
                        <Icon name="close" size={20} />
                    </TouchableOpacity>
                    <Input
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Importe inicial subasta"
                        keyboardType="numeric"                   
                    />
                    <Button
                        title={loading ? 'Procesando...' : 'Crear subasta'}
                        onPress={handleAuction}
                        disabled={loading}
                        buttonStyle={globalStyles.loginButton} 
                        titleStyle={{ fontSize: 16 }}
                    />
                    {response && <Text style={globalStyles.greenText}>{response}</Text>}
                    {error && <Text style={globalStyles.errorText}>{error.message}</Text>} 
                </View>
            </View>
        </Modal>
    );
};

export default NewAuctionModal;
