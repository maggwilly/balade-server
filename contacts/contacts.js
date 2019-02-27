const ObjectId = require('mongodb').ObjectId,

 var exports = module.exports = {};

 	// get a list of contacts for the current user
    exports.getContacts =(currentUser,db)  => {
		return new Promise((resolve, reject) => {
			db.collection('users').find({

			}).toArray((err, data) => {
				if (err) {
					reject();
					return console.log(err);
				}
				if (!data || !data[0]) {
					resolve([]);
					return;
				}

				let contacts = data.map(contact => {
					let online = false;

					for (let x in users) {
						if (users[x].id == contact._id) {
							online = true;
							break;
						}
					}
					return {
						id: contact._id + '',
						name: contact.name,
						username: contact.username,
						image: contact.image,
						online: online
					};
				});
				resolve(contacts);

			});
		});
	};