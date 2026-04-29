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

describe('GET /results', () => {
  it('returns parsed gender counts', async () => {
    const knexMock = createKnexMock([
      [
        { age: '18', gender: 'male', count: '2' },
        { age: '22', gender: 'female', count: '4' },
      ],
    ]);
    const resultsRoutes = proxyquire('../../src/routes/results', {
      '../config/knex': knexMock,
    });

    const { res, nextError } = await invokeGetRoute(resultsRoutes, {});

    expect(nextError).to.equal(null);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.deep.equal([
      { age: 18, gender: 'male', count: 2 },
      { age: 22, gender: 'female', count: 4 },
    ]);
  });
});