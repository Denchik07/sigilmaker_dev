"use client";
import { useEffect, useRef, useState } from "react";

export default function SigilGenerator() {
  const [text, setText] = useState("protection");
  const [circleSize, setCircleSize] = useState(160);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [pointRadius, setPointRadius] = useState(6);
  const [previewSize, setPreviewSize] = useState(420);
  const [exportSize, setExportSize] = useState(500);
  const [lineColor, setLineColor] = useState("#ff3b3b");
  const [circleColor, setCircleColor] = useState("#7f0f0f");
  const [bgColor, setBgColor] = useState("#000000");
  const [glow, setGlow] = useState(true);
  const [animateEnabled, setAnimateEnabled] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [visiblePointsCount, setVisiblePointsCount] = useState(0);
  const [lineDrawProgress, setLineDrawProgress] = useState(0);
  const [showInnerCircle, setShowInnerCircle] = useState(true);

  const svgRef = useRef(null);
  const pathRef = useRef(null);

  function normalize(s) {
    if (!s) return "";
    s = s.toLowerCase().trim();
    const filtered = Array.from(s).filter(ch => ch.match(/[a-z0-9]/i));
    const seen = new Set();
    const out = [];
    for (const ch of filtered) {
      if (!seen.has(ch)) {
        seen.add(ch);
        out.push(ch);
      }
    }
    return out.join("");
  }

  function charIndex(ch) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    const i = alphabet.indexOf(ch);
    if (i >= 0) return i;
    return ch.charCodeAt(0) % alphabet.length;
  }

  function generatePoints(s, cx, cy, r) {
    const normalized = normalize(s);
    if (!normalized) return [];
    const alphabetLength = 36;
    const pts = [];
    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized[i];
      const base = charIndex(ch);
      const angleFrac = ((base + i * 7) % alphabetLength) / alphabetLength;
      const angle = angleFrac * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      pts.push({ x, y });
    }
    return pts;
  }

  function pathFromPoints(pts) {
    if (!pts || pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  }

  const cx = previewSize / 2;
  const cy = previewSize / 2;
  const r = Math.min(circleSize, previewSize / 2 - 10);
  const pts = generatePoints(text, cx, cy, r);
  const d = pathFromPoints(pts);

  useEffect(() => {
    setVisiblePointsCount(0);
    setLineDrawProgress(0);
    setAnimating(false);
  }, [text, circleSize, strokeWidth, pointRadius, previewSize, lineColor, circleColor, bgColor, showInnerCircle]);

  function startGenerate() {
    if (!pts || pts.length === 0) return;
    setAnimating(true);
    setVisiblePointsCount(0);
    setLineDrawProgress(0);

    if (!animateEnabled) {
      setVisiblePointsCount(pts.length);
      setLineDrawProgress(1);
      setTimeout(() => setAnimating(false), 50);
      return;
    }

    const pointInterval = 120;
    pts.forEach((_, i) => {
      setTimeout(() => {
        setVisiblePointsCount((prev) => Math.min(pts.length, prev + 1));
      }, i * pointInterval);
    });

    const totalPointTime = pts.length * pointInterval;
    const lineAnimTime = Math.max(500, pts.length * 120);

    setTimeout(() => {
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / lineAnimTime);
        setLineDrawProgress(t);
        if (t < 1) requestAnimationFrame(step);
        else setAnimating(false);
      }
      requestAnimationFrame(step);
    }, totalPointTime + 80);
  }

  useEffect(() => {
    if (!pathRef.current) return;
    const pathEl = pathRef.current;
    try {
      const len = pathEl.getTotalLength();
      const offset = (1 - lineDrawProgress) * len;
      pathEl.style.strokeDasharray = `${len}`;
      pathEl.style.strokeDashoffset = `${offset}`;
      pathEl.style.transition = animating ? "stroke-dashoffset 120ms linear" : "";
    } catch (e) {}
  }, [lineDrawProgress, animating, d]);

  useEffect(() => {
    if (visiblePointsCount > pts.length) setVisiblePointsCount(pts.length);
  }, [pts.length, visiblePointsCount]);

  return (
    <div className="w-full grid gap-6">
      <div className="mx-auto max-w-3xl bg-[#0b0b0b] p-4 rounded-2xl border border-red-900/40 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <label className="text-sm text-gray-300">Текст (исходный)</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded bg-black border border-red-700 text-gray-200"
              placeholder="Например: protection"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-300">Размер круга</label>
                <input
                  type="range"
                  min="40"
                  max={Math.floor(previewSize / 2 - 10)}
                  value={circleSize}
                  onChange={(e) => setCircleSize(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="text-xs text-gray-400">{circleSize}px</div>
              </div>
              <div>
                <label className="text-sm text-gray-300">Толщина линий</label>
                <input
                  type="range"
                  min="1"
                  max="18"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="text-xs text-gray-400">{strokeWidth}px</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-300">Радиус точек</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={pointRadius}
                  onChange={(e) => setPointRadius(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="text-xs text-gray-400">{pointRadius}px</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Внутренний круг</label>
                <input
                  type="checkbox"
                  checked={showInnerCircle}
                  onChange={(e) => setShowInnerCircle(e.target.checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-300">Цвет линий</label>
                <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-full h-8 p-0 border-0" />
              </div>
              <div>
                <label className="text-sm text-gray-300">Цвет круга</label>
                <input type="color" value={circleColor} onChange={(e) => setCircleColor(e.target.value)} className="w-full h-8 p-0 border-0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-300">Фон (для PNG)</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 p-0 border-0" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Свечение</label>
                <input type="checkbox" checked={glow} onChange={(e) => setGlow(e.target.checked)} />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => startGenerate()}
                disabled={animating}
                className={`px-4 py-2 rounded bg-red-700 hover:bg-red-600 font-semibold ${animating ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {animating ? "Рисуется..." : "Создать сигил"}
              </button>
            </div>
          </div>

          <div className="w-[440px] flex-shrink-0 flex flex-col items-center gap-3">
            <div className="text-sm text-gray-300">Preview (не сохраняемый размер)</div>
            <div className="bg-transparent p-2 rounded">
              <svg ref={svgRef} width={previewSize} height={previewSize} viewBox={`0 0 ${previewSize} ${previewSize}`} xmlns="http://www.w3.org/2000/svg" className="rounded-lg shadow-inner">
                <rect width="100%" height="100%" fill={bgColor} rx="8" />

                {glow && (
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation={strokeWidth * 1.2} result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                )}

                <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={circleColor} strokeWidth={Math.max(1, strokeWidth)} opacity="0.95" style={glow ? { filter: "url(#glow)" } : {}} />

                {showInnerCircle && (
                  <circle cx={cx} cy={cy} r={Math.max(8, r - 8)} fill="none" stroke={circleColor} strokeWidth={Math.max(1, Math.round(strokeWidth / 2))} opacity="0.55" style={glow ? { filter: "url(#glow)" } : {}} />
                )}

                {d && (
                  <path
                    ref={pathRef}
                    d={d}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={Math.max(1, strokeWidth)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: animating ? "none" : "stroke-dashoffset 120ms linear",
                      filter: glow ? "url(#glow)" : undefined,
                    }}
                  />
                )}

                {pts.map((p, i) => {
                  const visible = i < visiblePointsCount;
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={pointRadius}
                      fill="none"
                      stroke={lineColor}
                      strokeWidth={Math.max(1, Math.round(strokeWidth))}
                      style={{
                        opacity: visible ? 1 : 0,
                        transition: "opacity 120ms linear",
                        filter: glow ? "url(#glow)" : undefined,
                      }}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="text-xs text-gray-400 text-center">Preview — фиксированный размер для интерфейса</div>
          </div>
        </div>
      </div>
    </div>
  );
}
