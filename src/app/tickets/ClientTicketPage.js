// Import necessary hooks and router from react and next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the ClientTicketPage component
const ClientTicketPage = ({ spots }) => {
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
export default ClientTicketPage;
