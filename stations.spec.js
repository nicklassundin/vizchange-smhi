const {Stations} = require('./stations.js')

const assert = require('assert');

let stations = new Stations();
describe('Stations', function () {
    it('construct', function () {
        return stations.paramsRequests.then((results) => {
            return assert.equal(results.length, 5)
        })
    })
    it('stations', function () {
        return stations.getStations().then((results) => {
            return true
        })
    })
    it.only('station params', function () {
        return stations.getStations().then((results) => {
            let station = results[0]
            console.log(station)
            return station
        })
    })
})
