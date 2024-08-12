import React from "react";

const Navigation = ({ days, selectedDay, onDayClick }) => {
  return (
    <nav className="flex justify-center space-x-4 my-4">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDayClick(day)}
          className={`px-4 py-2 rounded ${
            selectedDay === day ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {day.toUpperCase()}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
