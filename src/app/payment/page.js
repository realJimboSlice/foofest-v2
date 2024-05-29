"use client";

// Import necessary hooks and utilities
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";

// Define the PaymentPage component
const PaymentPage = () => {
  // Use the useSearchParams hook to get the URL search parameters
  const searchParams = useSearchParams();
  // Extract the reservationId from the search parameters
  const reservationId = searchParams.get("reservationId");

  // Define state variables for total amount, breakdown, loading status, and error message
  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Use the useEffect hook to fetch booking details when the component mounts
  useEffect(() => {
    const fetchBookingDetails = async () => {
      // If the reservationId is not present, set an error message and stop loading
      if (!reservationId) {
        setErrorMessage("Invalid reservation ID.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch booking details from Supabase using the reservation ID
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("reservation_id", reservationId)
          .single();

        // If there's an error or no data, throw an error
        if (error || !data) {
          throw new Error("Error fetching booking data.");
        }

        // Set the total amount and breakdown state variables with the fetched data
        setTotalAmount(data.amount_paid.totalAmount);
        setBreakdown({
          regularTicketsCost: data.regular_ticket * 799,
          vipTicketsCost: data.vip_ticket * 1299,
          twoPeopleTentsCost: data.two_person_tent * 299,
          threePeopleTentsCost: data.three_person_tent * 399,
          greenCampingCost: data.green_camping ? 295 : 0,
          bookingFee: data.booking_fee,
        });
      } catch (error) {
        // If there's an error, log it and set the error message state variable
        console.error(error.message);
        setErrorMessage(error.message);
      } finally {
        // Stop loading when the fetch is complete
        setIsLoading(false);
      }
    };

    // Call the fetchBookingDetails function
    fetchBookingDetails();
  }, [reservationId]); // Only re-run the effect if reservationId changes

  // Render loading, error, or the payment page based on the state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="">
      <h1 className="">Payment</h1>
      <div className="">
        <div className="space-y-2">
          {/* Render the cost breakdown */}
          {breakdown.regularTicketsCost > 0 && (
            <p>Regular Tickets Cost: {breakdown.regularTicketsCost} kr</p>
          )}
          {breakdown.vipTicketsCost > 0 && (
            <p>VIP Tickets Cost: {breakdown.vipTicketsCost} kr</p>
          )}
          {breakdown.twoPeopleTentsCost > 0 && (
            <p>2-Person Tents Cost: {breakdown.twoPeopleTentsCost} kr</p>
          )}
          {breakdown.threePeopleTentsCost > 0 && (
            <p>3-Person Tents Cost: {breakdown.threePeopleTentsCost} kr</p>
          )}
          {breakdown.greenCampingCost > 0 && (
            <p>Green Camping Cost: {breakdown.greenCampingCost} kr</p>
          )}
          {breakdown.bookingFee > 0 && (
            <p>Booking Fee: {breakdown.bookingFee} kr</p>
          )}
        </div>
        <h2 className="">Total Amount: {totalAmount} kr</h2>
        {/* React credit cards 2 implementation */}
      </div>
    </div>
  );
};

export default PaymentPage;
