// Comments added using GitHub Copilot for increased readability and context
// Prompt used: Please add comments to the code for better readability and context.
// Indicating this is a client-side component
"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import CountrySelect from "../components/countrySelect";
import supabase from "../../lib/supabaseClient";

const BookingForm = () => {
  // Retrieve search parameters from the URL
  const searchParams = useSearchParams();
  const area = searchParams.get("area");

  // Initialize form handling using react-hook-form
  const {
    register, // Registers input elements with react-hook-form
    handleSubmit, // Handles form submission
    watch, // Watches form inputs for changes
    control, // Controls input elements for non-standard inputs
    formState: { errors }, // Contains form validation errors
  } = useForm();

  // State variables to manage booking details
  const [totalTickets, setTotalTickets] = useState(0); // Total number of tickets
  const [totalAmount, setTotalAmount] = useState(0); // Total cost amount
  const [costBreakdown, setCostBreakdown] = useState({}); // Detailed cost breakdown
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // Submission button state

  const bookingFee = 99; // Fixed booking fee

  // Function to handle form submission
  const onSubmit = async (data) => {
    // Destructure data to get ticket and tent details
    const {
      regularTickets,
      vipTickets,
      twoPeopleTents,
      threePeopleTents,
      greenCamping,
      ...rest
    } = data;

    // Calculate the cost breakdown based on the form inputs
    const breakdown = {
      regularTicketsCost: parseInt(regularTickets) * 799,
      vipTicketsCost: parseInt(vipTickets) * 1299,
      twoPeopleTentsCost: parseInt(twoPeopleTents) * 299,
      threePeopleTentsCost: parseInt(threePeopleTents) * 399,
      greenCampingCost: greenCamping ? 295 : 0,
      bookingFee,
    };

    // Calculate the total amount paid
    const amountPaid = {
      regularTicketsCost: breakdown.regularTicketsCost,
      vipTicketsCost: breakdown.vipTicketsCost,
      twoPeopleTentsCost: breakdown.twoPeopleTentsCost,
      threePeopleTentsCost: breakdown.threePeopleTentsCost,
      greenCampingCost: breakdown.greenCampingCost,
      bookingFee,
      totalAmount,
    };

    // Calculate the total number of tickets
    const totalTickets = parseInt(regularTickets) + parseInt(vipTickets);

    try {
      // Send PUT request to reserve the spot
      const response = await fetch(
        "https://fluffy-scrawny-hedgehog.glitch.me/reserve-spot",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ area, amount: totalTickets }),
        }
      );

      // Parse the response JSON to get reservation ID
      const result = await response.json();
      const reservationId = result.id;

      // Insert data into Supabase
      const { error } = await supabase
        .from("bookings") // Supabase table name
        .insert([
          {
            first_name: rest.firstName,
            last_name: rest.lastName,
            area: area,
            email: rest.email,
            address: rest.address,
            phone_number: rest.phoneNumber,
            city: rest.city,
            postal_code: rest.postalCode,
            country: rest.country,
            regular_ticket: parseInt(regularTickets),
            vip_ticket: parseInt(vipTickets),
            green_camping: greenCamping,
            two_person_tent: parseInt(twoPeopleTents),
            three_person_tent: parseInt(threePeopleTents),
            amount_paid: amountPaid,
            reservation_id: reservationId,
          },
        ]);

      if (error) {
        // Log error if insertion fails
        console.error("Error inserting data:", error);
      } else {
        // Log success message and navigate to payment page
        console.log("Data inserted successfully");
        router.push("/payment"); // Navigate to the payment page
      }
    } catch (error) {
      // Log error if reservation fails
      console.error("Error reserving spot:", error);
    }
  };

  // Watch specific form fields for changes
  const watchRegularTickets = watch("regularTickets", 0);
  const watchVipTickets = watch("vipTickets", 0);
  const watchTwoPeopleTents = watch("twoPeopleTents", 0);
  const watchThreePeopleTents = watch("threePeopleTents", 0);
  const watchGreenCamping = watch("greenCamping", false);

  // old useEffect function
  // useEffect(() => {
  //   const regularTicketsCost = parseInt(watchRegularTickets) * 799;
  //   const vipTicketsCost = parseInt(watchVipTickets) * 1299;
  //   const twoPeopleTentsCost = parseInt(watchTwoPeopleTents) * 299;
  //   const threePeopleTentsCost = parseInt(watchThreePeopleTents) * 399;
  //   const greenCampingCost = watchGreenCamping ? 295 : 0;

  //   const totalTickets =
  //     parseInt(watchRegularTickets) + parseInt(watchVipTickets);
  //   setTotalTickets(totalTickets);

  //   const totalAmount =
  //     regularTicketsCost +
  //     vipTicketsCost +
  //     twoPeopleTentsCost +
  //     threePeopleTentsCost +
  //     greenCampingCost +
  //     bookingFee;
  //   setTotalAmount(totalAmount);

  //   setCostBreakdown({
  //     regularTicketsCost: regularTicketsCost > 0 ? regularTicketsCost : null,
  //     vipTicketsCost: vipTicketsCost > 0 ? vipTicketsCost : null,
  //     twoPeopleTentsCost: twoPeopleTentsCost > 0 ? twoPeopleTentsCost : null,
  //     threePeopleTentsCost:
  //       threePeopleTentsCost > 0 ? threePeopleTentsCost : null,
  //     greenCampingCost: watchGreenCamping ? greenCampingCost : null,
  //     bookingFee,
  //   });

  //   setIsSubmitDisabled(totalTickets === 0);
  // }, [
  //   watchRegularTickets,
  //   watchVipTickets,
  //   watchTwoPeopleTents,
  //   watchThreePeopleTents,
  //   watchGreenCamping,
  // ]);

  {
    /* New cost breakdown code provided by ChatGPT 4 with the aim to avoid multiple calls and ensure calculations are correct.
  It is now a single piece of logic that updates the state
        Prompt used: "Hey GPT4, I'm developing in the newest version of Next.JS using Tailwind.css, but not using Typscript.
        This is my currently finished code for my booking site. Do you have any tips for improvements that can be made for better readability, maintainability, and functionality?
        Please explain your logic and provide snippets of code if necessary."
        */
  }

  // Effect to calculate costs and update state based on form inputs
  useEffect(() => {
    // Function to calculate costs based on form inputs
    const calculateCosts = () => {
      // Calculate individual costs
      const regularTicketsCost = parseInt(watchRegularTickets) * 799 || 0;
      const vipTicketsCost = parseInt(watchVipTickets) * 1299 || 0;
      const twoPeopleTentsCost = parseInt(watchTwoPeopleTents) * 299 || 0;
      const threePeopleTentsCost = parseInt(watchThreePeopleTents) * 399 || 0;
      const greenCampingCost = watchGreenCamping ? 295 : 0;

      // Calculate total tickets and total amount
      const totalTickets =
        parseInt(watchRegularTickets) + parseInt(watchVipTickets);
      setTotalTickets(totalTickets);

      const totalAmount =
        regularTicketsCost +
        vipTicketsCost +
        twoPeopleTentsCost +
        threePeopleTentsCost +
        greenCampingCost +
        bookingFee;
      setTotalAmount(totalAmount);

      // Set cost breakdown in state
      setCostBreakdown({
        regularTicketsCost: regularTicketsCost || null,
        vipTicketsCost: vipTicketsCost || null,
        twoPeopleTentsCost: twoPeopleTentsCost || null,
        threePeopleTentsCost: threePeopleTentsCost || null,
        greenCampingCost: watchGreenCamping ? greenCampingCost : null,
        bookingFee,
      });

      // Disable submit button if no tickets are selected
      setIsSubmitDisabled(totalTickets === 0);
    };

    calculateCosts(); // Call the function to calculate costs
  }, [
    watchRegularTickets,
    watchVipTickets,
    watchTwoPeopleTents,
    watchThreePeopleTents,
    watchGreenCamping,
  ]);

  // Old validateTents function
  // const validateTents = () => {
  //   const totalTents =
  //     parseInt(watchTwoPeopleTents) + parseInt(watchThreePeopleTents);
  //   return totalTents <= totalTickets;
  // };

  {
    /* New validateTents function by ChatGPT 4 to improve clarity
        Prompt used: "Hey GPT4, I'm developing in the newest version of Next.JS using Tailwind.css, but not using Typscript.
        This is my currently finished code for my booking site. Do you have any tips for improvements that can be made for better readability, maintainability, and functionality?
        Please explain your logic and provide snippets of code if necessary."
        */
  }

  // Validate the total number of tents against the total number of tickets
  const validateTents = (value) => {
    const totalTents =
      parseInt(watch("twoPeopleTents") || 0) +
      parseInt(watch("threePeopleTents") || 0);
    return (
      totalTents <= totalTickets || "Total tents cannot exceed total tickets"
    );
  };

  // Cost items to be displayed in the cost breakdown section
  const costItems = [
    {
      label: `${watchRegularTickets}x Regular Tickets`,
      cost: costBreakdown.regularTicketsCost,
    },
    {
      label: `${watchVipTickets}x VIP Tickets`,
      cost: costBreakdown.vipTicketsCost,
    },
    {
      label: `${watchTwoPeopleTents}x 2-Person Tents`,
      cost: costBreakdown.twoPeopleTentsCost,
    },
    {
      label: `${watchThreePeopleTents}x 3-Person Tents`,
      cost: costBreakdown.threePeopleTentsCost,
    },
    { label: "Green Camping", cost: costBreakdown.greenCampingCost },
    { label: "Mandatory Booking Fee", cost: bookingFee },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-8">Booking</h1>
      {/* Form for booking */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        {/* Area selection - disabled as it's preselected */}
        <div className="flex flex-col">
          <label htmlFor="area" className="mb-2">
            Area
          </label>
          <select
            id="area"
            {...register("area")}
            className="p-2 border rounded"
            defaultValue={area}
            disabled
          >
            <option value="Svartheim">Svartheim</option>
            <option value="Nilfheim">Nilfheim</option>
            <option value="Helheim">Helheim</option>
            <option value="Muspelheim">Muspelheim</option>
            <option value="Alfheim">Alfheim</option>
          </select>
        </div>

        {/* Regular Tickets selection */}
        <div className="flex flex-col">
          <label htmlFor="regularTickets" className="mb-2">
            Regular Tickets (799,-)
          </label>
          <select
            id="regularTickets"
            {...register("regularTickets")}
            className="p-2 border rounded"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* VIP Tickets selection */}
        <div className="flex flex-col">
          <label htmlFor="vipTickets" className="mb-2">
            VIP Tickets (1299,-)
          </label>
          <select
            id="vipTickets"
            {...register("vipTickets")}
            className="p-2 border rounded"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Green Camping selection */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="greenCamping"
            {...register("greenCamping")}
          />
          <label htmlFor="greenCamping" className="mb-2">
            Green Camping (295,-)
          </label>
        </div>

        {/* 2-Person Tents selection */}
        <div className="flex flex-col">
          <label htmlFor="twoPeopleTents" className="mb-2">
            2 person tent - including the tent (299,-)
          </label>
          <select
            id="twoPeopleTents"
            {...register("twoPeopleTents", { validate: validateTents })}
            className="p-2 border rounded"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {/* Display error if tents exceed tickets */}
          {errors.twoPeopleTents && (
            <span className="text-red-500 text-sm">
              Total amount of tents cannot exceed total amount of tickets
            </span>
          )}
        </div>

        {/* 3-Person Tents selection */}
        <div className="flex flex-col">
          <label htmlFor="threePeopleTents" className="mb-2">
            3 person tent - including the tent (399,-)
          </label>
          <select
            id="threePeopleTents"
            {...register("threePeopleTents", { validate: validateTents })}
            className="p-2 border rounded"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {/* Display error if tents exceed tickets */}
          {errors.threePeopleTents && (
            <span className="text-red-500 text-sm">
              Total amount of tents cannot exceed total amount of tickets
            </span>
          )}
        </div>

        {/* Email input */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if email is missing */}
          {errors.email && (
            <span className="text-red-500 text-sm">Email is required</span>
          )}
        </div>

        {/* First Name input */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if first name is missing */}
          {errors.firstName && (
            <span className="text-red-500 text-sm">First name is required</span>
          )}
        </div>

        {/* Last Name input */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if last name is missing */}
          {errors.lastName && (
            <span className="text-red-500 text-sm">Last name is required</span>
          )}
        </div>

        {/* Address input */}
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register("address", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if address is missing */}
          {errors.address && (
            <span className="text-red-500 text-sm">Address is required</span>
          )}
        </div>

        {/* Phone Number input */}
        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className="mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if phone number is missing */}
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">
              Phone number is required
            </span>
          )}
        </div>

        {/* Postal Code input */}
        <div className="flex flex-col">
          <label htmlFor="postalCode" className="mb-2">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            {...register("postalCode", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if postal code is missing */}
          {errors.postalCode && (
            <span className="text-red-500 text-sm">
              Postal code is required
            </span>
          )}
        </div>

        {/* City input */}
        <div className="flex flex-col">
          <label htmlFor="city" className="mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            {...register("city", { required: true })}
            className="p-2 border rounded"
          />
          {/* Display error if city is missing */}
          {errors.city && (
            <span className="text-red-500 text-sm">City is required</span>
          )}
        </div>

        {/* Country selection using CountrySelect component */}
        <div className="flex flex-col">
          <label htmlFor="country" className="mb-2">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountrySelect
                {...field}
                onChange={(selected) => field.onChange(selected.value)}
              />
            )}
            rules={{ required: true }}
          />
          {/* Display error if country is missing */}
          {errors.country && (
            <span className="text-red-500 text-sm">Country is required</span>
          )}
        </div>

        {/* Old cost breakdown code */}
        {/* <div className="flex flex-col items-center">
          <p className="text-xl font-bold mb-2">Cost Breakdown</p>
          {costBreakdown.regularTicketsCost !== null && (
            <p>
              {watchRegularTickets}x Regular Tickets:{" "}
              {costBreakdown.regularTicketsCost} kr
            </p>
          )}
          {costBreakdown.vipTicketsCost !== null && (
            <p>
              {watchVipTickets}x VIP Tickets: {costBreakdown.vipTicketsCost} kr
            </p>
          )}
          {costBreakdown.twoPeopleTentsCost !== null && (
            <p>
              {watchTwoPeopleTents}x 2-Person Tents:{" "}
              {costBreakdown.twoPeopleTentsCost} kr
            </p>
          )}
          {costBreakdown.threePeopleTentsCost !== null && (
            <p>
              {watchThreePeopleTents}x 3-Person Tents:{" "}
              {costBreakdown.threePeopleTentsCost} kr
            </p>
          )}
          {costBreakdown.greenCampingCost !== null && (
            <p>Green Camping: {costBreakdown.greenCampingCost} kr</p>
          )}
          <p>Mandatory Booking Fee: {bookingFee} kr</p>
          <p className="text-2xl font-bold mt-4">
            Total amount: {totalAmount} kr
          </p>
        </div> */}

        {/* New cost breakdown code provided by ChatGPT 4
        Prompt used: "Hey GPT4, I'm developing in the newest version of Next.JS using Tailwind.css, but not using Typscript.
        This is my currently finished code for my booking site. Do you have any tips for improvements that can be made for better readability, maintainability, and functionality?
        Please explain your logic and provide snippets of code if necessary."
        */}

        {/* Display cost breakdown */}
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold mb-2">Cost Breakdown</p>
          {/* Iterate through costItems to display each item */}
          {costItems.map(
            (item, index) =>
              item.cost !== null && (
                <p key={index}>
                  {item.label}: {item.cost} kr
                </p>
              )
          )}
          <p className="text-2xl font-bold mt-4">
            Total amount: {totalAmount} kr
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`px-6 py-3 ${
            isSubmitDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-700"
          } text-white rounded`}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
