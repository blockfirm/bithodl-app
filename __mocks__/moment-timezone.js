const moment = require.requireActual('moment-timezone');

moment.tz.setDefault('Europe/Stockholm');

export default moment;
