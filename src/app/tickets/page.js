// GitHub Copilot added comments

// Import necessary modules from react
import React from "react";
// Import the ClientTicketPage component
import ClientTicketPage from "./ClientTicketPage";

// Define an async function to fetch available spots
async function fetchSpots() {
  // Fetch data from the API
  const response = await fetch(
    "https://fluffy-scrawny-hedgehog.glitch.me/available-spots"
  );
  // If the response is not ok, throw an error
  if (!response.ok) {
    throw new Error("Failed to fetch available spots");
  }
  // Parse the response as JSON and return it
  return response.json();
}

// Define the TicketPage component
const TicketPage = async () => {
  // Fetch the available spots
  const spots = await fetchSpots();
  // Render the ClientTicketPage component with the fetched spots as a prop
  return <ClientTicketPage spots={spots} />;
};

// Export the TicketPage component
export default TicketPage;
