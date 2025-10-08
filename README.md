# Fake Supermarket Backend

Backend system for a fake supermarket UX research project.

## Product Fetcher Script

The `product-fetcher.js` script is used to fetch and process product data based on a configuration file.

### Usage

```bash
node product-fetcher.js <config-file-path>
```

### Example

```bash
node product-fetcher.js ./config/products.json
```

If you run the script without providing a configuration file path, it will display a usage message:

```
Usage: node product-fetcher.js <config-file-path>
```

## Development

This project uses Node.js with ES modules.

### Setup

```bash
npm install
```

## License

MIT
