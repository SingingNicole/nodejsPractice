const mongoose = require('mongoose');
// 교재 오류 추가 수정 => MongooseError: Mongoose.prototype.connect() no longer accepts a callback
const mongoURI = 'mongodb://nodejs:nodejs@localhost:27017/admin';


/* const connect = () => {
    if(process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    
    mongoose.connect('mongodb://root:nodejsbook@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true,
    }, (error) => {
        if(error) {
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공.');
        }
    });
};
*/

const connect = async() => {
    try {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.set("strictQuery", false);
        mongoose.connect(mongoURI);
        console.log('몽고디비 연결 성공.');
    } catch(error) {
        console.log('몽고디비 연결 에러', error);
    }
};

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러.', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;