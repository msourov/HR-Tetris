import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      // "@mantine/notifications"
    ], // Ensure it's optimized
    exclude: [], // Reset exclusion
  },
});
