import next from "eslint-config-next";

/**
 * Flat config, using eslint-config-next's native export.
 *
 * The previous config wrapped `next/core-web-vitals` in FlatCompat, which threw
 * "Converting circular structure to JSON" on eslint-config-next 16 — so linting
 * had been silently impossible: `npm run lint` (`next lint`) also fails, because
 * Next 16 removed that command. The repo had no working linter at all.
 */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "out/**",
      "public/**",
      "next-env.d.ts",
      "worker-configuration.d.ts",
    ],
  },
  ...next,
  {
    rules: {
      // Content data files legitimately carry long strings with apostrophes and
      // quotes; the JSX-entity rule is noise for a marketing site where copy is
      // authored in data, not markup.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
