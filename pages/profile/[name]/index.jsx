import Head from 'next/head';
import { useRouter } from "next/router";

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from "@mui/material/Link";
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,

  display: 'flex',
  justifyContent: 'space-between',
}));

export default function Profile(props) {

  const getLastXEntries = (entries, number) => {
    let lastEntries = entries.slice(-number).sort((a,b) => {
      return b['start'].localeCompare(a['start']);
    })
    return lastEntries;
  }

  const getScoredArray = (propsArray, column) => {
    let scoredArray = [];
    propsArray.forEach(c => { // get the entries that pertain to each class:
      let filteredEntries = entries.filter(e => {
        return e[column] == c;
      })
      // get average score of these entries
      let score = 0;
      filteredEntries.forEach(e => {
        score += e['score'];
      })
      score = (score / filteredEntries.length).toFixed(2);

      scoredArray.push([c, score]);
    })

    scoredArray.sort((a, b) => { // sort array
      return b[1] - a[1];
    })
    return scoredArray;
  }

  const getOverallScore = () => {
    let score = 0;
    let sampleSize = 100;
    let recentEntries = getLastXEntries(entries, sampleSize);
    recentEntries.forEach(e => {
      score += e['score'];
    });
    // average divides by length if number of entries is insufficient
    score = (score / ((sampleSize <= recentEntries.length) ? sampleSize : recentEntries.length)).toFixed(1)
    return score;
  }

  const getDate = (dateTimeString) => {
    let date = dateTimeString.split('T')[0]
    let { year, month, day } = date.split('-');

    return date;
  }

  const router = useRouter();
  const name = router.query.name;
  const { entries, classes, countries } = props;
  const nationality = entries[0]['nationality'];
  const overallScore = getOverallScore(entries);
  const classesWithScores = getScoredArray(classes, 'vehicle_class');
  const countriesWithScores = getScoredArray(countries, 'country');
  const recentEntries = getLastXEntries(entries, 10);


  return (
    <Container sx={{
      width: 1,
      padding: 2,
      background: '#111'
      
    }}>
      <Head>
        <title>DR2.0: {name}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* profile summary */}
      <Paper sx={{p: 1, maxWidth: 800, m: 'auto'}}>
        <Grid container justifyContent="space-between">

          <Grid item xs={12} >
            <Typography variant="h1" textAlign="center" fontWeight="bold">{name}</Typography>
          </Grid>

          <Grid item xs={6} justifyItems='flex-start' >
            <Img src={`/flags/${nationality}.png`} sx={{margin:0, maxHeight: 60}} />
          </Grid>
          
          <Grid item xs={6} >
            <Typography variant="h2" textAlign="right">{overallScore}</Typography>
          </Grid>

        </Grid>
      </Paper>


      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        m: 2,
      }}>

        {/* score by class */}
        <Paper sx={{p: 2}}>
          <Stack spacing={1} maxWidth={400}>
            <Typography variant="h5" textAlign="center" >Class performance</Typography>
            {classesWithScores.map(e => {
              return (
                <Item key={e[0]}>
                  <span>{e[0].replace('eRally', '').replace('Caps', '')}</span> {/* TODO: make a prettify function for classes/countries */}
                  <span>{e[1]}</span>
                </Item>
              )
            })}
          </Stack>
        </Paper>

        {/* score by country */}
        <Paper sx={{p: 2}}>
          <Stack spacing={1} maxWidth={400}>
            <Typography variant="h5" textAlign="center">Country performance</Typography>
            {countriesWithScores.map(e => {
              return (
                <Item key={e[0]}>
                  <span>{e[0].substring(1)}</span>
                  <span>{e[1]}</span>
                </Item>
              )
            })}
          </Stack>
        </Paper>
      </Box>


      {/* recent challenges */}
      <Paper sx={{
        p: 1,
        overflowX: 'scroll',
      }}>
        <Typography variant='h5' textAlign='center'>Recent challenges</Typography>

        <Table>
          <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Stage</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
          {recentEntries.map((entry, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{getDate(entry['start'])}</TableCell>
                <TableCell>{entry['country'].substring(1)}</TableCell>
                <TableCell><Link href={`/stage/${entry['stage']}`} color='inherit'>{entry['stage']}</Link></TableCell>
                <TableCell>{entry['vehicle_class'].replace('eRally', '').replace('Caps', '')}</TableCell>
                <TableCell><Link href={`/vehicle/${entry['vehicle']}`} color='inherit'>{entry['vehicle']}</Link></TableCell>
                <TableCell>{entry['time']}</TableCell>
                <TableCell>{entry['score'].toFixed(2)}</TableCell>
              </TableRow>
            )
          })}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

// TODO:
// challenges.jsx
// https://mui.com/components/data-grid/
// show ALL challenges and use DataGrid so you can filter for class, order by score, etc.

// TODO:
// records.jsx
// fastest time per stage, per car (not class)
// https://mui.com/components/tabs/






export async function getServerSideProps(context) {
  const mysql = require('mysql2/promise');
  // use connection pool instead to make it faster, make previous connection reusable
  const conn = await mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USERNAME,
    // database: process.env.DB_DATABASE,
    // password: process.env.DB_PASSWORD
    host: 'https://niemann.app/',
    user: 'niemann8_dr2_usr',
    database: 'niemann8_dr2',
    password: '7-!^hz927k;p'
  });
  const [entries, entryFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT * FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))
  const [classes, classFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT DISTINCT vehicle_class FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))
  const [countries, countryFields] = JSON.parse(JSON.stringify(await conn.execute("SELECT DISTINCT country FROM leaderboard INNER JOIN challenges ON leaderboard.challenge_id = challenges.id WHERE name=?", [context.query.name])))

  return {
    props: {
      "entries": entries,
      "classes": classes.map(c => { return c['vehicle_class'] }),
      "countries": countries.map(c => { return c['country'] }),
    }
  }

}