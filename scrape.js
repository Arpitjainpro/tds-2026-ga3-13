const { chromium } = require('playwright');

async function scrapeAndSumTables(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  
  // Wait for tables to fully load (dynamic content)
  await page.waitForSelector('table', { timeout: 10000 });
  
  // Find all table cells, extract numbers only (ignores text)
  const numbers = await page.evaluate(() => {
    const cells = document.querySelectorAll('table td, table th');
    return Array.from(cells)
      .map(cell => parseFloat(cell.textContent.trim()))
      .filter(num => !isNaN(num));
  });
  
  const pageSum = numbers.reduce((acc, num) => acc + num, 0);
  await browser.close();
  return pageSum;
}

async function main() {
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=31',
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
    const sum = await scrapeAndSumTables(url);
    console.log(`Sum for ${url}: ${sum}`);
    grandTotal += sum;
  }
  
  console.log(`GRAND TOTAL SUM OF ALL TABLES: ${grandTotal}`);
}

main().catch(console.error);
