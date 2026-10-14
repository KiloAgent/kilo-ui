"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "../lib/cn";

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);
const AMBER = "#f5b301";
const CYAN = "#06b6d4";
const INK = "#111214";
const PAPER = "#f7f7f8";
const SURFACE = "#ffffff";
const MUTED = "#2f3339";
const FAINT = "#6b6f76";

export type IsoVec3 = { x: number; y: number; z: number };

export type IsometricStageNode = {
  id: string;
  label: string;
  status: string;
  spec: string;
  latency: string;
};

export type IsometricStageProps = {
  interactive?: boolean;
  height?: number | string;
  showControls?: boolean;
  className?: string;
};

type Pt = { x: number; y: number };
type Box = { x: number; y: number; z: number; w: number; d: number; h: number };
type Cam = { ox: number; oy: number; scale: number; pitch: number; yaw: number };
type NodeDef = IsometricStageNode & { box: Box; accent: string; led: IsoVec3 };
type Rgb = { r: number; g: number; b: number };

const CERAMIC: Rgb = { r: 242, g: 242, b: 245 };
const METAL: Rgb = { r: 186, g: 188, b: 194 };
const CORE: Rgb = { r: 245, g: 179, b: 1 };

const NODES: NodeDef[] = [
  {
    id: "kernel",
    label: "Kernel / LLM",
    status: "READY",
    spec: "isolate · 512MB",
    latency: "12ms",
    accent: AMBER,
    box: { x: 1.55, y: -2.05, z: 0.08, w: 1.05, d: 0.9, h: 0.46 },
    led: { x: 2.08, y: -1.6, z: 0.56 },
  },
  {
    id: "vault",
    label: "Vault / Keys",
    status: "SEALED",
    spec: "HSM · BYOK",
    latency: "3ms",
    accent: AMBER,
    box: { x: -2.85, y: -0.55, z: 0.08, w: 0.95, d: 0.95, h: 0.62 },
    led: { x: -2.38, y: -0.08, z: 0.72 },
  },
  {
    id: "storage",
    label: "Storage / D1",
    status: "SYNC",
    spec: "SQLite · edge",
    latency: "8ms",
    accent: CYAN,
    box: { x: 1.7, y: 1.05, z: 0.08, w: 1.1, d: 0.85, h: 0.4 },
    led: { x: 2.25, y: 1.48, z: 0.5 },
  },
  {
    id: "bus",
    label: "Bus / Queue",
    status: "FLOW",
    spec: "fiber · 40Gb",
    latency: "1.4ms",
    accent: CYAN,
    box: { x: -0.65, y: 1.55, z: 0.08, w: 1.3, d: 0.72, h: 0.3 },
    led: { x: 0, y: 1.91, z: 0.4 },
  },
];

const CHASSIS: Box = { x: -1.2, y: -0.88, z: 0.14, w: 2.4, d: 1.76, h: 1.08 };
const CORE_BOX: Box = { x: -0.38, y: -0.32, z: 0.28, w: 0.76, d: 0.64, h: 0.52 };
const GLASS: Box = { x: -1.05, y: -0.74, z: 1.16, w: 2.1, d: 1.48, h: 0.12 };

const FEET: Box[] = [
  { x: -1.12, y: -0.8, z: 0, w: 0.22, d: 0.22, h: 0.14 },
  { x: 0.9, y: -0.8, z: 0, w: 0.22, d: 0.22, h: 0.14 },
  { x: -1.12, y: 0.66, z: 0, w: 0.22, d: 0.22, h: 0.14 },
  { x: 0.9, y: 0.66, z: 0, w: 0.22, d: 0.22, h: 0.14 },
];

const CONDUITS: { color: string; path: IsoVec3[] }[] = [
  {
    color: AMBER,
    path: [
      { x: 1.2, y: -0.7, z: 0.55 },
      { x: 1.55, y: -1.15, z: 0.72 },
      { x: 1.9, y: -1.55, z: 0.42 },
    ],
  },
  {
    color: AMBER,
    path: [
      { x: -1.2, y: -0.15, z: 0.58 },
      { x: -1.7, y: -0.2, z: 0.78 },
      { x: -2.2, y: -0.12, z: 0.5 },
    ],
  },
  {
    color: CYAN,
    path: [
      { x: 1.2, y: 0.55, z: 0.48 },
      { x: 1.55, y: 0.9, z: 0.7 },
      { x: 1.95, y: 1.25, z: 0.36 },
    ],
  },
  {
    color: CYAN,
    path: [
      { x: 0.05, y: 0.88, z: 0.42 },
      { x: 0.05, y: 1.22, z: 0.62 },
      { x: 0.05, y: 1.55, z: 0.3 },
    ],
  },
];

const BUS: IsoVec3[][] = [
  [
    { x: -0.85, y: -0.55, z: 1.22 },
    { x: 0.85, y: -0.55, z: 1.22 },
    { x: 0.85, y: 0.55, z: 1.22 },
    { x: -0.85, y: 0.55, z: 1.22 },
    { x: -0.85, y: -0.55, z: 1.22 },
  ],
  [
    { x: -0.55, y: 0, z: 1.22 },
    { x: 0.55, y: 0, z: 1.22 },
  ],
  [
    { x: 0, y: -0.4, z: 1.22 },
    { x: 0, y: 0.4, z: 1.22 },
  ],
];

function sub(a: IsoVec3, b: IsoVec3): IsoVec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scale3(a: IsoVec3, s: number): IsoVec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

function len(a: IsoVec3): number {
  return Math.hypot(a.x, a.y, a.z);
}

function norm(a: IsoVec3): IsoVec3 {
  const l = len(a) || 1;
  return scale3(a, 1 / l);
}

function cross(a: IsoVec3, b: IsoVec3): IsoVec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

function dot(a: IsoVec3, b: IsoVec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function lerp3(a: IsoVec3, b: IsoVec3, t: number): IsoVec3 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

function centroid(pts: IsoVec3[]): IsoVec3 {
  const n = pts.length || 1;
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / n,
    y: pts.reduce((s, p) => s + p.y, 0) / n,
    z: pts.reduce((s, p) => s + p.z, 0) / n,
  };
}

function boxCenter(b: Box): IsoVec3 {
  return { x: b.x + b.w / 2, y: b.y + b.d / 2, z: b.z + b.h / 2 };
}

function rotate(p: IsoVec3, pitch: number, yaw: number): IsoVec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy - p.y * sy;
  const y1 = p.x * sy + p.y * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: y1 * cp - p.z * sp, z: y1 * sp + p.z * cp };
}

function project(p: IsoVec3, cam: Cam): Pt {
  const r = rotate(p, cam.pitch, cam.yaw);
  return {
    x: cam.ox + (r.x - r.y) * COS30 * cam.scale,
    y: cam.oy + ((r.x + r.y) * SIN30 - r.z) * cam.scale,
  };
}

function depthOf(p: IsoVec3, cam: Cam): number {
  const r = rotate(p, cam.pitch, cam.yaw);
  return r.x + r.y + r.z * 0.35;
}

function rgbStr(c: Rgb, k = 1, a = 1): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  if (a < 1) return `rgba(${clamp(c.r * k)},${clamp(c.g * k)},${clamp(c.b * k)},${a})`;
  return `rgb(${clamp(c.r * k)},${clamp(c.g * k)},${clamp(c.b * k)})`;
}

function hexRgb(hex: string): Rgb {
  const n = hex.replace("#", "");
  return {
    r: Number.parseInt(n.slice(0, 2), 16),
    g: Number.parseInt(n.slice(2, 4), 16),
    b: Number.parseInt(n.slice(4, 6), 16),
  };
}

function pathPoint(path: IsoVec3[], t: number): IsoVec3 {
  const segs: number[] = [0];
  for (let i = 1; i < path.length; i++) segs.push(segs[i - 1]! + len(sub(path[i]!, path[i - 1]!)));
  const total = segs[segs.length - 1] || 1;
  const d = ((t % 1) + 1) % 1 * total;
  for (let i = 1; i < path.length; i++) {
    if (d <= segs[i]!) {
      const span = segs[i]! - segs[i - 1]! || 1;
      return lerp3(path[i - 1]!, path[i]!, (d - segs[i - 1]!) / span);
    }
  }
  return path[path.length - 1]!;
}

function corners(b: Box): IsoVec3[] {
  const { x, y, z, w, d, h } = b;
  return [
    { x, y, z },
    { x: x + w, y, z },
    { x: x + w, y: y + d, z },
    { x, y: y + d, z },
    { x, y, z: z + h },
    { x: x + w, y, z: z + h },
    { x: x + w, y: y + d, z: z + h },
    { x, y: y + d, z: z + h },
  ];
}

const FACE_IDX: number[][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [3, 2, 6, 7],
  [0, 3, 7, 4],
  [1, 2, 6, 5],
];

function faceFront(pts: Pt[]): boolean {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    const q = pts[(i + 1) % pts.length]!;
    area += p.x * q.y - q.x * p.y;
  }
  return area > 0;
}

function poly(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string, stroke: string, width = 1) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineJoin = "miter";
  ctx.miterLimit = 2.4;
  ctx.lineWidth = width;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function polyline(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.stroke();
}

const LIGHT = norm({ x: -0.42, y: 0.48, z: 0.92 });

function drawBox(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  box: Box,
  base: Rgb,
  opts?: { alpha?: number; edge?: string; glow?: string; inset?: boolean },
) {
  const c = corners(box);
  const alpha = opts?.alpha ?? 1;
  const edge = opts?.edge ?? "rgba(17,18,20,0.42)";
  const faces = FACE_IDX.map((idx) => {
    const world = idx.map((i) => c[i]!);
    const pts = world.map((p) => project(p, cam));
    const n = norm(cross(sub(world[1]!, world[0]!), sub(world[2]!, world[0]!)));
    const rn = rotate(n, cam.pitch, cam.yaw);
    return { world, pts, n: rn, depth: depthOf(centroid(world), cam) };
  })
    .filter((f) => faceFront(f.pts))
    .sort((a, b) => a.depth - b.depth);

  for (const f of faces) {
    const lit = 0.78 + Math.max(0, dot(f.n, LIGHT)) * 0.28 + Math.max(0, f.n.z) * 0.08;
    const fill = rgbStr(base, lit, alpha);
    poly(ctx, f.pts, fill, edge, 1);
    if (opts?.glow) {
      ctx.save();
      ctx.shadowColor = opts.glow;
      ctx.shadowBlur = 18;
      poly(ctx, f.pts, rgbStr(base, lit, Math.min(alpha, 0.35)), "transparent", 0);
      ctx.restore();
    }
  }

  if (opts?.inset) {
    const pad = 0.08;
    const inner: Box = {
      x: box.x + pad,
      y: box.y + pad,
      z: box.z + box.h,
      w: box.w - pad * 2,
      d: box.d - pad * 2,
      h: 0.03,
    };
    const top = [
      { x: box.x, y: box.y, z: box.z + box.h },
      { x: box.x + box.w, y: box.y, z: box.z + box.h },
      { x: box.x + box.w, y: box.y + box.d, z: box.z + box.h },
      { x: box.x, y: box.y + box.d, z: box.z + box.h },
    ];
    const inn = [
      { x: inner.x, y: inner.y, z: inner.z + 0.02 },
      { x: inner.x + inner.w, y: inner.y, z: inner.z + 0.02 },
      { x: inner.x + inner.w, y: inner.y + inner.d, z: inner.z + 0.02 },
      { x: inner.x, y: inner.y + inner.d, z: inner.z + 0.02 },
    ];
    for (let i = 0; i < 4; i++) {
      const ring = [top[i]!, top[(i + 1) % 4]!, inn[(i + 1) % 4]!, inn[i]!];
      const pts = ring.map((p) => project(p, cam));
      if (!faceFront(pts)) continue;
      poly(ctx, pts, "rgba(255,255,255,0.55)", "rgba(17,18,20,0.28)", 1);
    }
    poly(
      ctx,
      inn.map((p) => project(p, cam)),
      "rgba(247,247,248,0.35)",
      "rgba(17,18,20,0.22)",
      1,
    );
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, cam: Cam) {
  const n = 8;
  const step = 0.55;
  for (let i = -n; i <= n; i++) {
    const u = i * step;
    const fade = 1 - (Math.abs(i) / n) ** 2;
    ctx.strokeStyle = `rgba(216,216,220,${0.55 * fade})`;
    ctx.lineWidth = 1;
    polyline(ctx, [project({ x: u, y: -n * step, z: 0 }, cam), project({ x: u, y: n * step, z: 0 }, cam)]);
    polyline(ctx, [project({ x: -n * step, y: u, z: 0 }, cam), project({ x: n * step, y: u, z: 0 }, cam)]);
  }
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const fade = 1 - (Math.max(Math.abs(i), Math.abs(j)) / n) ** 2;
      if (fade < 0.12) continue;
      const p = project({ x: i * step, y: j * step, z: 0 }, cam);
      ctx.fillStyle = `rgba(107,111,118,${0.45 * fade})`;
      ctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4);
    }
  }
}

function drawAo(ctx: CanvasRenderingContext2D, cam: Cam, c: IsoVec3, rx: number, ry: number) {
  const pts: Pt[] = [];
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    pts.push(project({ x: c.x + Math.cos(a) * rx, y: c.y + Math.sin(a) * ry, z: 0.01 }, cam));
  }
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.closePath();
  ctx.fillStyle = "rgba(17,18,20,0.1)";
  ctx.fill();
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  path: IsoVec3[],
  color: string,
  width: number,
  glow = false,
) {
  const pts = path.map((p) => project(p, cam));
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
  }
  polyline(ctx, pts);
  ctx.restore();
}

function drawPulse(ctx: CanvasRenderingContext2D, cam: Cam, path: IsoVec3[], color: string, t: number) {
  const p = project(pathPoint(path, t), cam);
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = SURFACE;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPorts(ctx: CanvasRenderingContext2D, cam: Cam) {
  for (let i = 0; i < 4; i++) {
    const z = 0.38 + i * 0.16;
    const a = { x: 1.2, y: -0.42 + i * 0.08, z };
    const b = { x: 1.2, y: 0.02 + i * 0.08, z };
    drawPath(ctx, cam, [a, b], "rgba(17,18,20,0.55)", 2);
  }
  for (let i = 0; i < 5; i++) {
    const y = -0.55 + i * 0.22;
    drawPath(
      ctx,
      cam,
      [
        { x: -1.2, y, z: 0.34 },
        { x: -1.2, y, z: 1.02 },
      ],
      "rgba(17,18,20,0.18)",
      1,
    );
  }
}

function drawSeal(ctx: CanvasRenderingContext2D, cam: Cam) {
  const strip: IsoVec3[] = [
    { x: -0.42, y: -0.88, z: 1.1 },
    { x: 0.42, y: -0.88, z: 1.1 },
    { x: 0.42, y: -0.88, z: 1.22 },
    { x: -0.42, y: -0.88, z: 1.22 },
  ];
  poly(ctx, strip.map((p) => project(p, cam)), AMBER, "rgba(122,86,0,0.45)", 1);
}

function drawLed(ctx: CanvasRenderingContext2D, cam: Cam, p: IsoVec3, color: string, on: boolean) {
  const s = project(p, cam);
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = on ? 10 : 0;
  ctx.fillStyle = on ? color : FAINT;
  ctx.beginPath();
  ctx.arc(s.x, s.y, on ? 2.4 : 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  t: number,
  hoverId: string | null,
  paused: boolean,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, cam);
  drawAo(ctx, cam, boxCenter(CHASSIS), 1.7, 1.35);
  for (const n of NODES) drawAo(ctx, cam, boxCenter(n.box), 0.7, 0.6);

  for (const c of CONDUITS) {
    drawPath(ctx, cam, c.path, `${c.color}55`, 3.5);
    drawPath(ctx, cam, c.path, c.color, 1.35, true);
  }

  const solids: { depth: number; draw: () => void }[] = [];
  for (const f of FEET) {
    solids.push({
      depth: depthOf(boxCenter(f), cam),
      draw: () => drawBox(ctx, cam, f, METAL),
    });
  }
  solids.push({
    depth: depthOf(boxCenter(CHASSIS), cam),
    draw: () => {
      drawBox(ctx, cam, CHASSIS, CERAMIC, { inset: true });
      drawPorts(ctx, cam);
      drawSeal(ctx, cam);
    },
  });
  solids.push({
    depth: depthOf(boxCenter(CORE_BOX), cam) + 0.2,
    draw: () => drawBox(ctx, cam, CORE_BOX, CORE, { alpha: 0.42, glow: AMBER, edge: "rgba(245,179,1,0.55)" }),
  });
  for (const node of NODES) {
    const hot = hoverId === node.id;
    solids.push({
      depth: depthOf(boxCenter(node.box), cam),
      draw: () => {
        drawBox(ctx, cam, node.box, hot ? hexRgb(node.accent) : CERAMIC, {
          alpha: hot ? 0.22 : 1,
          edge: hot ? node.accent : "rgba(17,18,20,0.45)",
          glow: hot ? node.accent : undefined,
        });
        if (hot) drawBox(ctx, cam, node.box, CERAMIC, { alpha: 0.82, edge: node.accent });
        const lid: Box = {
          x: node.box.x + 0.08,
          y: node.box.y + 0.08,
          z: node.box.z + node.box.h,
          w: node.box.w - 0.16,
          d: node.box.d - 0.16,
          h: 0.04,
        };
        drawBox(ctx, cam, lid, { r: 255, g: 255, b: 255 }, { alpha: 0.55, edge: "rgba(17,18,20,0.25)" });
      },
    });
  }
  solids.sort((a, b) => a.depth - b.depth);
  for (const s of solids) s.draw();

  drawBox(ctx, cam, GLASS, { r: 255, g: 255, b: 255 }, { alpha: 0.28, edge: "rgba(17,18,20,0.28)" });

  for (const trace of BUS) {
    drawPath(ctx, cam, trace, "rgba(6,182,212,0.55)", 1.15, true);
    if (!paused) drawPulse(ctx, cam, trace, CYAN, t * 0.22 + 0.35);
  }
  CONDUITS.forEach((c, i) => {
    if (!paused) drawPulse(ctx, cam, c.path, c.color, t * 0.18 + i * 0.22);
    else drawPulse(ctx, cam, c.path, c.color, 0.35 + i * 0.18);
  });

  NODES.forEach((node, i) => {
    const blink = paused ? true : Math.sin(t * 4 + i * 1.7) > -0.2;
    drawLed(ctx, cam, node.led, node.accent, hoverId === node.id || blink);
    const c = boxCenter(node.box);
    const p = project({ ...c, z: node.box.z + node.box.h + 0.18 }, cam);
    ctx.font = "500 9px 'Geist Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = hoverId === node.id ? INK : MUTED;
    ctx.fillText(node.label.toUpperCase(), p.x, p.y);
  });
}

function cssHeight(height: number | string): string {
  return typeof height === "number" ? `${height}px` : height;
}

function IsometricStage({
  interactive = true,
  height = 420,
  showControls = true,
  className,
}: IsometricStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const hoverIdRef = useRef<string | null>(null);
  const pausedRef = useRef(false);
  const tiltRef = useRef({ pitch: 0, yaw: 0, tx: 0, ty: 0, dragging: false });
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const simRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState<IsometricStageNode | null>(null);

  const reset = useCallback(() => {
    tiltRef.current = { pitch: 0, yaw: 0, tx: 0, ty: 0, dragging: false };
    pointerRef.current = { x: 0.5, y: 0.5 };
    simRef.current = 0;
    hoverIdRef.current = null;
    setHover(null);
  }, []);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && !pausedRef.current) {
      pausedRef.current = true;
      setPaused(true);
    }

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const size = { current: fit() };
    const ro = new ResizeObserver(() => {
      size.current = fit();
    });
    ro.observe(wrap);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) simRef.current += dt;

      const { w, h } = size.current;
      const tlt = tiltRef.current;
      if (interactive) {
        const range = tlt.dragging ? 0.42 : 0.26;
        tlt.tx = (pointerRef.current.x - 0.5) * 2 * range;
        tlt.ty = (pointerRef.current.y - 0.5) * 2 * (range * 0.65);
      } else {
        tlt.tx = 0;
        tlt.ty = 0;
      }
      const idle = pausedRef.current || !interactive ? 0 : Math.sin(simRef.current * 0.45) * 0.025;
      tlt.yaw += (tlt.tx + idle - tlt.yaw) * 0.1;
      tlt.pitch += (tlt.ty - tlt.pitch) * 0.1;

      const cam: Cam = {
        ox: w / 2,
        oy: h * 0.58,
        scale: Math.min(w, h) * 0.094,
        pitch: tlt.pitch,
        yaw: tlt.yaw,
      };

      let nearest: NodeDef | null = null;
      let best = 28;
      const local = {
        x: pointerRef.current.x * w,
        y: pointerRef.current.y * h,
      };
      if (interactive) {
        for (const node of NODES) {
          const p = project(boxCenter(node.box), cam);
          const dist = Math.hypot(p.x - local.x, p.y - local.y);
          if (dist < best) {
            best = dist;
            nearest = node;
          }
        }
      }
      const nextId = nearest?.id ?? null;
      if (nextId !== hoverIdRef.current) {
        hoverIdRef.current = nextId;
        setHover(nearest ? { id: nearest.id, label: nearest.label, status: nearest.status, spec: nearest.spec, latency: nearest.latency } : null);
      }
      const hud = hudRef.current;
      if (nearest && hud) {
        const p = project({ ...boxCenter(nearest.box), z: nearest.box.z + nearest.box.h + 0.35 }, cam);
        hud.style.left = `${Math.min(Math.max(12, p.x + 14), w - 196)}px`;
        hud.style.top = `${Math.min(Math.max(12, p.y - 64), h - 96)}px`;
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.clip();
      drawScene(ctx, cam, simRef.current, hoverIdRef.current, pausedRef.current);
      ctx.restore();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [interactive]);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  return (
    <div
      ref={wrapRef}
      data-slot="isometric-stage"
      className={cn(
        "relative isolate overflow-hidden rounded-ka-card border border-ka-line bg-ka-bg select-none",
        interactive && "touch-none",
        className,
      )}
      style={{ height: cssHeight(height) }}
      onPointerMove={onPointerMove}
      onPointerDown={(e) => {
        if (!interactive) return;
        tiltRef.current.dragging = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={() => {
        tiltRef.current.dragging = false;
      }}
      onPointerLeave={() => {
        tiltRef.current.dragging = false;
        if (!interactive) return;
        pointerRef.current = { x: 0.5, y: 0.5 };
        hoverIdRef.current = null;
        setHover(null);
      }}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePause();
        }
        if (e.key === "Escape") reset();
      }}
      tabIndex={interactive ? 0 : undefined}
      role="img"
      aria-label="Interactive isometric MicroVM chassis with inspectable Kernel, Vault, Storage, and Bus modules"
    >
      <canvas ref={canvasRef} className="block size-full" aria-hidden />
      {hover ? (
        <div
          ref={hudRef}
          data-slot="isometric-stage-hud"
          className="pointer-events-none absolute top-3 left-3 z-10 min-w-[11.5rem] rounded-ka-card border border-ka-line bg-ka-surface px-2.5 py-2 shadow-ka-raised"
        >
          <div className="font-mono text-[10px] font-medium tracking-wider text-ka-ink uppercase">
            {hover.label}
          </div>
          <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[10px] tabular-nums">
            <span className="tracking-wider text-ka-faint uppercase">Status</span>
            <span className="text-ka-ink">{hover.status}</span>
            <span className="tracking-wider text-ka-faint uppercase">p95</span>
            <span className="text-ka-ink">{hover.latency}</span>
            <span className="tracking-wider text-ka-faint uppercase">Spec</span>
            <span className="text-ka-muted">{hover.spec}</span>
          </div>
        </div>
      ) : null}
      {showControls ? (
        <div
          data-slot="isometric-stage-controls"
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 overflow-hidden rounded-ka-pill border border-ka-line bg-ka-surface"
        >
          <button
            type="button"
            className="h-7 px-2.5 font-mono text-[10px] tracking-wider text-ka-ink uppercase hover:bg-ka-subtle"
            aria-pressed={paused}
            onClick={togglePause}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            className="h-7 border-l border-ka-line px-2.5 font-mono text-[10px] tracking-wider text-ka-ink uppercase hover:bg-ka-subtle"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { IsometricStage };
