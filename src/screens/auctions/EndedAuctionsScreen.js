import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import ApiConstants from '../../constants/ApiConstants';
import { globalStyles } from '../../styles/styles';
import { makeRequest } from '../../utils/networkServices';

const EndedAuctionsScreen = () => {
    const [auctionsWithProperty, setAuctionsWithProperty] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAuctions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await makeRequest(ApiConstants.BASE_URL + ApiConstants.AUCTION_URL + ApiConstants.ENDED_ENDPOINT);

            if (!response.ok || response.status === 204) {
                setAuctionsWithProperty([]);
                setIsLoading(false);
                return;
            }

            const endedAuctions = await response.json();

            const propertiesResponses = await Promise.all(endedAuctions.map(auction => 
                makeRequest(ApiConstants.BASE_URL + ApiConstants.PROPERTY_URL + ApiConstants.PROPERTY_ENDPOINT + '/' + auction.propertyId)
            ));

            const auctionsWithProperty = await Promise.all(propertiesResponses.map(async (response, index) => {
                const propertyData = await response.json();
                const winningBid = endedAuctions[index].bids.find(bid => bid.id === endedAuctions[index].winningBidId);
                const winningBidAmount = winningBid.amount;
                const endDate = new Date(endedAuctions[index].endDate).toLocaleString();
                return { ...endedAuctions[index], property: propertyData, winningBidAmount, endDate };
            }));

            setAuctionsWithProperty(auctionsWithProperty);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error al cargar las subastas: {error.message}</Text>;
    }

    if (auctionsWithProperty.length === 0) {
        return <Text>No hay subastas finalizadas.</Text>;
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Subastas finalizadas</Text>
            <FlatList
                data={auctionsWithProperty}
                keyExtractor={auction => auction.id.toString()}
                renderItem={({ item }) => (
                    <View style={globalStyles.propertyCard}>
                        <Text style={globalStyles.propertyTitle}>{item.property.type} - {item.property.address}</Text>
                        <Text>Precio inicial: {item.initialPrice}€</Text>
                        <Text style={globalStyles.greenText}>Puja ganadora: {item.winningBidAmount}€</Text>
                        <Text>Fecha de finalización: {item.endDate}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default EndedAuctionsScreen;
