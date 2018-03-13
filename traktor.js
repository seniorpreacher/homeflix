const config = require('./config'),
    Trakt = require('trakt.tv');

var _trakt;

var _traktor = {
    init: function(){
        _trakt = new Trakt({
            client_id: config.trakt.client_id,
            client_secret: config.trakt.client_secret,
            redirect_uri: null
        });

    },
    authenticate: function(){
        _trakt.get_codes().then(function(poll) {
            // poll.verification_url: url to visit in a browser
            // poll.user_code: the code the user needs to enter on trakt

            console.log('Enter the "' + poll.user_code + '" code at: ' + poll.verification_url);


            // trakt.poll_access(poll).then(function (re) {
            //     console.log(re)
            // }).catch(function(error) {
            //     console.error(error)
            // })

            // trakt.users.watched({'username': config.trakt.user_id, 'type': 'shows', user_code: poll.user_code}).then(function(response) {
            //      console.log(3, response);
            // }, function(error) {
            //     console.log(error);
            // });
            return trakt.poll_access(poll).then(function(newTokens){
                _traktor.saveToken(newTokens);
            });
        }).catch(function(error) {
            console.error(error)
        });
    },
    saveToken: function(token){
        fs.writeFileSync(JSON.stringify(traktTokenFile), token, {flag: 'w'});
    },
    reuseToken: function(token){
        trakt.import_token(token).then(function(newTokens) {
            _traktor.saveToken(newTokens);
        });
    }
}

module.exports = _traktor;