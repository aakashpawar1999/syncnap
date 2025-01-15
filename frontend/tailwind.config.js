/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors'

export const content = ['./src/**/*.{html,ts}', 'node_modules/preline/dist/*.js']
export const safelist = [
  'w-64',
  'w-1/2',
  'rounded-l-lg',
  'rounded-r-lg',
  'bg-gray-200',
  'grid-cols-4',
  'grid-cols-7',
  'h-6',
  'leading-6',
  'h-9',
  'leading-9',
  'shadow-lg'
];
export const darkMode = 'class';
export const theme = {
  screens: {
    '3xsm': '375px',
    '2xsm': '480px',
    'xsm': '576px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1440px',
    '3xl': '1536px',
  },
  colors: {
    'transparent': 'transparent',
    'white': '#FFFFFF',
    'black': '#000000',
  },
  fontFamily: {
    sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
    body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
  },
  extend: {
    colors: {
      slate: colors.slate,
      gray: colors.gray,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      violet: colors.violet,
    },
  },
}
export const plugins = [
  require('@tailwindcss/forms'),
  require('preline/plugin')
]
