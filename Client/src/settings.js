//const { version } = require('../package.json');
import packageInfo from '../package.json';

// DEBUG mode
export const DEBUG = process.env.NODE_ENV === 'development';

// Application name
export const NAME = 'HIV Platform';

// Application version
export const VERSION = packageInfo.version;

// Duration of the notification displayed at the bottom of the screen [in milliseconds]
export const NOTIFICATION_DURATION = 5000;

// Vector of names of aggregated data sets to not group in the Modelling -> Populations tab
export const nonGroupedDataNames = ['DEAD', 'AIDS'];
