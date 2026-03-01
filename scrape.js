const { chromium } = require('playwright');

async function scrapeAndSumTables(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Aggressive wait for dynamic tables
  await page.waitForSelector('table', { timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const numbers = await page.evaluate(() => {
    // Grab ALL text in tables, extract every number with regex
    const tableElements = document.querySelectorAll('table *');
    let allText = '';
    tableElements.forEach(el => {
      allText += el.textContent + ' ';
    });
    // Regex: any number like 123, 123.45, -1.2
    const matches = allText.match(/-?\d*\.?\d+/g) || [];
    return matches.map(n => parseFloat(n)).filter(n => !isNaN(n));
  });
  
  const pageSum = numbers.reduce((acc, num) => acc + num, 0, 0);
  await browser.close();
  console.log(`URL: ${url}`);
  console.log(`Numbers found: ${numbers.length}`);
  console.log(`Page sum: ${pageSum}`);
  return pageSum;
}

async function main() {
  console.log('Starting scrape...');
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=31',
    // ... all 10 URLs from before
    'https://sanand0.github.io/tdsdata/js_table/?seed=32',
    'https://sanand0.github.io/tdsdata/js_table/?seed=33',
    'https://sanand0.github.io/tdsdata/js_table/?seed=34',
    'https://sanand0.github.io/tdsdata/js_table/?seed=35',
    'https://sanand0.github.io/tdsdata/js_table/?seed=36',
    'https://sanand0.github.io/tdsdata/js_table/?seed=37',
    'https://sanand0.github.io/tdsdata/js_table/?seed=38',
    'https://sanand0.github.io/tdsdata/js_table/?seed=39',
    'https://sanand0.github.io/tdsdata/js_table/?seed=40'
  ];
  
  let grandTotal = 0;
  for (const url of urls) {
    try {
      const sum = await scrapeAndSumTables(url);
      grandTotal += sum;
    } catch (error) {
      console.log(`Error on ${url}: ${error.message}`);
    }
  }
  
  console.log('');
  console.log('=== GRAND TOTAL SUM OF ALL TABLES ACROSS ALL PAGES: ' + grandTotal + ' ===');
  console.log('Copy this number for your assignment!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
