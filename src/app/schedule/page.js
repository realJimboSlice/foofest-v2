"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../components/navigation";
import ScheduleGrid from "../components/ScheduleGrid";

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
    <div className="min-h-screen bg-black text-white p-4">
      {/* Navigation */}
      <Navigation
        days={days}
        selectedDay={selectedDay}
        onDayClick={setSelectedDay}
        className="mb-8"
      />

      {/* Schedule Grid */}
      <ScheduleGrid schedule={getFilteredSchedule(selectedDay)} />
    </div>
  );
};

export default SchedulePage;
