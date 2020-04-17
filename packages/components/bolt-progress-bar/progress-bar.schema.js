module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Progress Bar',
  description: 'Visually indicates the quantity or progression of an activity.',
  type: 'object',
  required: ['value'],
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal attributes object. Applies extra HTML attributes to the outer &lt;bolt-progress-bar&gt; tag.',
    },
    value: {
      type: 'number',
      description:
        'Typically represents the value (from 0 to 100) of the percentage progressed.',
      minimum: 0,
    },
    min: {
      type: 'number',
      description: 'The minimum value.',
      default: 0,
      hidden: true,
    },
    max: {
      type: 'number',
      description: 'The maximum value allowed in the Progress Bar.',
      default: 100,
    },
    valueFormat: {
      enum: ['percent', 'step'],
      default: 'percent',
      type: 'string',
      description: 'The data format that the progress bar should display.',
    },
    animated: {
      type: 'boolean',
      description:
        'Enables the animated background to better indicate active progress. Note: this will also automatically set "striped" to true when enabled.',
    },
  },
};
