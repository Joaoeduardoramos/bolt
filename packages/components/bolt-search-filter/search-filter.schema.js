module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Search Filter',
  type: 'object',
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal-style attributes object with extra attributes to append to this component.',
    },
    content: {
      tyoe: ['string', 'object', 'array'],
      description:
        'Renderable content (e.g. a string, render array, or included pattern) to display within a modal at mobile breakpoints.  Typically, this is where the filters themselves go.',
    },
  },
};
