const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Keycloak = require('keycloak-connect');
const keycloakConfig = require('./public/keycloak');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

const keycloak = new Keycloak({
    store: memoryStore
}, keycloakConfig);

app.use(keycloak.middleware({ // TODO look into what these options actually do, because stuff works without them...
    logout: '/logout',
    admin: '/'
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/public-stuff', function (req, res) {
    res.send({secretLevel: 'super low...'});
});

function checkRoles(roles) {
    return function(token, request) {
        return token.content.realm_access.roles.some(item => {
            return roles.includes(item);
        });
    }
}

app.get('/private/mage-spells', keycloak.protect(checkRoles(['mage'])), function (req, res) {
    res.send(['fireball', 'frostbolt', 'arcane missiles']);
});

app.get('/private/warlock-spells', keycloak.protect(checkRoles(['warlock'])), function (req, res) {
    res.send(['shadowbolt', 'corruption', 'immolate']);
});

app.listen(3000);
