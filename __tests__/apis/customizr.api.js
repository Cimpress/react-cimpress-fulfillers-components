const assert = require("assert");
const nock = require("nock");

const paths = {
  client: "../../src/apis/customizr.api.js"
};

const CustomizrClient = require(paths.client);

const serviceUrl = "https://www.customizr.com";
const resourceUrl = "https://www.myservice.com";
const token = "mytoken";
const mockSettings = {
  primitiveValue: true,
  array: [false, false, false]
};

afterEach(() => {
  nock.cleanAll();
});

describe("for CustomizrClient", () => {
  describe("for getSettings", () => {
    it("correctly retrieves settings", async () => {
      nock(serviceUrl)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get(`/v1/resources/${encodeURIComponent(resourceUrl)}/settings`)
        .reply(200, mockSettings);

      let client = new CustomizrClient(serviceUrl, resourceUrl);
      let response = await client.getSettings(token);

      assert.deepEqual(response, mockSettings);
    });
  });

  describe("for putSettings", () => {
    it("shallowly merges existing settings with updates", async () => {
      let update = {
        udpatedKey: true
      };
      let mockUpdatedSettings = Object.assign({}, mockUpdatedSettings, update);

      nock(serviceUrl)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get(`/v1/resources/${encodeURIComponent(resourceUrl)}/settings`)
        .reply(200, mockSettings)
        .put(`/v1/resources/${encodeURIComponent(resourceUrl)}/settings`)
        .reply(200, mockUpdatedSettings)

      let client = new CustomizrClient(serviceUrl, resourceUrl);
      let response = await client.putSettings(token, update);

      assert.deepEqual(response, mockUpdatedSettings);
    });
  });
});
