'use strict';

/**
 * enquiry controller
 */

const { factories } = require('@strapi/strapi');
const { sendEnquiryNotification } = require('../services/email');

module.exports = factories.createCoreController('api::enquiry.enquiry', ({ strapi }) => ({
  async create(ctx) {
    // 1. Create record via standard core controller logic
    const response = await super.create(ctx);

    // 2. Dispatch email notification asynchronously
    try {
      const enquiryData = ctx.request.body?.data || response?.data;
      if (enquiryData) {
        sendEnquiryNotification(enquiryData).catch((err) => {
          strapi.log.error('[Enquiry Email Dispatch Error]: ' + (err?.message || err));
        });
      }
    } catch (err) {
      strapi.log.error('[Enquiry Hook Error]: ' + (err?.message || err));
    }

    return response;
  }
}));
