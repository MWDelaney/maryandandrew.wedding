/** import external dependencies */
import 'jquery';
import 'bootstrap';

/** import local dependencies */
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import aboutUs from './routes/about';

import Headroom from 'headroom.js/dist/headroom';

$(function() {
  let header = document.querySelector('header.banner');
  let headroom = new Headroom(header, {
    'offset': 100,
    'tolerance': 5,
    'classes': {
      'initial': 'animated',
      'pinned': 'slideInDown',
      'unpinned': 'slideOutUp',
    },
  });
  headroom.init();
});

/**
 * Populate Router instance with DOM routes
 * @type {Router} routes - An instance of our router
 */
const routes = new Router({
  /** All pages */
  common,
  /** Home page */
  home,
  /** About Us page, note the change from about-us to aboutUs. */
  aboutUs,
});

/** Load Events */
jQuery(document).ready(() => routes.loadEvents());
