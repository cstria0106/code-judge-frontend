/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    screens: {
      tablet: '800px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
  plugins: [],
  important: '#app',
};
