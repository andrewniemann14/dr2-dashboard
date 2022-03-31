import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography'



export default function current(props) {
  
  const { todaysChallenges, topEntries } = props;
  console.log(topEntries[0]);
  console.log(topEntries[1]);

  const getDate = (dateTimeString) => {
    let date = dateTimeString.split('T')[0]
    // let { year, month, day } = date.split('-');
    return date;
  }

  

  return (
    <Paper sx={{
      p: 1,
    }}>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Typography variant='h5' textAlign='center'>Today's challenges</Typography>

      <Table>
        <TableHead>
        <TableRow>
          <TableCell>Country</TableCell>
          <TableCell>Stage</TableCell>
          <TableCell>Class</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {todaysChallenges.map((c, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{c['country'].substring(1)}</TableCell>
              <TableCell>{c['stage']}</TableCell>
              <TableCell>{c['vehicle_class'].replace('eRally', '').replace('Caps', '')}</TableCell>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>


      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Typography variant='h5' textAlign='center'>Fastest times</Typography>

      <Table>
        <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Vehicle</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Score</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {todaysChallenges.forEach((c, i) => {
          try {
          return (
            <TableRow key={i}>
              <TableCell>{getDate(tops[i]['start'])}</TableCell>
              <TableCell>{tops[i]['vehicle']}</TableCell>
              <TableCell>{tops[i].time}</TableCell>
              <TableCell>{tops[i].score}</TableCell>
            </TableRow>
          )
          } catch {
            return (
              <TableRow key={i}>
                <TableCell>Not found</TableCell>
                <TableCell>Not found</TableCell>
                <TableCell>Not found</TableCell>
                <TableCell>Not found</TableCell>
              </TableRow>
            )
          }
        })}
        </TableBody>
      </Table>
    </Paper>
  )
}




export async function getServerSideProps(context) {
  const mysql = require('mysql2/promise');
  // use connection pool instead to make it faster, make previous connection reusable
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
  });
  const [todaysChallenges, todayFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT * FROM challenges ORDER BY id DESC LIMIT 2")))
  const name = "8ourne"
  const [top0, top0Fields] = JSON.parse(JSON.stringify(await conn.execute(
    "SELECT start, vehicle, time, score FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=? AND stage=? AND vehicle_class=? ORDER BY time ASC LIMIT 1",
    [name, todaysChallenges[0].stage, todaysChallenges[0].vehicle_class])))
  const [top1, top1Fields] = JSON.parse(JSON.stringify(await conn.execute(
    "SELECT start, vehicle, time, score FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=? AND stage=? AND vehicle_class=? ORDER BY time ASC LIMIT 1",
    [name, todaysChallenges[1].stage, todaysChallenges[1].vehicle_class])))


  return {
    props: {
      "todaysChallenges": todaysChallenges,
      "topEntries": [top0, top1]
    }
  }
}