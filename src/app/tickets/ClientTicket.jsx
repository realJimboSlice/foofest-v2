"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the ClientTicketPage component
const ClientTicket = ({ spots }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAreaSelection = (area) => {
    setLoading(true);
    router.push(`/booking?area=${area}`);
    console.log(`Navigating to booking page for ${area}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Choose an Area
      </h1>
      {loading ? (
        <p className="text-lg text-electricBlue animate-pulse">
          Loading... Please wait...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {spots.map((spot) => (
            <div
              key={spot.area}
              className={`p-6 rounded-lg flex flex-col items-center justify-between bg-gray-800 ${
                spot.available === 0 ? "opacity-50" : ""
              }`}
            >
              <button
                className={`text-xl font-bold py-2 px-4 rounded w-full ${
                  spot.available > 0
                    ? "bg-electricBlue text-white hover:bg-deepRed"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => handleAreaSelection(spot.area)}
                disabled={spot.available === 0}
              >
                {spot.area}
              </button>
              <p className="mt-4 text-lg">
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

export default ClientTicket;
