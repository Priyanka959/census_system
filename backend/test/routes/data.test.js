const { expect } = require('chai');
const proxyquire = require('proxyquire');
const createKnexMock = require('../helpers/createKnexMock');

const invokeGetRoute = async (router, req) => {
  const layer = router.stack.find((entry) => entry.route && entry.route.path === '/');
  const handler = layer.route.stack[0].handle;
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  let nextError = null;
  await handler(req, res, (err) => {
    nextError = err;
  });
  return { res, nextError };
};

describe('GET /data', () => {
  it('returns records with formatted birthdates', async () => {
    const knexMock = createKnexMock([
      [
        {
          id: 1,
          name: 'Jane',
          birthdate: '2024-04-29T00:00:00.000Z',
          gender: 'female',
          is_vaccinated: true,
        },
      ],
    ]);
    const dataRoutes = proxyquire('../../src/routes/data', {
      '../config/knex': knexMock,
    });

    const { res, nextError } = await invokeGetRoute(dataRoutes, {});

    expect(nextError).to.equal(null);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.count).to.equal(1);
    expect(res.body.data[0].birthdate).to.equal('29-04-2024');
  });
});