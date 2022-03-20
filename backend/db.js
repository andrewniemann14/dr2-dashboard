// https://www.mysqltutorial.org/mysql-nodejs/connect/
// https://github.com/jeremydaly/serverless-mysql
// https://www.simplenextjs.com/posts/next-mysql

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // port: 3306,
  user: 'root',
  database: 'dr2',
  password: 'password'
});

export default async function executeQuery() {
  try {
    console.log("db.js running...");
    db.query("SELECT * FROM challenges",
    (err, results, fields) => {
      if (err) {
        // console.log(err);
        return err;
      }
      console.log("query finished");
      return results; // GOOD RESULTS
    });
  } catch (err) {
    return {err} // why the braces?
  }
}

// END








// let sql = `SELECT * FROM leaderboard WHERE name=?`;
// connection.query(sql, ['8ourne'], (err, results, fields) => {
//   if (err) return console.log(err);
//   data = results;
// })


// connection.end((err) => {
//   if (err) return console.log(err);

//   console.log("Closing database connection after queries complete");
// })
