const AdminBro = require('admin-bro');
const { News } = require('./news.entity');

const {
  after: uploadAfterHook,
  before: uploadBeforeHook,
} = require('./actions/upload-image.hook');

/** @type {AdminBro.ResourceOptions} */
const options = {
  properties: {
    profilePhotoLocation: {
      isVisible: false,
    },
    uploadImage: {
      components: {
        edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
        list: AdminBro.bundle('./components/upload-image.list.tsx'),
      },
    },
  },
  actions: {
    new: {
      after: (response, request, context) => {
        return uploadAfterHook(response, request, context);
      },
      before: (request, context) => {
        return uploadBeforeHook(request, context);
      },
    },
    edit: {
      after: (response, request, context) => {
        return uploadAfterHook(response, request, context);
      },
      before: (request, context) => {
        return uploadBeforeHook(request, context);
      },
    },
    show: {
      isVisible: false,
    },
  },
};

module.exports = {
  options,
  resource: News,
};
