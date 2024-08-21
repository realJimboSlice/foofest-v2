"use client";

// Import necessary hooks and utilities
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import supabase from "../../lib/supabaseClient";
import CreditCard from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useForm } from "react-hook-form";
import Payment from "payment";
import Loading from "../components/Loading";

// Define the PaymentPage component
const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [focus, setFocus] = useState("");
  const [issuer, setIssuer] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm();

  const number = watch("number", "");
  const name = watch("name", "");
  const expiry = watch("expiry", "");
  const cvc = watch("cvc", "");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!reservationId) {
        setErrorMessage("Invalid reservation ID.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("reservation_id", reservationId)
          .single();

        if (error || !data) {
          throw new Error("Error fetching booking data.");
        }

        setTotalAmount(data.amount_paid.totalAmount);
        setBreakdown({
          regularTicketsCost: data.regular_ticket * 799,
          vipTicketsCost: data.vip_ticket * 1299,
          twoPeopleTentsCost: data.two_person_tent * 299,
          threePeopleTentsCost: data.three_person_tent * 399,
          greenCampingCost: data.green_camping ? 295 : 0,
          bookingFee: data.booking_fee,
        });

        const createdAt = localStorage.getItem("createdAt");
        if (createdAt) {
          const createdAtTime = new Date(createdAt).getTime();
          const currentTime = new Date().getTime();
          const elapsedTime = Math.floor((currentTime - createdAtTime) / 1000);
          const remaining = 60 - elapsedTime;
          setRemainingTime(remaining > 0 ? remaining : 0);
        }
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [reservationId]);

  const deleteReservation = async (reservationId) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("reservation_id", reservationId);

      if (error) {
        console.error("Error deleting reservation:", error);
      } else {
        console.log("Reservation deleted successfully.");
        router.push("/tickets");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const [remainingTime, setRemainingTime] = useState(60);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setErrorMessage(
        "Session expired. Please start the booking process again."
      );
      deleteReservation(reservationId);
    }
  }, [remainingTime, reservationId, router]);

  const formatMaskedNumber = (number) => {
    const cleanNumber = number.replace(/\s|-/g, "");
    const retainLength = Math.ceil(cleanNumber.length / 2);
    const retainedPart = cleanNumber.slice(0, retainLength);
    const maskedPart = "X".repeat(cleanNumber.length - retainLength);
    return retainedPart + maskedPart;
  };

  const handleExpiryInput = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, "");

    if (value.length >= 2) {
      let month = value.slice(0, 2);
      if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
        month = "12";
      }
      value = month + value.slice(2);
    }

    if (value.length >= 4) {
      let year = value.slice(2, 4);
      if (parseInt(year, 10) < 24) {
        year = "24";
      } else if (parseInt(year, 10) > 99) {
        year = "99";
      }
      value = value.slice(0, 2) + "/" + year;
    } else if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setValue("expiry", value);
  };

  const handleCVCInput = (event) => {
    const input = event.target;
    input.value = input.value.replace(/\D/g, "").slice(0, 3);
  };

  const onSubmit = async (data) => {
    const maskedNumber = formatMaskedNumber(number);
    const cardIssuer = issuer
      .split(" ")
      .map((word) => word.toUpperCase())
      .join(" ");

    const cardData = {
      credit_card_issuer: cardIssuer,
      credit_card_number: maskedNumber,
    };

    try {
      const { error } = await supabase
        .from("bookings")
        .update(cardData)
        .eq("reservation_id", reservationId);

      if (error) {
        throw new Error("Error saving payment data.");
      }

      console.log("Payment data saved successfully.");

      const response = await fetch(
        "https://fluffy-scrawny-hedgehog.glitch.me/fullfill-reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: reservationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error sending POST request.");
      }

      console.log(
        "POST request sent successfully. Reservation has been fulfilled."
      );

      router.push(`/confirmation?reservationId=${reservationId}`);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (number) {
      const cardType = Payment.fns.cardType(number);
      setIssuer(cardType);
    }
  }, [number]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-black text-white mt-32">
      {/* Payment Form Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4 lg:mr-8 lg:sticky">
        <h1 className="text-4xl font-bold mb-8">Payment</h1>
        <h2 className="text-2xl font-bold mb-4">
          Total Amount: {totalAmount} kr
        </h2>
        <CreditCard
          number={number}
          name={name}
          expiry={expiry}
          cvc={cvc}
          focused={focus}
          issuer={issuer}
        />
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="tel"
              name="number"
              placeholder="Card Number"
              {...register("number")}
              onFocus={(e) => setFocus(e.target.name)}
              maxLength={19}
              className="p-2 border rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              {...register("name")}
              onFocus={(e) => setFocus(e.target.name)}
              maxLength={26}
              className="p-2 border rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              name="expiry"
              placeholder="MM/YY"
              {...register("expiry")}
              onFocus={(e) => setFocus(e.target.name)}
              onInput={handleExpiryInput}
              value={expiry}
              pattern="\d{2}/\d{2}"
              maxLength={5}
              className="p-2 border rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              name="cvc"
              placeholder="CVC"
              {...register("cvc")}
              onFocus={(e) => setFocus(e.target.name)}
              onInput={handleCVCInput}
              maxLength={3}
              className="p-2 border rounded w-full bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-electricBlue hover:bg-deepRed text-white rounded font-semibold transition-colors duration-300 w-full"
          >
            Pay {totalAmount} kr
          </button>
        </form>
      </div>

      {/* Cost Breakdown Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm mt-8 lg:mt-0 lg:sticky lg:top-32">
        <h2 className="text-2xl font-bold mb-4">Cost Breakdown</h2>
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
        <hr className="border-gray-600 my-4" />
        <div className="flex justify-between text-xl font-bold">
          <span>Total Amount</span>
          <span>{totalAmount} kr</span>
        </div>
        {/* Countdown Timer Section */}
        <div className="w-full max-w-sm mt-4 lg:mt-8">
          <p className="text-xl font-bold text-center">
            Time remaining to complete booking:{" "}
            <span className="text-red-500">
              {Math.floor(remainingTime / 60)}:
              {("0" + (remainingTime % 60)).slice(-2)}
            </span>{" "}
            minutes
          </p>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <Suspense fallback={<Loading />}>
    <PaymentPageContent />
  </Suspense>
);

export default PaymentPage;
