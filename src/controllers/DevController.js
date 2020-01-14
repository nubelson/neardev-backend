const axios = require('axios')

const Dev = require('../models/Dev')

module.exports = {
	async store(req, res) {
		const { github_username, techs, latitude, longitude } = req.body

		let dev = await Dev.findOne({ github_username })

		if (!dev) {
			const techsArray = techs
				.split(',')
				.map(tech => tech.trim().toUpperCase())

			const response = await axios.get(
				`https://api.github.com/users/${github_username}`
			)
			const { name = login, avatar_url, bio } = response.data

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			}

			dev = await Dev.create({
				name,
				github_username,
				bio,
				techs: techsArray,
				avatar_url,
				location
			})
		}

		return res.json(dev)
	}
}