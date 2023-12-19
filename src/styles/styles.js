import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    headerMenuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      modalContent: {
        width: '80%', 
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000', 
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      loginButton: {
        backgroundColor: '#4c9c2e', 
        color: 'white',
        maxWidth:120,
      },
      closeButton: {
        alignSelf: 'flex-end',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20, 
    },
    input: {
        height: 50,
        width: '90%', 
        marginVertical: 10, 
        borderWidth: 1, 
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 5, 
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
      errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 5,
      },
      registerText: {
        marginTop: 15,
        color: 'black',
        textAlign: 'center',
        textDecorationLine: 'underline',
      },
      closeButton: {
        alignSelf: 'flex-end',
      },
      menuItemStyle:{
        marginLeft:20,
      },
      menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    menuItem: {
        marginHorizontal: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    greenText: {
        color: '#4c9c2e',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 15, 
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
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
  propertyDetails: {
      fontSize: 14,
      color: '#666',
      marginVertical: 5,
  },
  propertyAddress: {
      fontSize: 14,
      color: '#000',
  },
  propertyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
},
propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
},
imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
},
propertyImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
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
  deleteButton: {
    backgroundColor: '#cc0000',
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