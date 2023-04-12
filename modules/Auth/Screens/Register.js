import React, {useState} from 'react';
import {Alert, Animated, Dimensions, FlatList, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Body, Button, Container, Content, Form, ListItem, Text, View,} from 'native-base';
import styles from '../styles';
import buttonStyles from "../../../styles/ButtonStyles";
import {FloatingLabelInput} from "../../../react-native-floating-label-input";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {Header} from "react-native-elements";
import {colors} from "../../../constants/colors";

import {SqliteService} from "../../Shared/services/sqlite.service";
import utilService from "../../Shared/services/util.service";

const sqliteService = new SqliteService();

const {width, height} = Dimensions.get('window');

function Register(props) {

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolId, setSchoolId] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState('name');

    const register = async () => {
        sqliteService.select('USER', '*', {email: email}).then(response => {
            if (response && response[0]) {
                handleError('This email is being used!')
            } else {
                const rows = [
                    'name',
                    'phone_number',
                    'school_id',
                    'email',
                    'password',
                    'coins'
                ]
                const values = [];
                values.push(name);
                values.push(phoneNumber);
                values.push(schoolId);
                values.push(email.toLowerCase());
                values.push(password);
                values.push(0);
                sqliteService.insert('USER', rows, values, 1)
                    .then(async response => {
                        const userId = response[0].insertId;
                        await utilService.storageSetObject('userDetail', {
                            id: userId,
                            name: name,
                            phone_number: phoneNumber,
                            school_id: schoolId,
                            email: email.toLowerCase(),
                            password: password,
                            coins: 0
                        });
                        props.navigation.navigate('MainTabs');
                    }).catch(() => handleError('Something went wrong!'));
            }
        }).catch(() => handleError('Something went wrong!'));
    };

    const handleError = (message) => {
        Alert.alert(
            'Error',
            message,
            [
                {
                    text: 'OK',
                    onPress: () => {
                    }
                }
            ]
        );
    }

    const renderInput = () => {
        switch (step) {
            case 'name':
                return (
                    <View>
                        <FloatingLabelInput label={'Name'}
                                            customContainerStyles={{height: 40}}
                                            value={name}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            returnKeyType="next"
                                            key="name"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="user"/>}
                                            onChangeText={value => setName(value)}
                        />
                        <Button style={[buttonStyles.btn, buttonStyles.success, {width: width - 24}]}
                                onPress={() => setStep('phone_number')}>
                            <Text>Next</Text>
                        </Button>
                    </View>
                )
            case 'phone_number':
                return (
                    <View>
                        <FloatingLabelInput label={'Phone Number'}
                                            customContainerStyles={{height: 40}}
                                            value={phoneNumber}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            returnKeyType="next"
                                            key="name"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="phone"/>}
                                            onChangeText={value => setPhoneNumber(value)}
                        />
                        <Button style={[buttonStyles.btn, buttonStyles.success, {width: width - 24}]}
                                onPress={() => setStep('school')}>
                            <Text>Next</Text>
                        </Button>
                    </View>
                )
            case 'school':
                const schoolList = require('../../Shared/data/school-list.json');
                return (
                    <View>
                        <FlatList data={schoolList}
                                  renderItem={({item}) => (
                                      <ListItem avatar
                                                onPress={() => setSchoolId(item.id)}>
                                          <Body>
                                              <View style={{flex: 1, flexDirection: 'row'}}>
                                                  <View>
                                                      <Text
                                                          style={{color: item.id === schoolId ? colors.BLUE.kl : 'black'}}>{item.name}</Text>
                                                  </View>
                                              </View>
                                          </Body>
                                      </ListItem>
                                  )}
                                  keyExractor={(item) => item.id.toString()}
                        />
                        <Button style={[buttonStyles.btn, buttonStyles.success, {width: width - 24}]}
                                onPress={() => setStep('email')}>
                            <Text>Next</Text>
                        </Button>
                    </View>
                );
            case 'email':
                return (
                    <View>
                        <FloatingLabelInput label={'Email'}
                                            customContainerStyles={{height: 40}}
                                            value={email}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            returnKeyType="next"
                                            key="name"
                                            leftComponent={<FontAwesome5 style={{color: '#8162fd'}} name="user"/>}
                                            onChangeText={value => setEmail(value)}
                        />
                        <Button style={[buttonStyles.btn, buttonStyles.success, {width: width - 24}]}
                                onPress={() => setStep('password')}>
                            <Text>Next</Text>
                        </Button>
                    </View>
                );
            case 'password':
                return (
                    <View>
                        <FloatingLabelInput label={'Email'}
                                            customContainerStyles={{height: 40}}
                                            value={email}
                                            staticLabel
                                            hintTextColor={'#aaa'}
                                            isPassword={true}
                                            returnKeyType="done"
                                            key="password"
                                            leftComponent={<FontAwesome5 style={{color: '#1775af'}} name="lock"/>}
                                            customShowPasswordComponent={
                                                <Text style={{color: '#1775af'}}>{'Show'}</Text>
                                            }
                                            customHidePasswordComponent={
                                                <Text style={{color: '#1775af'}}>{'Hide'}</Text>
                                            }
                                            onChangeText={value => setPassword(value)}
                        />
                        <Button style={[buttonStyles.btn, buttonStyles.success, {width: width - 24}]}
                                onPress={() => register()}>
                            <Text>Register</Text>
                        </Button>
                    </View>
                )
        }
    }

    return (
        <Container style={styles.container}>
            <Header noShadow style={{backgroundColor: 'transparent'}}></Header>
            <Content>
                <KeyboardAvoidingView>
                    <Animated.Image source={require('../../../assets/logo.png')}
                                    style={styles.logo}
                    />

                    <Form style={{paddingHorizontal: 12, paddingVertical: 20}}>
                        {
                            renderInput()
                        }
                    </Form>
                </KeyboardAvoidingView>
            </Content>
        </Container>
    );
}

export default Register;

const registerStyle = new StyleSheet.create({
    socialButton: {
        marginTop: 5,
        borderRadius: 15,
        borderColor: '#d9d8d8',
        width: (width / 2) - 18,
        justifyContent: 'center'
    }
})
