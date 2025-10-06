const ProductFetcher = require('./product-fetcher');
const fs = require('fs');
const path = require('path');

/**
 * Simple tests for Product Fetcher
 */

async function testConfigParsing() {
  console.log('Test 1: Config parsing...');
  
  const testConfig = {
    projectName: 'test-project',
    categoryListPages: ['https://example.com/products'],
    productQuota: 5,
    requiredProductUrls: ['https://example.com/product1']
  };
  
  const configPath = path.join(__dirname, 'data', 'test-project', 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));
  
  const fetcher = new ProductFetcher(configPath);
  
  try {
    fetcher.parseConfig();
    console.log('✓ Config parsed successfully');
    console.log(`  Project name: ${fetcher.config.projectName}`);
    console.log(`  Category pages: ${fetcher.config.categoryListPages.length}`);
    console.log(`  Product quota: ${fetcher.config.productQuota}`);
    console.log(`  Required products: ${fetcher.config.requiredProductUrls.length}`);
  } catch (error) {
    console.error('✗ Config parsing failed:', error.message);
    return false;
  }
  
  return true;
}

async function testRosettaLoading() {
  console.log('\nTest 2: Rosetta loading...');
  
  const configPath = path.join(__dirname, 'data', 'test-project', 'config.json');
  const fetcher = new ProductFetcher(configPath);
  
  try {
    fetcher.loadRosetta();
    console.log('✓ Rosetta loaded successfully');
    console.log(`  Sites configured: ${Object.keys(fetcher.rosetta.sites || {}).length}`);
    console.log(`  Default selectors available: ${Object.keys(fetcher.rosetta.defaultSelectors || {}).length}`);
  } catch (error) {
    console.error('✗ Rosetta loading failed:', error.message);
    return false;
  }
  
  return true;
}

async function testFilenameSanitization() {
  console.log('\nTest 3: Filename sanitization...');
  
  const configPath = path.join(__dirname, 'data', 'test-project', 'config.json');
  const fetcher = new ProductFetcher(configPath);
  
  const testCases = [
    ['Product Name', 'Product-Name'],
    ['Product/Name', 'ProductName'],
    ['Product:Name?', 'ProductName'],
    ['Product   Name', 'Product-Name'],
    ['...Product...', 'Product'],
  ];
  
  let allPassed = true;
  for (const [input, expected] of testCases) {
    const result = fetcher.sanitizeFilename(input);
    if (result === expected) {
      console.log(`  ✓ "${input}" -> "${result}"`);
    } else {
      console.log(`  ✗ "${input}" -> "${result}" (expected "${expected}")`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testProductSelection() {
  console.log('\nTest 4: Product selection logic...');
  
  const configPath = path.join(__dirname, 'data', 'test-project', 'config.json');
  const fetcher = new ProductFetcher(configPath);
  fetcher.parseConfig();
  
  // Simulate discovered products
  fetcher.discoveredProducts.set('https://example.com/product1', {
    url: 'https://example.com/product1',
    name: 'Product 1',
    sku: 'SKU1'
  });
  
  fetcher.discoveredProducts.set('https://example.com/product2', {
    url: 'https://example.com/product2',
    name: 'Product 2',
    sku: 'SKU2'
  });
  
  fetcher.discoveredProducts.set('https://example.com/product3', {
    url: 'https://example.com/product3',
    name: 'Product 3',
    sku: 'SKU3'
  });
  
  const selected = fetcher.selectProductsToFetch();
  
  console.log(`  Total discovered: ${fetcher.discoveredProducts.size}`);
  console.log(`  Total selected: ${selected.length}`);
  console.log(`  Expected: ${Math.min(fetcher.config.productQuota, fetcher.discoveredProducts.size)}`);
  
  // Check that required product is included
  const hasRequired = selected.some(p => p.url === 'https://example.com/product1');
  console.log(`  Required product included: ${hasRequired ? '✓' : '✗'}`);
  
  return selected.length > 0 && hasRequired;
}

async function runTests() {
  console.log('=== Product Fetcher Tests ===\n');
  
  const tests = [
    testConfigParsing,
    testRosettaLoading,
    testFilenameSanitization,
    testProductSelection
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
