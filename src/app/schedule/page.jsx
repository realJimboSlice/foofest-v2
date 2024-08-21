"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../components/navigation";
import Image from "next/image";

// Function to fetch schedule data
async function fetchSchedule() {
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/schedule");
  const data = await res.json();
  return data;
}

// Function to fetch band data
async function fetchBands() {
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/bands");
  const data = await res.json();
  return data;
}

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState("mon");
  const [scheduleData, setScheduleData] = useState({});
  const [bandData, setBandData] = useState([]);

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  useEffect(() => {
    const fetchData = async () => {
      const schedule = await fetchSchedule();
      const bands = await fetchBands();
      setScheduleData(schedule);
      setBandData(bands);
    };

    fetchData();
  }, []);

  const getFilteredSchedule = (day) => {
    const scheduleByTimeSlot = {};

    Object.keys(scheduleData).forEach((stage) => {
      scheduleData[stage][day].forEach((slot) => {
        if (slot.act !== "break") {
          const key = `${slot.start}-${slot.end}`;
          if (!scheduleByTimeSlot[key]) {
            scheduleByTimeSlot[key] = [];
          }

          // Find the band details for the slot
          const band = bandData.find((b) => b.name === slot.act);
          if (band) {
            slot.logo = band.logo.includes("https")
              ? band.logo
              : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`;
            slot.slug = band.slug;
          }

          scheduleByTimeSlot[key].push({ ...slot, stage });
        }
      });
    });

    return scheduleByTimeSlot;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-32">
      {/* Navigation */}
      <div className="flex justify-center flex-wrap my-8 mb-20 gap-5">
        {days.map((day) => (
          <button
            key={day}
            className={`text-xl px-4 p-1 w-20 rounded-full ${
              selectedDay === day
                ? "bg-electricBlue text-black"
                : "bg-gray-700 text-white"
            } md:text-2xl md:p-2 lg:w-40 lg:text-2xl uppercase transition ease-in-out hover:bg-deepRed duration-300 cursor-pointer`}
            onClick={() => setSelectedDay(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule Display */}
      <div>
        {Object.keys(scheduleData).map((stage) => (
          <section key={stage} className="mb-20">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl mb-5 text-electricBlue">
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </h2>
            <div className="flex gap-8 overflow-x-scroll snap-x snap-mandatory mb-20">
              {Object.entries(getFilteredSchedule(selectedDay)).map(
                ([timeSlot, acts]) =>
                  acts
                    .filter((act) => act.stage === stage)
                    .map((act) => (
                      <article
                        key={`${act.slug}-${timeSlot}`}
                        className="min-w-fit snap-start rounded-lg overflow-hidden relative mb-10"
                      >
                        <a
                          aria-label={`Read more about ${act.act}`}
                          href={`/band/${act.slug}`}
                          className="block"
                        >
                          <Image
                            alt={act.act}
                            loading="lazy"
                            width="300"
                            height="300"
                            decoding="async"
                            className="aspect-square object-cover mx-auto"
                            src={act.logo}
                          />
                          <div className="absolute inset-x-0 bottom-0 pt-40 pl-2">
                            <p className="text-electricBlue">{act.genre}</p>
                            <h3 className="text-3xl xl:text-4xl mb-2">
                              {act.act}
                            </h3>
                            <div className="flex items-baseline gap-2">
                              <h4 className="text-xl lg:text-2xl">
                                {act.start} - {act.end}
                              </h4>
                            </div>
                          </div>
                        </a>
                      </article>
                    ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
