const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongo = require('./config');
const {KeywordSchema, UserSchema} = require('./schema');
const db = mongoose.createConnection(`mongodb://${mongo.name}:${mongo.pwd}@${mongo.url}:${mongo.port}/${mongo.db}`, {
	poolSize: 10,
  useNewUrlParser: true,
  auth: {
      authSource: 'cloudmusic'
  }
});

db.on('error', (err)=>{
	console.log('database have a error: ', err)
})
db.on('connected', ()=>{
	console.log('database is connected!')
})
db.on('disconnected', () => { 
	console.log('disconnected!') 
})

module.exports = {
  Keyword: db.model('Keyword', KeywordSchema),
  User: db.model('User', UserSchema)
};
