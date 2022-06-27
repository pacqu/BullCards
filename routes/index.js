var express = require('express');
var router = express.Router();
const axios = require('axios');
var moment = require('moment'); // require
moment().format(); 

const BASE_URL = "http://statsapi.mlb.com/api/v1/";

/* GET home page. */
router.get('/team', function (req, res, next) {
  let teamParams = Object.assign({
    teamId: "147",
  }, req.query);
  axios.get(BASE_URL + "teams/", {
    params: teamParams
  }).then(result => {
    res.json(result.data);
  }).catch(err => next(err));
});

router.get('/roster', function (req, res, next) {
  const teamId = req.query.teamId ? req.query.teamId : 147
  axios.get(BASE_URL + `teams/${teamId}/roster`)
  .then(result => {
    res.json(result.data);
  }).catch(err => next(err));
});

router.get('/pitchers', function (req, res, next) {
  const teamId = req.query.teamId ? req.query.teamId : 147
  axios.get(BASE_URL + `teams/${teamId}/roster`)
    .then(result => {
      const pitchers = result.data.roster.filter(player => player.position.code === "1")
      res.json(pitchers)
      //how to handle sent-down pitchers?
    }).catch(err => next(err));
});

router.get('/lastgames', function (req, res, next) {
  const schedParams = {
    sportId: 1,
    teamId: (req.query.teamId ? req.query.teamId : 147), 
    pastNDays: (req.query.days ? req.query.days : 10),
    endDate: moment().format("MM/DD/YYYY"),
    startDate: moment().subtract((req.query.days ? req.query.days : 10), 'days').format("MM/DD/YYYY"),
  }
  axios.get(BASE_URL + "schedule/", {
    params: schedParams
  }).then(result => {
      res.json(result.data)
  }).catch(err => console.log(err));
});

router.get('/pitchcounts', function (req, res, next) {
  const gameIds = req.query.gameIds ? req.query.gameIds : [661300, 661893]
  const teamId = req.query.teamId ? req.query.teamId : 147
  Promise.all(gameIds.map(id => axios.get("http://statsapi.mlb.com/api/v1.1/" + `game/${id}/feed/live`)))
  .then(results => {
    const counts = {}
    results.forEach(game => {
      const gameId = game.data.gameData.game.pk
      const boxscore = game.data.liveData.boxscore
      const team = boxscore.teams.away.team.id === teamId ? boxscore.teams.away : boxscore.teams.home
      const pitchers = Object.values(team.players).filter(player => player.position.code === '1' && Object.keys(player.stats.pitching).length)
      counts[gameId] = pitchers 
    })
    res.send(counts)
  }).catch(err => {console.log(err); res.send(err)})
});

module.exports = router;

/*router.get('/pitchcounts', function (req, res, next) {
  const schedParams = {
    sportId: 1,
    teamId: (req.query.teamId ? req.query.teamId : 147),
    pastNDays: (req.query.days ? req.query.days : 10),
    endDate: moment().format("MM/DD/YYYY"),
    startDate: moment().subtract((req.query.days ? req.query.days : 10), 'days').format("MM/DD/YYYY"),
  }
  axios.get("http://statsapi.mlb.com/api/v1/schedule/", {
    params: schedParams
  }).then(result => {
    const gameIds = []
    for (const date of result.data.dates) {
      for (const game of date.games) {
        gameIds.push(game.gamePk)
      }
    }
    //const gameIds = [661300, 661893]
    //const teamId = 147
    Promise.all(gameIds.map(id => axios.get(BASE_URL + `game/${id}/feed/live`)))
      .then(results => {
        const counts = {}
        results.forEach(game => {
          const gameId = game.data.gameData.game.pk
          const boxscore = game.data.liveData.boxscore
          const team = boxscore.teams.away.team.id === schedParams.teamId ? boxscore.teams.away : boxscore.teams.home
          const pitchers = Object.values(team.players).filter(player => player.position.code === '1' && Object.keys(player.stats.pitching).length)
          //return { [gameId]: pitchers }
          counts[gameId] = pitchers
        })
        res.send(counts)
      }).catch(err => { console.log(err); res.send(err) })
  }).catch(err => console.log(err));
});*/