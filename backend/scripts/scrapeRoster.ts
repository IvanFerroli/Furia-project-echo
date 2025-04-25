import { getCurrentRoster } from '../src/scraping/rosterScraper.js';
import fs from 'fs';

async function run() {
  const roster = await getCurrentRoster();

  if (roster.length) {
    fs.writeFileSync('current_roster.json', JSON.stringify(roster, null, 2));
    console.log('✅ Roster salvo em current_roster.json');
  } else {
    console.log('⚠️ Nenhum dado extraído');
  }
}

run();
