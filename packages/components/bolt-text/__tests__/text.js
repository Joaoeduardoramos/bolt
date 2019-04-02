import { render } from '@bolt/twig-renderer';
import { fixture as html } from '@open-wc/testing-helpers';

const { readYamlFileSync } = require('@bolt/build-tools/utils/yaml');
const { join } = require('path');
const schema = readYamlFileSync(join(__dirname, '../text.schema.yml'));
const {
  tag,
  display,
  color,
  align,
  opacity,
  quoted,
  'line-height': lineHeight,
  'letter-spacing': letterSpacing,
  'text-transform': textTransform,
  'font-family': fontFamily,
  'font-size': fontSize,
  'font-style': fontStyle,
  'font-weight': fontWeight,
} = schema.properties;

const timeout = 90000;

describe('<bolt-text> Component', () => {
  let page;

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://127.0.0.1:4444/', {
      timeout: 0,
      waitLoad: true,
      waitNetworkIdle: true, // defaults to false
    });
  }, timeout);

  // Basic Usage (Shadow DOM)
  test('Default <bolt-text> w/ Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is regular text`;
      document.body.appendChild(text);

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // Code text (Shadow DOM)
  test('Code text using <bolt-text> w/ Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is code text`;
      text.setAttribute('font-family', 'code');
      document.body.appendChild(text);

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // xxxlarge Headline (Shadow DOM)
  test('xxxlarge headline using <bolt-text> w/ Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is xxxlarge headline`;
      text.setAttribute('headline', true);
      text.setAttribute('font-size', 'xxxlarge');
      document.body.appendChild(text);

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // xxxlarge Headline (Light DOM)
  test('xxxlarge headline using <bolt-text> w/o Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is xxxlarge headline`;
      text.setAttribute('headline', true);
      text.setAttribute('font-size', 'xxxlarge');
      document.body.appendChild(text);
      text.useShadow = false;
      text.updated();

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(
      renderedHTML
        .querySelector('.c-bolt-text-v2')
        .classList.contains('c-bolt-text-v2--font-size-xxxlarge'),
    ).toBe(true);

    expect(
      renderedHTML
        .querySelector('.c-bolt-text-v2')
        .classList.contains('is-long'),
    ).toBe(false);

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // Long xxxlarge Headline (Shadow DOM)
  test('Long xxxlarge headline using <bolt-text> w/ Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida ex.`;
      text.setAttribute('headline', true);
      text.setAttribute('font-size', 'xxxlarge');
      document.body.appendChild(text);

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // Long xxxlarge Headline (Light DOM)
  test('Long xxxlarge headline using <bolt-text> w/o Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida ex.`;
      text.setAttribute('headline', true);
      text.setAttribute('font-size', 'xxxlarge');
      document.body.appendChild(text);
      text.useShadow = false;
      text.updated();

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(
      renderedHTML
        .querySelector('.c-bolt-text-v2')
        .classList.contains('is-long'),
    ).toBe(true);

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // All caps xxlarge bold quote (Shadow DOM)
  test('All caps xxlarge bold quote using <bolt-text> w/ Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is a quote`;
      text.setAttribute('quoted', true);
      text.setAttribute('letter-spacing', 'wide');
      text.setAttribute('text-transform', 'uppercase');
      text.setAttribute('font-size', 'xxlarge');
      text.setAttribute('font-weight', 'bold');
      document.body.appendChild(text);

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // All caps xxlarge bold quote (Light DOM)
  test('All caps xxlarge bold quote using <bolt-text> w/o Shadow DOM renders', async function() {
    const renderedTextHTML = await page.evaluate(() => {
      const text = document.createElement('bolt-text');

      text.textContent = `This is a quote`;
      text.setAttribute('quoted', true);
      text.setAttribute('letter-spacing', 'wide');
      text.setAttribute('text-transform', 'uppercase');
      text.setAttribute('font-size', 'xxlarge');
      text.setAttribute('font-weight', 'bold');
      document.body.appendChild(text);
      text.useShadow = false;
      text.updated();

      return text.outerHTML;
    });

    const renderedHTML = await html(renderedTextHTML);
    const image = await page.screenshot();

    expect(
      renderedHTML
        .querySelector('.c-bolt-text-v2')
        .classList.contains(
          'c-bolt-text-v2--quoted',
          'c-bolt-text-v2--letter-spacing-wide',
          'c-bolt-text-v2--text-transform-uppercase',
          'c-bolt-text-v2--font-size-xxlarge',
          'c-bolt-text-v2--font-weight-bold',
        ),
    ).toBe(true);

    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.01',
      failureThresholdType: 'percent',
    });

    expect(renderedHTML).toMatchSnapshot();
  });

  // @todo: Bold, wide letter spacing, color, and quoted
});
