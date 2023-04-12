import React from 'react';

const cardStyle = {
    content: {
        paddingLeft: 7,
        paddingRight: 7,
    },
    card: {
        paddingTop: 10,
        borderRadius: 6
    },
    cardHeader: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        height: 33,
        title: {
            color: '#1775af',
            fontSize: 17,
            paddingRight: 2
        },
        subtitle: {
            color: '#919191',
            fontSize: 13,
            paddingRight: 2
        },
        button: {
            position: 'absolute',
            right: 10,
            top: 0
        }
    }
}

export default cardStyle;
