
export async function getRecipeFromChefClaude(ingredientsArr) {
    const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ingredients: ingredientsArr,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe")
    }

    return data.recipe
}
