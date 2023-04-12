import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// globalStyles.js
import { setGlobalStyles } from 'react-native-floating-label-input';

setGlobalStyles.containerStyles = {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 0,
    backgroundColor: '#fff',
    borderColor: '#8162fd',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 12
};
setGlobalStyles.labelStyles = {
    backgroundColor: '#fff',
    paddingHorizontal: 10
};
setGlobalStyles.inputStyles = {
    color: 'black',
    paddingHorizontal: 10,
};

setGlobalStyles.customLabelStyles = {
    colorFocused: '#8162fd',
    fontSizeFocused: 12,
}
