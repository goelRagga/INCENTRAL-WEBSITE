/** SVG inner markup — ported from v375 pdp-feature-comparison-v273.js */
export const featureComparisonIconPaths: Record<string, string> = {
  location:
    '<path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/>',
  hub: '<circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 12h4l4-5M12 12l4 5"/>',
  geofence:
    '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  fuel: '<path d="M7 4h7v16H7z"/><path d="M9 7h3"/><path d="M14 8h2l2 2v7c0 1 .5 2 1.5 2s1.5-1 1.5-2v-6l-2-2"/>',
  warning: '<path d="M12 4 3.5 20h17L12 4Z"/><path d="M12 9v5M12 17h.01"/>',
  wrench:
    '<path d="M14 6a4 4 0 0 0-5 5L4 16l4 4 5-5a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/>',
  pulse: '<path d="M3 12h5l2-5 4 10 2-5h5"/>',
  automation:
    '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  cost: '<path d="M7 5h10M7 9h10M9 5c5 0 5 7 0 7h-2l8 7"/>',
  driver:
    '<circle cx="12" cy="8" r="3"/><path d="M6 20c.7-4 2.7-6 6-6s5.3 2 6 6"/><path d="M4 12a8 8 0 0 1 16 0"/>',
  camera:
    '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  adas: '<path d="M4 18 8 6h8l4 12"/><path d="M7 14h10M12 6v12"/>',
  attendance:
    '<circle cx="10" cy="8" r="3"/><path d="M4 20c.6-4 2.6-6 6-6 2.2 0 3.8.8 4.8 2.3"/><path d="m16 18 2 2 4-5"/>',
  voice:
    '<path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9c1 1 1 5 0 6M19 7c2 2 2 8 0 10"/>',
  panic: '<circle cx="12" cy="12" r="8"/><path d="M12 7v6M12 16h.01"/>',
  speed: '<path d="M5 16a7 7 0 1 1 14 0"/><path d="m12 13 4-4"/><path d="M8 18h8"/>',
  accel: '<path d="M4 16h12"/><path d="m12 12 4 4-4 4"/><path d="M4 8h7"/>',
  brake:
    '<circle cx="12" cy="12" r="7"/><path d="M9 8h3.5a2 2 0 1 1 0 4H9V8Zm0 4h4a2 2 0 1 1 0 4H9v-4Z"/>',
  stop: '<path d="m8 3 8 0 5 5v8l-5 5H8l-5-5V8l5-5Z"/><path d="M8 12h8"/>',
  night: '<path d="M18 15a7 7 0 0 1-9-9 7 7 0 1 0 9 9Z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  slow: '<path d="M5 16a7 7 0 1 1 14 0"/><path d="m12 13-3-2"/><path d="M8 18h8"/>',
  engine: '<path d="M5 9h12l2 3v5H5V9Z"/><path d="M8 9V6h6v3M3 12h2M19 12h2"/>',
  idle: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4M9 16h6"/>',
  coast: '<path d="M4 15c3-5 13-5 16 0"/><path d="M7 18h10M8 11l-2-2M16 11l2-2"/>',
  regen:
    '<path d="M7 7a7 7 0 0 1 11 3"/><path d="m18 6 .5 4-4-.5"/><path d="M17 17a7 7 0 0 1-11-3"/><path d="m6 18-.5-4 4 .5"/>',
  ac: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3"/>',
  rpm: '<path d="M5 16a7 7 0 1 1 14 0"/><path d="m12 13 2-5"/><path d="M8 18h8"/>',
  gear: '<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  person:
    '<circle cx="12" cy="8" r="3"/><path d="M6 20c.7-4 2.7-6 6-6s5.3 2 6 6"/><path d="M5 5 19 19"/>',
  collision:
    '<path d="M4 15h16M6 15l1-5h10l1 5"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/><path d="M12 4v3M9 6l-2-2M15 6l2-2"/>',
  pedestrian:
    '<circle cx="12" cy="5" r="2"/><path d="M12 7v6l-4 3M12 10l4 2M12 13l3 6M10 13l-2 6"/>',
  distracted:
    '<circle cx="10" cy="7" r="3"/><path d="M5 20c.5-4 2-6 5-6"/><rect x="14" y="8" width="5" height="9" rx="1"/>',
  drowsy: '<path d="M4 12c4-5 12-5 16 0-4 5-12 5-16 0Z"/><path d="M9 12h6"/>',
  lens: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  phone: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 18h2"/>',
  face: '<path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4"/><circle cx="9" cy="11" r=".8"/><circle cx="15" cy="11" r=".8"/><path d="M9 15c2 1 4 1 6 0"/>',
  storage:
    '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 3v5h6V3M9 15h6M9 18h3"/>',
  seatbelt:
    '<circle cx="8" cy="6" r="2"/><path d="M8 8v5l4 6M8 11l8-4M14 8l4 11"/>',
  lane: '<path d="M7 21 10 3M17 21 14 3"/><path d="M12 7v3M12 14v3"/>',
  tailgate:
    '<path d="M3 15h8M13 15h8"/><path d="M5 15l1-4h4l1 4M15 15l1-4h4l1 4"/><circle cx="7" cy="17" r="1"/><circle cx="18" cy="17" r="1"/>',
  record: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  eye: '<path d="M3 12c4-5 14-5 18 0-4 5-14 5-18 0Z"/><path d="M8 12h8"/>',
  stream:
    '<path d="M9 8a5 5 0 0 0 0 8M15 8a5 5 0 0 1 0 8"/><circle cx="12" cy="12" r="2"/><path d="M6 5a9 9 0 0 0 0 14M18 5a9 9 0 0 1 0 14"/>',
  route:
    '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a4 4 0 0 0 4-4v-4a4 4 0 0 1 3-4"/>',
  report:
    '<path d="M6 3h9l4 4v14H6V3Z"/><path d="M15 3v5h4M9 13h6M9 17h6"/>',
  fleet:
    '<path d="M4 15h7l1-4h6l2 4v3H4v-3Z"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><path d="M6 9h5M5 6h8"/>',
  odo: '<circle cx="12" cy="12" r="8"/><path d="m12 12 4-4M8 16h8"/>',
  efficiency: '<path d="M4 18h16M6 15l4-5 3 2 5-7"/><path d="m15 5 3 0 0 3"/>',
  analytics: '<path d="M5 19V9M10 19v-5M15 19V6M20 19v-9"/>',
};

export const featureComparisonGroupIconPaths: Record<string, string> = {
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  driver:
    '<circle cx="12" cy="8" r="3"/><path d="M6 20c.7-4 2.7-6 6-6s5.3 2 6 6"/><path d="M4 12a8 8 0 0 1 16 0"/>',
  alerts: '<path d="M12 3v10"/><path d="M12 17h.01"/><path d="M5.2 20h13.6L12 4 5.2 20Z"/>',
  score: '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/><path d="M3 19h19"/>',
  camera:
    '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/><circle cx="9.5" cy="12" r="2.5"/>',
  report:
    '<path d="M6 3h9l4 4v14H6V3Z"/><path d="M15 3v5h4M9 13h6M9 17h6M9 9h3"/>',
  fuel: '<path d="M7 4h7v16H7z"/><path d="M9 7h3"/><path d="M14 8h2l2 2v7c0 1 .5 2 1.5 2s1.5-1 1.5-2v-6l-2-2"/>',
  pulse: '<path d="M3 12h5l2-5 4 10 2-5h5"/>',
};
