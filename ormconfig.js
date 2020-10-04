module.exports = {
  type: "postgres",
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  synchronize: false,
  logging: true,
  entities: ["src/**/entities/*.entity.js", "dist/**/entities/*.entity.js"],
  migrations: ["src/**/migrations/*.ts", "dist/**/migrations/*.ts"],
  subscribers: ["src/**/subscriber/*.ts", "dist/**/subscriber/*.js"],
  cli: {
    "entitiesDir": "src/db/entities",
    "migrationsDir": "src/db/migrations",
    "subscribersDir": "src/db/subscriber"
  }
}
