import React from 'react';
import {LogBox, StyleSheet} from 'react-native';
import {Root} from 'native-base';
import 'react-native-gesture-handler';
import 'react-native-reanimated'
import AppContainer from "./modules/Core/AppContainer";

LogBox.ignoreAllLogs();

function App() {

    return (
        <Root>
            <AppContainer/>
        </Root>
    );
}

export default App;

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 320,
        height: 320,
        marginVertical: 32,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    }
});
