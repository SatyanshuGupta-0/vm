// generate-sitemap.mjs
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const sitemap = new SitemapStream({ hostname: "https://vmodifier.com" });

sitemap.write({ url: "/", changefreq: "monthly", priority: 1.0 });
sitemap.write({ url: "/about", changefreq: "monthly", priority: 0.7 });
sitemap.write({ url: "/products", changefreq: "monthly", priority: 0.8 });
// Add more URLs as needed

sitemap.end();

const buffer = await streamToPromise(sitemap);
createWriteStream("./dist/sitemap.xml").end(buffer);

console.log("✅ Sitemap created in /dist/sitemap.xml");

