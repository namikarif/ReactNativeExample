import React, {useEffect, useState} from 'react';
import {Alert, Animated, Dimensions, KeyboardAvoidingView, StatusBar, StyleSheet} from 'react-native';
import {Button, Container, Content, Form, Text, View,} from 'native-base';
import {enableScreens} from 'react-native-screens'
import styles from '../styles';
import buttonStyles from "../../../styles/ButtonStyles";
import {FloatingLabelInput} from "../../../react-native-floating-label-input";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {Header} from "react-native-elements";
import {colors} from "../../../constants/colors";
import {SqliteService} from "../../Shared/services/sqlite.service";
import utilService from "../../Shared/services/util.service";

enableScreens();
const sqliteService = new SqliteService();
const {width, height} = Dimensions.get('window');

function Login(props) {
    useEffect(() => {
        async function fetchData() {
            await sqliteService.createTable('USER', [
                {
                    name: 'id',
                    dataType: 'INTEGER',
                    isNotNull: true,
                    options: 'PRIMARY KEY AUTOINCREMENT'
                },
                {
                    name: 'name',
                    dataType: 'TEXT'
                },
                {
                    name: 'phone_number',
                    dataType: 'TEXT'
                },
                {
                    name: 'school_id',
                    dataType: 'INTEGER'
                },
                {
                    name: 'email',
                    dataType: 'TEXT'
                },
                {
                    name: 'password',
                    dataType: 'TEXT'
                },
                {
                    name: 'coins',
                    dataType: 'INTEGER'
                }
            ]);
            await sqliteService.createTable('ANSWERS', [
                {
                    name: 'id',
                    dataType: 'INTEGER',
                    isNotNull: true,
                    options: 'PRIMARY KEY AUTOINCREMENT'
                },
                {
                    name: 'user_id',
                    dataType: 'INTEGER'
                },
                {
                    name: 'question_id',
                    dataType: 'INTEGER'
                }
            ]);

            await sqliteService.createTable('COUNTDOWN', [
                {
                    name: 'id',
                    dataType: 'INTEGER',
                    isNotNull: true,
                    options: 'PRIMARY KEY AUTOINCREMENT'
                },
                {
                    name: 'user_id',
                    dataType: 'INTEGER'
                },
                {
                    name: 'time',
                    dataType: 'TEXT'
                }
            ]);

            const firstSetUsers = await utilService.storageGet('firstSetUsers');


            if (firstSetUsers !== 'yes') {
                const userDataList: Array<any> = require('../../Shared/data/users.json');
                const userRows = [
                    'name',
                    'phone_number',
                    'school_id',
                    'email',
                    'password',
                    'coins'
                ];

                const insertUserDate = [];

                userDataList.forEach(user => {
                    insertUserDate.push(user.name);
                    insertUserDate.push(user.phone_number);
                    insertUserDate.push(user.school_id);
                    insertUserDate.push(user.email);
                    insertUserDate.push(user.password);
                    insertUserDate.push(0);
                });


                sqliteService.insert('USER', userRows, insertUserDate, userDataList.length)
                    .then(async res => await utilService.storageSet('firstSetUsers', 'yes'))
                    .catch(error => console.log('insert error : ', error));
            }
        }

        fetchData();
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let passwordInput = null;

    const login = async () => {
        if (email && password) {
            const whereConditions = "email = '" + email.toLowerCase() + "' AND password = '" + password + "'";
            sqliteService.select('USER', '*', whereConditions)
                .then(async response => {
                    await utilService.storageSetObject('userDetail', response[0]);
                    props.navigation.navigate('MainTabs');
                }).catch(() => {
                Alert.alert(
                    'Error',
                    'User not found!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            }
                        }
                    ]
                );
            })
        } else {
            Alert.alert(I18n.t('warning'), I18n.t('lines_can_not_be_empty'));
        }
    };


    return (
        <Container style={styles.container}>
            <StatusBar translucent backgroundColor="red"/>
            <Header style={{backgroundColor: 'red'}}/>

            <Content>
                <KeyboardAvoidingView style={{paddingTop: 60}}>
                    <Animated.Image source={require('../../../assets/logo.png')}
                                    style={styles.logo}
                    />

                    <Form style={{paddingHorizontal: 12, marginTop: 40}}>
                        <FloatingLabelInput label={'Email'}
                                            customContainerStyles={{height: 40}}
                                            value={email}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            onSubmitEditing={() => passwordInput.focus()}
                                            returnKeyType="next"
                                            key="email"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="envelope"/>}
                                            onChangeText={value => setEmail(value)}
                        />
                        <FloatingLabelInput label={'Password'}
                                            customContainerStyles={{height: 40}}
                                            value={password}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            isPassword={true}
                                            ref={(ref) => passwordInput = ref}
                                            onSubmitEditing={() => login()}
                                            returnKeyType="done"
                                            key="password"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="lock"/>}
                                            customShowPasswordComponent={
                                                <Text style={{color: '#8162fd'}}>{'Show'}</Text>
                                            }
                                            customHidePasswordComponent={
                                                <Text style={{color: '#8162fd'}}>{'Hide'}</Text>
                                            }
                                            onChangeText={value => setPassword(value)}
                        />
                        <View style={{height: 75}}>
                            <Button full
                                    style={[buttonStyles.btn, buttonStyles.klButton, {marginTop: 5, borderRadius: 15}]}
                                    onPress={() => login()}>
                                <Text>{'Login'}</Text>
                            </Button>
                        </View>
                        <View>
                            <Text onPress={() => props.navigation.navigate('Register')}
                                  style={{
                                      textAlign: 'center',
                                      fontSize: 20,
                                      color: colors.main
                                  }}>{'Register'}</Text>
                        </View>
                    </Form>
                </KeyboardAvoidingView>
            </Content>
        </Container>
    );
}

export default Login;

const loginStyle = new StyleSheet.create({
    socialButton: {
        marginTop: 5,
        borderRadius: 15,
        borderColor: '#d9d8d8',
        width: (width / 2) - 18,
        justifyContent: 'center'
    }
})
