'use strict';

/**
 * team controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::team.team', ({ strapi }) => ({
  find: async ctx => {
    const knex = strapi.db.connection;

    const teams = await strapi.query('api::team.team')
      .findMany({
        select: ['id', 'name', 'slug'],
        populate: {
          icon: true,
        },
      });

    ctx.body = await Promise.all(teams.map(async team => {
      const scores = await knex('events')
        .leftJoin('events_team_links', 'events.id', 'events_team_links.event_id')
        .leftJoin(
          'teams',
          'events_team_links.team_id',
          'teams.id'
        )
        .where('teams.id', team.id)
        .sum({ score: 'score' });

      return {
        ...team,
        score: scores[0]?.score ?? 0,
      };
    }));
  },
}));
