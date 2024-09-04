import React from "react";
import ClientTicket from "../components/ClientTicket";

async function fetchSpots() {
  // Fetches data from the API
  const response = await fetch(
    "https://fluffy-scrawny-hedgehog.glitch.me/available-spots"
  );
  // If not ok, throws an error
  if (!response.ok) {
    throw new Error("Failed to fetch available spots");
  }
  return response.json();
}

const TicketPage = async () => {

  const spots = await fetchSpots();
  return <ClientTicket spots={spots} />;
};

export default TicketPage;
