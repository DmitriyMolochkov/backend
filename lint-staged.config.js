module.exports = {
  '*.[jt]s?(x)': () => 'npm run build',
  '*.(js|cjs|msx|jsx|ts|tsx|html|vue)': 'eslint --fix --max-warnings=0',
};
