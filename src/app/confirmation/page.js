"use client";

// Import necessary hooks and utilities
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import jsPDF from "jspdf";

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
        console.log(data);

        if (error || !data) {
          throw new Error("Error fetching booking data.");
        }

        setBookingDetails(data);
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [reservationId]);

  const handleDownloadTicket = () => {
    const doc = new jsPDF();
    doc.text("Foofest Ticket", 10, 10);
    doc.text(`Event: Foofest`, 10, 20);
    doc.text(`Date: 20th of June 2024 until the 27th of June 2024`, 10, 30);
    doc.text(`Area: ${bookingDetails.area}`, 10, 40);
    if (bookingDetails.regular_ticket > 0) {
      doc.text(`Regular Tickets: ${bookingDetails.regular_ticket}`, 10, 50);
    }
    if (bookingDetails.vip_ticket > 0) {
      doc.text(`VIP Tickets: ${bookingDetails.vip_ticket}`, 10, 60);
    }
    if (bookingDetails.two_person_tent > 0) {
      doc.text(`2-Person Tents: ${bookingDetails.two_person_tent}`, 10, 70);
    }
    if (bookingDetails.three_person_tent > 0) {
      doc.text(`3-Person Tents: ${bookingDetails.three_person_tent}`, 10, 80);
    }
    if (bookingDetails.green_camping) {
      doc.text(`Green Camping: Yes`, 10, 90);
    }
    doc.text("Bring this ticket to the event entrance.", 10, 100);
    doc.save("Foofest_Ticket.pdf");
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    doc.text("Transaction Receipt", 10, 10);
    doc.text(`Event: Foofest`, 10, 20);
    doc.text(`Date: 20th of June 2024 until the 27th of June 2024`, 10, 30);
    doc.text(`Area: ${bookingDetails.area}`, 10, 40);
    doc.text(`Total Price: ${bookingDetails.total_price} kr`, 10, 50);
    doc.text(`Regular Tickets: ${bookingDetails.regular_ticket}`, 10, 60);
    doc.text(`VIP Tickets: ${bookingDetails.vip_ticket}`, 10, 70);
    doc.text(`2-Person Tents: ${bookingDetails.two_person_tent}`, 10, 80);
    doc.text(`3-Person Tents: ${bookingDetails.three_person_tent}`, 10, 90);
    doc.text(
      `Green Camping: ${bookingDetails.green_camping ? "Yes" : "No"}`,
      10,
      100
    );
    doc.text(`Booking Fee: ${bookingDetails.booking_fee} kr`, 10, 110);
    doc.text(
      `Name: ${bookingDetails.first_name} ${bookingDetails.last_name}`,
      10,
      120
    );
    doc.text(`Email: ${bookingDetails.email}`, 10, 130);
    doc.text(
      `Credit Card Issuer: ${bookingDetails.credit_card_issuer}`,
      10,
      140
    );
    doc.text(
      `Credit Card Number: ${bookingDetails.credit_card_number}`,
      10,
      150
    );
    doc.save("Transaction_Receipt.pdf");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  const {
    area,
    regular_ticket,
    vip_ticket,
    two_person_tent,
    three_person_tent,
    green_camping,
    booking_fee,
    total_price,
    first_name,
    last_name,
    email,
    credit_card_issuer,
    credit_card_number,
  } = bookingDetails;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-4xl font-bold mb-8">
        Congratulations, you've completed your booking!
      </h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-black">
          Below you'll find your confirmation. It has also been sent to the
          email you provided along with the receipt for the transaction.
        </h2>
        <div className="space-y-2 text-black" id="ticket-content">
          <p>
            <strong>Event:</strong> Foofest
          </p>
          <p>
            <strong>Date:</strong> 20th of June 2024 until the 27th of June 2024
          </p>
          <p>
            <strong>Area:</strong> {area}
          </p>
          {regular_ticket > 0 && <p>Regular Tickets: {regular_ticket}</p>}
          {vip_ticket > 0 && <p>VIP Tickets: {vip_ticket}</p>}
          {two_person_tent > 0 && <p>2-Person Tents: {two_person_tent}</p>}
          {three_person_tent > 0 && <p>3-Person Tents: {three_person_tent}</p>}
          {green_camping && <p>Green Camping: Yes</p>}
        </div>
        <div className="mt-8">
          <p>
            Bring a printed copy of your ticket or show the e-ticket on your
            mobile device at the entrance.
          </p>
          <p>We look forward to seeing you at the event!</p>
          <p>
            If you have any questions or need assistance, please contact our
            support team at support@foofest.dk or call +45 66 64 20 69.
          </p>
          <button
            onClick={handleDownloadTicket}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Download Ticket
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
