const keycloak = Keycloak();
let authorization;

keycloak.init({
    responseMode: 'fragment',
    flow: 'standard',
    onload: 'check-sso'
}).success(function(authenticated) {
    authorization = new KeycloakAuthorization(keycloak);
});
