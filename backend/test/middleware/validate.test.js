const { expect } = require('chai');
const sinon = require('sinon');
const { validateVote, validateCounts } = require('../../src/middleware/validate');

const createRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

describe('validate middleware', () => {
  afterEach(() => sinon.restore());

  it('normalizes a valid vote payload', () => {
    const req = {
      body: {
        name: '  Jane Doe  ',
        is_vaccinated: true,
        birthdate: '29-04-2000',
        gender: 'FEMALE',
      },
    };
    const res = createRes();
    const next = sinon.spy();

    validateVote(req, res, next);

    expect(next.calledOnce).to.equal(true);
    expect(req.body.name).to.equal('Jane Doe');
    expect(req.body.gender).to.equal('female');
    expect(req.body.parsedBirthdate).to.be.instanceOf(Date);
  });

  it('rejects missing query param for counts', () => {
    const req = { query: {} };
    const res = createRes();
    const next = sinon.spy();

    validateCounts(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it('rejects invalid vaccination flag for counts', () => {
    const req = { query: { is_vaccinated: 'maybe' } };
    const res = createRes();
    const next = sinon.spy();

    validateCounts(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(next.called).to.equal(false);
  });
});