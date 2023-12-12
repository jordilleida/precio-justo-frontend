import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image as RNImage, Platform } from 'react-native';
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

    // Flag para recargar datos
    const [shouldReload, setShouldReload] = useState(false);

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
                return { ...property, currentPrice: currentBid, initialPrice : auction.initialPrice, auctionId : auction.id };
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
                            return <img src={item.imageUrl} style={styles.propertyImage} alt="Property" />;
                        } else {
                            return <RNImage source={{ uri: item.imageUrl }} style={styles.propertyImage} />;
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            );
        } else {
            return <Text style={styles.noImageText}>Sin Foto</Text>;
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
                    <View style={styles.propertyCard}>
                        {renderImages(item.images)}
                        <View style={styles.propertyContent}>
                            <Text style={styles.propertyTitle}>{item.type} en {item.postalCode.city.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.initialPrice}>Precio inicial: {item.initialPrice}€</Text>
                                {item.currentPrice > item.initialPrice && (
                                    <Text style={styles.currentPrice}>Puja más alta: {item.currentPrice}€</Text>
                                )}
                            </View>

                            <View style={styles.propertyDetails}>
                                <Text>{item.rooms} hab. | {item.surface} m²</Text>
                           
                            </View>
                            <Text style={styles.propertyDescription}>{item.description}</Text>
                            <View style={styles.propertyToolbar}>
                                   <TouchableOpacity
                                        style={styles.bidButton}
                                        onPress={() => handleBidPress(item.auctionId)}>
                                        <Text style={styles.contactButtonText}>Pujar</Text>
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

const styles = StyleSheet.create({
    propertyCard: {
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    priceRow:{ 
        marginTop:15,
    },
    propertyInfo: {
        padding: 10,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    propertyDetails: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    propertyAddress: {
        fontSize: 14,
        color: '#000',
    },
    contactButton: {
        backgroundColor: '#007bff',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    bidButton: {
        backgroundColor: '#006633',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    propertyImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    noImageText: {
        padding: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    initialPrice: {
        fontSize: 14,
        color: '#666',
    },
    currentPrice: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
    },
});

export default ActiveAuctionsScreen;
