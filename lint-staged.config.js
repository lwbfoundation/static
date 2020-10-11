module.exports = {
  '**/*.{js,ts,tsx}': 'eslint --ext .js,.jsx,.ts,.tsx --fix',
  '**/*.{ts,tsx}': () => 'tsc -p tsconfig.json --noEmit',
};
