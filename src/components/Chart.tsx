// components/Chart.tsx
// ----------------------------------------------------------
// Chart component wraps KLineCharts setup.
// - Initializes chart once on mount.
// - Loads candlestick data from public/ohlcv.json.
// - Draws candlestick series and Bollinger Bands overlay.
// - Updates when settings change (including style options).
// - Tooltip / crosshair shows Basis, Upper, Lower values.
// ----------------------------------------------------------

"use client";
import { useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";
import { computeBollingerBands } from "../lib/indicators/bollinger";

export default function Chart({ bbOptions }: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const bandsCache = useRef<any[]>([]);

  // Helper to apply bands and style
  const applyBands = async () => {
    if (!chartInstance.current) return;
    const res = await fetch("/data/ohlcv.json");
    const data = await res.json();

    // Compute bands
    const bands = computeBollingerBands(data, bbOptions);
    bandsCache.current = bands;

    // Remove any existing overlays (so style updates correctly)
    chartInstance.current.removeIndicator("custom-bollinger");

    // Create Bollinger Bands overlay indicator
    chartInstance.current.createIndicator(
      {
        name: "custom-bollinger",
        shortName: "BB",
        calc: () => bands,
        // Drawing logic
        draw: ({ ctx, indicator, visibleRange }) => {
          const { basis, upper, lower } = indicator.result;
          const { from, to } = visibleRange;

          // Line style helper
          const drawLine = (
            values: any[],
            color: string,
            width: number,
            dashed: boolean
          ) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            if (dashed) ctx.setLineDash([4, 2]);
            else ctx.setLineDash([]);
            ctx.beginPath();
            for (let i = from; i < to; i++) {
              const x = indicator.xAxis.convertToPixel(i);
              const y = indicator.yAxis.convertToPixel(values[i]);
              if (i === from) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          };

          if (bbOptions.style.basis.visible) {
            drawLine(
              basis,
              bbOptions.style.basis.color,
              bbOptions.style.basis.width,
              bbOptions.style.basis.dashed
            );
          }

          if (bbOptions.style.upper.visible) {
            drawLine(
              upper,
              bbOptions.style.upper.color,
              bbOptions.style.upper.width,
              bbOptions.style.upper.dashed
            );
          }

          if (bbOptions.style.lower.visible) {
            drawLine(
              lower,
              bbOptions.style.lower.color,
              bbOptions.style.lower.width,
              bbOptions.style.lower.dashed
            );
          }

          if (bbOptions.style.background.visible) {
            ctx.fillStyle = bbOptions.style.upper.color;
            ctx.globalAlpha = bbOptions.style.background.opacity;
            ctx.beginPath();
            for (let i = from; i < to; i++) {
              const x = indicator.xAxis.convertToPixel(i);
              const y = indicator.yAxis.convertToPixel(upper[i]);
              if (i === from) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            for (let i = to - 1; i >= from; i--) {
              const x = indicator.xAxis.convertToPixel(i);
              const y = indicator.yAxis.convertToPixel(lower[i]);
              ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        },
      },
      false,
      { id: "candle_pane" }
    );
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = init(chartRef.current);
      fetch("/data/ohlcv.json")
        .then((res) => res.json())
        .then((data) => {
          chartInstance.current.applyNewData(data);
          applyBands();

          const tooltip = document.createElement("div");
          tooltip.id = "bb-tooltip";
          tooltip.style.position = "absolute";
          tooltip.style.pointerEvents = "none";
          tooltip.style.background = "rgba(0,0,0,0.8)";
          tooltip.style.color = "white";
          tooltip.style.padding = "4px 8px";
          tooltip.style.borderRadius = "4px";
          tooltip.style.fontSize = "12px";
          tooltip.style.display = "none";
          tooltip.style.zIndex = "50";
          chartRef.current?.appendChild(tooltip);

          chartInstance.current.subscribeAction("crosshair", (params: any) => {
            const { dataIndex, x, y } = params;
            const band = bandsCache.current[dataIndex];
            if (!band) return;

            tooltip.innerText = `Basis: ${
              band.basis?.toFixed(2) ?? "-"
            } | Upper: ${band.upper?.toFixed(2) ?? "-"} | Lower: ${
              band.lower?.toFixed(2) ?? "-"
            }`;
            tooltip.style.left = `${x + 10}px`;
            tooltip.style.top = `${y - 20}px`;
            tooltip.style.display = "block";
          });

          chartInstance.current.subscribeAction("crosshair-hide", () => {
            tooltip.style.display = "none";
          });
        });
    }
    return () => {
      if (chartInstance.current) dispose(chartInstance.current);
    };
  }, []);

  useEffect(() => {
    applyBands();
  }, [bbOptions]);

  return <div ref={chartRef} className="relative h-[500px] w-full bg-black" />;
}
