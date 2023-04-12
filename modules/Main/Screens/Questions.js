import React, {Component} from 'react';
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

export class Questions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            answers: [],
            index: 0,
            userDetail: {},
            selectedAnswer: {},
            leftSeconds: 0,
            countdown: {}
        }
    }

    async componentDidMount() {
        const userDetail: UserDto = await utilService.storageGetObject('userDetail');
        const countdown = await sqliteService.select('COUNTDOWN', '*', 'user_id = ' + userDetail.id);
        let leftSeconds = 0;

        if (countdown && countdown[0]) {
            leftSeconds = getSeconds(countdown[0].time);
        }

        this.setState({
            userDetail: userDetail,
            leftSeconds: leftSeconds,
        }, async () => await this.getQuestions());
    }

    async getQuestions() {
        const questions = require('../../Shared/data/questions.json');
        const _questions = this.getRandomArray(questions, 5);
        this.setState({questions: _questions}, async () => await this.getAnswers());
    }

    getRandomArray(array, count) {
        let result = new Array(count),
            len = array.length,
            taken = new Array(len);
        while (count--) {
            let x = Math.floor(Math.random() * len);
            result[count] = array[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    async getAnswers() {
        const whereConditions = "school_id = " + this.state.userDetail.school_id + " AND id != " + this.state.userDetail.id;
        const answers = await sqliteService.select('USER', '*', whereConditions, 'RANDOM() LIMIT 4');

        this.setState({answers: answers});
    }

    async confirmQuestion() {
        if (this.state.selectedAnswer.id) {
            const questionId = this.state.questions[this.state.index].id;
            const userId = this.state.selectedAnswer.id;

            const index = this.state.index + 1;

            const userDetail: UserDto = this.state.userDetail;

            userDetail.coins += 5;

            const answerRows = ['user_id', 'question_id'];

            const answerValues = [userId, questionId]

            await sqliteService.insert('ANSWERS', answerRows, answerValues);

            if (index === 5) {
                const now = new Date();

                const dateTime = addMinuteDate(now, 45);

                await sqliteService.insert('COUNTDOWN', ['user_id', 'time'], [userDetail.id, dateTime], 1);


                await utilService.storageSetObject('userDetail', userDetail);

                const seconds = getSeconds(dateTime);

                this.setState({leftSeconds: seconds});

                sqliteService.update('USER', ['coins'], [userDetail.coins], {id: userDetail.id})
                    .then(res => {
                        console.log('user insert res : ', res);
                    }).catch(error => {
                    console.log('user insert error : ', error);
                })
            }

            this.setState({
                index: index,
                selectedAnswer: {},
                answers: [],
                userDetail: userDetail
            }, async () => await this.getAnswers());
        }
    }

    async skipQuestion() {
        this.setState({
            index: this.state.index + 1,
            selectedAnswer: {},
            answers: []
        }, async () => await this.getAnswers());
    }

    async countdownFinished() {
        const userDetail: UserDto = this.state.userDetail;
        const countdown = this.state.countdown;
        const whereConditions = 'user_id = ' + userDetail.id + ' AND id = ' + countdown.id;
        await sqliteService.delete('COUNTDOWN', whereConditions);
        this.setState({
            leftSeconds: 0,
            index: 0
        }, async () => await this.getQuestions());
    }

    render() {
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
                        (this.state.index < 5 && this.state.questions[this.state.index] && this.state.leftSeconds === 0) && (
                            <Card style={cardStyle.card}>
                                <CardItem style={cardStyle.cardHeader}>
                                    <View>
                                        <Text
                                            style={cardStyle.cardHeader.title}>{this.state.questions[this.state.index].question}</Text>
                                    </View>
                                </CardItem>
                                <CardItem style={{borderBottomLeftRadius: 6, borderBottomRightRadius: 6}}>
                                    <View style={customStyle.container}>
                                        {
                                            this.state.answers.map(answer => {
                                                return (
                                                    <View style={customStyle.item}>
                                                        <Button onPress={() => this.setState({selectedAnswer: answer})}
                                                                style={[buttonStyles.info, buttonStyles.btn, {
                                                                    width: '100%',
                                                                    backgroundColor: answer.id === this.state.selectedAnswer.id ? colors.main : '#77c3ec'
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
                                            <Button onPress={() => this.skipQuestion()}
                                                    style={[buttonStyles.warning, buttonStyles.btn, {width: '100%'}]}>
                                                <Text>Skip</Text>
                                            </Button>
                                        </View>
                                        <View style={customStyle.item}>
                                            <Button onPress={() => this.confirmQuestion()}
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
                        (this.state.leftSeconds > 0) && (
                            <View style={{paddingVertical: 10, paddingHorizontal: 12}}>

                                <Text style={{
                                    fontSize: 18,
                                    color: colors.main,
                                    marginBottom: 20
                                }}>{this.state.userDetail.name} səs vermədə iştirak etdiyiniz üçün təşəkkürlər. Bir sonraki
                                    səs vermə üçün gözləyin</Text>

                                <CountDown until={this.state.leftSeconds}
                                           onFinish={() => this.countdownFinished()}
                                           size={20}
                                />
                            </View>
                        )
                    }
                </View>
            </Container>
        );
    }
}

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


