// SVGO Configuration for Ridgewood Insights
// Run: npx svgo --config .svgo.config.js --folder public --recursive

module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox for scaling in Next.js Image component
          removeViewBox: false,
          // Remove XML comments and metadata
          removeComments: true,
          removeMetadata: true,
          // Keep IDs if referenced by other elements
          removeUnknownsAndDefaults: {
            keepDataAttrs: false,
            keepRoleAttr: true,
          },
        },
      },
    },
    // Remove width/height attributes to allow CSS styling
    'removeDimensions',
    // Sort attributes alphabetically for consistent output
    'sortAttrs',
    // Remove unnecessary groups
    {
      name: 'removeEmptyContainers',
    },
    // Convert colors to shortest representation
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
  ],
};
