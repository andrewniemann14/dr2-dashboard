import { useRouter } from "next/router";
import TableRow from '../../../components/TableRow';

export default function Profile(props) {
  const router = useRouter();
  const name = router.query.name;
  const nationality = props.profileEntries[0]['nationality'];

  // profile score: overallScore
  let overallScore = 0;
  props.profileEntries.forEach(e => {
    overallScore += e['score'];
  });
  overallScore = (overallScore / props.profileEntries.length).toFixed(1)

  // scored classes: classesWithScores
  let classesWithScores = Object();
  props.classes.forEach(c => {
    let classEntries = props.profileEntries.filter(e => {
      return e['vehicle_class'] == c['vehicle_class'];
    })
    let classScore = 0;
    classEntries.forEach(e => {
      classScore += e['score'];
    })
    classScore = (classScore / classEntries.length).toFixed(2);
    classesWithScores[c['vehicle_class']] = classScore;
  })

  // scored countries: countriesWithScores
  let countriesWithScores = Object();
  props.countries.forEach(c => {
    let countryEntries = props.profileEntries.filter(e => {
      return e['country'] == c['country'];
    })
    let countryScore = 0;
    countryEntries.forEach(e => {
      countryScore += e['score'];
    })
    countryScore = (countryScore / countryEntries.length).toFixed(2);
    countriesWithScores[c['country']] = countryScore;
  })


  return (
    <div>
      {/* profile at a glance: name and score, with flag */}
      <div>
        <h1>{name}</h1>
        <h3>{nationality}</h3>
        <h3>{overallScore}</h3>
      </div>


      {/* score by class */}
      <div>
        {Object.keys(classesWithScores).map((c, i) => {
          return (
            <div key={i}>
              <span key={i}>
                {Object.keys(classesWithScores)[i]}
              </span>
              <span>
                {classesWithScores[c]}
              </span>
            </div>
          )
        })}
      </div>

      {/* score by country */}
      <div>
        {Object.keys(countriesWithScores).map((c, i) => {
          return (
            <div key={i}>
              <span key={i}>
                {Object.keys(countriesWithScores)[i]}
              </span>
              <span>
                {countriesWithScores[c]}
              </span>
            </div>
          )
        })}
      </div>


      {/* recent challenges */}
      <table border="1">
        <TableRow props={Object.keys(props.profileEntries[0])}/>
        {props.profileEntries.map((c, i) => {
          return (
            <TableRow key={i} props={c}/>
          )
        })}
      </table>
    </div>
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
  const [profileEntries, fields] = JSON.parse(JSON.stringify(await conn.execute("SELECT * FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))
  const [classes, classFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT DISTINCT vehicle_class FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))
  const [countries, countryFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT DISTINCT country FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))

  return {
    props: {
      "profileEntries": profileEntries,
      "classes": classes,
      "countries": countries,
    }
  }

}