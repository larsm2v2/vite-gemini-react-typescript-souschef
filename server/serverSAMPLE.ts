import express from "express"
import cors from "cors"

const app = express()
const port = 5000 // Choose your port

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
	res.send("Hello from Express and TypeScript!")
})

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})
