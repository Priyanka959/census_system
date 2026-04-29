function createBuilder(result) {
  const builder = {
    where: function where() { return builder; },
    whereNot: function whereNot() { return builder; },
    select: function select() { return builder; },
    orderBy: function orderBy() { return builder; },
    groupBy: function groupBy() { return builder; },
    insert: function insert() { return builder; },
    update: function update() { return builder; },
    returning: function returning() { return builder; },
    first: function first() { return builder; },
    del: function del() { return builder; },
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };

  return builder;
}

function createKnexMock(responses = []) {
  const calls = [];
  const mock = function knex(table) {
    calls.push(table);
    return createBuilder(responses.length ? responses.shift() : undefined);
  };

  mock.calls = calls;
  mock.raw = (sql) => sql;

  return mock;
}

module.exports = createKnexMock;