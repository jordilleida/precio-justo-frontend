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
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      loginButton: {
        backgroundColor: '#32cd32', 
        color: 'white'
      },
      closeButton: {
        alignSelf: 'flex-end',
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
});