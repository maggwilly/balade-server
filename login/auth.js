const ObjectId = require('mongodb').ObjectId;
//const exports = module.exports = {};


 exports.checkUser =  (socket,db) => {
     return  new Promise((resolve, reject) => {
       db.collection('users').find({
     socket: socket.id
   }).toArray((err, data) => {
     if (err) {
       return resolve(false); 
     }
     if (!data || !data[0] || !data[0]._id|| !data[0].online) {
       return resolve(false);
     }
     resolve(data[0]); 
       })
   });
   }

 exports.setupAuth = (socket,db) =>{

    let logUserIn = user => {
		let usr = {
            userID: user.userID,
			name: user.name,
            image: user.image,
            birthday:user.birthday,
            email: user.email,
            gender: user.gender,
            singupdate:Date.now(),
            online: true,
            socket: socket.id,
        };
      console.log(usr);
      
        socket.emit('login_successful', usr);

        db.collection('users').update({
			_id: user._id },usr,(err, data) => {
            if (err) return console.log(err);
            ///socket.broadcast.emit('online', usr); notifiy my friends tha t i m online
        })
	};


	// recieve a jwt from the client and authenticate them
	socket.on('auth', userID => {
        console.log(userID);
		if (!userID ) {
			return socket.emit('auth_error', 'invalid userID');
		}
		// this is optional. you can typicaly assume the token is valid if you prefer and skip this additinal lookup
		db.collection('users').find({
			userID: userID
		}).toArray((err, data) => {
			if (err) {
				socket.emit('auth_error', 'Error fetching user');
				return console.log(err);
            }
        
			if (!data || !data[0] || !data[0]._id) {
				socket.emit('auth_error', 'inconsistant data fecth');
				return console.log('data', data);
			}
			return logUserIn(data[0]);
		});
	});

	
	socket.on('login', authUser => {
		if (!authUser) {
			return;
		}
             db.collection('users').find({
                userID: authUser.userID 
            }).toArray((err, data) => {
                if (err) {
                    socket.emit('login_error', 'Error');
                    return console.log(err);
                }
                if (!data.length) {
                        let avatar = (Math.floor(Math.random() * (17 - 1 + 1)) + 1) + '';
                        avatar = '00'.substring(0, '00'.length - avatar.length) + avatar;
                        db.collection('users').insert({
                            userID: authUser.userID,
                            name: authUser.name,
                            image: '1-81-' + avatar + '.svg',
                            gender: authUser.gender,
                            birthday: authUser.birthday,
                            email: authUser.email,
                            singupdate:Date.now()
                        }, (err, data) => {
                            if (err) {
                                socket.emit('login_error', 'Error');
                                return console.log(err);
                            }
                            return logUserIn(data.ops[0]);
                        });
                
                } else {
                    return	logUserIn(data[0]);	
                }
                     
        })

	});
 }