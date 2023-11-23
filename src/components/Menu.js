import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Menu = ({ onMenuItemSelect, onPrecioJustoPress }) => {
    return (
        <View style={styles.menu}>

            <TouchableOpacity onPress={() => onMenuItemSelect('item1')}>
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
    menu: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    greenText: {
        color: '#32cd32',
        fontWeight: 'bold',
    },
});

export default Menu;
