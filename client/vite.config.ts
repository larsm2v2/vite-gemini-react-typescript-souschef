import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	preview: {
		port: 5173,
	},
	server: {
		port: 5173,
		host: "0.0.0.0",
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://localhost:5000", // Your Express server port
				changeOrigin: true,
				secure: false,
			},
		},
		hmr: false,
	},
	optimizeDeps: {
		include: ["react-icons"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			external: ["react-icons"],
		},
	},
})

