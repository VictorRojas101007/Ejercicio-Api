const cardsContainer = document.getElementById("cards");
const form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = form.search.value;
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

  fetch(url, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.meals) {
        cardsContainer.innerHTML = `<div class="tenor-gif-embed" data-postid="9341845775617694425" data-share-method="host"
                data-aspect-ratio="3" data-width="90%"><a
                    href="https://tenor.com/view/there%27s-no-food-over-here-matty-matheson-cookin-somethin-30-minute-matty-meal-we%27re-out-of-food-gif-9341845775617694425">There&#39;S
                    No Food Over Here Matty Matheson GIF</a>from <a
                    href="https://tenor.com/search/there%27s+no+food+over+here-gifs">There&#39;S No Food Over Here
                    GIFs</a></div>
            <span style="display: block;">Meal not found!!</span>`;
        const tenorScript = document.createElement("script");
        tenorScript.src = "https://tenor.com/embed.js";
        tenorScript.async = true;
        document.body.appendChild(tenorScript);
        console.error("No meals found");
        return;
      }
      console.log(data.meals);
      cardsContainer.innerHTML = "";
      const mealsElements = data.meals.map((meal) => createCard(meal));
      cardsContainer.append(...mealsElements);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
function createCard(meal) {
  let extended = false;
  const ingredients = Object.entries(meal)
    .filter(([key, value]) => {
      return key.startsWith("strIngredient") && value && value.trim() !== "";
    })
    .map(([_key, value]) => {
      return value;
    });
  const measure = Object.entries(meal)
    .filter(([key, value]) => {
      return key.startsWith("strMeasure") && value && value.trim() !== "";
    })
    .map(([_key, value]) => {
      return value;
    });
  console.log({ ingredients, measure });
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", meal.idMeal);
  card.innerHTML = `
          <img src="${meal.strMealThumb}" 
              height="270px" 
              width="100%" 
              alt="${meal.strMeal}" />
          <p>${meal.strMeal}</p>
          <p>Categoría: ${meal.strCategory}</p>
          <p>Instrucciones:
            <a target="_blank" href="${meal.strYoutube}">Youtube</a>
          </p>
      `;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Eliminar";
  deleteBtn.classList.add("delete");
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const idCard = document.querySelector(`[data-id="${meal.idMeal}"]`);
    idCard.remove();
  });
  card.appendChild(deleteBtn);
  const ingredientsList = document.createElement("ul");
  ingredients.forEach((ingredient, index) => {
    const ingredientItem = document.createElement("li");
    ingredientItem.textContent = `${measure[index]} ${ingredient}`;
    ingredientsList.appendChild(ingredientItem);
  });
  card.addEventListener("click", () => {
    if (!extended) {
      card.append(ingredientsList);
      extended = true;
    } else {
      ingredientsList.remove();
      extended = false;
    }
  });
  return card;
}
