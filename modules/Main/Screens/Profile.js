import React, {useState, useEffect} from 'react';
import {Container, Form, Text, Title, View} from 'native-base';
import {Dimensions, StyleSheet} from 'react-native';
import style from '../../../styles/styles';
import utilService from '../../Shared/services/util.service';
import {Header} from "react-native-elements";
import {colors} from "../../../constants/colors";
import FastImage from "react-native-fast-image";
import {FloatingLabelInput} from "../../../react-native-floating-label-input";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


const {width, height} = Dimensions.get('window');

function ProfilePage(props) {

    const [userProfile, setUserProfile] = useState({name: ''});

    const imageSource = require('../../../assets/avatar.png');
    const coinImageSource = require('../../../assets/coin.png');

    useEffect(() => {

        async function fetchData() {
            const _userProfile = await utilService.storageGetObject('userDetail');
            setUserProfile(_userProfile);
        }

        fetchData();

    }, []);

    return (
        <Container style={{backgroundColor: '#ffffff'}}>

            <Header backgroundColor={colors.BLUE.kl}
                    containerStyle={style.headerStyle}
                    centerComponent={<Title>{userProfile.name}</Title>}
            />

            <View>
                <View style={[style.boxShadow, customStyle.body]}>
                    <View style={customStyle.imageView}>
                        <View key="profile-image"
                              style={customStyle.imageCover}>
                            <FastImage source={imageSource}
                                       style={{width: 120, height: 120, borderRadius: 60}}/>
                        </View>
                    </View>
                    <Form style={[customStyle.form]}>
                        <FloatingLabelInput label={'Name'}
                                            customContainerStyles={{height: 40}}
                                            value={userProfile.name}
                                            staticLabel
                                            editable={false}
                                            hintTextColor={'#aaa'}
                                            key="name"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="user"/>}
                        />
                        <FloatingLabelInput label={'Phone Number'}
                                            customContainerStyles={{height: 40}}
                                            value={userProfile.phone_number}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            key="email"
                                            editable={false}
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}}
                                                                         name="envelope"/>}
                        />
                        <FloatingLabelInput label={'Email'}
                                            customContainerStyles={{height: 40}}
                                            value={userProfile.email}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            key="email"
                                            editable={false}
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}}
                                                                         name="envelope"/>}
                        />
                    </Form>
                    <View>
                        <Text style={customStyle.coin}>{userProfile.coins}</Text>
                        <View style={customStyle.coinImageView}>
                            <View key="coin-image"
                                  style={customStyle.coinImageCover}>
                                <FastImage source={coinImageSource}
                                           style={{width: 120, height: 120, borderRadius: 60}}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Container>
    );
}

export default ProfilePage;

const customStyle = new StyleSheet.create({
    body: {
        marginVertical: 7,
        marginHorizontal: 7,
        backgroundColor: '#ffffff',
        borderRadius: 9,
        borderColor: '#ffffff',
        height: height - 140
    },
    form: {
        paddingHorizontal: 7,
        marginTop: 35,
        width: width - 14,
        zIndex: 100
    },
    imageView: {
        width: '100%',
        height: 120,
        marginVertical: 10,
        alignItems: 'center',
    },
    coinImageView: {
        width: '100%',
        height: 120,
        alignItems: 'center',
    },
    imageCover: {
        width: 126,
        height: 126,
        borderRadius: 63,
        borderWidth: 3,
        borderColor: colors.BLUE.kl
    },
    coin: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: colors.gold
    },
    coinImageCover: {
        width: 126,
        height: 126,
        borderRadius: 63,
    },
    footer: {
        backgroundColor: 'transparent',
        height: 50,
        paddingLeft: 7,
        width: width
    },
    sheetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sheetIcon: {
        fontSize: 25,
        color: '#1775af',
        marginHorizontal: 10
    },
    sheetText: {
        fontSize: 18,
        color: '#646464'
    },
})
