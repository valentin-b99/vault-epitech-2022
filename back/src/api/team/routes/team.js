'use strict';

/**
 * team router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/teams',
      handler: 'team.find',
    },
  ],
};
