import {
  isConnected,
  render,
  renderString,
  stopServer,
  html,
  vrtDefaultConfig,
} from '../../../testing/testing-helpers';
import schema from '../layout.schema';
const { disabled } = schema.properties;
const timeout = 90000;

describe('Layout', () => {
  let page;

  afterAll(async () => {
    await stopServer();
    await page.close();
  });

  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = '';
    });
  }, timeout);

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://127.0.0.1:4444/', {
      timeout: 0,
    });
  }, timeout);

  test('basic usage', async () => {
    const results = await render('@bolt-components-layout/layout.twig');
    expect(results.ok).toBe(true);
    expect(results.html).toMatchSnapshot();
  });

  test('adds class via Drupal Attributes', async () => {
    const results = await render('@bolt-components-layout/layout.twig', {
      attributes: {
        class: ['u-bolt-margin-top-medium'],
      },
    });
    expect(results.ok).toBe(true);
    expect(results.html).toMatchSnapshot();
  });

  test('renders with Shadow DOM', async function() {
    const shadowRoot = await page.evaluate(async () => {
      document.body.insertAdjacentHTML(
        'beforeend',
        '<bolt-layout>Layout test</bolt-layout>',
      );
      const el = document.querySelector('bolt-layout');
      await el.updateComplete;
      return el.renderRoot.innerHTML;
    });

    const outerHTML = await page.evaluate(async () => {
      const el = document.querySelector('bolt-layout');
      await el.updateComplete;
      return el.outerHTML;
    });

    const renderedShadowDomHTML = await html(shadowRoot);
    expect(renderedShadowDomHTML).toMatchSnapshot();

    const renderedHTML = await html(outerHTML);
    expect(renderedHTML).toMatchSnapshot();

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot(vrtDefaultConfig);
  });

  test('renders without Shadow DOM', async function() {
    const outerHTML = await page.evaluate(async () => {
      document.body.insertAdjacentHTML(
        'beforeend',
        '<bolt-layout no-shadow>Layout test</bolt-layout>',
      );
      const el = document.querySelector('bolt-layout');
      await el.updateComplete;
      return el.outerHTML;
    });

    const renderedHTML = await html(outerHTML);
    expect(renderedHTML).toMatchSnapshot();

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot(vrtDefaultConfig);
  });

  test(`sets 'disabled' prop`, async () => {
    const results = await render('@bolt-components-layout/layout.twig', {
      disabled: true,
    });
    expect(results.ok).toBe(true);
    expect(results.html).toMatchSnapshot();
  });
});