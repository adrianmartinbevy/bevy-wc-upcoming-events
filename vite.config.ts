import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => 
{
  return {
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    lib: {
      entry: 'src/bevy-upcoming-events.ts',
      formats: ['umd'],
      name: 'BevyUpcomingEvents',
      fileName: (format) => `bevy-wc-upcoming-events.${format}.js`,
    },
    rollupOptions: {
      external: mode === "production" ? "" : /^lit/,
    },
  },
}
})
