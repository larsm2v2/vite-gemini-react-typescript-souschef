import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
//const cors = require("cors")
import fs from "fs"
import fsPromises from "fs/promises"
import path from "path"
import dotenv from "dotenv"
import { cleanRecipe, cleanedRecipeData } from "./cleanRecipeData"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { RecipeModel } from "./Models"

// Load environment variables from .env file

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	})
)
app.use(express.json())
express.response

//API key for Google Generative AI
const apiKey = process.env.API_KEY
if (!apiKey) {
	throw new Error("API_KEY environment variable not found!")
}
const genAI = new GoogleGenerativeAI(apiKey)

const recipeFilePath = path.join(__dirname, "Recipes.json")
const synonymFilePath = path.join(__dirname, "IngredientSynonyms.json")
let activeSSEConnections: Response[] = []

// Error Handling Middleware
app.use(
	(
		err: any, // Define `err` to accept any type of error
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		console.error("Error in request handling:", err)
		if (err.code === "ENOENT") {
			// Specific handling for file not found
			res.status(404).json({ error: "File not found" })
		} else if (err instanceof SyntaxError && err.message.includes("JSON")) {
			// Specific handling for JSON parsing errors
			res.status(400).json({ error: "Invalid JSON data" })
		} else {
			// Generic error handling
			res.status(500).json({ error: "Internal Server Error" })
		}
	}
)
//API for getting recipe data
app.get(
	"/api/recipes",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. Read recipe data
			let rawData
			rawData = await fsPromises.readFile(recipeFilePath, "utf-8")

			const recipeData: any[] = JSON.parse(rawData)
			res.status(200).json(recipeData)
		} catch (error) {
			next(error)
		}
	}
)
//API for getting ingredient synonyms
app.get(
	"/api/ingredient-synonyms",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. Read recipe data
			let synonyms
			synonyms = await fsPromises.readFile(synonymFilePath, "utf-8")
			res.status(200).json({
				message: "Recipe data fixed successfully.",
				data: synonyms,
			})
		} catch (error) {
			next(error)
		}
	}
)

//Gemini API
app.post(
	"/api/gemini",
	async (req: Request, res: Response, next: NextFunction) => {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

		const chat = model.startChat({
			history: req.body.history,
			generationConfig: {
				/* maxOutputTokens: 100, */
				temperature: 0.7,
				topP: 0.4,
			},
		})
		const msg = req.body.message
		const result = await chat.sendMessageStream(msg)
		const response = await result.response
		const text = response.text()
		res.send(text)
	}
)
//API for cleaning recipe data
app.post(
	"/api/clean-recipe",
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const recipe: RecipeModel = req.body // Type assertion to RecipeModel
			const cleanedRecipe = cleanRecipe(recipe)
			res.status(200).json(cleanedRecipe)
		} catch (error) {
			next(error)
		}
	}
)
//API for cleaning recipe data
app.post(
	"/api/clean-recipes",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. Read recipe data
			let rawData

			rawData = await fsPromises.readFile(recipeFilePath, "utf-8")
			const recipeData: any[] = JSON.parse(rawData)

			// 2. Fix the recipe data
			const cleanedRecipes: RecipeModel[] = cleanedRecipeData(recipeData)
			console.log("Recipes.json path:", recipeFilePath)

			// 3. Write cleaned data back to file
			await fsPromises.writeFile(
				recipeFilePath,
				JSON.stringify(cleanedRecipes, null, 2)
			)

			// 4. Send success response
			res.status(200).json({
				message: "Recipe data fixed successfully.",
				data: cleanedRecipes,
			})
		} catch (error) {
			next(error)
		}
	}
)
//API for cleaning and appending recipe data to JSON
app.post(
	"/api/clean-and-add-recipes",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. Read recipe data
			let rawData

			rawData = await fsPromises.readFile(recipeFilePath, "utf-8")
			const recipeData: any[] = JSON.parse(rawData)

			// 2. Fix the recipe data
			const recipe: RecipeModel = req.body
			const cleanedRecipe: RecipeModel = cleanRecipe(recipe)
			const withAddedRecipe = Array.isArray(cleanedRecipe)
				? [...recipeData, ...cleanedRecipe]
				: [...recipeData, cleanedRecipe]
			console.log("All Recipes with Addition: ", withAddedRecipe)
			console.log("Recipes.json path: ", recipeFilePath)

			// 3. Write cleaned data back to file
			await fsPromises.writeFile(
				recipeFilePath,
				JSON.stringify(withAddedRecipe, null, 2)
			)

			// 4. Send success response
			res.status(200).json({
				message: "Recipe data fixed successfully.",
				data: withAddedRecipe,
			})
		} catch (error) {
			next(error)
		}
	}
)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
