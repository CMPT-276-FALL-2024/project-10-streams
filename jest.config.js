// jest.config.js
module.exports = {
  // ... other configurations
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  // Use ESM extensions
  extensionsToTreatAsEsm: [".jsx"]
};

