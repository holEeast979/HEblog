/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 棕色主题色彩系统
        primary: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#E8D5C0',
          300: '#DBBF99',
          400: '#C8A882',
          500: '#A0522D', // 主色
          600: '#8B4513', // 深棕色
          700: '#6B3410',
          800: '#4A240B',
          900: '#2B1505',
        },
        warm: {
          50: '#FFFBF5',
          100: '#FFF7EB',
          200: '#FEECCC',
          300: '#FDE1AD',
          400: '#FBD16E',
          500: '#D2691E', // 温暖橙
          600: '#B8531A',
          700: '#9E3D16',
          800: '#842712',
          900: '#6A110E',
        },
        dark: {
          50: '#F7F3F0',
          100: '#EDE5DD',
          200: '#D9C7B5',
          300: '#C4A98D',
          400: '#B08B65',
          500: '#8B6F47',
          600: '#6B5437',
          700: '#4B3927',
          800: '#2B1E17',
          900: '#1A1209',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'particles': 'particles 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(160, 82, 45, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(160, 82, 45, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        particles: {
          '0%': { transform: 'translateY(100vh) translateX(-50px)' },
          '100%': { transform: 'translateY(-100vh) translateX(50px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
