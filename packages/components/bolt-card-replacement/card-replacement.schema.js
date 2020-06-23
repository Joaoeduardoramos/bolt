module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Card',
  type: 'object',
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal-style attributes object with extra attributes to append to this component.',
    },
    tag: {
      type: 'string',
      description: 'HTML tag that contains the card-replacement content.',
      default: 'article',
      enum: ['div', 'article', 'figure'],
    },
    horizontal: {
      type: 'boolean',
      description: 'Displays the card media + body horizontally.',
    },
    height: {
      type: 'string',
      description:
        'Controls the height of the card-replacement to auto fit to content or the full height of the column in a grid.',
      default: 'full',
      enum: ['auto', 'full'],
    },
    borderRadius: {
      type: 'string',
      description: 'Controls the border-radius of the card-replacement.',
      default: 'small',
      enum: ['small', 'large'],
    },
    spacing: {
      type: 'string',
      description: 'Controls the spacing of the card-replacement.',
      default: 'medium',
      enum: ['small', 'medium'],
    },
    theme: {
      type: 'string',
      description: 'Controls the theme of the individual card-replacement.',
      default: 'none',
      enum: ['xlight', 'light', 'dark', 'xdark', 'none'],
    },
    link: {
      type: 'object',
      description:
        'Providing a link will make the whole card-replacement clickable.',
      properties: {
        url: {
          type: 'string',
          description: 'Address for the link.',
        },
        text: {
          type: 'string',
          description:
            'Visually hidden text for link, included for accessibility.',
        },
        attributes: {
          type: 'object',
          description:
            'A Drupal-style attributes object with extra attributes to append to this component.',
        },
      },
    },
    media: {
      type: 'object',
      description:
        'Media section of the card-replacement, accepts either image and video, or custom content.',
      properties: {
        image: {
          type: 'object',
          ref: '@bolt-components-image/image.schema.json',
        },
        video: {
          type: 'object',
          ref: '@bolt-components-video/video.schema.json',
        },
        content: {
          type: ['string', 'array', 'object'],
          description:
            "Passing free-form content into the card-replacement media will ignore image or video data. Use this if the pre-configured image or video doesn't satisfy your needs.",
        },
      },
    },
    body: {
      type: 'object',
      description:
        'Body section of the card-replacement, accepts pre-configured eyebrow, headline, and paragraph or custom content.',
      properties: {
        eyebrow: {
          type: 'string',
          description: 'Regular eyebrow.',
        },
        headline: {
          type: 'string',
          description: 'Headline pre-defined to size large.',
        },
        paragraph: {
          type: 'string',
          description: 'Regular paragraph of text.',
        },
        content: {
          type: ['string', 'array', 'object'],
          description:
            "Passing free-form content into the card-replacement body will ignore eyebrow, headline, and paragraph data. Use this if the pre-configured eyebrow, headline, and paragraph don't satisfy your needs.",
        },
      },
    },
    actions: {
      type: 'array',
      description: 'Actions section of the card-replacement, accepts buttons.',
      properties: {
        text: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        external: {
          type: 'boolean',
        },
        attributes: {
          type: 'object',
          description:
            'A Drupal-style attributes object with extra attributes to append to this component.',
        },
      },
    },
    content: {
      type: ['string', 'array', 'object'],
      description:
        'Content will override media, body, and actions props. Use this to build a completely cuztomized card-replacement.',
    },
    raised: {
      type: 'boolean',
      description:
        'Manually switch on / off the raised (shadow + animation effect) treament. By default this config option is applied if the card-replacement contains a bolt-card-replacement-link OR includes the `url` prop.',
      hidden: true,
    },
  },
};
