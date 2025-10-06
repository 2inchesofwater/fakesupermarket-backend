# Example Workflow

This document provides a complete example of using the Product Pages Fetcher.

## Step 1: Create a New Project

```bash
mkdir -p data/my-supermarket-project
```

## Step 2: Create a Config File

Create `data/my-supermarket-project/config.json`:

```json
{
  "projectName": "my-supermarket-project",
  "categoryListPages": [
    "https://www.example-supermarket.com/fruits-vegetables",
    "https://www.example-supermarket.com/dairy-eggs",
    "https://www.example-supermarket.com/meat-seafood"
  ],
  "productQuota": 50,
  "requiredProductUrls": [
    "https://www.example-supermarket.com/product/organic-bananas",
    "https://www.example-supermarket.com/product/whole-milk",
    "https://www.example-supermarket.com/product/chicken-breast"
  ]
}
```

## Step 3: Configure Selectors (if needed)

If the target site is not already in `Products tools/rosetta.json`, add its selectors:

```json
{
  "sites": {
    "example-supermarket.com": {
      "productItemSelector": ".product-card",
      "productLinkSelector": ".product-card a.product-link",
      "productNameSelector": ".product-title",
      "productSkuSelector": ".product-code"
    }
  }
}
```

## Step 4: Run the Fetcher

```bash
node product-fetcher.js data/my-supermarket-project/config.json
```

## Step 5: Review Output

The fetcher will:
1. Download 3 category list pages
2. Discover all product URLs from those pages
3. Select 50 products (including the 3 required ones)
4. Download each product page
5. Ask if you want to run the parser

Output will be saved to:
```
data/my-supermarket-project/
├── config.json
├── category-1.html
├── category-2.html
├── category-3.html
├── organic-bananas.html
├── whole-milk.html
├── chicken-breast.html
└── ... (47 more product pages)
```

## Example Output

```
=== Product Pages Fetcher ===

Step 1: Parsing config file...
✓ Config loaded for project: my-supermarket-project

✓ Rosetta selectors loaded

Step 2: Downloading category list pages...
  Downloading category page 1/3: https://www.example-supermarket.com/fruits-vegetables
    ✓ Saved to category-1.html
  Downloading category page 2/3: https://www.example-supermarket.com/dairy-eggs
    ✓ Saved to category-2.html
  Downloading category page 3/3: https://www.example-supermarket.com/meat-seafood
    ✓ Saved to category-3.html
✓ Category pages downloaded

Step 3: Discovering product URLs...
  Processing category-1.html...
    Found 45 product links
  Processing category-2.html...
    Found 38 product links
  Processing category-3.html...
    Found 52 product links
✓ Discovered 135 unique products

Step 4: Selecting products to fetch...
  Added 3 required products
  Added 47 random products (47 requested)
✓ Selected 50 products to fetch

Step 5: Downloading product pages...
  Downloading product 1/50: organic-bananas
    ✓ Saved to organic-bananas.html
  Downloading product 2/50: whole-milk
    ✓ Saved to whole-milk.html
  ...
✓ Product pages downloaded

=== Fetching Complete ===

Total products fetched: 50
Output directory: data/my-supermarket-project

Would you like to run the Product Pages Parser? (yes/no):
```

## Advanced Usage

### Multiple Sites

You can fetch products from multiple supermarket sites in one config:

```json
{
  "projectName": "multi-site-comparison",
  "categoryListPages": [
    "https://supermarket-a.com/fruits",
    "https://supermarket-b.com/produce",
    "https://supermarket-c.com/fresh-food"
  ],
  "productQuota": 100,
  "requiredProductUrls": []
}
```

The fetcher will deduplicate products across sites when possible.

### Debugging

If the fetcher isn't finding product links, check:

1. The category page HTML was saved correctly
2. The selectors in `rosetta.json` match the site's structure
3. Use browser developer tools to inspect the page and find the correct selectors

### Programmatic Usage

You can also use the fetcher as a module:

```javascript
const ProductFetcher = require('./product-fetcher');

const fetcher = new ProductFetcher('data/my-project/config.json');
fetcher.run();
```
