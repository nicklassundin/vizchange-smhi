const {Stations} = require('./stations.js')

const assert = require('assert');

let stations = new Stations();
describe('Stations', function () {
    it('construct', function () {
        return stations.paramsRequests.then((results) => {
            //console.log(results)
            return assert.equal(results.length, 2)
        })
    })
    it('stations', function () {
        console.log(stations.getStations())
        return stations.getStations().then((results) => {
            console.log(results)
        })
    })
})
