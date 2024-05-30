import React from "react";
import Image from "next/image";

const ScheduleGrid = ({ schedule }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {Object.entries(schedule).map(([timeSlot, bands], index) => (
        <div key={index} className="border p-4 rounded">
          <div className="font-bold mb-2">{timeSlot}</div>
          {bands.map((band, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="text-sm">{band.stage}</div>
                <div className="font-bold ml-10">{band.act}</div>
              </div>
              {band.logo && (
                <Image
                  src={band.logo}
                  alt={band.act}
                  width={100}
                  height={100}
                  className="ml-4"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScheduleGrid;
