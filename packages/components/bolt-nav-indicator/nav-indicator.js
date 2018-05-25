import {
  h,
  render,
  define,
  props,
  BoltComponent,
  css,
  spacingSizes,
  hasNativeShadowDomSupport,
} from '@bolt/core';

import gumshoe from 'gumshoejs';
import isVisible from 'is-visible';

// const indicatorElement = '.js-bolt-nav-indicator';
const navLinkElement = 'bolt-navlink'; // Custom element
const isActiveClass = 'is-active';

// Listen for smooth scroll events so we can determine whether or not a link was just clicked on vs if the user is scrolling (to change animation behavior)
function logScrollEvent(event) {
  if (event.type === 'scrollStart'){
    window.isScrolling = true;
  } else if (event.type === 'scrollStop' || event.type === 'scrollCancel') {
    window.isScrolling = false;
  }
}

// Listen for smooth-scroll events
document.addEventListener('scrollStart', logScrollEvent, false);
document.addEventListener('scrollStop', logScrollEvent, false);
document.addEventListener('scrollCancel', logScrollEvent, false);


// gumshoeStateModule stores an offset value that persists even when it's called multiple times.  If the offset
// is the same as the last time it was called, it avoids initializing gumshoe again (among other things, when
// initializing multiple navbars on one page, this only initializes gumshoe once).  If the offset value HAS changed--
// presumably because the header has adjusted its own height--gumshoe will be re-initialized with the new value.


/* From Modernizr */
function whichTransitionEndEvent() {
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
  }

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}


@define
export class BoltNavIndicator extends BoltComponent() {
  static is = 'bolt-nav-indicator';

  // Behavior for `<bolt-nav>` parent container
  static get observedAttributes() { return ['offset']; }

  constructor(self) {
    self = super(self);
    this.activeLink = false;
    this.isAnimating = false;
    this.useShadow = hasNativeShadowDomSupport;

    // Ensure that 'this' inside the _onWindowResize event handler refers to <bolt-nav-link>
    // even if the handler is attached to another element (window in this case)
    this._onWindowResize = this._onWindowResize.bind(this);
    return self;
  }

  static initGumshoeModule(element) {
    const navSelectorInstance = element;

    if (this.gumshoeInstance) {
      return this.gumshoeInstance;
    } else {
      this.offset; // Private variable
      this.gumshoeInstance = {}; // public object - returned at end of module to allow external interaction
      let oldElement;
      let newElement;

      this.gumshoeInstance.setOffset = function (newOffset) {
        if (this.offset !== newOffset) {
          this.offset = newOffset;

          gumshoe.init({
            selector: 'bolt-nav-indicator a',
            // All the link activation logic is handled in the callback, but gumshoe won't work without a value for activeClass, so we give it a placeholder.
            activeClass: 'has-gumshoe-focus',
            scrollDelay: false,
            offset: this.offset,
            callback(nav) {
              const originalTarget = document.querySelector('.has-gumshoe-focus');
              let originalTargetHref;

              let normalizedTarget;


              // If nav or originalTarget don't exist, exit and skip doing any updates
              if (!nav && !originalTarget) {
                return;
              }

              if (originalTarget){
                originalTargetHref = originalTarget.getAttribute('href');
              } else {
                originalTargetHref = nav.nav.getAttribute('href');
              }

              // Need to target via document vs this custom element reference since only one gumshoe instance is shared across every component instance to better optimize for performance
              const matchedTargetLinks = document.querySelectorAll(`bolt-navlink > [href*="${originalTargetHref}"]`);

              for (var i = 0, len = matchedTargetLinks.length; i < len; i++) {
                const linkInstance = matchedTargetLinks[i];

                // Stop if normalizedTarget already set.
                if (normalizedTarget){
                  break;
                }

                // Prefer visible links over hidden links
                if (isVisible(linkInstance)){
                  normalizedTarget = linkInstance;

                // If a better match hasn't been found by this point, use the last element in the array.
                } else if (i === len - 1){
                  normalizedTarget = originalTarget;
                }
              }

              const normalizedParent = normalizedTarget.parentNode;

              navSelectorInstance.resetLinks(normalizedParent);
              normalizedParent.activate();
            },
          });
        }
      };

      this.gumshoeInstance.getOffset = function () {
        return this.offset;
      };

      return this.gumshoeInstance;
    }
  }

  render() {
    return this.html`
      ${this.slot('default')}
    `
  }

  get offset() {
    return this.getAttribute('offset');
  }

  set offset(value) {
    // Reflect the value of the offset property as an HTML attribute.
    if (value) {
      this.setAttribute('offset', value);
    }
  }

  /**
   * Automatically tell any nested `<bolt-navlink>` elements to deactivate,
   * optionally skip over the one being activated
   */
  resetLinks(activeLink = null) {
    const links = this._allLinks();
    links.forEach(link => {
      if (link !== activeLink) {
        link.deactivate();
      }
    });
  }

  // flushCss() is used to make sure the previous CSS alterations are complete before continuing.
  // See https://stackoverflow.com/questions/34726154/temporarily-bypass-a-css-transition/34726346
  flushCss(element) {
    // By reading the offsetHeight property, we are forcing
    // the browser to flush the pending CSS changes (which it
    // does to ensure the value obtained is accurate).
    element.offsetHeight;
  }

  // Return all the nested nav-link children for manually resetting at the parent-level
  _allLinks() {
    return Array.from(this.querySelectorAll(navLinkElement));
  }

  // `_onActiveLink` handles the `activateLink` event emitted by the children
  _onActivateLink(event) {
    if (event.detail.isVisible) {
      this._animateIn(event.target);
    } else {
      this._animateOut(event.target);
    }

    this.activeLink = event.target;
  }

  _onWindowResize() {
    if (this.activeLink) {
      this._animateIn(this.activeLink);
    }
  }

  // `_animateIn` animates the line for the active link
  _animateIn(link) {
    if (this.isAnimating && window.isScrolling) {
      return;
    }

    if (!this.isAnimating){
      this.isAnimating = true;
    }

    const linkPos = link.getBoundingClientRect(); // object w/ all positioning
    const linkWidth = linkPos.width;
    const linkHeight = linkPos.height;
    const linkOffsetLeft = link.offsetLeft;
    const linkOffsetTop = link.offsetTop;
    const linkOffsetVertical = linkPos.top + linkHeight / 2;
    const linkOffsetHorizontal = linkOffsetLeft + linkWidth / 2;

    if (link.hasAttribute('is-dropdown-link')) {
      this._indicator.style.opacity = 0;
      return;
    }

    // No link is currently active; the first link to become active is a special snowflake when it comes to animation.
    if (!this.activeLink) {

      // First, immediately center the indicator.
      this._indicator.style.transition = 'none';
      this._indicator.style.opacity = 1;
      this._indicator.style.width = linkWidth + 'px';
      this._indicator.style.transform = 'translateX(' + linkOffsetLeft + 'px) scaleX(0)';

      // Then, reset the transition and expand the indicator to the full width of the link.
      this.flushCss(this._indicator);
      this._indicator.style.transition = '';
      this._indicator.style.opacity = 1;
      this._indicator.style.width = linkWidth + 'px';
      this._indicator.style.transform = 'translateX(' + linkOffsetLeft + 'px) scaleX(1)';

    } else {
      this._indicator.style.opacity = 1;
      this._indicator.style.width = linkWidth + 'px';
      this._indicator.style.transform = 'translateX(' + linkOffsetLeft + 'px) scaleX(1)';
    }
  }

  // hide the animated line when the active link can't be seen / is nested in a dropdown
  _animateOut(link) {
      this._indicator.style.opacity = 0;
    }

  _initializeGumshoe() {
    this.gumshoeStateModule = BoltNavIndicator.initGumshoeModule(this);
    this.gumshoeStateModule.setOffset(this.offset);
  }

  // `<bolt-nav-link>` emits a custom event when the link is active
  connecting() {
    Promise.all([
      customElements.whenDefined('bolt-nav-priority'),
      customElements.whenDefined('bolt-navlink'),
    ]).then(_ => {
      const indicatorElem = document.createElement('li');
      indicatorElem.classList.add('c-bolt-nav-indicator');

      const indicatorElement = this.querySelector('ul').appendChild(indicatorElem);
      this._indicator = indicatorElement;


      // Get the closest navbar component (if it exists) to use as a fallback offset
      const navbarParent = this.closest('bolt-navbar');
      if (navbarParent){
        this.offsetDefault = navbarParent.offsetHeight;
      }

      this.offset = this.hasAttribute('offset') ? this.getAttribute('offset') : this.offsetDefault;

      this._initializeGumshoe();
      this._upgradeProperty('offset');

      this.addEventListener('navlink:active', this._onActivateLink);
      window.addEventListener('optimizedResize', this._onWindowResize);
      this.addEventListener(whichTransitionEndEvent(), this._onTransitionEnd);
    });
  }

  // connected() {
  //   // Wait until navlinks are ready to go before double-check if any are already active
  //   Promise.all([
  //     customElements.whenDefined('bolt-navlink'),
  //   ]).then(_ => {

  //     // Check if a nested <bolt-navlink> element is already active / we might have missed the activateLink event. If an active link is found, let's proactively re-activate to trigger appropriate events.
  //     if (!this.activeLink){
  //       const nestedNavlinks = this.querySelectorAll('bolt-navlink');
  //       nestedNavlinks.forEach(navlink => {
  //         if (navlink.isActive()) {
  //           navlink.activate();
  //         }
  //       });
  //     }
  //   });
  // }

  _onTransitionEnd(){
    if (this.isAnimating) {
      this.isAnimating = false;
    }
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  // Clean up event listeners when being removed from the page
  disconnecting() {
    this.removeEventListener('navlink:active', this._onActivateLink);
    window.removeEventListener('optimizedResize', this._onWindowResize);
  }
}


// Create a custom 'optimizedResize' event that works just like window.resize but is more performant because it
// won't fire before a previous event is complete.
// This was adapted from https://developer.mozilla.org/en-US/docs/Web/Events/resize
(function () {
  function throttle(type, name, obj) {
    obj = obj || window;
    let running = false;

    function func() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    }
    obj.addEventListener(type, func);
  }

  // Initialize on window.resize event.  Note that throttle can also be initialized on any type of event,
  // such as scroll.
  throttle('resize', 'optimizedResize');
})();

