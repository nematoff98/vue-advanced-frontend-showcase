type ColorShades = {
  [key: string | number]: string;
};

type Colors = {
  [key: string]: ColorShades;
};

export const colors: Colors = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#232D3D',
  },
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3f86fa',
    600: '#2b73ff',
    700: '#2e5fe9',
    800: '#1e40af',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
  },
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
  },
  green: {
    50: '#eefaf6',
    100: '#d6f3ea',
    200: '#b7ead9',
    300: '#93dfc6',
    400: '#64d1ad',
    500: '#10b981',
    600: '#0e9d6e',
    700: '#0c8b61',
    800: '#0a7854',
  },
  lime: {
    50: '#f6fbef',
    100: '#eaf6d7',
    200: '#daf0b9',
    300: '#c8e896',
    400: '#afde68',
    500: '#84cc16',
    600: '#70ad13',
    700: '#639911',
    800: '#56850e',
  },
  yellow: {
    50: '#fffbea',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
  },
};

export const generateAntDesignTheme = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      colorPrimary: colors.primary[500],
      colorSuccess: colors.green[500],
      colorWarning: colors.yellow[500],
      colorError: colors.red[500],
      colorInfo: colors.lime[500],
      colorText: '#ffffff',
      colorBackground: colors.gray[50],
    };
  }

  return {
    colorPrimary: colors.primary[500],
    colorSuccess: colors.green[500],
    colorWarning: colors.yellow[500],
    colorError: colors.red[500],
    colorInfo: colors.lime[500],
    colorText: colors.gray[800],
    colorBackground: colors.gray[50],
  };
};

export const generateTailwindColors = (): Colors => Object.entries(colors).reduce((acc: Colors, [color, shades]) => {
  acc[color] = {
    DEFAULT: shades[600],
    ...shades,
    ...Object.keys(colors[color] || {}).reduce<ColorShades>((darkAcc, shade) => ({
      ...darkAcc,
      [`dark-${shade}`]: colors[color]?.[shade] || '',
    }), {}),
  };
  return acc;
}, {});
