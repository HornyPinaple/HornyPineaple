/**
 * Created by yuval_000 on 11/19/2015.
 */
var q = require('q');
var geolib = require('geolib');

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

    this.usersCollection.update({"_id":userId},{$set:updateJson},{"upsert":true},function(err,result){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve();
        }
    });
    return deferred.promise;
};

DbAccess.prototype.getUser  = function(userId){
    var deferred = q.defer();

    var cursor =this.usersCollection.find( { _id: userId } );
    cursor.each(function(err, doc) {
        if (err ||  doc == null) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
}

DbAccess.prototype.getCompaninons = function(userId){
    var deferred = q.defer();

    this.usersCollection.get(userId).then(function(user){
        var allUsers = [];
        var allUsersCursor = this.usersCollection.find({currentLocation: { $exists: true }});
        allUsersCursor.each(function(err, doc){
            if (err ||  doc == null) {
                deferred.reject(err);
            } else{
                doc.distance = geolib.getDistance(
                    {latitude: user.currentLocation.lng, longitude: user.currentLocation.lat},
                    {latitude: doc.currentLocation.lng, longitude: doc.currentLocation.lat} +
                    {latitude: user.destinationLocation.lng, longitude: user.destinationLocation.lat},
                    {latitude: doc.destinationLocation.lng, longitude: doc.destinationLocation.lat});
                allUsers.push(doc);
            }
            allUsers.sort(function(a,b){
                if(a.distance < b.distance){
                    return -1;
                }
                if(a.distance < b.distance){
                    return -1;
                }
                return 0;
            });
            deferred.resolve(allUsers);
        });



    });
    return deferred.promise;
};

module.exports=DbAccess;



