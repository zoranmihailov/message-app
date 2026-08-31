export default async function () {
  process.loadEnvFile('.env');
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}