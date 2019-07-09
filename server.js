const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const db = require('./models')
// TODO: remove fs and use sequelize instead
const methodOverride =require('method-override');

const port = 3000; 

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
    res.render('index')
})

//GET /dinosaurs - index route - gets ALL dinos
app.get('/dinosaurs', function(req, res){
    // TODO: remove file system stuff and use sequelize functions 
    db.dinosaur.findAll()
        .then(function(dinos){
            res.render('dinos/index.ejs', {dinosaurs: dinos})
        })
    
})

//GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req, res){
    res.render('dinos/new');
})

//GET /dinosaurs/:id/edit - serve up our NEW dino form
app.get('/dinosaurs/:id/edit', function(req, res){;
    let id = parseInt(req.params.id);
    db.dinosaur.findOne({
        where: {
            id: id
        }
    }).then(function(dino){
        res.render('dinos/edit',{dino, id})
    })
})

//GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res){
    let id = parseInt(req.params.id);
    db.dinosaur.findOne({
        where: {
            id: id
        }
    }).then(function(dino){
        res.render('dinos/show',{dino})
    })
})


// POST /dinosaurs
app.post('/dinosaurs', function(req, res){
    db.dinosaur.create({
        name: req.body.name,
        type: req.body.type
    })
        .then(function(dino){
            res.redirect('/dinosaurs')
        })
    
})

//DELETE /dinosaurs/id
app.delete('/dinosaurs/:id', function(req, res){
    var id = parseInt(req.params.id);
    db.dinosaur.destroy({
        where: {
            id: id
        }
    })
    res.redirect('/dinosaurs');
})

app.put('/dinosaurs/:id',function(req, res){
    var id = parseInt(req.params.id);    
    db.dinosaur.update({
        name: req.body.name,
        type: req.body.type
    },{
        where:{
            id: id
        }
    })
    res.redirect('/dinosaurs')
})

app.listen(port, function(){
    console.log('😇 Listening on port: ' + port);
});

