"use client";

// Import necessary hooks and utilities
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import jsPDF from "jspdf";
import JSBarcode from "jsbarcode";

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

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

  const generateBarcode = (text) => {
    const canvas = document.createElement("canvas");
    JSBarcode(canvas, text, { format: "CODE128" });
    return canvas.toDataURL("image/png");
  };

  const handleDownloadTicket = () => {
    const doc = new jsPDF();
    const barcode = generateBarcode(reservationId);
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
    doc.text(`Reservation ID: ${bookingDetails.reservation_id}`, 10, 110);
    doc.addImage(barcode, "PNG", 10, 120, 100, 40);
    doc.save("Foofest_Ticket.pdf");
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const regularTicketsCost = bookingDetails.regular_ticket * 799;
    const vipTicketsCost = bookingDetails.vip_ticket * 1299;
    const twoPeopleTentsCost = bookingDetails.two_person_tent * 299;
    const threePeopleTentsCost = bookingDetails.three_person_tent * 399;
    const greenCampingCost = bookingDetails.green_camping ? 295 : 0;
    const bookingFee = bookingDetails.booking_fee;
    const totalPrice =
      regularTicketsCost +
      vipTicketsCost +
      twoPeopleTentsCost +
      threePeopleTentsCost +
      greenCampingCost +
      bookingFee;

    doc.text("Foofest Receipt", 10, 10);
    doc.text(`Event: Foofest`, 10, 20);
    doc.text(`Date: 20th of June 2024 until the 27th of June 2024`, 10, 30);
    doc.text(`Area: ${bookingDetails.area}`, 10, 40);
    doc.text(
      `Regular Tickets (${bookingDetails.regular_ticket} x 799 kr): ${regularTicketsCost} kr`,
      10,
      60
    );
    doc.text(
      `VIP Tickets (${bookingDetails.vip_ticket} x 1299 kr): ${vipTicketsCost} kr`,
      10,
      70
    );
    doc.text(
      `2-Person Tents (${bookingDetails.two_person_tent} x 299 kr): ${twoPeopleTentsCost} kr`,
      10,
      80
    );
    doc.text(
      `3-Person Tents (${bookingDetails.three_person_tent} x 399 kr): ${threePeopleTentsCost} kr`,
      10,
      90
    );
    doc.text(`Green Camping: ${greenCampingCost} kr`, 10, 100);
    doc.text(`Booking Fee: ${bookingFee} kr`, 10, 110);
    doc.text(`Total Price: ${totalPrice} kr`, 10, 120);
    doc.text(
      `Name: ${bookingDetails.first_name} ${bookingDetails.last_name}`,
      10,
      130
    );
    doc.text(`Country: ${bookingDetails.country}`, 10, 140);
    doc.text(`Email: ${bookingDetails.email}`, 10, 150);
    doc.text(
      `Paid with ${bookingDetails.credit_card_issuer} ${bookingDetails.credit_card_number}`,
      10,
      160
    );
    // doc.text(
    //   `Credit Card Issuer: ${bookingDetails.credit_card_issuer}`,
    //   10,
    //   160
    // );
    // doc.text(
    //   `Credit Card Number: ${bookingDetails.credit_card_number}`,
    //   10,
    //   170
    // );
    doc.text(`Reservation ID: ${bookingDetails.reservation_id}`, 10, 170);
    doc.save("Transaction_Receipt.pdf");
  };

  const handleResendEmail = async () => {
    try {
      // Create Ticket PDF
      const ticketDoc = new jsPDF();
      const barcode = generateBarcode(reservationId);
      ticketDoc.text("Foofest Ticket", 10, 10);
      ticketDoc.text(`Event: Foofest`, 10, 20);
      ticketDoc.text(
        `Date: 20th of June 2024 until the 27th of June 2024`,
        10,
        30
      );
      ticketDoc.text(`Area: ${bookingDetails.area}`, 10, 40);
      if (bookingDetails.regular_ticket > 0) {
        ticketDoc.text(
          `Regular Tickets: ${bookingDetails.regular_ticket}`,
          10,
          50
        );
      }
      if (bookingDetails.vip_ticket > 0) {
        ticketDoc.text(`VIP Tickets: ${bookingDetails.vip_ticket}`, 10, 60);
      }
      if (bookingDetails.two_person_tent > 0) {
        ticketDoc.text(
          `2-Person Tents: ${bookingDetails.two_person_tent}`,
          10,
          70
        );
      }
      if (bookingDetails.three_person_tent > 0) {
        ticketDoc.text(
          `3-Person Tents: ${bookingDetails.three_person_tent}`,
          10,
          80
        );
      }
      if (bookingDetails.green_camping) {
        ticketDoc.text(`Green Camping: Yes`, 10, 90);
      }
      ticketDoc.text("Bring this ticket to the event entrance.", 10, 100);
      ticketDoc.text(
        `Reservation ID: ${bookingDetails.reservation_id}`,
        10,
        110
      );
      ticketDoc.addImage(barcode, "PNG", 10, 120, 100, 40);
      const ticketPdfString = ticketDoc.output("datauristring");

      // Create Receipt PDF
      const receiptDoc = new jsPDF();
      const regularTicketsCost = bookingDetails.regular_ticket * 799;
      const vipTicketsCost = bookingDetails.vip_ticket * 1299;
      const twoPeopleTentsCost = bookingDetails.two_person_tent * 299;
      const threePeopleTentsCost = bookingDetails.three_person_tent * 399;
      const greenCampingCost = bookingDetails.green_camping ? 295 : 0;
      const bookingFee = bookingDetails.booking_fee;
      const totalPrice =
        regularTicketsCost +
        vipTicketsCost +
        twoPeopleTentsCost +
        threePeopleTentsCost +
        greenCampingCost +
        bookingFee;

      receiptDoc.text("Foofest Receipt", 10, 10);
      receiptDoc.text(`Event: Foofest`, 10, 20);
      receiptDoc.text(
        `Date: 20th of June 2024 until the 27th of June 2024`,
        10,
        30
      );
      receiptDoc.text(`Area: ${bookingDetails.area}`, 10, 40);
      receiptDoc.text(
        `Regular Tickets (${bookingDetails.regular_ticket} x 799 kr): ${regularTicketsCost} kr`,
        10,
        60
      );
      receiptDoc.text(
        `VIP Tickets (${bookingDetails.vip_ticket} x 1299 kr): ${vipTicketsCost} kr`,
        10,
        70
      );
      receiptDoc.text(
        `2-Person Tents (${bookingDetails.two_person_tent} x 299 kr): ${twoPeopleTentsCost} kr`,
        10,
        80
      );
      receiptDoc.text(
        `3-Person Tents (${bookingDetails.three_person_tent} x 399 kr): ${threePeopleTentsCost} kr`,
        10,
        90
      );
      receiptDoc.text(`Green Camping: ${greenCampingCost} kr`, 10, 100);
      receiptDoc.text(`Booking Fee: ${bookingFee} kr`, 10, 110);
      receiptDoc.text(`Total Price: ${totalPrice} kr`, 10, 120);
      receiptDoc.text(
        `Name: ${bookingDetails.first_name} ${bookingDetails.last_name}`,
        10,
        130
      );
      receiptDoc.text(`Country: ${bookingDetails.country}`, 10, 140);
      receiptDoc.text(`Email: ${bookingDetails.email}`, 10, 150);
      receiptDoc.text(
        `Paid with ${bookingDetails.credit_card_issuer} ${bookingDetails.credit_card_number}`,
        10,
        160
      );
      // doc.text(
      //   `Credit Card Issuer: ${bookingDetails.credit_card_issuer}`,
      //   10,
      //   160
      // );
      // doc.text(
      //   `Credit Card Number: ${bookingDetails.credit_card_number}`,
      //   10,
      //   170
      // );
      receiptDoc.text(
        `Reservation ID: ${bookingDetails.reservation_id}`,
        10,
        170
      );
      const receiptPdfString = receiptDoc.output("datauristring");

      // Prepare HTML content for the email
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Your booking has been confirmed!</h1>
          <p>Hello ${bookingDetails.first_name},</p>
          <p>Thank you for booking with Foofest!</p>
          <p>Please find your receipt and ticket enclosed to this email.</p>
          <p>We look forward to seeing you at the event!</p>
          <table style="width: 50%; border: 1px solid #ddd; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Booking Status</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Reservation ID</th>
            </tr>
            <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><b><u>Confirmed</u></b></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><b>${bookingDetails.reservation_id}</b></td>
            </tr>
          </table>
        </div>
      `;

      // Prepare plain text content for the email
      const textContent = `
        Your booking has been confirmed!
  
        Hello ${bookingDetails.first_name},
  
        Thank you for booking with Foofest!
  
        Please find your receipt and ticket enclosed to this email.

        We look forward to seeing you at the event!
  
        Booking Status: Confirmed
        Reservation ID: ${bookingDetails.reservation_id}
  
      `;

      // Send email with both attachments and the HTML and text content
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: bookingDetails.email,
          subject: "Your Foofest Booking Confirmation",
          text: textContent,
          html: htmlContent,
          attachments: [
            { filename: "Foofest_Ticket.pdf", content: ticketPdfString },
            { filename: "Foofest_Receipt.pdf", content: receiptPdfString },
          ],
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
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
          <button
            onClick={handleResendEmail}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Resend Email
          </button>
          {emailSent && (
            <p className="mt-4 text-green-500">Email sent successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
