module.exports = {
  register(/* { strapi } */) {},
  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const requiredPermissions = [
          'api::page.page.find',
          'api::page.page.findOne',
          'api::author.author.find',
          'api::author.author.findOne',
          'api::category.category.find',
          'api::category.category.findOne',
          'api::tag.tag.find',
          'api::tag.tag.findOne',
          'api::enquiry.enquiry.create',
        ];

        for (const action of requiredPermissions) {
          const existingPerm = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action },
          });

          if (!existingPerm) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id, enabled: true },
            });
            strapi.log.info(`[Bootstrap] Auto-granted public permission: ${action}`);
          }
        }
      }
    } catch (err) {
      strapi.log.warn(`[Bootstrap] Could not verify public permissions: ${err.message}`);
    }
  },
};
