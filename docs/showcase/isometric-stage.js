/* Static showcase port of IsometricStage (Canvas 2D, 30° isometric). */
(() => {
  const canvas = document.getElementById("iso-canvas");
  const wrap = document.getElementById("iso-stage");
  const hud = document.getElementById("iso-hud");
  const pauseBtn = document.getElementById("iso-pause");
  const resetBtn = document.getElementById("iso-reset");
  if (!canvas || !wrap || !hud || !pauseBtn || !resetBtn) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = Math.sin(Math.PI / 6);
  const AMBER = "#f5b301";
  const CYAN = "#06b6d4";
  const INK = "#111214";
  const PAPER = "#f7f7f8";
  const SURFACE = "#ffffff";
  const MUTED = "#2f3339";
  const FAINT = "#6b6f76";
  const CERAMIC = { r: 242, g: 242, b: 245 };
  const METAL = { r: 186, g: 188, b: 194 };
  const CORE = { r: 245, g: 179, b: 1 };
  const LIGHT = norm({ x: -0.42, y: 0.48, z: 0.92 });

  const NODES = [
    { id: "kernel", label: "Kernel / LLM", status: "READY", spec: "isolate · 512MB", latency: "12ms", accent: AMBER, box: { x: 1.55, y: -2.05, z: 0.08, w: 1.05, d: 0.9, h: 0.46 }, led: { x: 2.08, y: -1.6, z: 0.56 } },
    { id: "vault", label: "Vault / Keys", status: "SEALED", spec: "HSM · BYOK", latency: "3ms", accent: AMBER, box: { x: -2.85, y: -0.55, z: 0.08, w: 0.95, d: 0.95, h: 0.62 }, led: { x: -2.38, y: -0.08, z: 0.72 } },
    { id: "storage", label: "Storage / D1", status: "SYNC", spec: "SQLite · edge", latency: "8ms", accent: CYAN, box: { x: 1.7, y: 1.05, z: 0.08, w: 1.1, d: 0.85, h: 0.4 }, led: { x: 2.25, y: 1.48, z: 0.5 } },
    { id: "bus", label: "Bus / Queue", status: "FLOW", spec: "fiber · 40Gb", latency: "1.4ms", accent: CYAN, box: { x: -0.65, y: 1.55, z: 0.08, w: 1.3, d: 0.72, h: 0.3 }, led: { x: 0, y: 1.91, z: 0.4 } },
  ];
  const CHASSIS = { x: -1.2, y: -0.88, z: 0.14, w: 2.4, d: 1.76, h: 1.08 };
  const CORE_BOX = { x: -0.38, y: -0.32, z: 0.28, w: 0.76, d: 0.64, h: 0.52 };
  const GLASS = { x: -1.05, y: -0.74, z: 1.16, w: 2.1, d: 1.48, h: 0.12 };
  const FEET = [
    { x: -1.12, y: -0.8, z: 0, w: 0.22, d: 0.22, h: 0.14 },
    { x: 0.9, y: -0.8, z: 0, w: 0.22, d: 0.22, h: 0.14 },
    { x: -1.12, y: 0.66, z: 0, w: 0.22, d: 0.22, h: 0.14 },
    { x: 0.9, y: 0.66, z: 0, w: 0.22, d: 0.22, h: 0.14 },
  ];
  const CONDUITS = [
    { color: AMBER, path: [{ x: 1.2, y: -0.7, z: 0.55 }, { x: 1.55, y: -1.15, z: 0.72 }, { x: 1.9, y: -1.55, z: 0.42 }] },
    { color: AMBER, path: [{ x: -1.2, y: -0.15, z: 0.58 }, { x: -1.7, y: -0.2, z: 0.78 }, { x: -2.2, y: -0.12, z: 0.5 }] },
    { color: CYAN, path: [{ x: 1.2, y: 0.55, z: 0.48 }, { x: 1.55, y: 0.9, z: 0.7 }, { x: 1.95, y: 1.25, z: 0.36 }] },
    { color: CYAN, path: [{ x: 0.05, y: 0.88, z: 0.42 }, { x: 0.05, y: 1.22, z: 0.62 }, { x: 0.05, y: 1.55, z: 0.3 }] },
  ];
  const BUS = [
    [{ x: -0.85, y: -0.55, z: 1.22 }, { x: 0.85, y: -0.55, z: 1.22 }, { x: 0.85, y: 0.55, z: 1.22 }, { x: -0.85, y: 0.55, z: 1.22 }, { x: -0.85, y: -0.55, z: 1.22 }],
    [{ x: -0.55, y: 0, z: 1.22 }, { x: 0.55, y: 0, z: 1.22 }],
    [{ x: 0, y: -0.4, z: 1.22 }, { x: 0, y: 0.4, z: 1.22 }],
  ];
  const FACE_IDX = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]];

  const state = {
    paused: matchMedia("(prefers-reduced-motion: reduce)").matches,
    sim: 0,
    pointer: { x: 0.5, y: 0.5 },
    tilt: { pitch: 0, yaw: 0, tx: 0, ty: 0, dragging: false },
    hoverId: null,
    size: { w: 1, h: 1 },
  };

  function sub(a, b) { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }
  function scale3(a, s) { return { x: a.x * s, y: a.y * s, z: a.z * s }; }
  function len(a) { return Math.hypot(a.x, a.y, a.z); }
  function norm(a) { const l = len(a) || 1; return scale3(a, 1 / l); }
  function cross(a, b) { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }; }
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function lerp3(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t }; }
  function centroid(pts) {
    const n = pts.length || 1;
    return { x: pts.reduce((s, p) => s + p.x, 0) / n, y: pts.reduce((s, p) => s + p.y, 0) / n, z: pts.reduce((s, p) => s + p.z, 0) / n };
  }
  function boxCenter(b) { return { x: b.x + b.w / 2, y: b.y + b.d / 2, z: b.z + b.h / 2 }; }
  function rotate(p, pitch, yaw) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const x1 = p.x * cy - p.y * sy;
    const y1 = p.x * sy + p.y * cy;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return { x: x1, y: y1 * cp - p.z * sp, z: y1 * sp + p.z * cp };
  }
  function project(p, cam) {
    const r = rotate(p, cam.pitch, cam.yaw);
    return { x: cam.ox + (r.x - r.y) * COS30 * cam.scale, y: cam.oy + ((r.x + r.y) * SIN30 - r.z) * cam.scale };
  }
  function depthOf(p, cam) { const r = rotate(p, cam.pitch, cam.yaw); return r.x + r.y + r.z * 0.35; }
  function rgbStr(c, k = 1, a = 1) {
    const cl = (n) => Math.max(0, Math.min(255, Math.round(n)));
    return a < 1 ? `rgba(${cl(c.r * k)},${cl(c.g * k)},${cl(c.b * k)},${a})` : `rgb(${cl(c.r * k)},${cl(c.g * k)},${cl(c.b * k)})`;
  }
  function hexRgb(hex) {
    const n = hex.replace("#", "");
    return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) };
  }
  function pathPoint(path, t) {
    const segs = [0];
    for (let i = 1; i < path.length; i++) segs.push(segs[i - 1] + len(sub(path[i], path[i - 1])));
    const total = segs[segs.length - 1] || 1;
    const d = (((t % 1) + 1) % 1) * total;
    for (let i = 1; i < path.length; i++) {
      if (d <= segs[i]) {
        const span = segs[i] - segs[i - 1] || 1;
        return lerp3(path[i - 1], path[i], (d - segs[i - 1]) / span);
      }
    }
    return path[path.length - 1];
  }
  function corners(b) {
    const { x, y, z, w, d, h } = b;
    return [
      { x, y, z }, { x: x + w, y, z }, { x: x + w, y: y + d, z }, { x, y: y + d, z },
      { x, y, z: z + h }, { x: x + w, y, z: z + h }, { x: x + w, y: y + d, z: z + h }, { x, y: y + d, z: z + h },
    ];
  }
  function faceFront(pts) {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      area += p.x * q.y - q.x * p.y;
    }
    return area > 0;
  }
  function poly(pts, fill, stroke, width = 1) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2.4;
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  function polyline(pts) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
  function drawBox(cam, box, base, opts = {}) {
    const c = corners(box);
    const alpha = opts.alpha ?? 1;
    const edge = opts.edge ?? "rgba(17,18,20,0.42)";
    const faces = FACE_IDX.map((idx) => {
      const world = idx.map((i) => c[i]);
      const pts = world.map((p) => project(p, cam));
      const n = norm(cross(sub(world[1], world[0]), sub(world[2], world[0])));
      return { world, pts, n: rotate(n, cam.pitch, cam.yaw), depth: depthOf(centroid(world), cam) };
    }).filter((f) => faceFront(f.pts)).sort((a, b) => a.depth - b.depth);
    for (const f of faces) {
      const lit = 0.78 + Math.max(0, dot(f.n, LIGHT)) * 0.28 + Math.max(0, f.n.z) * 0.08;
      poly(f.pts, rgbStr(base, lit, alpha), edge, 1);
      if (opts.glow) {
        ctx.save();
        ctx.shadowColor = opts.glow;
        ctx.shadowBlur = 18;
        poly(f.pts, rgbStr(base, lit, Math.min(alpha, 0.35)), "transparent", 0);
        ctx.restore();
      }
    }
    if (opts.inset) {
      const pad = 0.08;
      const top = [
        { x: box.x, y: box.y, z: box.z + box.h }, { x: box.x + box.w, y: box.y, z: box.z + box.h },
        { x: box.x + box.w, y: box.y + box.d, z: box.z + box.h }, { x: box.x, y: box.y + box.d, z: box.z + box.h },
      ];
      const inn = [
        { x: box.x + pad, y: box.y + pad, z: box.z + box.h + 0.02 }, { x: box.x + box.w - pad, y: box.y + pad, z: box.z + box.h + 0.02 },
        { x: box.x + box.w - pad, y: box.y + box.d - pad, z: box.z + box.h + 0.02 }, { x: box.x + pad, y: box.y + box.d - pad, z: box.z + box.h + 0.02 },
      ];
      for (let i = 0; i < 4; i++) {
        const ring = [top[i], top[(i + 1) % 4], inn[(i + 1) % 4], inn[i]].map((p) => project(p, cam));
        if (faceFront(ring)) poly(ring, "rgba(255,255,255,0.55)", "rgba(17,18,20,0.28)", 1);
      }
      poly(inn.map((p) => project(p, cam)), "rgba(247,247,248,0.35)", "rgba(17,18,20,0.22)", 1);
    }
  }
  function drawGrid(cam) {
    const n = 8, step = 0.55;
    for (let i = -n; i <= n; i++) {
      const u = i * step, fade = 1 - (Math.abs(i) / n) ** 2;
      ctx.strokeStyle = `rgba(216,216,220,${0.55 * fade})`;
      ctx.lineWidth = 1;
      polyline([project({ x: u, y: -n * step, z: 0 }, cam), project({ x: u, y: n * step, z: 0 }, cam)]);
      polyline([project({ x: -n * step, y: u, z: 0 }, cam), project({ x: n * step, y: u, z: 0 }, cam)]);
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
  function drawAo(cam, c, rx, ry) {
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      pts.push(project({ x: c.x + Math.cos(a) * rx, y: c.y + Math.sin(a) * ry, z: 0.01 }, cam));
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = "rgba(17,18,20,0.1)";
    ctx.fill();
  }
  function drawPath(cam, path, color, width, glow) {
    const pts = path.map((p) => project(p, cam));
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 14; }
    polyline(pts);
    ctx.restore();
  }
  function drawPulse(cam, path, color, t) {
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
  function drawPorts(cam) {
    for (let i = 0; i < 4; i++) {
      const z = 0.38 + i * 0.16;
      drawPath(cam, [{ x: 1.2, y: -0.42 + i * 0.08, z }, { x: 1.2, y: 0.02 + i * 0.08, z }], "rgba(17,18,20,0.55)", 2);
    }
    for (let i = 0; i < 5; i++) {
      const y = -0.55 + i * 0.22;
      drawPath(cam, [{ x: -1.2, y, z: 0.34 }, { x: -1.2, y, z: 1.02 }], "rgba(17,18,20,0.18)", 1);
    }
  }
  function drawSeal(cam) {
    poly(
      [{ x: -0.42, y: -0.88, z: 1.1 }, { x: 0.42, y: -0.88, z: 1.1 }, { x: 0.42, y: -0.88, z: 1.22 }, { x: -0.42, y: -0.88, z: 1.22 }].map((p) => project(p, cam)),
      AMBER,
      "rgba(122,86,0,0.45)",
      1,
    );
  }
  function drawLed(cam, p, color, on) {
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
  function drawScene(cam, t, hoverId, paused) {
    const { w, h } = state.size;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    drawGrid(cam);
    drawAo(cam, boxCenter(CHASSIS), 1.7, 1.35);
    for (const n of NODES) drawAo(cam, boxCenter(n.box), 0.7, 0.6);
    for (const c of CONDUITS) {
      drawPath(cam, c.path, `${c.color}55`, 3.5);
      drawPath(cam, c.path, c.color, 1.35, true);
    }
    const solids = FEET.map((f) => ({ depth: depthOf(boxCenter(f), cam), draw: () => drawBox(cam, f, METAL) }));
    solids.push({
      depth: depthOf(boxCenter(CHASSIS), cam),
      draw: () => { drawBox(cam, CHASSIS, CERAMIC, { inset: true }); drawPorts(cam); drawSeal(cam); },
    });
    solids.push({
      depth: depthOf(boxCenter(CORE_BOX), cam) + 0.2,
      draw: () => drawBox(cam, CORE_BOX, CORE, { alpha: 0.42, glow: AMBER, edge: "rgba(245,179,1,0.55)" }),
    });
    for (const node of NODES) {
      const hot = hoverId === node.id;
      solids.push({
        depth: depthOf(boxCenter(node.box), cam),
        draw: () => {
          drawBox(cam, node.box, hot ? hexRgb(node.accent) : CERAMIC, { alpha: hot ? 0.22 : 1, edge: hot ? node.accent : "rgba(17,18,20,0.45)", glow: hot ? node.accent : undefined });
          if (hot) drawBox(cam, node.box, CERAMIC, { alpha: 0.82, edge: node.accent });
          drawBox(cam, { x: node.box.x + 0.08, y: node.box.y + 0.08, z: node.box.z + node.box.h, w: node.box.w - 0.16, d: node.box.d - 0.16, h: 0.04 }, { r: 255, g: 255, b: 255 }, { alpha: 0.55, edge: "rgba(17,18,20,0.25)" });
        },
      });
    }
    solids.sort((a, b) => a.depth - b.depth);
    for (const s of solids) s.draw();
    drawBox(cam, GLASS, { r: 255, g: 255, b: 255 }, { alpha: 0.28, edge: "rgba(17,18,20,0.28)" });
    for (const trace of BUS) {
      drawPath(cam, trace, "rgba(6,182,212,0.55)", 1.15, true);
      drawPulse(cam, trace, CYAN, paused ? 0.4 : t * 0.22 + 0.35);
    }
    CONDUITS.forEach((c, i) => drawPulse(cam, c.path, c.color, paused ? 0.35 + i * 0.18 : t * 0.18 + i * 0.22));
    NODES.forEach((node, i) => {
      const blink = paused ? true : Math.sin(t * 4 + i * 1.7) > -0.2;
      drawLed(cam, node.led, node.accent, hoverId === node.id || blink);
      const c = boxCenter(node.box);
      const p = project({ ...c, z: node.box.z + node.box.h + 0.18 }, cam);
      ctx.font = "500 9px 'Geist Mono', ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = hoverId === node.id ? INK : MUTED;
      ctx.fillText(node.label.toUpperCase(), p.x, p.y);
    });
  }

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.size = { w, h };
  }

  function setHud(node, cam) {
    if (!node) {
      hud.hidden = true;
      return;
    }
    hud.hidden = false;
    hud.querySelector("[data-iso-label]").textContent = node.label;
    hud.querySelector("[data-iso-status]").textContent = node.status;
    hud.querySelector("[data-iso-latency]").textContent = node.latency;
    hud.querySelector("[data-iso-spec]").textContent = node.spec;
    const { w, h } = state.size;
    const p = project({ ...boxCenter(node.box), z: node.box.z + node.box.h + 0.35 }, cam);
    hud.style.left = `${Math.min(Math.max(12, p.x + 14), w - 196)}px`;
    hud.style.top = `${Math.min(Math.max(12, p.y - 64), h - 96)}px`;
  }

  function syncPause() {
    pauseBtn.textContent = state.paused ? "Play" : "Pause";
    pauseBtn.setAttribute("aria-pressed", String(state.paused));
  }

  function reset() {
    state.sim = 0;
    state.pointer = { x: 0.5, y: 0.5 };
    state.tilt = { pitch: 0, yaw: 0, tx: 0, ty: 0, dragging: false };
    state.hoverId = null;
    hud.hidden = true;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!state.paused) state.sim += dt;
    const range = state.tilt.dragging ? 0.42 : 0.26;
    state.tilt.tx = (state.pointer.x - 0.5) * 2 * range;
    state.tilt.ty = (state.pointer.y - 0.5) * 2 * (range * 0.65);
    const idle = state.paused ? 0 : Math.sin(state.sim * 0.45) * 0.025;
    state.tilt.yaw += (state.tilt.tx + idle - state.tilt.yaw) * 0.1;
    state.tilt.pitch += (state.tilt.ty - state.tilt.pitch) * 0.1;
    const { w, h } = state.size;
    const cam = { ox: w / 2, oy: h * 0.58, scale: Math.min(w, h) * 0.094, pitch: state.tilt.pitch, yaw: state.tilt.yaw };
    let nearest = null, best = 28;
    const local = { x: state.pointer.x * w, y: state.pointer.y * h };
    for (const node of NODES) {
      const p = project(boxCenter(node.box), cam);
      const dist = Math.hypot(p.x - local.x, p.y - local.y);
      if (dist < best) { best = dist; nearest = node; }
    }
    state.hoverId = nearest ? nearest.id : null;
    setHud(nearest, cam);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    drawScene(cam, state.sim, state.hoverId, state.paused);
    ctx.restore();
    requestAnimationFrame(loop);
  }

  function pointerFrom(e) {
    const rect = wrap.getBoundingClientRect();
    state.pointer = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }

  wrap.addEventListener("pointermove", pointerFrom);
  wrap.addEventListener("pointerdown", (e) => { state.tilt.dragging = true; wrap.setPointerCapture(e.pointerId); pointerFrom(e); });
  wrap.addEventListener("pointerup", () => { state.tilt.dragging = false; });
  wrap.addEventListener("pointerleave", () => { state.tilt.dragging = false; state.pointer = { x: 0.5, y: 0.5 }; state.hoverId = null; hud.hidden = true; });
  wrap.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); state.paused = !state.paused; syncPause(); }
    if (e.key === "Escape") reset();
  });
  pauseBtn.addEventListener("click", () => { state.paused = !state.paused; syncPause(); });
  resetBtn.addEventListener("click", reset);

  new ResizeObserver(fit).observe(wrap);
  fit();
  syncPause();
  requestAnimationFrame(loop);
})();
