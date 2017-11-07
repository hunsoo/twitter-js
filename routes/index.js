const express = require('express');
const router = express.Router();
const tweetBank = require('../tweetBank');

let allTweets = (req, res) => {
  res.render('index', {tweets: tweetBank.list()});
};

router.get('/', allTweets);
router.get('/tweets', allTweets);

router.get('/users/:name', (req, res) => {
  var name = req.params.name;
  var tweets = tweetBank.find( {name: name} );
  res.render( 'index', { tweets: tweets, name: name, showForm: true } );
});

router.get('/tweets/:id', (req, res) => {
  var id = Number(req.params.id);
  var tweet = tweetBank.find( {id: id} );
  res.render( 'index', {tweets: tweet});
})

module.exports = (io) => {
  router.post('/tweets', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    tweetBank.add(name, text);
    io.sockets.emit('newTweet', {name: name, content: text});
    res.redirect('/');
  });

  return router;
};
