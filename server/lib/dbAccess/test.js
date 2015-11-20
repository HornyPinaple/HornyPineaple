/**
 * Created by yuval_000 on 11/19/2015.
 */
var config = {
    mongodbServerUrl: 'horny-pineapple.cloudapp.net:27017',
    dbName:'uberfind'
};

var DbAccess = require('../dbAccess');

var dbAccess = new DbAccess();

dbAccess.connect(config.mongodbServerUrl,config.dbName).then(function(){
    dbAccess.createUser('yuval',0525392753).then(function(userId){
        console.log(userId);
        dbAccess.upsertLocations(userId,'loc1','loc2').then(function(){
           console.log('Success.');
            dbAccess.getUser(userId).then(function(user){
                console.log('User found.');
                console.log(user);
            });
        });
    });
})