import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: 'src/index.tsx',
  printInstructions: true,
  external: ['firebase/auth', 'firebase/firestore', 'firebase/app'],
});
