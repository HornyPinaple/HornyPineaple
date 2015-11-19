/**
 * Created by yuval_000 on 11/19/2015.
 */
var q = require('q');

function DbAccess(){
    this.mongoClient = require('mongodb').MongoClient
    this.db = null;
    this.usersCollection = null;
}


DbAccess.prototype.connect = function (serverUrl,dbName){
    var deferred = q.defer();
    var self = this;
    var url = 'mongodb://'+serverUrl+'/'+ dbName;
    self.mongoClient.connect(url, function(err, db) {
        if(err){
            deferred.reject(err);
        }else{
            console.log("Connected correctly to server");
            self.db = db;
            self.usersCollection = db.collection('users');
            deferred.resolve();
        }
    });
    return deferred.promise;
};


DbAccess.prototype.disconnect = function(){
    if(this.db){
        this.db.close();
    }
}

DbAccess.prototype.createUser = function(name,phoneNumber){
    var deferred = q.defer();

    var userJson = {
        name:name,
        phoneNumber:phoneNumber
    };

    this.usersCollection.insertOne(userJson,function(err,result){
        if(err){
            deferred.reject(err);
        }else {
            var insertedUserId = result["ops"][0]["_id"]
            deferred.resolve(insertedUserId);
        }
    });
    return deferred.promise;
};

DbAccess.prototype.upsertLocations = function(userId , currentLocation,destinationLocation){
    var deferred = q.defer();

    var updateJson = {
        currentLocation:currentLocation,
        destinationLocation:destinationLocation
    }

    this.usersCollection.update({"_id":userId },updateJson,{"upsert":true},function(err,result){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve();
        }
    });
    return deferred.promise;
};

DbAccess.prototype.getCompaninons = function(userId){

};

module.exports=DbAccess;



