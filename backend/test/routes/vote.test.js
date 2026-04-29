const { expect } = require('chai');
const proxyquire = require('proxyquire');
const createKnexMock = require('../helpers/createKnexMock');

const buildVoteRoutes = (responses) => {
  const knexMock = createKnexMock(responses);
  return proxyquire('../../src/routes/vote', {
    '../middleware/validate': {
      validateVote: (req, res, next) => next(),
    },
    '../config/knex': knexMock,
  });
};

const invokeRoute = async (router, method, path, req) => {
  const layer = router.stack.find((entry) =>
    entry.route && entry.route.path === path && entry.route.methods && entry.route.methods[method]
  );
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
  for (const routeLayer of layer.route.stack) {
    await routeLayer.handle(req, res, () => {});
    if (res.body) {
      break;
    }
  }
  return res;
};

describe('vote routes', () => {
  const payload = {
    name: 'Jane Doe',
    is_vaccinated: true,
    birthdate: '29-04-2000',
    gender: 'female',
  };

  it('creates a record', async () => {
    const routes = buildVoteRoutes([
      undefined,
      [{ id: 1, name: 'Jane Doe', is_vaccinated: true }],
    ]);

    const res = await invokeRoute(routes, 'post', '/', {
      body: { ...payload, parsedBirthdate: new Date('2000-04-29T00:00:00Z') },
      params: {},
    });

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.include({ id: 1, name: 'Jane Doe' });
  });

  it('rejects duplicate create requests', async () => {
    const routes = buildVoteRoutes([
      { id: 1, name: 'Jane Doe' },
    ]);

    const res = await invokeRoute(routes, 'post', '/', {
      body: { ...payload, parsedBirthdate: new Date('2000-04-29T00:00:00Z') },
      params: {},
    });

    expect(res.statusCode).to.equal(409);
    expect(res.body.error).to.equal('Record already exists');
  });

  it('returns 404 when updating a missing record', async () => {
    const routes = buildVoteRoutes([
      undefined,
    ]);

    const res = await invokeRoute(routes, 'put', '/:id', {
      body: { ...payload, parsedBirthdate: new Date('2000-04-29T00:00:00Z') },
      params: { id: '99' },
    });

    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.equal('Record not found');
  });

  it('updates a record', async () => {
    const routes = buildVoteRoutes([
      { id: 1, name: 'Jane Doe' },
      undefined,
      [{ id: 1, name: 'Jane Doe', gender: 'female' }],
    ]);

    const res = await invokeRoute(routes, 'put', '/:id', {
      body: { ...payload, parsedBirthdate: new Date('2000-04-29T00:00:00Z') },
      params: { id: '1' },
    });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
  });

  it('returns 404 when deleting a missing record', async () => {
    const routes = buildVoteRoutes([
      undefined,
    ]);

    const res = await invokeRoute(routes, 'delete', '/:id', {
      params: { id: '9' },
    });

    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.equal('Record not found');
  });

  it('deletes a record', async () => {
    const routes = buildVoteRoutes([
      { id: 1, name: 'Jane Doe' },
      undefined,
    ]);

    const res = await invokeRoute(routes, 'delete', '/:id', {
      params: { id: '1' },
    });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
  });
});