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
                    const characterCard = document.createElement("div");
                    characterCard.classList.add("character-card");
                    
                    const nameLink = document.createElement("a");
                    nameLink.textContent = person.name;
                    nameLink.dataset.films = JSON.stringify(person.films);
                    
                    const img = document.createElement("img");
                    img.src = `../images/${person.name}.png`;
                    img.classList.add("char-image");
                    img.alt = `${person.name} character image`;

                    const characterInfo = document.createElement("div");
                    characterInfo.classList.add("character-info");
                    characterInfo.innerHTML = `
                        <h3>${person.name}</h3>
                        <p>Birth Year: ${person.birth_year}</p>
                        <p>Gender: ${person.gender}</p>
                        <p>Films: ${person.films.length}</p>
                    `;

                    // Set the background image for the blurred effect
                    characterCard.style.setProperty('--bg-image', `url(../images/${person.name}.png)`);
                    characterCard.style.backgroundImage = `var(--bg-image)`;

                    characterCard.appendChild(img);
                    characterCard.appendChild(nameLink);
                    characterCard.appendChild(characterInfo);
                    li.appendChild(characterCard);
                    ul.appendChild(li);
                });

                charContainer.appendChild(ul);
            })
            .then(() => {
                // Add click event to the entire card instead of just the link
                document.querySelectorAll(".character-card").forEach(card => {
                    card.addEventListener("click", (e) => {
                        // Prevent the event from triggering if clicking the link
                        if (e.target.tagName !== 'A') {
                            const films = JSON.parse(card.querySelector('a').dataset.films);
                            getMovies({ currentTarget: { dataset: { films: JSON.stringify(films) } } });
                        }
                    });
                });
            })
            .catch(function(error) {
                const img = document.createElement("img");
                img.src = "../images/bouncing-squares.svg";
                img.alt = "error loader";
                img.classList.add("loader");

                charContainer.innerHTML = `<p>Error Fetching characters List</p>`;
                charContainer.appendChild(img);
                console.log(error);
            });
    }

    function getMovies(e) {
        const films = JSON.parse(e.currentTarget.dataset.films);
        lightbox.style.display = "flex";
        lightboxContent.innerHTML = ""; 

        // Create a container for all movies
        const moviesContainer = document.createElement('div');
        moviesContainer.classList.add('movies-grid');

        // Fetch all movies in parallel
        Promise.all(films.map(filmUrl => 
            fetch(filmUrl)
                .then(response => response.json())
        ))
        .then(responses => {
            responses.forEach(response => {
                const clone = movieTemplate.content.cloneNode(true);
                const movieHeading = clone.querySelector(".film_title");
                const movieDescription = clone.querySelector(".film_description");
                const moviePoster = clone.querySelector(".film_images");
                const movieDirector = clone.querySelector(".film_director");

                movieHeading.textContent = response.title;
                movieDescription.innerHTML = response.opening_crawl;
                movieDirector.innerHTML = `Director: ${response.director}`;
                moviePoster.src = `../images/${response.title}.jpg`;
                moviePoster.alt = `${response.title} Poster`;

                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.appendChild(clone);
                moviesContainer.appendChild(movieCard);
            });

            lightboxContent.appendChild(moviesContainer);
        })
        .catch(function(error) {
            const img = document.createElement("img");
            img.src = "../images/bouncing-squares.svg";
            img.alt = "error loader";
            img.classList.add("loader");

            lightboxContent.innerHTML = `<p>Error Fetching Movie Details</p>`;
            lightboxContent.appendChild(img);
            console.log(error);
        });
    }

    // Close the lightbox when the close button is clicked
    closeLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    // Close lightbox when clicking outside
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    getChars();
})();

// (() => {
//     gsap.registerPlugin(ScrollTrigger);  
//     gsap.from(".trigger1", {
//       scrollTrigger: {
//         trigger: ".trigger",
//         toggleActions: "play reverse play reverse",
//         markers: false,
//         start: "top 50%", 
        
        
//       },
//       opacity: 0,
//       y: 100,
//       duration: 1,
//       ease: "power2.out"
//     });

// })();