(() => {
    const charContainer = document.querySelector("#character-con");
    const movieTemplate = document.querySelector("#movie-template");
    // const movieCon = document.querySelector("#movie-con");
    const lightbox = document.querySelector("#lightbox");
    const lightboxContent = document.querySelector("#lightbox-content");
    const closeLightbox = document.querySelector("#close-lightbox");
    const baseUrl = "https://swapi.dev/api/";

   

    function getChars() {
        fetch(`${baseUrl}people/`)
            .then(response => response.json())
            .then(data => {
                const peopleStarWars = data.results;
                const ul = document.createElement("ul");

                peopleStarWars.forEach(person => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.textContent = person.name;
                    const img = document.createElement("img");
                    img.src = `images/${person.name}.png`;
                    img.classList.add("char-image");

                    // Array Convertion- using stringify to store the dataset, we then use JSON.parse to retrieve stored data
                    a.dataset.films = JSON.stringify(person.films);
                    //OR if i use 
                    // a.dataset.films = person.films.join(","); 
                    // for example then i will use split to convert bact to an array, but if i am declaring the comma as my join attribute, this will be an issue if the data or film URLs contains a comma, then its gonna break making the url invalid...

                    li.appendChild(a);
                    ul.appendChild(li);
                    ul.appendChild(img);
                });

                charContainer.appendChild(ul);
            })
            .then(() => {
                document.querySelectorAll("#character-con li a").forEach(link => {
                    link.addEventListener("click", getMovies);
                });
            })
            .catch(function(error) {
                const img = document.createElement("img");
                img.src = "images/bouncing-squares.svg";
                img.alt = "error loader";
                img.classList.add("loader");

                charContainer.innerHTML = `<p>Error Fetching characters List</p>`;
                charContainer.appendChild(img);
                console.log(error);
            });
    }

    function getMovies(e) {
        const films = JSON.parse(e.currentTarget.dataset.films); // collecting stored film URLs as an array [0,1,2,3,4,...]

      
        lightbox.style.display = "flex";
        lightboxContent.innerHTML = ""; 

        films.forEach(filmUrl => {
            fetch(filmUrl)
            .then(response => response.json())
            .then(function(response) {
                const clone = movieTemplate.content.cloneNode(true);
                const movieHeading = clone.querySelector(".movie-heading");
                const movieDescription = clone.querySelector(".movie-description");
                const moviePoster = clone.querySelector(".movie-image");
                const movieDirector = clone.querySelector(".movie-director");

                movieHeading.textContent = `Title: ${response.title}`;
                movieDescription.innerHTML = response.opening_crawl;
                movieDirector.innerHTML = `Director: ${response.director}`;
                moviePoster.src = `images/${response.title}.jpg`;
                moviePoster.alt = `${response.title} Poster`;

                lightboxContent.appendChild(clone);
                })
                .catch(function(error) {
                const img = document.createElement("img");
                    img.src = "images/bouncing-squares.svg";
                    img.alt = "error loader";
                    img.classList.add("loader");

                lightboxContent.innerHTML = `<p>Error Fetching Movie Details</p>`;
                lightboxContent.appendChild(img);
            console.log(error);
                });
        });
    }

     // Close the lightbox when the close button is clicked
     closeLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    getChars();
})();
