const fs = require('fs');

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const map = {
  'text-xs': 'text-sm',
  'text-sm': 'text-base',
  'text-base': 'text-lg',
  'text-lg': 'text-xl',
  'text-xl': 'text-2xl',
  'text-2xl': 'text-3xl',
  'text-3xl': 'text-4xl',
  'text-4xl': 'text-5xl',
  'text-5xl': 'text-6xl',
  'text-6xl': 'text-7xl',
  'text-7xl': 'text-8xl',
  'text-8xl': 'text-9xl',
};

// scale px
content = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
  return `text-[${parseInt(p1) + 2}px]`;
});

// scale rem
content = content.replace(/text-\[([\d\.]+)rem\]/g, (match, p1) => {
  return `text-[${parseFloat(p1) + 0.5}rem]`;
});

// scale string classes
// To avoid double replacements, we sort by length desc and replace carefully, but regex with word boundaries is easier.
for (const [key, value] of Object.entries(map).reverse()) {
  const regex = new RegExp(`\\b${key}\\b`, 'g');
  content = content.replace(regex, value);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Fonts scaled up');
