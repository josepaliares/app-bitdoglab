import type { Config } from 'tailwindcss';

export default {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			backgroundImage: {
				'gradient-blue': 'linear-gradient(to right, #000000,rgb(0, 0, 255))',
				'gradient-green': 'linear-gradient(to right, #000000,rgb(0, 255, 0))',
				'gradient-red': 'linear-gradient(to right, #000000,rgb(255, 0, 0))'
			},
			fontFamily: {
				ubuntu: ['Ubuntu', 'sans-serif'],
			},
			fontWeight: {
				regular: '400',
				medium: '500',
				bold: '700',
			},
			fontSize: {
				xs: '0.75rem',  // 12px
				sm: '0.875rem', // 14px
				md: '1rem',     // 16px
				lg: '1.25rem',  // 20px
				xl: '1.5rem',   // 24px
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			colors: {
				// Design System Tokens
				'primary': '#3F84AF',
				'on-primary': '#FFFFFF',
				'primary-container': '#A8CADF',
				'on-primary-container': '#244B64',
				'secondary': '#E31A8B',
				'on-secondary': '#FFFFFF',
				'secondary-container': '#F7BADD',
				'on-secondary-container': '#A01262',
				'background': '#FFFFFF',
				'surface': '#E6E6E6',
				'on-surface': '#4D4D4D',
				'error': '#ED54AA',
				'on-error': '#FFFFFF',
				'border': '#000000',
				'heading': '#000000',
				'text': '#000000',
				'hover': '#244B64',
				'hover-secondary': '#A01262',

				// Paleta Tonal
				'primary-palette': {
					10: '#162F3E',
					20: '#244B64',
					30: '#3F84AF',
					40: '#5D9DC4',
					50: '#A8CADF',
				},
				'secondary-palette': {
					10: '#720D46',
					20: '#A01262',
					30: '#E31A8B',
					40: '#ED54AA',
					50: '#F7BADD',
				},
				'neutral-palette': {
					10: '#000000',
					20: '#4D4D4D',
					30: '#8A8A8A',
					40: '#E6E6E6',
					50: '#FFFFFF',
				},
				'rgb-red': 'rgb(255, 0, 0)',
				'rgb-green': 'rgb(0, 255, 0)',
				'rgb-blue': 'rgb(0, 0, 255)',  
			},
		},
		plugins: [require('tailwindcss-animate')],
	},
} satisfies Config;
