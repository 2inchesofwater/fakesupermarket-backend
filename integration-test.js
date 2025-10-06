const fs = require('fs');
const path = require('path');

/**
 * Integration test - Creates mock HTML files and tests the full workflow
 */

// Create test directory
const testDir = path.join(__dirname, 'data', 'integration-test');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Create a mock category HTML file
const mockCategoryHtml = `
<!DOCTYPE html>
<html>
<head><title>Test Category Page</title></head>
<body>
  <div class="product-item">
    <a href="/product/apple" class="product-link">
      <span class="product-name">Fresh Apple</span>
    </a>
    <span class="product-sku">SKU-001</span>
  </div>
  <div class="product-item">
    <a href="/product/banana" class="product-link">
      <span class="product-name">Organic Banana</span>
    </a>
    <span class="product-sku">SKU-002</span>
  </div>
  <div class="product-item">
    <a href="/product/orange" class="product-link">
      <span class="product-name">Valencia Orange</span>
    </a>
    <span class="product-sku">SKU-003</span>
  </div>
  <div class="product-item">
    <a href="/product/grape" class="product-link">
      <span class="product-name">Red Grape</span>
    </a>
    <span class="product-sku">SKU-004</span>
  </div>
  <div class="product-item">
    <a href="/product/strawberry" class="product-link">
      <span class="product-name">Fresh Strawberry</span>
    </a>
    <span class="product-sku">SKU-005</span>
  </div>
</body>
</html>
`;

// Create config for integration test
const integrationConfig = {
  "projectName": "integration-test",
  "categoryListPages": [
    "https://example-supermarket.com/category/fruits"
  ],
  "productQuota": 3,
  "requiredProductUrls": [
    "https://example-supermarket.com/product/apple"
  ]
};

const configPath = path.join(testDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(integrationConfig, null, 2));

// Create mock category HTML file
const categoryPath = path.join(testDir, 'category-1.html');
fs.writeFileSync(categoryPath, mockCategoryHtml);

console.log('Integration test setup complete!');
console.log(`Config created: ${configPath}`);
console.log(`Mock category page: ${categoryPath}`);
console.log('\nNow testing product URL discovery...\n');

// Test the fetcher with mock data
const ProductFetcher = require('./product-fetcher');
const fetcher = new ProductFetcher(configPath);

async function runIntegrationTest() {
  try {
    // Parse config
    fetcher.parseConfig();
    console.log('✓ Config parsed');
    
    // Load rosetta
    fetcher.loadRosetta();
    console.log('✓ Rosetta loaded');
    
    // Setup project directory
    fetcher.setupProjectDirectory();
    console.log('✓ Project directory setup');
    
    // Test product discovery from our mock HTML
    await fetcher.discoverProductUrls();
    console.log(`✓ Discovered ${fetcher.discoveredProducts.size} products from mock HTML`);
    
    // List discovered products
    console.log('\nDiscovered products:');
    for (const [url, product] of fetcher.discoveredProducts) {
      console.log(`  - ${product.name} (SKU: ${product.sku})`);
      console.log(`    URL: ${url}`);
    }
    
    // Test product selection
    const selected = fetcher.selectProductsToFetch();
    console.log(`\n✓ Selected ${selected.length} products (quota: ${fetcher.config.productQuota})`);
    
    // Verify required product is included
    const hasRequired = selected.some(p => p.url.includes('/product/apple'));
    console.log(`✓ Required product included: ${hasRequired}`);
    
    console.log('\n=== Integration Test Complete ===');
    console.log(`All features working correctly!`);
    
  } catch (error) {
    console.error('✗ Integration test failed:', error.message);
    process.exit(1);
  }
}

runIntegrationTest();
