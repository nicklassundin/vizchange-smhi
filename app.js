const request = require("request"),

	// CONSTANTS
	SMHI_STATION_NAME_URL = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json",
	SMHI_STATION_URL = [
		"https://opendata-download-metobs.smhi.se/api/version/latest/parameter/",
		"/station/",
		"/period/",
		"/data.csv"
	],

	SMHI_PARAM = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/",

	// parameters
	// lifttemp momentan värder en 1/timmen: 1 
	// lufttemperature: 2
	// snödjup: 8
	// lufttryck: 9
	
smhi = {
	"archive": "corrected-archive",
	"months": "latest-months",
	"days": "latest-day",
	"hour": "latest-hour"
},

	/*
	 * Return array of all TODO generalize with WMO, currently only accept SMHI_STATION_NAME_URL
	 * TODO input generalize function for different html documents
	 */
	getName = function (url, i) {

		const res = $.getJSON(
			url,
			(json) => {

				/*
				 * Console.log(json.station[0]);
				 * Console.log(json.station);
				 */
				console.log(json.station[i]);
				const name = `<li>${json.station[i].name}</li>`;
				$(
					"<ul/>",
					{
						"class": "Station Name",
						"html": name
					}
				).appendTo("body");

			}
		).
			done(() => {

				console.log("Get JSON done");

			}).
			fail((jqxhr, textStatus, error) => {

				console.log("Get JSON error");

			}).
			always(() => {

				console.log("Get JSON complete");

			});

	},
	// $(document).ready(getName(SMHI_STATION_NAME_URL, 0));

	// // input ID from station and period currently string "latest-months"

	smhiParam = {
		"temp": {
			"id": 1,
			"url": `${SMHI_PARAM}1.json`
		},
		"perc": {
			"id": 5,
			"url": `${SMHI_PARAM}5.json`
		}
	},

	get_smhi_station_url = function (ID, param, period = smhi.archive) {

		const res = SMHI_STATION_URL[0] + param + SMHI_STATION_URL[1] + ID + SMHI_STATION_URL[2] + period + SMHI_STATION_URL[3];
		return res;

	},

	/*
	 * TEMP get temprature from SMHI
	 * TODO generalize function for WMO
	 */
	getTempSMHI = function (id, type) {

		url = get_smhi_station_url(
			id,
			smhi[type]
		);
		const res = $.getJSON(
			url,
			(json) => {

				let values = json.value,
					item = [];
				values = values.map((each) => ({
					"date": new Date(each.date),
					"value": each.value,
					"quality": each.quality
				}));

				/*
				 * Console.log(values)
				 * Item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all
				 */

				/*
				 * $("<ul/>", {
				 * 	"class": "station temperature",
				 * 	Html: item
				 * }).appendTo("body");
				 */

			}
		).done(() => {

			console.log("get JSON getTempSMHI done");

		}).
			fail((jqxhr, textStatus, error) => {

				console.log("get JSON error");

			}).
			always(() => {

				console.log("get JSON finished");

			});
		return res;

	},

	// $(document).ready(getTempSMHI(get_smhi_station_url(159880, smhi.months)));


	csv_smhi_json = function (id, type) {

		url = get_smhi_station_url(
			id,
			smhi[type]
		);
		result = $.getJSON(
			url,
			(json) => {

				const values = json.value,
					item = [];

				/*
				 * Item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all
				 * $("<ul/>", {
				 * 	"class": "station temperature",
				 * 	Html: item
				 * }).appendTo("body");
				 */

			}
		).done(() => {

			console.log("get JSON getTempSMHI done");

		}).
			fail((jqxhr, textStatus, error) => {

				console.log("get JSON error");

			}).
			always(() => {

				console.log("get JSON finished");

			});
		return result;

	},

	restApiStations = function (parmFile = smhiParam.temp) {

		return new Promise((resolve, reject) => {

			console.log(parmFile.url);
			request(
				{
					"url": parmFile.url,
					"json": true,
					"path": "/",
					"method": "GET"
				},
				(error, response, body) => {

					if (error) {

						reject(error);

					} else {

						resolve(body);

					}

				}
			);

		});

	};
const {Stations} = require('./stations.js')
exports.stations = new Stations();

exports.init = function (app) {

	const smhiRestApi = function (body, parmFile, fileName, type = "text/csv") {

		app.get(
			`/data/${fileName}/smhi`,
			(req, res) => {

				res.send(body);

			}
		);
		Object.keys(body.station).forEach((key) => {

			const {id} = body.station[key];
			app.get(
				`/data/${id}/${fileName}.csv`,
				(req, res) => {

					request(
						{
							"url": get_smhi_station_url(
								id,
								parmFile.id
							),
							"json": true,
							"path": "/",
							"method": "GET"
						},
						(error, response, body) => {

							res.set(
								"Content-Type",
								type
							);
							res.status(200).end(body);

						}
					);

				}
			);

		});

	};

	restApiStations(smhiParam.perc).then((result) => {

		smhiRestApi(
			result,
			smhiParam.perc,
			"precipitation"
		);

	});
	restApiStations(smhiParam.temp).then((result) => {

		smhiRestApi(
			result,
			smhiParam.temp,
			"temperature"
		);

	});

};
