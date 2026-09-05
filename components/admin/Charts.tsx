"use client";
import { useEffect, useRef } from "react";

export default function BarChart({ data, color = "#1A56A0", h = 220, money = false }: {
  data: { label: string; value: number }[]; color?: string; h?: number; money?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 500, hh = h;
    cv.width = w * dpr; cv.height = hh * dpr;
    const x = cv.getContext("2d")!; x.scale(dpr, dpr); x.clearRect(0, 0, w, hh);
    const pad = { l: 8, r: 8, t: 20, b: 26 }, iw = w - pad.l - pad.r, ih = hh - pad.t - pad.b;
    const max = Math.max(...data.map((d) => d.value), 1), n = data.length;
    const bw = Math.min(52, (iw / n) * 0.6);
    x.font = '11px "Plus Jakarta Sans"'; x.textAlign = "center";
    data.forEach((d, i) => {
      const cx = pad.l + (iw * (i + 0.5)) / n, bh = Math.max(2, (ih * d.value) / max), y = pad.t + ih - bh;
      x.fillStyle = color; x.beginPath();
      if (x.roundRect) x.roundRect(cx - bw / 2, y, bw, bh, 6); else x.rect(cx - bw / 2, y, bw, bh);
      x.fill();
      x.fillStyle = "#5B6B7E"; x.fillText(d.label, cx, hh - 8);
      if (d.value > 0) { x.fillStyle = "#13233A"; x.fillText(String(d.value), cx, y - 6); }
    });
  }, [data, color, h]);
  return <canvas ref={ref} style={{ width: "100%", height: h }} aria-label="Grafik batang" />;
}