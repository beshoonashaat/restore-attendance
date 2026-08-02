import type { Config } from 'tailwindcss';
const config: Config = { darkMode:['class'], content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./features/**/*.{ts,tsx}'], theme:{extend:{colors:{restore:{ink:'#0b2a4d',paper:'#f4ecd7',muted:'#d8cfb8'}},fontFamily:{display:['Impact','Anton','Arial Black','sans-serif']},boxShadow:{premium:'0 24px 80px rgba(15,23,42,.14)'}}}, plugins:[require('tailwindcss-animate')]};
export default config;
