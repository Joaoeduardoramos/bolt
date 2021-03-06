module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Background shapes',
  type: 'object',
  properties: {
    shapeGroup: {
      type: 'string',
      description: 'The shapeGroup to use to build the shapes layout.',
      default: 'A',
      enum: ['A', 'B'],
    },
  },
};
