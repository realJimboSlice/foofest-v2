"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import CountrySelect from "../components/countrySelect";
import supabase from "../../lib/supabaseClient";

const BookingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const area = searchParams.get("area");

  const {
    register,
    getValues,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const bookingFee = 99;

  const onSubmit = async (data) => {
    const {
      regularTickets,
      vipTickets,
      twoPeopleTents,
      threePeopleTents,
      greenCamping,
      ...rest
    } = data;

    const breakdown = {
      regularTicketsCost: parseInt(regularTickets) * 799,
      vipTicketsCost: parseInt(vipTickets) * 1299,
      twoPeopleTentsCost: parseInt(twoPeopleTents) * 299,
      threePeopleTentsCost: parseInt(threePeopleTents) * 399,
      greenCampingCost: greenCamping ? 295 : 0,
      bookingFee,
    };

    const amountPaid = {
      regularTicketsCost: breakdown.regularTicketsCost,
      vipTicketsCost: breakdown.vipTicketsCost,
      twoPeopleTentsCost: breakdown.twoPeopleTentsCost,
      threePeopleTentsCost: breakdown.threePeopleTentsCost,
      greenCampingCost: breakdown.greenCampingCost,
      bookingFee,
      totalAmount,
    };

    const totalTickets = parseInt(regularTickets) + parseInt(vipTickets);

    try {
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

      const result = await response.json();
      const reservationId = result.id;

      const { error } = await supabase.from("bookings").insert([
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
        console.error("Error inserting data:", error);
      } else {
        console.log("Data inserted successfully - redirecting to payment");

        const createdAt = new Date().toISOString();
        localStorage.setItem("reservationId", reservationId);
        localStorage.setItem("createdAt", createdAt);

        router.push(`/payment?reservationId=${reservationId}`);
      }
    } catch (error) {
      console.error("Error reserving spot:", error);
    }
  };

  const watchRegularTickets = watch("regularTickets", 0);
  const watchVipTickets = watch("vipTickets", 0);
  const watchTwoPeopleTents = watch("twoPeopleTents", 0);
  const watchThreePeopleTents = watch("threePeopleTents", 0);
  const watchGreenCamping = watch("greenCamping", false);

  useEffect(() => {
    const calculateCosts = () => {
      const regularTicketsCost = parseInt(watchRegularTickets) * 799 || 0;
      const vipTicketsCost = parseInt(watchVipTickets) * 1299 || 0;
      const twoPeopleTentsCost = parseInt(watchTwoPeopleTents) * 299 || 0;
      const threePeopleTentsCost = parseInt(watchThreePeopleTents) * 399 || 0;
      const greenCampingCost = watchGreenCamping ? 295 : 0;

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

      setCostBreakdown({
        regularTicketsCost: regularTicketsCost || null,
        vipTicketsCost: vipTicketsCost || null,
        twoPeopleTentsCost: twoPeopleTentsCost || null,
        threePeopleTentsCost: threePeopleTentsCost || null,
        greenCampingCost: watchGreenCamping ? greenCampingCost : null,
        bookingFee,
      });

      setIsSubmitDisabled(totalTickets === 0);
    };

    calculateCosts();
  }, [
    watchRegularTickets,
    watchVipTickets,
    watchTwoPeopleTents,
    watchThreePeopleTents,
    watchGreenCamping,
  ]);

  const validateTents = (value) => {
    const totalTents =
      parseInt(watch("twoPeopleTents") || 0) +
      parseInt(watch("threePeopleTents") || 0);
    return (
      totalTents <= totalTickets || "Total tents cannot exceed total tickets"
    );
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Booking</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6"
      >
        <div className="flex flex-col">
          <label htmlFor="area" className="mb-2 font-semibold">
            Area
          </label>
          <select
            id="area"
            {...register("area")}
            className="p-2 border rounded bg-gray-700 text-white"
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

        <div className="flex flex-col">
          <label htmlFor="regularTickets" className="mb-2 font-semibold">
            Regular Tickets (799,-)
          </label>
          <select
            id="regularTickets"
            {...register("regularTickets")}
            className="p-2 border rounded bg-gray-700 text-white"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="vipTickets" className="mb-2 font-semibold">
            VIP Tickets (1299,-)
          </label>
          <select
            id="vipTickets"
            {...register("vipTickets")}
            className="p-2 border rounded bg-gray-700 text-white"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="greenCamping"
            {...register("greenCamping")}
            className="w-4 h-4 text-electricBlue bg-gray-700 border-gray-600 rounded focus:ring-electricBlue"
          />
          <label htmlFor="greenCamping" className="font-semibold">
            Green Camping (295,-)
          </label>
        </div>

        <div className="flex flex-col">
          <label htmlFor="twoPeopleTents" className="mb-2 font-semibold">
            2-Person Tent (299,-)
          </label>
          <select
            id="twoPeopleTents"
            {...register("twoPeopleTents", { validate: validateTents })}
            className="p-2 border rounded bg-gray-700 text-white"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.twoPeopleTents && (
            <span className="text-red-500 text-sm mt-1">
              {errors.twoPeopleTents.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="threePeopleTents" className="mb-2 font-semibold">
            3-Person Tent (399,-)
          </label>
          <select
            id="threePeopleTents"
            {...register("threePeopleTents", { validate: validateTents })}
            className="p-2 border rounded bg-gray-700 text-white"
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.threePeopleTents && (
            <span className="text-red-500 text-sm mt-1">
              {errors.threePeopleTents.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">Email is required</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmEmail" className="mb-2 font-semibold">
            Confirm E-mail
          </label>
          <input
            type="email"
            id="confirmEmail"
            {...register("confirmEmail", {
              required: "Confirmation Email is required",
              validate: {
                matchesPreviousEmail: (value) => {
                  const { email } = getValues();
                  return email === value || "Emails should match!";
                },
              },
            })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.confirmEmail && (
            <span className="text-red-500 text-sm mt-1">
              {errors.confirmEmail.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="firstName" className="mb-2 font-semibold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm mt-1">
              First name is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName" className="mb-2 font-semibold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm mt-1">
              Last name is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className="mb-2 font-semibold">
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register("address", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.address && (
            <span className="text-red-500 text-sm mt-1">
              Address is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className="mb-2 font-semibold">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm mt-1">
              Phone number is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="postalCode" className="mb-2 font-semibold">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            {...register("postalCode", { required: true })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.postalCode && (
            <span className="text-red-500 text-sm mt-1">
              Postal code is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="city" className="mb-2 font-semibold">
            City
          </label>
          <input
            type="text"
            id="city"
            {...register("city", {
              required: true,
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Only letters are allowed",
              },
            })}
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.city && (
            <span className="text-red-500 text-sm mt-1">
              {errors.city.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="country" className="mb-2 font-semibold">
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
          {errors.country && (
            <span className="text-red-500 text-sm mt-1">
              Country is required
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xl font-bold mb-2">Cost Breakdown</p>
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

        <button
          type="submit"
          className={`px-6 py-3 w-full ${
            isSubmitDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-electricBlue hover:bg-deepRed"
          } text-white rounded font-semibold transition-colors duration-300`}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
