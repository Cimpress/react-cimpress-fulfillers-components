const { pope } = require('pope');
const axios = require('axios');

const DEFAULT_BASE_URL = 'https://customizr.at.cimpress.io';
const API = {
  v1Settings: '/v1/resources/{{resource}}/settings'
};

class CustomizrClient {
  constructor(baseUrl, resource) {
    this.baseUrl = baseUrl || DEFAULT_BASE_URL;
    this.resource = encodeURIComponent(resource);

  }

  static _isCimpressDomain(url) {
    return url.match(/https:\/\/[^/]*cimpress\.io\//) !== null;
  }

  buildUrl(path) {
    return `${this.baseUrl}${pope(path, { resource: this.resource })}`;
  }

  static addAuth(url, options, token) {
    let bearerToken = (token || "").startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
    if (CustomizrClient._isCimpressDomain(url)) {
      options.headers = Object.assign({}, (options.headers || {}), {
        Authorization: bearerToken
      });
    }
  }

  async getSettings(token) {
    let url = this.buildUrl(API.v1Settings);
    let options = {};

    CustomizrClient.addAuth(url, options, token);

    try {
      let response =  await axios.get(url, options);
      return response.data;
    } catch (err) {
      if (err.response.status !== 404) {
          throw err;
      }
      return {};
    }
  }

  async putSettings(token, update) {
    let settings = await this.getSettings(token);
    let newSettings = Object.assign({}, settings, update);

    let url = this.buildUrl(API.v1Settings);
    let options = {
    };

    CustomizrClient.addAuth(url, options, token);

    let response = await axios.put(url, newSettings, options);
    return response.data;
  }
}

export default CustomizrClient;
