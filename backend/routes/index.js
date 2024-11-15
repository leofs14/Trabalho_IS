var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTk4NWZmMGIxNzdkNDcyYTRjMmVhZWQ3NGZiY2I0OSIsIm5iZiI6MTczMTY2Mjc2NC4xMjA2OTIsInN1YiI6IjY3MzcxMjg4YWM5ZjNiYTA4MTU1ODk0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yRC3iv_SPRnhzytswd2tWCDHXN1YJnFGNdx3T1R3kzA'
  }
};

fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));