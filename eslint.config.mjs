// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Bloco `<script setup>` sem `lang="ts"` não passa por type-check, então nada além
    // do `no-undef` pega um identificador inexistente — foi assim que o `currentRoute`
    // do MapLibre chegou em produção e derrubou o mapa inteiro. O config gerado pelo
    // @nuxt/eslint já conhece os auto-imports, logo `ref`/`watch` não viram
    // falso-positivo; stores em `store/` não são auto-importadas e precisam de import.
    files: ['**/*.vue', '**/*.js', '**/*.mjs'],
    rules: {
      'no-undef': 'error',
    },
  },
)
