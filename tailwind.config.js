module.exports = {
  mode: 'jit',
  purge: {
    enabled: process.env.WEBPACK_DEV_SERVER === 'true' && process.argv.join(' ').indexOf('build') !== -1, // TODO CHECK PURGE IN PROD MODE
    content: ['./src/**/**/*.{html,ts}', './src/**/**/**/*.{html,ts}', './src/**/**/**/**/*.{html,ts}']
  },
  //prefix: 'tw-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
