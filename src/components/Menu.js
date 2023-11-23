import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Menu = ({ onMenuItemSelect, onPrecioJustoPress }) => {
    return (
        <View>
            <TouchableOpacity onPress={() => onMenuItemSelect('item1')}>
                {/* ...otros elementos del menú... */}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onPrecioJustoPress}>
                <Text>
                    <Text style={styles.boldText}>PRECIO </Text>
                    <Text style={styles.greenText}>JUSTO</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold',
    },
    greenText: {
        color: '#32cd32',
        fontWeight: 'bold',
    },
});

export default Menu;
