
export const globeText = {
  kicker: '// beyond borders',
  title: ['No borders.', 'Just good ideas.'],
  sub: 'Great things can come from anywhere. At APW Labs, your country and language do not matter. Everyone is welcome to learn, build, and grow together. Drag the globe to explore.',
}


export const globeConfig = {

  // Use the exact English names from src/data/world.json (e.g. 'Bangladesh', 'United States of America').
  // Sameer is from Bangladesh, Mandy is from Nepal and most of the devs and founder of APW labs (shabd bro) reside in India.
  // I will edit when new members comes
  highlighted: ['Bangladesh', 'India', 'Nepal'],

  // Which point on Earth faces the viewer when the page loads.
  start: { lon: 85, lat: 22 },

  // Rotation. speed is degrees per second (0 = still).
  autoRotate: true,
  speed: 6,

  // Show faint latitude / longitude lines.
  graticule: true,
}


export const globeLegend = [
  { label: 'Good ideas have no borders', color: 'highlight' as const },
{ label: 'No borders, no limits. Everyone is welcome to join', color: 'land' as const },
]
