/**
 * A Rollup plugin to ignore .d.cts files during build
 */
export default function ignoreDCTS() {
    return {
      name: "ignore-dcts",

      // This hook is called when a module is about to be resolved
      resolveId(source, importer) {
        // If the file ends with .d.cts, return a special object that tells Rollup to ignore it
        if (source.endsWith(".d.cts")) {
          return {
            id: source,
            external: true,
            moduleSideEffects: false,
          }
        }
        return null // Let Rollup handle other files
      },

      // This hook is called when a module is loaded
      load(id) {
        // If the file ends with .d.cts, return an empty module
        if (id.endsWith(".d.cts")) {
          return "export default {};"
        }
        return null // Let Rollup handle other files
      },
    }
  }

