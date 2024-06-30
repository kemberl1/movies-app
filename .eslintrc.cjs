module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // Поддержка среды тестирования Jest
  },
  ignorePatterns: ['node_modules', 'dist', 'build'], // Те папки, которые игнорируем
  extends: [
    'airbnb', // Основные правила Airbnb
    'airbnb/hooks', // Правила для React hooks
    'plugin:react/jsx-runtime', // Поддержка нового JSX runtime
    'prettier', // отключения конфликтующих правил
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Поддержка JSX
    },
    ecmaVersion: 'latest', // Поддержка последних возможностей ECMAScript
    sourceType: 'module', // Использование модулей
    requireConfigFile: false, // Не требовать конфигурационный файл для Babel
    babelOptions: {
      presets: ['@babel/preset-react'], // Использование пресета для React
    },
  },
  plugins: [
    'react', // Поддержка React
    'import', // Поддержка правил для модулей
    'react-hooks', // Поддержка правил для React hooks
    'jsx-a11y', // Поддержка правил для доступности JSX
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }], // Настройка отступов (2 пробела, 1 пробел для switch case)
    'linebreak-style': [0, 'unix'], // Отключение проверки стиля конца строки
    quotes: ['error', 'single'], // Использование одинарных кавычек
    semi: ['error', 'never'], // Отключение точки с запятой
    'react/react-in-jsx-scope': 'off', // Отключение правила необходимости импорта React в каждом файле (не нужно с новым JSX runtime)
    'react/prop-types': 0, // Отключение проверки типов пропсов
    'import/no-unresolved': [2, { caseSensitive: false }], // Проверка на неразрешенные модули
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // Поддержка JSX в файлах с расширениями .js и .jsx
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], // Настройка порядка импортов
        'newlines-between': 'always', // Пустые строки между группами импортов
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Автоматическое определение версии React
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Расширения файлов для резолвера модулей
        moduleDirectory: ['node_modules', 'src/'], // Директории для резолвера модулей
      },
    },
  },
}
