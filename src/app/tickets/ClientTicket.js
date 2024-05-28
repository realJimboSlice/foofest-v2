// ChatGPT 4 was used to assist in splitting my code into two components.
// Before, I had a single page that handled both both server-side data fetching and client-side interactivity.
// Now page.js handles data fetching and initial server-side rendering. This makes the initial load faster and improves SEO by pre-rendering the page with the necessary data.
// and ClientTicket interactivity and state. By keeping client-side logic separate, the code becomes easier to maintain and debug.
// GitHub Copilot added comments

// This directive indicates that this component should be rendered on the client side.
"use client";

// Import necessary hooks and router from react and next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the ClientTicketPage component
const ClientTicket = ({ spots }) => {
  // Use the useRouter hook to allow navigation
  const router = useRouter();
  // Use the useState hook to manage loading state
  const [loading, setLoading] = useState(false);

  // Define a function to handle area selection
  const handleAreaSelection = (area) => {
    // Set loading to true
    setLoading(true);
    // Navigate to the booking page for the selected area
    router.push(`/booking?area=${area}`);
  };

  // Render the component
  return (
    <div className="">
      <h1 className="">Choose an Area</h1>
      {/* Check if the page is loading */}
      {loading ? (
        // If loading, display a loading message
        <p>Loading... Please wait...</p>
      ) : (
        // If not loading, display the available spots
        <div className="">
          {spots.map((spot) => (
            <div key={spot.area} className="">
              {/* Button to select an area. Disabled if no spots are available */}
              <button
                className=""
                onClick={() => handleAreaSelection(spot.area)}
                disabled={spot.available === 0}
              >
                {spot.area}
              </button>
              {/* Display the number of available spots or a sold out message */}
              <p className="">
                {spot.available > 0
                  ? `${spot.available} spots left`
                  : "SOLD OUT"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export the component
export default ClientTicket;
