module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Logo',
  type: 'object',
  description:
    'Not: that logo accepts all the same parameters as the bolt-image component in addition to the properties below.',
  properties: {
    invert: {
      type: 'boolean',
      description: 'Set to true to invert the logo colors.',
    },
  },
};
