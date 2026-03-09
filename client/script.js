const eventsContainer = document.getElementById("events-container");

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
  if (!artists || artists.length === 0) {
    return "TBA";
  }

  return artists.join(", ");
};

const formatPrice = (price) => {
  return price === 0 ? "Free" : `$${price}`;
};

const createEventCard = (event) => {
  const article = document.createElement("article");
  article.classList.add("event-card");

  article.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.name}" />
    <div class="event-content">
      <h2>${event.name}</h2>
      <p class="event-meta"><strong>Artists:</strong> ${formatArtists(event.artists)}</p>
      <p class="event-meta"><strong>Date:</strong> ${formatDate(event.dateTime)}</p>
      <p class="event-meta"><strong>Venue:</strong> ${event.venue}</p>
      <p class="event-meta"><strong>Genre:</strong> ${event.genre}</p>
      <p class="event-description">${event.description}</p>
      <span class="${event.ticketPrice === 0 ? "free-ticket" : "paid-ticket"}">
        ${formatPrice(event.ticketPrice)}
      </span>
      <p>
  <a href="/event.html?id=${event.id}" role="button">View Details</a>
</p>
    </div>
  `;

  return article;
};

const loadEvents = async () => {
  try {
    eventsContainer.innerHTML = `<p class="loading-message">Loading events...</p>`;

    const response = await fetch("/events");

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const events = await response.json();

    eventsContainer.innerHTML = "";

    events.forEach((event) => {
      const card = createEventCard(event);
      eventsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading events:", error);
    eventsContainer.innerHTML = `
      <p class="error-message">Unable to load events right now.</p>
    `;
  }
};

loadEvents();