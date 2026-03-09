const eventDetails = document.getElementById("event-details");

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

const getEventId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const loadEvent = async () => {
  try {
    const id = getEventId();

    if (!id) {
      eventDetails.innerHTML = "<p>Event ID not found.</p>";
      return;
    }

    const response = await fetch(`/events/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    const event = await response.json();

    eventDetails.innerHTML = `
      <article>
        <img src="${event.imageUrl}" alt="${event.name}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 12px;" />
        <h1>${event.name}</h1>
        <p><strong>Artists:</strong> ${formatArtists(event.artists)}</p>
        <p><strong>Date:</strong> ${formatDate(event.dateTime)}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Genre:</strong> ${event.genre}</p>
        <p><strong>Price:</strong> ${formatPrice(event.ticketPrice)}</p>
        <p>${event.description}</p>
        <p><strong>Submitted By:</strong> ${event.submittedBy || "Unknown"}</p>
        <p>
          <a href="/edit-event.html?id=${event.id}" role="button">Edit Event</a>
        </p>
      </article>
    `;
  } catch (error) {
    console.error("Error loading event details:", error);
    eventDetails.innerHTML = "<p>Unable to load event details.</p>";
  }
};

loadEvent();