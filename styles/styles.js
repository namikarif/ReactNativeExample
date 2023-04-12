import React from 'react';
import {colors} from '../constants/colors';

const styles = {
    header: {
        backgroundColor: '#8162fd',
        color: '#f5f5f5',
        fontSize: 14,
        height: 60,
        zIndex: 1000,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#d2d2d2',
        backButton: {
            width: 80,
            height: 22,
            flex: 1,
            title: {
                textAlign: 'left',
                color: '#f5f5f5',
                fontSize: 15,
                borderWidth: 1,
                borderColor: 'red',
                marginVertical: 0
            },
            icon: {
                color: '#f5f5f5',
                fontSize: 18,
                width: 20,
                borderWidth: 1,
                borderColor: 'lime'
            },
        },
        title: {
            fontSize: 14,
            width: '100%',
            textAlign: 'left',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    headerStyle: {
        backgroundColor: colors.main,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        marginTop: 3
    },
    //********** Footer Style******
    tabStyle: {
        backgroundColor: '#F0F0F0',
    },

    tabTextStyle: {
        color: '#5f6368',
    },

    tabBarUnderlineStyle: {
        borderBottomWidth: 4,
        borderColor: 'green',
    },

    listItemDivider: {
        color: '#8162fd',
        borderRightColor: '#1a8ed9',
    },

    fieldSet: {
        marginTop: 10,
        marginLeft: 7,
        marginRight: 7,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: '#8162fd'
    },
    legend: {
        position: 'absolute',
        top: -12,
        left: 10,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        color: '#8162fd',
        fontSize: 12
    },

    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    }
};

export default styles;
