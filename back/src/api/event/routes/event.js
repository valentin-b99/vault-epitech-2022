'use strict';

/**
 * event router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events',
      handler: 'event.find',
    },
  ],
};
