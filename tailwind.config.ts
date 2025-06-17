// ...existing code...
export default {
  theme: {
    extend: {
      animation: {
        cursor: 'blink 1s step-end infinite',
        fadeIn: 'fadeIn 1.5s ease-in',
        fadeOut: 'fadeOut 1.5s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0'},
          '100%': { opacity: '1'},
        },
        fadeOut: {
          '0%': { opacity: '1'},
          '100%': { opacity: '0'},
        },
      },
    },
  },
};
