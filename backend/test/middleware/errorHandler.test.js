const { expect } = require('chai');
const sinon = require('sinon');
const errorHandler = require('../../src/middleware/errorHandler');

describe('errorHandler', () => {
  it('returns a generic 500 response', () => {
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    errorHandler(new Error('boom'), {}, res, () => {});

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledWith({ error: 'Internal server error' })).to.equal(true);
  });
});