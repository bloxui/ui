/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@blox-ui/ui"],
  async rewrites() {
    // Each component page has a Markdown copy at the same address plus ".md".
    return [{ source: "/docs/components/:name.md", destination: "/markdown/:name" }];
  },
};
export default nextConfig;
