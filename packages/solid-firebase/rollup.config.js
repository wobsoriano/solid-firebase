import withSolid from 'rollup-preset-solid'

const usedFirebaseModules = ['auth', 'firestore', 'app', 'storage', 'database']
const external = usedFirebaseModules.map(module => `firebase/${module}`)

export default withSolid({
  input: 'src/index.tsx',
  printInstructions: true,
  external,
})
