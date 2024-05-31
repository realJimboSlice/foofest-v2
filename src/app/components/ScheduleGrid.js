import React from "react";
import Image from "next/image";
import Link from "next/link";

const ScheduleGrid = ({ schedule }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {Object.entries(schedule).map(([timeSlot, bands], index) => (
        <div key={index} className="border p-4 rounded">
          <div className="font-bold mb-2 text-xl">{timeSlot}</div>
          {bands.map((band, idx) => (
            // console.log(band),
            <div key={idx} className="grid grid-cols-3 mb-8">
              <div className="flex justify-center items-center text-base">
                {band.stage}
              </div>
              <Link
                href={`/bands/${band.slug}`}
                className="flex justify-center items-center"
              >
                <div className="font-bold text-2xl">{band.act}</div>
              </Link>

              {band.logo && (
                <Link href={`/bands/${band.slug}`}>
                  <div className="flex justify-center items-right">
                    <Image
                      src={band.logo}
                      alt={band.act}
                      width={200}
                      height={200}
                      className=""
                    />
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScheduleGrid;
