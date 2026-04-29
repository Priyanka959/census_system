const { expect } = require('chai');
const proxyquire = require('proxyquire');
const createKnexMock = require('../helpers/createKnexMock');

const invokeCountRoute = async (router, req) => {
  const layer = router.stack.find((entry) => entry.route && entry.route.path === '/');
  const handlers = layer.route.stack.map((entry) => entry.handle);
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
  for (const handler of handlers) {
    await handler(req, res, () => {});
    if (res.body) {
      break;
    }
  }
  return res;
};

describe('GET /counts', () => {
  it('returns parsed age counts when query is valid', async () => {
    const knexMock = createKnexMock([
      [
        { age: '18', count: '3' },
        { age: '22', count: '1' },
      ],
    ]);
    const countsRoutes = proxyquire('../../src/routes/counts', {
      '../middleware/validate': {
        validateCounts: (req, res, next) => next(),
      },
      '../config/knex': knexMock,
    });

    const res = await invokeCountRoute(countsRoutes, {
      query: { is_vaccinated: 'true' },
    });

    expect(res.statusCode).to.equal(200);
    expect(res.body.is_vaccinated).to.equal(true);
    expect(res.body.data).to.deep.equal([
      { age: 18, count: 3 },
      { age: 22, count: 1 },
    ]);
  });

  it('rejects invalid query values', async () => {
    const knexMock = createKnexMock();
    const countsRoutes = proxyquire('../../src/routes/counts', {
      '../config/knex': knexMock,
    });

    const layer = countsRoutes.stack.find((entry) => entry.route && entry.route.path === '/');
    const validateCounts = layer.route.stack[0].handle;
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

    validateCounts({ query: { is_vaccinated: 'maybe' } }, res, () => {});

    expect(res.statusCode).to.equal(400);
    expect(res.body.error).to.equal("is_vaccinated must be 'true' or 'false'");
  });
});