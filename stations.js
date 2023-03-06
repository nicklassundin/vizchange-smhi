
const request = require("request")
const PARAMS = require("./params.json")
class Stations {
    constructor() {
    }
    get paramsRequests () {
        let requests = []
        Object.values(PARAMS.map).forEach((value) => {
            requests.push(new Promise((resolve, reject) => {
                request({
                    "url": PARAMS.url.replace('[PARAMS]', value),
                    "json": true,
                    "path": "/",
                    "method": "GET"
                }, (error, response, body) => {
                    if (error) reject(error);
                    resolve(body);
                });
            }));
        })
        return Promise.all(requests);
    }
    getStations () {
        return this.paramsRequests.then((response) => {
            let stations = {}
            response.forEach(each => {
                each.station.forEach(station => {
                    if(stations[station.id] === undefined) stations[station.id] = {}
                    stations[station.id].id = station.id;
                    stations[station.id].name = station.name
                    stations[station.id].formatedName = station.name.replace(' ', '-');
                    stations[station.id].longitude = station.longitude
                    stations[station.id].latitude = station.latitude
                    if(stations[station.id].params === undefined) {
                        stations[station.id].params = {}
                    }
                    stations[station.id].params[each.key] = station
                })
            })
            return Object.values(stations).filter(each => Object.keys(each.params).length > 3)
        })
    }
}
module.exports.Stations = Stations