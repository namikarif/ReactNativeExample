import React, {useEffect, useState} from 'react';
import {Button, Card, CardItem, Container, Text} from 'native-base';
import {Dimensions, StyleSheet, View} from 'react-native';
import style from '../../../styles/styles';
import {Header} from "react-native-elements";
import {colors} from "../../../constants/colors";
import cardStyle from "../../../styles/CardStyle";

import {SqliteService} from "../../Shared/services/sqlite.service";
import utilService from "../../Shared/services/util.service";
import buttonStyles from "../../../styles/ButtonStyles";
import {UserDto} from "../../Shared/models/UserDto";
import {addMinuteDate, getSeconds} from "../../Shared/services/date.service";
import CountDown from 'react-native-countdown-component';

const sqliteService = new SqliteService();

const {width, height} = Dimensions.get('window');

function Questions(props) {


    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [index, setIndex] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);
    const [userDetail, setUserDetail] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [countdown, setCountdown] = useState({});

    useEffect(() => {

        async function fetchData() {
            const _userDetail: UserDto = await utilService.storageGetObject('userDetail');
            const _countdown = await sqliteService.select('COUNTDOWN', '*', 'user_id = ' + _userDetail.id);
            let _leftSeconds = 0;

            if (_countdown && _countdown[0]) {
                _leftSeconds = getSeconds(_countdown[0].time);
            }

            setUserDetail(_userDetail);
            setLeftSeconds(_leftSeconds);

            await getQuestions(_userDetail);
        }

        fetchData();

    }, []);

    const getQuestions = async (_userDetail) => {
        const questionsData = require('../../Shared/data/questions.json');
        const _questions = utilService.getRandomArray(questionsData, 5);
        setQuestions(_questions);
        await getAnswers(_userDetail);
    }

    const getAnswers = async (_userDetail) => {
        const whereConditions = "school_id = " + _userDetail.school_id + " AND id != " + _userDetail.id;
        console.log('whereConditions : ', whereConditions);
        const _answers = await sqliteService.select('USER', '*', whereConditions, 'RANDOM() LIMIT 4');

        console.log('_answers : ', _answers);
        return setAnswers(_answers);
    }

    const confirmQuestion = async () => {
        if (selectedAnswer.id) {
            const questionId = questions[index].id;
            const userId = selectedAnswer.id;

            const _index = index + 1;

            const _userDetail = userDetail;

            _userDetail.coins += 5;

            const answerRows = ['user_id', 'question_id'];

            const answerValues = [userId, questionId]

            await sqliteService.insert('ANSWERS', answerRows, answerValues);

            if (_index === 5) {
                const now = new Date();

                const dateTime = addMinuteDate(now, 45);

                await sqliteService.insert('COUNTDOWN', ['user_id', 'time'], [userDetail.id, dateTime], 1);


                await utilService.storageSetObject('userDetail', _userDetail);

                const seconds = getSeconds(dateTime);

                setLeftSeconds(seconds);

                await sqliteService.update('USER', ['coins'], [_userDetail.coins], {id: userDetail.id});
            }

            setIndex(_index);
            setSelectedAnswer({});
            setAnswers([]);
            setUserDetail(_userDetail);

            await getAnswers(_userDetail);
        }
    }

    const skipQuestion = async () => {

        setIndex(index + 1);
        setSelectedAnswer({});
        setAnswers([]);

        await getAnswers(userDetail);
    }

    const countdownFinished = async () => {
        const whereConditions = 'user_id = ' + userDetail.id + ' AND id = ' + countdown.id;
        await sqliteService.delete('COUNTDOWN', whereConditions);

        setLeftSeconds(0);
        setIndex(0);

        await getQuestions(userDetail)
    }

    return (
        <Container style={{backgroundColor: '#ffffff'}}>
            <Header backgroundColor={colors.BLUE.kl}
                    containerStyle={style.headerStyle}
                    centerComponent={
                        <Text style={style.headerTitleStyle}>Questions</Text>
                    }
            />

            <View style={{marginTop: 10}}>
                {
                    (index < 5 && questions[index] && leftSeconds < 1) && (
                        <Card style={cardStyle.card}>
                            <CardItem style={cardStyle.cardHeader}>
                                <View>
                                    <Text
                                        style={cardStyle.cardHeader.title}>{questions[index].question}</Text>
                                </View>
                            </CardItem>
                            <CardItem style={{borderBottomLeftRadius: 6, borderBottomRightRadius: 6}}>
                                <View style={customStyle.container}>
                                    {
                                        answers.map(answer => {
                                            return (
                                                <View style={customStyle.item}>
                                                    <Button onPress={() => setSelectedAnswer(answer)}
                                                            style={[buttonStyles.info, buttonStyles.btn, {
                                                                width: '100%',
                                                                backgroundColor: answer.id === selectedAnswer.id ? colors.main : '#77c3ec'
                                                            }]}>
                                                        <Text>{answer.name}</Text>
                                                    </Button>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </CardItem>

                            <CardItem style={{borderBottomLeftRadius: 6, borderBottomRightRadius: 6}}>
                                <View style={customStyle.container}>
                                    <View style={customStyle.item}>
                                        <Button onPress={() => skipQuestion()}
                                                style={[buttonStyles.warning, buttonStyles.btn, {width: '100%'}]}>
                                            <Text>Skip</Text>
                                        </Button>
                                    </View>
                                    <View style={customStyle.item}>
                                        <Button onPress={() => confirmQuestion()}
                                                style={[buttonStyles.success, buttonStyles.btn, {width: '100%'}]}>
                                            <Text>Confirm</Text>
                                        </Button>
                                    </View>
                                </View>
                            </CardItem>
                        </Card>
                    )
                }
                {
                    (leftSeconds > 0) && (
                        <View style={{paddingVertical: 10, paddingHorizontal: 12}}>

                            <Text style={{
                                fontSize: 18,
                                color: colors.main,
                                marginBottom: 20
                            }}>{userDetail.name} səs vermədə iştirak etdiyiniz üçün təşəkkürlər. Bir sonraki
                                səs vermə üçün gözləyin</Text>

                            <CountDown until={leftSeconds}
                                       onFinish={() => countdownFinished()}
                                       size={20}
                            />
                        </View>
                    )
                }
            </View>
        </Container>
    );
}

export default Questions;

const customStyle = new StyleSheet.create({
    modalView: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    payIcon: {
        width: 24,
        height: 24,
        tintColor: '#700940',
    },
    payButton: {
        backgroundColor: '#700940',
    },
    payButtonUnderlay: {
        backgroundColor: '#94124E',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: (width / 2) - 32,
        marginRight: 10,
        marginBottom: 10
    }
})


