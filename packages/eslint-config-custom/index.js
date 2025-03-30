module.exports = {
  extends: ["next", "turbo", "prettier"],

  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/skipLibCheck": "off",
    "turbo/no-undeclared-env-vars": "warn",
    "no-console": "off",
    "import/no-anonymous-default-export": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": "off",
    "react/no-unescaped-entities": "off",
    "react/no-children-prop": "off",
    "no-implicit-any":"off",
    "no-alert": "off",
    "no-restricted-syntax": "off",
    "no-void": "off",
    "no-underscore-dangle": "off",
    "react/jsx-no-comment-textnodes": "off",
    "@next/next/no-img-element": "off",
    "no-undef": "off",
  },
  parserOptions: {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "impliedStrict": true,
      "experimentalObjectRestSpread": true
    },
    "allowImportExportEverywhere": 1,
    "rules": {
      // `@typescript-eslint`
      // https://github.com/typescript-eslint/typescript-eslint
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        2,
        {
          "argsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-var-requires": "off",
      // `eslint-plugin-import`
      // https://github.com/benmosher/eslint-plugin-import
      "import/order": [
        "error",
        {
          "groups": ["external", "internal"],
          "newlines-between": "always-and-inside-groups"
        }
      ],
      "sort-imports": [
        "warn",
        {
          "ignoreCase": false,
          "ignoreDeclarationSort": true,
          "ignoreMemberSort": false
        }
      ],
      // `eslint-plugin-react`
      // https://github.com/yannickcr/eslint-plugin-react
      "react/display-name": "off",
      "react/jsx-boolean-value": ["warn", "never"],
      "react/jsx-curly-brace-presence": [
        "error",
        { "props": "never", "children": "ignore" }
      ],
      "react/jsx-sort-props": [
        "error",
        {
          "callbacksLast": true
        }
      ],
      "react/jsx-wrap-multilines": "error",
      "react/no-array-index-key": "error",
      "react/no-multi-comp": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "warn"
    },
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
    "env": {
      "es6": true,
      "browser": true,
      "node": true,
      "jest": true
    }
  },
};
