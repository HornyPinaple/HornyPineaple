/**
 * Created by yuval_000 on 11/19/2015.
 */
var q = require('q');

function DbAccess(){

}


DbAccess.prototype.connect = function (){

};

DbAccess.prototype.createUser = function(name,phoneNumber){
    var deferred = q.defer();

    deferred.resolve('sd7f658f7w6etuy');

    return deferred.promise;
};

DbAccess.prototype.upsertLocations = function(userGuid , currentLocation,destinationLocation){
    var deferred = q.defer();

    deferred.resolve();

    return deferred.promise;
};

DbAccess.prototype.getCompaninons = function(userGuid){
    var deferred = q.defer();

    var companinos = [
        {
            userGuid: 'aksdjfhi76',
            name: 'roi',
            phoneNumber: 87657865,

            currentLocation: { lng : 8 , lat : 8 },
            destinationLocation: { lng : 8 , lat : 8 }
        }
    ];

    deferred.resolve(companinos);

    return deferred.promise;
};

module.exports=DbAccess;



