"use client";

// Import necessary hooks and utilities
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import CreditCard from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useForm } from "react-hook-form";
import Payment from "payment";

// Define the PaymentPage component
const PaymentPage = () => {
  // Use the useSearchParams hook to get the URL search parameters
  const searchParams = useSearchParams();
  // Extract the reservationId from the search parameters
  const reservationId = searchParams.get("reservationId");

  // Define state variables for total amount, breakdown, loading status, error message, and credit card details
  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [focus, setFocus] = useState("");
  const [issuer, setIssuer] = useState("");

  // Initialize react-hook-form
  const { register, handleSubmit, setValue, watch } = useForm();

  // Watch form values for credit card fields
  const number = watch("number", "");
  const name = watch("name", "");
  const expiry = watch("expiry", "");
  const cvc = watch("cvc", "");

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

  // Function to format and mask the card number
  const formatMaskedNumber = (number) => {
    // Remove all spaces and hyphens from the number
    const cleanNumber = number.replace(/\s|-/g, "");

    // Determine how many digits to retain
    const retainLength = Math.ceil(cleanNumber.length / 2);
    const retainedPart = cleanNumber.slice(0, retainLength);
    const maskedPart = "X".repeat(cleanNumber.length - retainLength);

    // Combine the retained and masked parts
    return retainedPart + maskedPart;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Determine the length of the card number and mask the remaining digits

    const maskedNumber = formatMaskedNumber(number);

    // Card issuer (e.g., VISA, MASTERCARD, etc.) in uppercase
    const cardIssuer = issuer
      .split(" ")
      .map((word) => word.toUpperCase())
      .join(" ");

    // Prepare the data to be sent to Supabase
    const cardData = {
      "credit-card-issuer": cardIssuer,
      "credit-card-number": maskedNumber,
    };

    try {
      // Update the booking record in Supabase with the card data
      const { error } = await supabase
        .from("bookings")
        .update(cardData)
        .eq("reservation_id", reservationId);

      if (error) {
        throw new Error("Error saving payment data.");
      }

      console.log("Payment data saved successfully.");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Update issuer based on card number
  useEffect(() => {
    if (number) {
      const cardType = Payment.fns.cardType(number);
      setIssuer(cardType);
    }
  }, [number]);

  // Render loading, error, or the payment page based on the state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Payment</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4">
          Total Amount: {totalAmount} kr
        </h2>
        <div className="space-y-2">
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
        <div className="mt-8">
          <CreditCard
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focus}
            issuer={issuer}
          />
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 text-black">
              <input
                type="tel"
                name="number"
                placeholder="Card Number"
                {...register("number")}
                onFocus={(e) => setFocus(e.target.name)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3 text-black">
              <input
                type="text"
                name="name"
                placeholder="Name"
                {...register("name")}
                onFocus={(e) => setFocus(e.target.name)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3 text-black">
              <input
                type="tel"
                name="expiry"
                placeholder="MM/YY"
                {...register("expiry")}
                onFocus={(e) => setFocus(e.target.name)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3 text-black">
              <input
                type="tel"
                name="cvc"
                placeholder="CVC"
                {...register("cvc")}
                onFocus={(e) => setFocus(e.target.name)}
                className="p-2 border rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white rounded"
            >
              Pay {totalAmount} kr
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
