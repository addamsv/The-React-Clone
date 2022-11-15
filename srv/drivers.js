import pkg from 'pg';
import credentials from './credentials.js';

const { Pool } = pkg;

/*
const example = {
  count: 87,
  next: 'http://yourOwnPath.com/?page=2',
  previous: null,
  results: [{}, {}, {}, {}]
}
*/

const getTableData = async (system, table) => {
  // Connect with a connection pool.
  const pool = new Pool(credentials);
  // console.log(`select * from "${system}"."${table}"`);
  const data = await pool.query(`select * from "${system}"."${table}"`);
  await pool.end();
  return {rows: data.rows, fields: data.fields};
}

const getQueryData = async (query) => {
  const pool = new Pool(credentials);
  // console.log(query);
  const data = await pool.query(query);
  await pool.end();
  return {rows: data.rows, fields: data.fields};
}

export default getTableData;
export { getQueryData };
