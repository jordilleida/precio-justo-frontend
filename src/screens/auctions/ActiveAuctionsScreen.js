import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image as RNImage, Platform } from 'react-native';
import ApiConstants from '../../constants/ApiConstants';
import { getTokenAccess } from '../../utils/Helpers';
import BidModal from '../../components/BidModal';
import { globalStyles } from '../../styles/styles';

const ActiveAuctionsScreen = ({ onShowLoginModal }) => {
    const [combinedData, setCombinedData] = useState([]);
    const [isBidModalVisible, setBidModalVisible] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [shouldReload, setShouldReload] = useState(false);

    const calculateTimeLeft = (endDate) => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const propertiesResponse = await fetch(ApiConstants.BASE_URL + ApiConstants.PROPERTY_URL + ApiConstants.AUCTION_ENDPOINT);
            const propertiesData = await propertiesResponse.json();
            
            const auctionsResponse = await fetch(ApiConstants.BASE_URL + ApiConstants.AUCTION_URL + ApiConstants.ACTIVE_ENDPOINT);
            const auctionsData = await auctionsResponse.json();
      
            // Combinar y actualizar los datos
            const activeProperties = propertiesData.filter(property => auctionsData.some(auction => auction.propertyId === property.id));
            const updatedProperties = activeProperties.map(property => {
                const auction = auctionsData.find(auc => auc.propertyId === property.id);
                const currentBid = auction?.winningBidId ? auction.bids.find(bid => bid.id === auction.winningBidId).amount : null;
                return { 
                    ...property, 
                    currentPrice: currentBid, 
                    initialPrice: auction.initialPrice, 
                    auctionId: auction.id,
                    endDate: auction.endDate,
                    timeLeft: calculateTimeLeft(auction.endDate)
                };
            });
                
            setCombinedData(updatedProperties);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [shouldReload]);

     // Actualizo el tiempo restante cada segundo
     useEffect(() => {
        const timer = setInterval(() => {
            setCombinedData(data => data.map(item => ({
                ...item,
                timeLeft: calculateTimeLeft(item.endDate)
            })));
        }, 1000);

        return () => clearInterval(timer);
    }, []);
        
    const handleBidPress = async (auctionId) => {
        const accessToken = await getTokenAccess();

        if (!accessToken) {
            onShowLoginModal();
        } else {
            setSelectedAuctionId(auctionId);
            setBidModalVisible(true); 
        }
    };

    const reloadAuctions = () => {
        setShouldReload(prev => !prev);
    };

    // Mostrar un indicador de carga si está cargando
    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Mostrar un mensaje de error si hay un error
    if (error) {
        return <Text>Error al cargar las subastas: {error.message}</Text>;
    }

    // Mostrar un mensaje si no hay propiedades en subasta
    if (combinedData.length === 0) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.propertyDetails}>Actualmente no hay inmuebles en subasta</Text>
            </View>
        );
    }

       const renderImages = (images) => {
        if (images && images.length > 0) {
            return (
                <FlatList
                    data={images}
                    horizontal
                    renderItem={({ item }) => {
                        if (Platform.OS === 'web') {
                            return <img src={item.imageUrl} style={globalStyles.propertyImage} alt="Property" />;
                        } else {
                            return <RNImage source={{ uri: item.imageUrl }} style={globalStyles.propertyImage} />;
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            );
        } else {
            return <Text style={globalStyles.noImageText}>Sin Foto</Text>;
        }
    };

    if (combinedData.length === 0) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.propertyDetails}>Actualmente no hay inmuebles en subasta</Text>
            </View>
        );
    }
    
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Lista de propiedades en subasta</Text>
            <FlatList
                data={combinedData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={globalStyles.propertyCard}>
                        {renderImages(item.images)}
                        <View style={globalStyles.propertyContent}>
                            <Text style={globalStyles.propertyTitle}>{item.type} en {item.postalCode.city.name}</Text>
                            <View style={globalStyles.priceRow}>
                                <Text style={globalStyles.initialPrice}>Precio inicial: {item.initialPrice}€</Text>
                                {item.currentPrice > item.initialPrice && (
                                    <Text style={globalStyles.currentPrice}>Puja más alta: {item.currentPrice}€</Text>
                                )}
                                {item.timeLeft && (
                                    <Text style={{ color: 'blue' }}>
                                        Tiempo restante: {`${item.timeLeft.days}d ${item.timeLeft.hours}h ${item.timeLeft.minutes}m ${item.timeLeft.seconds}s`}
                                    </Text>
                                )}
                            </View>

                            <View style={globalStyles.propertyDetails}>
                                <Text>{item.rooms} hab. | {item.surface} m²</Text>
                           
                            </View>
                            <Text style={globalStyles.propertyDescription}>{item.description}</Text>
                            <View style={globalStyles.propertyToolbar}>
                                   <TouchableOpacity
                                        style={globalStyles.bidButton}
                                        onPress={() => handleBidPress(item.auctionId)}>
                                        <Text style={globalStyles.contactButtonText}>Pujar</Text>
                                    </TouchableOpacity>                         
                            </View>
                        </View>
                    </View>
                )}
            />

              {/* Modal de puja */}
              <BidModal
                    isVisible={isBidModalVisible}
                    auctionId={selectedAuctionId}
                    onClose={() => setBidModalVisible(false)}
                    onBidSuccess={reloadAuctions}
                />

        </View>
    );
};


export default ActiveAuctionsScreen;
