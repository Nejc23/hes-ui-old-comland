module.exports = {
  content: ['./src/app/**/*.{html,ts}'], // Configure the paths to all of your content file
  prefix: 'tw-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        82: '22rem' // 352px
      },
      screens: {
        '3xl': '1750px'
      },
      colors: {
        // figma colors
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary) !important',
        darkGray: '#6F7072',
        darkPurple: '#981D78',
        darkBlue: '#053876',
        mediumGray: '#A9ABAF', // border color in figma
        green: '#37A350', // ok green
        yellow: '#E9BD4A', // meh yellow
        red: '#E43458', // bad red
        lightGray: '#CED2D9',
        lightestGray: '#F4F6F9',
        backgroundGray: '#FAFBFC', // details card background color
        black: '#121212', // dark in figma
        lightBlue: '#47A8BD',
        installed: '#50B167',
        installing: '#E9BD4A',
        deinstalled: '#E180C8',
        awaiting: '#981D78',
        blacklist: '#C748A6',
        disappeared: '#053876',
        lost: '#1C5BA8',
        other: '#5992D7',
        gray2: '#4F4F4F',
        gray: {
          100: '#F4F4F6',
          200: '#CFD1D8',
          300: '#B1B3BF',
          400: '#9296A5',
          500: '#73788C',
          600: '#5A5E6D',
          700: '#40434E',
          800: '#2C2E35',
          900: '#121316'
        },
        pink: {
          100: '#FCEEF9',
          200: '#F8B0E7',
          300: '#E481CD',
          400: '#D963BE',
          500: '#C94AAB',
          600: '#AA278C',
          700: '#8F1974',
          800: '#720959',
          900: '#5C0046'
        },
        blue: {
          100: '#DCE4FE',
          200: '#A3B7F5',
          300: '#7F98E6',
          400: '#5D7AD5',
          500: '#4461BB',
          600: '#314DA5',
          700: '#1C3687',
          800: '#0B236F',
          900: '#041549'
        }
      },
      container: {
        center: true,
        padding: '2.5rem' // 40px
      }
    }
  },
  plugins: []
};
