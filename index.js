const traktor = require('./traktor'),
    config = require('./config'),
    request = require('request'),
    _ = require('lodash');



let queryTrakt = (path) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.trakt.tv' + path,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': 0,
                'trakt-api-version': 2,
                'trakt-api-key': 'b5dfe539c6583fc0ffa91bccfb6a449a840c90a01705cdd8bdd30c3cfc78b6c7'
            }
        }, (err, response, data) => {
            if(err || response.statusCode >= 300){
                reject(err);
            }
            try{
                resolve(JSON.parse(data));
            }catch (ex){
                reject(ex);
            }
        });
    });
};

let getLists = () => {
    return queryTrakt('/users/' + config.trakt.user_id + '/lists')
};

let getWatched = () => {
    return queryTrakt('/users/' + config.trakt.user_id + '/watched/shows')
};

let getLastEpisode = (showId) => {
    return queryTrakt('/shows/' + showId + '/last_episode')
};

/*getLists().then((data) => {
    console.log(data)
});*/


getWatched().then((data) => {
    data.forEach((watchedShow) => {
        //console.log(show.show.title)

        getLastEpisode(watchedShow.show.ids.imdb).then((lastEpisode) => {
            let lastWatched = {};
            lastWatched.season = _.last(_.sortBy(watchedShow.seasons, 'number'));
            lastWatched.episode = _.last(_.sortBy(lastWatched.season.episodes, 'number'));
            if(lastWatched.season.number < lastEpisode.season || lastWatched.episode.number < lastEpisode.number){
                console.log('--------');
                console.log(watchedShow.show.title);
                console.log('Last watched:\t' + lastWatched.season.number + 'x' + lastWatched.episode.number);
                console.log('Last aired:  \t' + lastEpisode.season + 'x' + lastEpisode.number)
            }
        }).catch((err) => {
            console.error(err);
        });
    })
}).catch((err) => {
    console.error(err);
});
