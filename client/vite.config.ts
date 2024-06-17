import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		host: true,
		proxy: {
			"/api": {
				target: "http://server:5000", // Your Express server port
				changeOrigin: true,
				secure: false,
			},
		},
	},
})

