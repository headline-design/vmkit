import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import ignoreDCTS from "./rollup-plugin-ignore-dcts";
import fs from "fs";
import path from "path";

// Get the current NODE_ENV or default to "development"
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

// Define environment-specific configurations
const CLIENT_ENV = {
  "process.env.IS_BROWSER": "true",
  "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  global: "window",
  preventAssignment: true,
};

const SERVER_ENV = {
  "process.env.IS_BROWSER": "false",
  "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  preventAssignment: true,
};

// Custom plugin to create a proper top-level declaration file
function createTopLevelDeclaration() {
  return {
    name: "create-top-level-declaration",
    writeBundle: {
      sequential: true,
      order: "post",
      handler() {
        const correctServerDtsPath = path.resolve(
          "dist/types/server/index.d.ts"
        );
        const topLevelServerDtsPath = path.resolve("dist/server.d.ts");

        if (fs.existsSync(correctServerDtsPath)) {
          console.log(
            "Creating top-level declaration file from the correct one..."
          );

          // Read the correct declaration file
          const correctContent = fs.readFileSync(correctServerDtsPath, "utf8");

          // Write it to the top-level file
          fs.writeFileSync(topLevelServerDtsPath, correctContent);
          console.log("Created top-level declaration file");
        } else {
          console.error(
            "Correct declaration file not found:",
            correctServerDtsPath
          );
        }
      },
    },
  };
}

// Custom plugin to handle ESM imports in CJS output
function handleEsmImports() {
  return {
    name: "handle-esm-imports",
    renderChunk(code) {
      // Replace require('@avmkit/siwa') with dynamic import
      return code.replace(
        /require$$['"]@avmkit\/siwa['"]$$/g,
        `(function() {
          try {
            const importESM = new Function('modulePath', 'return import(modulePath)');
            return importESM('@avmkit/siwa');
          } catch (e) {
            console.error('Error importing @avmkit/siwa:', e);
            return {};
          }
        })()`
      );
    },
  };
}

// Common plugins
const commonPlugins = [
  // Add our custom plugin to handle .d.cts files
  ignoreDCTS(),
  peerDepsExternal(),
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  }),
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true,
    exclude: ["node_modules/**"],
    tsconfigOverride: {
      compilerOptions: {
        declaration: true,
        declarationDir: "dist/types",
        emitDeclarationOnly: false,
        noEmitOnError: false,
      },
    },
    // Important: This prevents TypeScript from overwriting declaration files
    clean: false,
  }),
  IS_PROD && terser(),
];

export default [
  // Client bundle (browser environment)
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    external: [
      "react",
      "react-dom",
      "@solana/wallet-standard-features",
      "@solana/wallet-standard-util",
      "@solana/wallet-adapter-react",
      "next",
      "next/server",
      "iron-session",
    ],
    plugins: [replace(CLIENT_ENV), ...commonPlugins],
    onwarn(warning, warn) {
      // Skip certain warnings
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  },

  // Server bundle (Node.js environment)
  {
    input: "./src/server/index.ts",
    output: {
      file: "dist/server.js",
      format: 'esm',
      sourcemap: true,
      // Add this to ensure dynamic imports work
      inlineDynamicImports: false,
    },
    external: [
      "react",
      "react-dom",
      "@solana/wallet-standard-features",
      "@solana/wallet-standard-util",
      "@solana/wallet-adapter-react",
      "siwe",
      "next",
      "next/server",
      "iron-session",
      "cookie",
      // Add Node.js built-ins here
      "crypto",
      "fs",
      "path",
      "util",
    ],
    plugins: [
      replace(SERVER_ENV),
      ...commonPlugins,
      // Add our custom plugin to handle ESM imports
      handleEsmImports(),
      // Add our custom plugin to create a proper top-level declaration file
      createTopLevelDeclaration(),
    ],
  },
];
