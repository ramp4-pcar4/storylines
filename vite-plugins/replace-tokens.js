import { promises as fs } from 'fs';
import path from 'path';

export default function replaceTokensPlugin(options) {
    const {
        tokens = {}, // mapping of token: replacement
    } = options;

    function replaceTokens(str) {
        let result = str;
        for (const [token, value] of Object.entries(tokens)) {
            const re = new RegExp(`\\{${token}\\}`, 'g');
            result = result.replace(re, value);
        }
        return result;
    }

    return {
        name: 'vite-plugin-replace-tokens',

        // DEV
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                // Only handle GET requests for JSON files from public dir
                if (req.method !== 'GET') {
                    return next();
                }

                // Remove query/fragment
                const url = req.url.split('?')[0].split('#')[0];
                if (!/\.json$/.test(url) && !/\.config$/.test(url)) {
                    return next();
                }

                const filePath = path.join(process.cwd(), 'public', url);
                try {
                    // Check file exists
                    await fs.access(filePath);
                    let content = await fs.readFile(filePath, 'utf-8');
                    content = replaceTokens(content);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(content);
                } catch (e) {
                next();
                }
            });
        },

        // BUILD
        async closeBundle() {
            const publicPath = path.resolve(process.cwd(), 'public');
            const distPath = path.resolve(process.cwd(), 'dist');

            async function processDirectory(productDirectory) {
                const productPath = path.join(publicPath, productDirectory.name)
                const entries = await fs.readdir(productPath, { withFileTypes: true });
                for (const entry of entries) {
                    if (/\.json$/.test(entry.name) || /\.config$/.test(entry.name)) {
                        // its a json file, replace tokens
                        const absPath = path.join(productPath, entry.name);
                        const relPath = path.join('', productDirectory.name, entry.name);
                        let content = await fs.readFile(absPath, 'utf-8');
                        content = replaceTokens(content);
                        // write to dist folder
                        const outPath = path.join(distPath, relPath);
                        await fs.mkdir(path.dirname(outPath), { recursive: true });
                        await fs.writeFile(outPath, content, 'utf-8');
                    }
                }
            }

            await processDirectory({name: ''});
            // find product folders
            const products = await fs.readdir(publicPath, { withFileTypes: true });
            products.forEach(async (product) => {
                if (product.isDirectory()) {
                    await processDirectory(product);
                }
            });
        }
    };
}