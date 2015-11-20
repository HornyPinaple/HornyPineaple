/**
 * Created by Regina on 19/11/2015.
 */

function route(dbAccess, server){
    server.post('/user', function(req, res){
        dbAccess.createUser(req.body.name, req.body.phoneNumber).then(function(userGuid){
            AddHeaders(res);

            res.send(201, userGuid);
        }, function(err){
            res.send(500, err);
        });
    });

    server.put('/user/locations', function(req, res){
        dbAccess.upsertLocations(req.body.userGuid, req.body.currentLocation, req.body.destinationLocation).then(function(){
            AddHeaders(res);
            res.send(200);
        }, function(err){
            res.send(500, err);
        });
    });

    server.get('/companions/:userGuid', function(req, res){
        dbAccess.getCompaninons(req.params.userGuid).then(function(companions){
            AddHeaders(res);
            res.send(200, companions);
        }, function(err){
            res.send(500, err);
        });
    })

}

function AddHeaders(res){
    res.setHeader('access-control-allow-origin', '*');
}

module.exports = {
    route: route
};