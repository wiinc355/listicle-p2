const eventsContainer = document.getElementById("events-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search");

const formatDate = (dateString) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleString("en-US", options);
};

const formatArtists = (artists) => {
  if (!artists) return "TBA";
  if (Array.isArray(artists)) return artists.join(", ");
  return artists;
};

const formatPrice = (price) => {
  if (price === 0) return "Free";
  if (price === null || price === undefined) return "Price unavailable";
  return `$${price}`;
};

const createEventCard = (event) => {
  const article = document.createElement("article");
  article.classList.add("card");

  article.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.name}" />
    <h2 class="card-title">${event.name}</h2>
    <p class="event-meta"><strong>Artists:</strong> ${formatArtists(event.artists)}</p>
    <p class="event-meta"><strong>Date:</strong> ${formatDate(event.dateTime)}</p>
    <p class="event-meta"><strong>Venue:</strong> ${event.venue}</p>
    <p class="event-meta"><strong>Genre:</strong> ${event.genre}</p>
    <p class="event-description">${event.description}</p>
    <p><strong>Price:</strong> ${formatPrice(event.ticketPrice)}</p>
    <p>
      <a href="/event.html?id=${event.id}" role="button">View Details</a>
    </p>
  `;

  return article;
};

const renderEvents = (events) => {
  eventsContainer.innerHTML = "";

  if (!events.length) {
    eventsContainer.innerHTML = `<p>No events found.</p>`;
    return;
  }

  events.forEach((event) => {
    const card = createEventCard(event);
    eventsContainer.appendChild(card);
  });
};

const loadEvents = async (searchTerm = "") => {
  try {
    eventsContainer.innerHTML = `<p class="loading-message">Loading events...</p>`;

    const url = searchTerm
      ? `/events?search=${encodeURIComponent(searchTerm)}`
      : "/events";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    console.error("Error loading events:", error);
    eventsContainer.innerHTML = `
      <p class="error-message">Unable to load events right now.</p>
    `;
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  loadEvents(searchTerm);
});
const logoutButton = document.getElementById('logout-button')

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    await fetch('/logout', { method: 'POST' })
    window.location.href = '/login.html'
  })
}

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  loadEvents();
});

loadEvents();