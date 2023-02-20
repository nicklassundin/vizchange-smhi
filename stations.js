
const request = require("request")
const PARAMS = require("./params.json")
class Stations {
    constructor() {
    }
    get paramsRequests () {
        let requests = []
        Object.values(PARAMS).forEach((value) => {
            requests.push(new Promise((resolve, reject) => {
                request({
                    "url": value.url,
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
    getStations (param) {
        return this.paramsRequests.then((response) => {
            let stations = {}
            response.forEach(each => {
                if(param === undefined || each.key === PARAMS[param].id){
                    each.station.forEach(station => {
                        if(stations[station.id] === undefined) stations[station.id] = {}
                        stations[station.id].id = station.id;
                        stations[station.id].name = station.name
                        stations[station.id].longitude = station.longitude
                        stations[station.id].latitude = station.latitude
                        if(stations[station.id].params === undefined) stations[station.id].params = {}
                        stations[station.id].params[each.key] = station
                    })
                }
            })
            return Object.values(stations)
        })
    }
}
module.exports.Stations = Stations