'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
  find: async ctx => {
    ctx.body = await strapi.query('api::event.event')
      .findMany({
        select: ['id', 'score', 'reason'],
        populate: {
          team: {
            select: ['id', 'name'],
          },
        },
        orderBy: {
          createdAt: 'DESC',
        },
        limit: 25,
      });
  },
}));
