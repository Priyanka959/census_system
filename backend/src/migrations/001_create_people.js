exports.up = (knex) =>
  knex.schema
    .raw(`CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other')`)
    .createTable('people', (table) => {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.boolean('is_vaccinated').notNullable();
      table.timestamp('birthdate').notNullable();
      table.specificType('gender', 'gender_enum').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });

exports.down = (knex) =>
  knex.schema.dropTable('people').raw('DROP TYPE gender_enum');
