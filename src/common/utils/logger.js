const browserColors = {
  info: 'color: #00a8ff; font-weight: bold;',
  debug: 'color: #9c88ff; font-weight: bold;',
  warn: 'color: #fbc531; font-weight: bold;',
  error: 'color: #e84118; font-weight: bold;',
  success: 'color: #4cd137; font-weight: bold;'
};

const logger = {
  info: (message, data = null) => {
    console.info('%cℹ️ INFO:', browserColors.info, message);
    if (data) console.log(data);
  },
  
  debug: (message, data = null) => {
    console.log('%c🐛 DEBUG:', browserColors.debug, message);
    if (data) console.debug(data);
  },
  
  warn: (message, data = null) => {
    console.log('%c⚠️ WARN:', browserColors.warn, message);
    if (data) console.warn(data);
  },

  error: (message, data = null) => {
    console.log('%c⛔ ERROR:', browserColors.error, message);
    if (data) console.error(data);
  },

  success: (message, data = null) => {
    console.log('%c✅ SUCCESS:', browserColors.success, message);
    if (data) console.debug(data);
  }
};

export default logger;