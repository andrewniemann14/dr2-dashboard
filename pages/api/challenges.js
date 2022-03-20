/* https://nextjs.org/docs/api-routes/introduction
*
* Next treats files in pages/api as endpoints. they need to export a request handler function
*
*/

import executeQuery from "../../backend/db";

// TODO: here's the problem, it's not passing on the perfectly good return of db.js

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    executeQuery()
    .then((data) => {
      res.status(200).json(data)
    })
  } catch (err) {
    console.log(err);
  }
}
