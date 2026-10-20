import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: { colors: { wine: '#4A1019', gold: '#D9B86C', cream: '#FFF9EF' } } }, plugins: [] };
export default config;
