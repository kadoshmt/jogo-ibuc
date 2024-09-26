"use client";
import React from "react";
import ChartOne from "@/components/Charts/ChartOne";
import TableOne from "@/components/Tables/TableOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";

const ECommerce: React.FC = () => {
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
