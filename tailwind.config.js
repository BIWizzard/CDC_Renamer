module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#0078D7', // Microsoft blue
          700: '#0063B1',
        },
        green: {
          600: '#107C10', // Microsoft green
          700: '#0B5C0B',
        },
        red: {
          600: '#E81123', // Microsoft red
          700: '#C50F1F',
        }
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
  plugins: [],
}