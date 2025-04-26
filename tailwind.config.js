module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EFF6FC',
          100: '#DEECF9',
          200: '#C7E0F4',
          300: '#A7CAE8',
          400: '#71AFE5',
          500: '#2B88D8',
          600: '#0078D7', // Microsoft blue
          700: '#0063B1',
          800: '#004881',
          900: '#002E52',
        },
        green: {
          50: '#E5F2E5',
          100: '#CDE8CD',
          200: '#ADDDAD',
          300: '#87CE87',
          400: '#61BE61',
          500: '#2D882D',
          600: '#107C10', // Microsoft green
          700: '#0B5C0B',
          800: '#094509',
          900: '#062906',
        },
        red: {
          50: '#FDF2F3',
          100: '#FBE5E7',
          200: '#F8C9CE',
          300: '#F5ACB4',
          400: '#F08F9B',
          500: '#EB7282',
          600: '#E81123', // Microsoft red
          700: '#C50F1F',
          800: '#A20C19',
          900: '#7F0914',
        },
        gray: {
          50: '#F8F8F8',
          100: '#F2F2F2',
          200: '#E6E6E6',
          300: '#D5D5D5',
          400: '#BBBBBB',
          500: '#909090',
          600: '#686868',
          700: '#505050',
          800: '#383838',
          900: '#202020',
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      borderWidth: ['focus-visible'],
      borderColor: ['focus-visible'],
    },
  },
  plugins: [],
}