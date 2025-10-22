declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '@/components/AareGuru.vue' {
  import type { DefineComponent } from 'vue'
  import type { AareGuruProps } from '@/types'

  const component: DefineComponent<AareGuruProps>
  export default component
}
