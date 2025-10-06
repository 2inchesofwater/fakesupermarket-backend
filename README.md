# Fake Supermarket Backend - Product Pages Fetcher

A workflow tool that ingests a JSON config file and downloads product pages as specified.

## Features

- Downloads category list pages from multiple sites
- Discovers product URLs using configurable CSS selectors
- Randomly selects products to meet quota requirements
- Ensures required products are always fetched
- Deduplicates products by URL
- Sanitizes filenames for safe storage
- Prompts to run Product Pages Parser after completion

## Installation

```bash
npm install
```

## Directory Structure

```
fakesupermarket-backend/
├── product-fetcher.js          # Main fetcher script
├── Products tools/
│   └── rosetta.json            # Known selectors for different sites
├── data/
│   └── [projectname]/
│       ├── config.json         # Project configuration
│       ├── category-*.html     # Downloaded category pages
│       └── [product-name].html # Downloaded product pages
└── package.json
```

## Configuration

### Config File (`data/[projectname]/config.json`)

```json
{
  "projectName": "sample-project",
  "categoryListPages": [
    "https://example-supermarket.com/categories/fruits",
    "https://another-store.com/categories/vegetables"
  ],
  "productQuota": 20,
  "requiredProductUrls": [
    "https://example-supermarket.com/product/banana",
    "https://example-supermarket.com/product/apple"
  ]
}
```

**Fields:**
- `projectName`: Name of the project (used for output directory)
- `categoryListPages`: Array of category page URLs to scrape
- `productQuota`: Total number of products to fetch
- `requiredProductUrls`: Array of specific product URLs that must be fetched

### Rosetta File (`Products tools/rosetta.json`)

Contains known CSS selectors for different sites:

```json
{
  "sites": {
    "example-supermarket.com": {
      "productItemSelector": ".product-item",
      "productLinkSelector": ".product-item a.product-link",
      "productNameSelector": ".product-name",
      "productSkuSelector": ".product-sku"
    }
  },
  "defaultSelectors": {
    "productItemSelector": "a[href*='/product/']",
    "productLinkSelector": "a[href*='/product/']",
    "productNameSelector": ".product-name, .title, h1, h2",
    "productSkuSelector": ".sku, [data-sku]"
  }
}
```

## Usage

Run the fetcher with a config file:

```bash
node product-fetcher.js data/sample-project/config.json
```

## Workflow

1. **Parse Config**: Loads and validates the configuration file
2. **Download Category Pages**: Fetches all category list pages and saves them locally
3. **Discover Product URLs**: Extracts product links from category pages using selectors from rosetta.json
4. **Select Products**: 
   - Adds all required products first
   - Randomly selects additional products to meet quota
   - Deduplicates by URL
5. **Download Product Pages**: Fetches each product page HTML (excluding CSS, JS, images)
6. **Prompt for Parser**: Asks user if they want to run the parser script

## Features & Deduplication

- **URL Deduplication**: Ensures the same product URL is not fetched twice
- **Name/SKU Deduplication**: Can identify duplicate products across sites (when SKU is available)
- **Required Products**: Guaranteed to be fetched and excluded from random selection
- **Filename Sanitization**: Product names are sanitized for safe filesystem usage
- **Random Distribution**: Products are randomly selected across all category pages

## Output

All files are saved to `data/[projectname]/`:
- `category-1.html`, `category-2.html`, etc. - Category list pages
- `[product-name].html` - Individual product pages

## Notes

- Only HTML is downloaded (no images, CSS, or JavaScript)
- Product names are sanitized when used as filenames
- A 500ms delay is added between product page downloads to be respectful to servers
- The script uses the User-Agent header to identify itself as a browser

## Example

```bash
# Create a new project
mkdir -p data/my-project

# Create config file
cat > data/my-project/config.json << EOF
{
  "projectName": "my-project",
  "categoryListPages": [
    "https://example.com/fruits"
  ],
  "productQuota": 10,
  "requiredProductUrls": []
}
EOF

# Run the fetcher
node product-fetcher.js data/my-project/config.json
```

## Adding New Site Selectors

To add selectors for a new site, edit `Products tools/rosetta.json`:

```json
{
  "sites": {
    "newsite.com": {
      "productItemSelector": ".product",
      "productLinkSelector": ".product a",
      "productNameSelector": ".name",
      "productSkuSelector": ".sku"
    }
  }
}
```

## License

ISC
