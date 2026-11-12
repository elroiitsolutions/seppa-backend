'use strict';

const { sendEnquiryNotification } = require('../../services/email');

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    // Only send if not already handled by custom controller
    if (result && !result._emailSent) {
      try {
        await sendEnquiryNotification(result);
      } catch (err) {
        console.error('[Lifecycle Enquiry Email Error]:', err.message);
      }
    }
  },
};
