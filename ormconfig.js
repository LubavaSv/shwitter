module.exports = {
  type: "mysql",
  host: "localhost",
  port: "3306",
  username: "root",
  password: "zt75pl3d",
  database: "shwitter_db",
  synchronize: false,
  logging: true,
  entities: ["src/**/*.entity.ts", "dist/**/*entity.ts"]
}