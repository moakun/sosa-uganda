import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
  	boxShadow: {
  		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  		DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  		t: '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  		orange: '0px 20px 20px -15px rgba(245,56,56,0.81) ',
  		'orange-md': '0px 20px 40px -15px rgba(245,56,56,0.81) ',
  		none: 'none'
  	},
  	colors: {
  		transparent: 'transparent',
  		black: {
  			'500': '#4F5665',
  			'600': '#0B132A'
  		},
  		orange: {
  			'100': '#FFECEC',
  			'500': '#F53855'
  		},
  		blue: {
  			'100': '#67a5f0',
  			'200': '#bfdbfe',
  			'500': '#135ced',
  			'800': '#1e40af'
  		},
  		green: {
  			'200': '#bbf7d0',
  			'500': '#2FAB73',
  			'800': '#166534'
  		},
  		white: {
  			'300': '#F8F8F8',
  			'500': '#fff'
  		},
  		yellow: {
  			'100': '#fefce8',
  			'300': '#fde047',
  			'600': '#ca8a04'
  		},
  		gray: {
  			'100': '#EEEFF2',
  			'400': '#AFB5C0',
  			'500': '#DDDDDD'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: ['Poppins', 'sans-serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  variants: {
    extend: {
      boxShadow: ["active", "hover"],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

