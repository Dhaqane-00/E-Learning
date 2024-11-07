/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
    
        //bg one is darker
        bgOne: '#050505',
        bgTwo: '#131415',

        //gray is used for sub texts
        gray: '#9CA1A4',

        green: '#9CF57F',

        border: '#232323',

      },
      backgroundImage: {

        'gradientForBorder': 'linear-gradient(to bottom, #050505, #131415)',
        'gradientForBorderOpposite': 'linear-gradient(to top, #050505, #131415)',

        'gradientForBg': 'linear-gradient(to right, #D5FD7E, #7BF080)',


      },
      animation: {
        'spin-slow': 'spin 3s linear infinite'
      },
      transitionDuration: {
        "400": "400ms"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

