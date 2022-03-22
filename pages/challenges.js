import TableRow from '../components/TableRow';

export default function challenges(props) {
  return (
    props.challenges.map((c, i) => {
      return (
        <TableRow key={i} props={c}/>
      )
    })
  )
}



export async function getServerSideProps(context) {
  const mysql = require('mysql2/promise');
  // use connection pool instead to make it faster, make previous connection reusable
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dr2',
    password: 'password'
  });
  const [challenges_rows, fields] = JSON.parse(JSON.stringify(await conn.execute("SELECT * FROM challenges", [])))

  return {
    props: {
      "challenges": challenges_rows,
    }
  }

}