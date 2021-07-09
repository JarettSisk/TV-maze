/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
// Get the shows from the API
async function searchShows(query) {
  // Make the request
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const showsArray = [];
  try {
    for(data of res.data) {
      // Push each new object onto the array
      showsArray.push({
        id: data.show.id,
        name: data.show.name,
        summary: data.show.summary,
        image: data.show.image.medium ? data.show.image.medium : "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
      })
    }
  }
   catch (error) {
    console.error(error);
  }

  return showsArray
}

// get the episodes from the API
async function getEpisodes(id) {

  // Make the request
  let res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodesArray = [];
  // Push each new object into the array
  try {
    for(data of res.data) {
      episodesArray.push({
        id: data.id,
        name: data.name,
        season: data.season,
        number: data.number
      })
    }
  }
   catch (error) {
    console.error(error);
  }

  return episodesArray
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  // Change data variables to be dynamically inserted
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="episodes-btn">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

// Populate the episodes list
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  // Clear the list
  $episodesList.empty();

  // loop through and append each episode
  for (let episode of episodes) {
    let $item = $(
      `<li data-episode-id="${episode.id}"> <b>${episode.name}</b> (Episode: ${episode.number} Season: ${episode.season}) </li>
      `);
    $episodesList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


// Handler for episodes button
$("#shows-list").on("click", ".episodes-btn", async function () {
  let id = $(this).parent().parent().attr("data-show-id");
  // Show the episodes area
  $("#episodes-area").show();
  // Get the esipose data
  let episodes = await getEpisodes(id);
  // Populate the DOM 
  populateEpisodes(episodes);
  
})








