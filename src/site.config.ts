// Site-wide details. Anything still marked as a TODO placeholder renders as a highlighted
// placeholder on the page; run `npm run todos` to list them.

export const site = {
  name: 'Before the Signal Dies',
  title: 'Before the Signal Dies · 2nd place, IBM Z Datathon 2026',
  description:
    'A disaster-communications planning tool that rates all 1,699 Western Australian localities by how likely they are to lose mobile coverage in a disaster, simulates outages and places portable cell units. Runs on IBM LinuxONE. 2nd place at the IBM Z Datathon 2026 in Australia.',
  event: 'IBM Z Datathon 2026', // non-breaking space keeps "IBM Z" together
  award: '2nd place',
  date: '17 October 2026',
  venue: 'Federation University, Berwick',
  team: [
    { name: 'Adithyan Kunnummal', role: 'Built the prototype app' },
    { name: 'Meer Daiyan Ahmed', role: 'Collected and prepared the data' },
    { name: 'Sanal Mehra', role: 'Collected and prepared the data' },
    { name: 'Sanika Rahman', role: 'Collected and prepared the data' },
  ],

  // Links. Set to null to hide one.
  repo: 'https://github.com/Adithyan-Kunnummal/IBM-Before-The-Signal-Dies' as string | null,
  video: 'https://youtu.be/piIo76e4jmU' as string | null,
  slides: null as string | null,
};

export const nav = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#results', label: 'Results' },
  { href: '/#linuxone', label: 'LinuxONE' },
  { href: '/#team', label: 'Team' },
  { href: '/story', label: 'Full Story' },
];
