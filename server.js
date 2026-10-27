
import "dotenv/config"
import express from "express"
import Anthropic from "@anthropic-ai/sdk"

const app = express()
app.use(express.json())

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `
You are a helpful cooking assistant.
Suggest a recipe using some or all of the ingredients
provided by the user. You may include a few extra
ingredients. Format the recipe in Markdown.
`

app.post("/api/recipe", async (req, res) => {
    try {
        const { ingredients } = req.body

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                error: "Please provide at least one ingredient.",
            })
        }

        const ingredientsString = ingredients.join(", ")

        const message = await anthropic.messages.create({
            model: "claude-haiku-5-5",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: `I have ${ingredientsString}. Please recommend a recipe.`,
                },
            ],
        })

        const recipeBlock = message.content.find(
            block => block.type === "text"
        )

        res.json({
            recipe: recipeBlock?.text ?? "No recipe was returned.",
        })
    } catch (error) {
        console.error("Recipe generation failed:", error.message)
        res.status(500).json({
            error: "Unable to generate a recipe. Please try again.",
        })
    }
})

app.listen(3001, () => {
    console.log("Chef Claude backend running at http://localhost:3001")
})
