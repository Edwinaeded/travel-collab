module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'travel_collab',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE_NAME,
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql'
  }
}
