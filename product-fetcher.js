#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const readline = require('readline');

/**
 * Product Pages Fetcher
 * Ingests a JSON config file and downloads product pages as specified
 */

class ProductFetcher {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
    this.rosetta = null;
    this.projectDir = null;
    this.discoveredProducts = new Map(); // Map of URL -> product info for deduplication
    this.fetchedUrls = new Set(); // Track URLs already fetched
  }

  /**
   * Main entry point
   */
  async run() {
    try {
      console.log('=== Product Pages Fetcher ===\n');

      // Step 1: Parse config file
      console.log('Step 1: Parsing config file...');
      this.parseConfig();
      console.log(`✓ Config loaded for project: ${this.config.projectName}\n`);

      // Load rosetta file
      this.loadRosetta();
      console.log('✓ Rosetta selectors loaded\n');

      // Setup project directory
      this.setupProjectDirectory();

      // Step 2: Download category list pages
      console.log('Step 2: Downloading category list pages...');
      await this.downloadCategoryPages();
      console.log('✓ Category pages downloaded\n');

      // Step 3: Discover product URLs from category pages
      console.log('Step 3: Discovering product URLs...');
      await this.discoverProductUrls();
      console.log(`✓ Discovered ${this.discoveredProducts.size} unique products\n`);

      // Step 4: Select products to fetch
      console.log('Step 4: Selecting products to fetch...');
      const productsToFetch = this.selectProductsToFetch();
      console.log(`✓ Selected ${productsToFetch.length} products to fetch\n`);

      // Step 5: Download product pages
      console.log('Step 5: Downloading product pages...');
      await this.downloadProductPages(productsToFetch);
      console.log('✓ Product pages downloaded\n');

      console.log('=== Fetching Complete ===\n');
      console.log(`Total products fetched: ${this.fetchedUrls.size}`);
      console.log(`Output directory: ${this.projectDir}\n`);

      // Ask if user wants to run the parser
      this.promptForParser();

    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Parse the config file
   */
  parseConfig() {
    if (!fs.existsSync(this.configPath)) {
      throw new Error(`Config file not found: ${this.configPath}`);
    }

    const configContent = fs.readFileSync(this.configPath, 'utf-8');
    this.config = JSON.parse(configContent);

    // Validate required fields
    if (!this.config.projectName) {
      throw new Error('Config must include projectName');
    }
    if (!this.config.categoryListPages || this.config.categoryListPages.length === 0) {
      throw new Error('Config must include at least one categoryListPages URL');
    }
    if (!this.config.productQuota || this.config.productQuota < 1) {
      throw new Error('Config must include a valid productQuota');
    }

    // Ensure requiredProductUrls exists
    this.config.requiredProductUrls = this.config.requiredProductUrls || [];
  }

  /**
   * Load the rosetta.json file with known selectors
   */
  loadRosetta() {
    const rosettaPath = path.join(__dirname, 'Products tools', 'rosetta.json');
    if (!fs.existsSync(rosettaPath)) {
      throw new Error(`Rosetta file not found: ${rosettaPath}`);
    }

    const rosettaContent = fs.readFileSync(rosettaPath, 'utf-8');
    this.rosetta = JSON.parse(rosettaContent);
  }

  /**
   * Setup the project directory structure
   */
  setupProjectDirectory() {
    this.projectDir = path.join(__dirname, 'data', this.config.projectName);
    if (!fs.existsSync(this.projectDir)) {
      fs.mkdirSync(this.projectDir, { recursive: true });
    }
  }

  /**
   * Download all category list pages
   */
  async downloadCategoryPages() {
    for (let i = 0; i < this.config.categoryListPages.length; i++) {
      const url = this.config.categoryListPages[i];
      console.log(`  Downloading category page ${i + 1}/${this.config.categoryListPages.length}: ${url}`);

      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        });

        const filename = `category-${i + 1}.html`;
        const filepath = path.join(this.projectDir, filename);
        fs.writeFileSync(filepath, response.data);
        console.log(`    ✓ Saved to ${filename}`);

      } catch (error) {
        console.log(`    ✗ Failed to download: ${error.message}`);
      }
    }
  }

  /**
   * Discover product URLs from downloaded category pages
   */
  async discoverProductUrls() {
    const categoryFiles = fs.readdirSync(this.projectDir)
      .filter(file => file.startsWith('category-') && file.endsWith('.html'));

    for (let i = 0; i < categoryFiles.length; i++) {
      const categoryFile = categoryFiles[i];
      console.log(`  Processing ${categoryFile}...`);
      const filepath = path.join(this.projectDir, categoryFile);
      const html = fs.readFileSync(filepath, 'utf-8');
      const $ = cheerio.load(html);

      // Try to extract the base URL from the HTML
      let baseUrl = this.extractBaseUrl($, html);
      
      // If we couldn't extract base URL from HTML, try to use the original category URL
      if (!baseUrl && i < this.config.categoryListPages.length) {
        try {
          const categoryUrl = new URL(this.config.categoryListPages[i]);
          baseUrl = `${categoryUrl.protocol}//${categoryUrl.host}`;
        } catch (e) {}
      }

      // Get selectors for this site
      const selectors = this.getSelectorsForSite(baseUrl);

      // Find product links
      const productLinks = this.extractProductLinks($, selectors, baseUrl);
      console.log(`    Found ${productLinks.length} product links`);

      // Add to discovered products (with deduplication)
      productLinks.forEach(link => {
        if (!this.discoveredProducts.has(link.url)) {
          this.discoveredProducts.set(link.url, link);
        }
      });
    }
  }

  /**
   * Extract base URL from HTML
   */
  extractBaseUrl($, html) {
    // Try to get from base tag
    const baseTag = $('base').attr('href');
    if (baseTag) return baseTag;

    // Try to extract from meta tags or links
    const firstLink = $('a[href^="http"]').first().attr('href');
    if (firstLink) {
      try {
        const url = new URL(firstLink);
        return `${url.protocol}//${url.host}`;
      } catch (e) {}
    }

    return null;
  }

  /**
   * Get selectors for a specific site from rosetta.json
   */
  getSelectorsForSite(baseUrl) {
    if (!baseUrl) {
      return this.rosetta.defaultSelectors;
    }

    // Extract domain from URL
    try {
      const url = new URL(baseUrl);
      const domain = url.hostname.replace('www.', '');

      // Check if we have specific selectors for this domain
      if (this.rosetta.sites && this.rosetta.sites[domain]) {
        return this.rosetta.sites[domain];
      }
    } catch (e) {}

    // Return default selectors
    return this.rosetta.defaultSelectors;
  }

  /**
   * Extract product links from HTML using selectors
   */
  extractProductLinks($, selectors, baseUrl) {
    const links = [];
    const seen = new Set();

    // Try to find product links using the selector
    $(selectors.productLinkSelector).each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      // Normalize URL
      let fullUrl;
      try {
        if (href.startsWith('http')) {
          fullUrl = href;
        } else if (href.startsWith('/')) {
          fullUrl = baseUrl ? new URL(href, baseUrl).toString() : href;
        } else {
          fullUrl = baseUrl ? new URL(href, baseUrl).toString() : href;
        }

        // Remove query params and fragments for cleaner URLs
        const url = new URL(fullUrl);
        fullUrl = `${url.protocol}//${url.host}${url.pathname}`;

      } catch (e) {
        return; // Skip invalid URLs
      }

      // Extract product name (if available)
      let name = $(elem).text().trim();
      if (!name) {
        // Try to find name in parent or nearby elements
        const $parent = $(elem).closest(selectors.productItemSelector || '.product');
        name = $parent.find(selectors.productNameSelector || '.product-name').first().text().trim();
      }

      // Extract SKU (if available)
      const $item = $(elem).closest(selectors.productItemSelector || '.product');
      const sku = $item.find(selectors.productSkuSelector || '.sku').first().text().trim();

      if (fullUrl && !seen.has(fullUrl)) {
        seen.add(fullUrl);
        links.push({
          url: fullUrl,
          name: name || this.extractProductNameFromUrl(fullUrl),
          sku: sku || null
        });
      }
    });

    return links;
  }

  /**
   * Extract product name from URL as fallback
   */
  extractProductNameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      return pathParts[pathParts.length - 1] || 'product';
    } catch (e) {
      return 'product';
    }
  }

  /**
   * Select products to fetch (required + random selection)
   */
  selectProductsToFetch() {
    const productsToFetch = [];
    const requiredUrls = new Set(this.config.requiredProductUrls);

    // First, add all required products
    this.config.requiredProductUrls.forEach(url => {
      // Check if we discovered this URL
      if (this.discoveredProducts.has(url)) {
        productsToFetch.push(this.discoveredProducts.get(url));
      } else {
        // Add it anyway as it's required
        productsToFetch.push({
          url: url,
          name: this.extractProductNameFromUrl(url),
          sku: null,
          required: true
        });
      }
    });

    console.log(`  Added ${productsToFetch.length} required products`);

    // Calculate how many more products we need
    const remainingQuota = this.config.productQuota - productsToFetch.length;

    if (remainingQuota > 0) {
      // Get all non-required products
      const availableProducts = Array.from(this.discoveredProducts.values())
        .filter(p => !requiredUrls.has(p.url));

      // Randomly shuffle and select
      const shuffled = this.shuffleArray(availableProducts);
      const selected = shuffled.slice(0, remainingQuota);
      productsToFetch.push(...selected);

      console.log(`  Added ${selected.length} random products (${remainingQuota} requested)`);
    }

    return productsToFetch;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Download all selected product pages
   */
  async downloadProductPages(products) {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`  Downloading product ${i + 1}/${products.length}: ${product.name}`);

      try {
        const response = await axios.get(product.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        });

        const sanitizedName = this.sanitizeFilename(product.name);
        const filename = `${sanitizedName}.html`;
        const filepath = path.join(this.projectDir, filename);

        // Handle duplicate filenames
        let finalPath = filepath;
        let counter = 1;
        while (fs.existsSync(finalPath)) {
          const ext = path.extname(filename);
          const base = path.basename(filename, ext);
          finalPath = path.join(this.projectDir, `${base}-${counter}${ext}`);
          counter++;
        }

        fs.writeFileSync(finalPath, response.data);
        this.fetchedUrls.add(product.url);
        console.log(`    ✓ Saved to ${path.basename(finalPath)}`);

        // Small delay to be respectful to servers
        await this.sleep(500);

      } catch (error) {
        console.log(`    ✗ Failed to download: ${error.message}`);
      }
    }
  }

  /**
   * Sanitize filename to remove invalid characters
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
      .substring(0, 200) // Limit length
      || 'product'; // Fallback if empty
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Prompt user to run the parser script
   */
  promptForParser() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Would you like to run the Product Pages Parser? (yes/no): ', (answer) => {
      const response = answer.toLowerCase().trim();
      if (response === 'yes' || response === 'y') {
        console.log('\nStarting Product Pages Parser...');
        console.log('Note: Parser script not yet implemented.');
        // TODO: Call parser script here when implemented
      } else {
        console.log('\nSkipping parser. You can run it manually later.');
      }
      rl.close();
    });
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node product-fetcher.js <path-to-config.json>');
    console.log('Example: node product-fetcher.js data/sample-project/config.json');
    process.exit(1);
  }

  const configPath = path.resolve(args[0]);
  const fetcher = new ProductFetcher(configPath);
  fetcher.run();
}

module.exports = ProductFetcher;
