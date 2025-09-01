"use client";
//Here we will render chart component and button to open settings.

import Chart from "@/components/Chart";
import BollingerSettings from "@/components/BollingerSettings";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  //state to control whether the settings dialog is open
  const [open, setOpen] = useState(false); //closed by default

  const [bbOptions, setBbOptions] = useState({
    length: 20,
    maType: "SMA", // Only SMA supported but exposed for UI
    source: "close",
    multiplier: 2,
    offset: 0,
    style: {
      basis: { visible: true, color: "#ffffff", width: 2, dashed: false },
      upper: { visible: true, color: "#22c55e", width: 2, dashed: false },
      lower: { visible: true, color: "#ef4444", width: 2, dashed: false },
      background: { visible: true, opacity: 0.1 },
    },
  });

  return (
    <main className="p-4">
      {/* Chart wrapper */}
      <Chart bbOptions={bbOptions} />

      {/* Button to open Settings Dialog */}
      <div className="mt-4">
        <Button onClick={() => setOpen(true)}>Open Bollinger Settings</Button>
      </div>

      {/* Settings Dialog */}
      <BollingerSettings
        open={open}
        onOpenChange={setOpen}
        bbOptions={bbOptions}
        setBbOptions={setBbOptions}
      />
    </main>
  );
}
