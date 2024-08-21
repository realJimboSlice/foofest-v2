"use client";

// Import necessary hooks and utilities
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import supabase from "../../lib/supabaseClient";
import Head from "next/head";
import jsPDF from "jspdf";
import JSBarcode from "jsbarcode";
import Loading from "../components/Loading";

// Define the ConfirmationPage component
const ConfirmationPageContent = () => {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailAutoSent, setEmailAutoSent] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!reservationId) {
        setErrorMessage("Invalid reservation ID.");
        setIsLoading(false);
        return;
      }

      const emailSentFlag = localStorage.getItem(`emailSent_${reservationId}`);
      if (emailSentFlag) {
        setEmailAutoSent(true);
        console.log("Auto-email already sent");
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("reservation_id", reservationId)
          .single();
        console.log("Fetched booking details:", data);

        if (error || !data) {
          throw new Error("Error fetching booking data.");
        }

        setBookingDetails(data);
      } catch (error) {
        console.error("Error fetching booking details:", error.message);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [reservationId]);

  useEffect(() => {
    if (bookingDetails && !emailAutoSent) {
      sendEmail();
      setEmailAutoSent(true);
      console.log("Auto-email sent");
    }
  }, [bookingDetails, emailAutoSent]);

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
    doc.text(`Date: 20th of June 2024 - 27th of June 2024`, 10, 30);
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
    console.log("Ticket PDF downloaded");
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
    doc.text(`Booking created: ${bookingDetails.created_at}`, 10, 20);
    doc.text(`Event: Foofest`, 10, 30);
    doc.text(`Date: 20th of June 2024 - 27th of June 2024`, 10, 40);
    doc.text(`Area: ${bookingDetails.area}`, 10, 50);
    doc.text(
      `Regular Tickets (${bookingDetails.regular_ticket} x 799 kr): ${regularTicketsCost} kr`,
      10,
      70
    );
    doc.text(
      `VIP Tickets (${bookingDetails.vip_ticket} x 1299 kr): ${vipTicketsCost} kr`,
      10,
      80
    );
    doc.text(
      `2-Person Tents (${bookingDetails.two_person_tent} x 299 kr): ${twoPeopleTentsCost} kr`,
      10,
      90
    );
    doc.text(
      `3-Person Tents (${bookingDetails.three_person_tent} x 399 kr): ${threePeopleTentsCost} kr`,
      10,
      100
    );
    doc.text(`Green Camping: ${greenCampingCost} kr`, 10, 110);
    doc.text(`Booking Fee: ${bookingFee} kr`, 10, 120);
    doc.text(`Total Price: ${totalPrice} kr`, 10, 130);
    doc.text(
      `Name: ${bookingDetails.first_name} ${bookingDetails.last_name}`,
      10,
      140
    );
    doc.text(`Country: ${bookingDetails.country}`, 10, 150);
    doc.text(`Email: ${bookingDetails.email}`, 10, 160);
    doc.text(
      `Paid with ${bookingDetails.credit_card_issuer} ${bookingDetails.credit_card_number}`,
      10,
      170
    );
    doc.text(`Reservation ID: ${bookingDetails.reservation_id}`, 10, 180);
    doc.save("Transaction_Receipt.pdf");
    console.log("Receipt PDF downloaded");
  };

  const sendEmail = async () => {
    try {
      const ticketDoc = new jsPDF();
      const barcode = generateBarcode(reservationId);
      ticketDoc.text("Foofest Ticket", 10, 10);
      ticketDoc.text(`Event: Foofest`, 10, 20);
      ticketDoc.text(`Date: 20th of June 2024 - 27th of June 2024`, 10, 30);
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

      console.log("Ticket PDF generated");

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
      receiptDoc.text(`Booking created: ${bookingDetails.created_at}`, 10, 20);
      receiptDoc.text(`Event: Foofest`, 10, 30);
      receiptDoc.text(`Date: 20th of June 2024 - 27th of June 2024`, 10, 40);
      receiptDoc.text(`Area: ${bookingDetails.area}`, 10, 50);
      receiptDoc.text(
        `Regular Tickets (${bookingDetails.regular_ticket} x 799 kr): ${regularTicketsCost} kr`,
        10,
        70
      );
      receiptDoc.text(
        `VIP Tickets (${bookingDetails.vip_ticket} x 1299 kr): ${vipTicketsCost} kr`,
        10,
        80
      );
      receiptDoc.text(
        `2-Person Tents (${bookingDetails.two_person_tent} x 299 kr): ${twoPeopleTentsCost} kr`,
        10,
        90
      );
      receiptDoc.text(
        `3-Person Tents (${bookingDetails.three_person_tent} x 399 kr): ${threePeopleTentsCost} kr`,
        10,
        100
      );
      receiptDoc.text(`Green Camping: ${greenCampingCost} kr`, 10, 110);
      receiptDoc.text(`Booking Fee: ${bookingFee} kr`, 10, 120);
      receiptDoc.text(`Total Price: ${totalPrice} kr`, 10, 130);
      receiptDoc.text(
        `Name: ${bookingDetails.first_name} ${bookingDetails.last_name}`,
        10,
        140
      );
      receiptDoc.text(`Country: ${bookingDetails.country}`, 10, 150);
      receiptDoc.text(`Email: ${bookingDetails.email}`, 10, 160);
      receiptDoc.text(
        `Paid with ${bookingDetails.credit_card_issuer} ${bookingDetails.credit_card_number}`,
        10,
        170
      );
      receiptDoc.text(
        `Reservation ID: ${bookingDetails.reservation_id}`,
        10,
        180
      );
      const receiptPdfString = receiptDoc.output("datauristring");

      console.log("Receipt PDF generated");

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Your booking has been confirmed!</h1>
          <p>Hello ${bookingDetails.first_name},</p>
          <p>Thank you for booking with Foofest!</p>
          <p>Please find your receipt and ticket enclosed in this email.</p>
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

      const textContent = `
        Your booking has been confirmed!
  
        Hello ${bookingDetails.first_name},
  
        Thank you for booking with Foofest!
  
        Please find your receipt and ticket enclosed to this email.

        We look forward to seeing you at the event!
  
        Booking Status: Confirmed
        Reservation ID: ${bookingDetails.reservation_id}
  
      `;

      console.log("Prepared email content");

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
        console.log("Email sent successfully");
        localStorage.setItem(
          `emailSent_${bookingDetails.reservation_id}`,
          "true"
        );
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
  } = bookingDetails;

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-black text-white pt-36">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg lg:w-2/3 space-y-4 lg:mr-8">
        <h1 className="text-4xl font-bold mb-8">
          Congratulations, you&apos;ve completed your booking!
        </h1>
        <h2 className="text-2xl font-bold mb-4">
          Below you&apos;ll find your confirmation. It has also been sent to the
          email you provided along with the receipt for the transaction.
        </h2>
        <div className="space-y-2" id="ticket-content">
          <p>
            <strong>Event:</strong> Foofest
          </p>
          <p>
            <strong>Date:</strong> 20th of June 2024 - 27th of June 2024
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
      </div>

      <div className="flex flex-col bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm mt-8 lg:mt-0 lg:w-1/3 lg:sticky lg:top-36">
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleDownloadTicket}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
          >
            Download Ticket
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="px-4 py-2 bg-electricBlue hover:bg-deepRed text-white rounded"
          >
            Download Receipt
          </button>
          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
          >
            Resend Confirmation Email
          </button>
          {emailSent && (
            <p className="text-green-500">
              Email sent successfully! Please check your spam/junk folder if you
              can&apos;t find it in your inbox.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmationPage = () => (
  <Suspense fallback={<Loading />}>
    <ConfirmationPageContent />
  </Suspense>
);

export default ConfirmationPage;
