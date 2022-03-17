'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Film(filmID, name, favorite=false, date, rating){
    this.filmID = filmID;
    this.name = name;
    this.favorite = favorite;
    this.date = date && dayjs(date);
    this.rating = rating;
}

function FilmLibrary(){
    const db = new sqlite.Database('films.db', err => { if(err) throw err; });

    // get all films
    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating));
                    resolve(films);
                }
            })
        }
    )};

    //get vavorite films
    this.getFavorites = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE films.favorite = TRUE";
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const favfilms = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating));
                    resolve(favfilms);
                }
            })
        })
    }

    // get films watched today
    this.getWatchedToday = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE films.watchdate = ?";
            db.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const filmwatched = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating))
                    resolve(filmwatched);
                }
            })
        })
    };

    // get films watched before date
    this.getWatchedBeforeDate = (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE films.watchdate < DATE(?)";
            db.all(sql, [dayjs(date).format('YYYY-MM-DD')], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const filmwatched = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating))
                    resolve(filmwatched);
                }
            })
        })
    }

    // get films with rate bigger or equal to rating passed
    this.getByRating = (rating) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE films.rating >= ?";
            db.all(sql, [rating], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const filmwatched = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating))
                    resolve(filmwatched);
                }
            })
        })
    }

    // get film by title
    this.getByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE films.title = ?";
            db.all(sql, [title], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite ? true : false, row.watchdate, row.rating))
                    resolve(films);
                }
            })
        })
    }


}


async function main(){
    const filmLib = new FilmLibrary();

    const films = await filmLib.getAll();
    const favfilms = await filmLib.getFavorites();
    const filmsWatchedToday = await filmLib.getWatchedToday();
    const filmsWatchedBefore = await filmLib.getWatchedBeforeDate('2022-03-12');
    const filmsWithRatingGT4 = await filmLib.getByRating(4);
    const StarWars = await filmLib.getByTitle('Star Wars');
    console.log(StarWars);

}

main();