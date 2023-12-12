import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { globalStyles } from '../styles/styles';
import usePost from '../hooks/usePost';
import ApiConstants from '../constants/ApiConstants';
import Icon from 'react-native-vector-icons/FontAwesome';

const BidModal = ({ isVisible, onClose, auctionId, onBidSuccess }) => {
    const [amount, setAmount] = useState('');
    const { doPost, response, error, loading } = usePost(ApiConstants.BASE_URL + ApiConstants.AUCTION_URL + ApiConstants.BID_ENDPOINT);

    const handleBid = async () => {
        const bidData = {
            auctionId: auctionId,
            amount: parseFloat(amount),
        };
    
        await doPost(bidData);
    };

    const handleClose = () => {
        onBidSuccess();
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
                        placeholder="Importe de la puja"
                        keyboardType="numeric"                   
                    />
                    <Button
                        title={loading ? 'Procesando...' : 'Realizar Puja'}
                        onPress={handleBid}
                        disabled={loading}
                        buttonStyle={globalStyles.loginButton} 
                    />
                    {response && <Text style={globalStyles.greenText}>{response}</Text>}
                    {error && <Text style={globalStyles.errorText}>{error.message}</Text>} 
                </View>
            </View>
        </Modal>
    );
};

export default BidModal;
