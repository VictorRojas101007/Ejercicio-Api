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
        console.error("No meals found");
        return;
      }
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
      return key.startsWith("strIngredient") && value.trim() !== "";
    })
    .map(([_key, value]) => {
      return value;
    });
  const measure = Object.entries(meal)
    .filter(([key, value]) => {
      return key.startsWith("strMeasure") && value.trim() !== "";
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
