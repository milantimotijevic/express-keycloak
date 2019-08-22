const keycloak = Keycloak();
//let authorization;

keycloak.onTokenExpired = function () {
    console.log('calling refresh...');
    keycloak.updateToken().success(function(refreshed) {
        if (refreshed) {
            console.log('Token refreshed');
        } else {
            console.log('Token not refreshed.... no idea why lol');
        }
    }).error(function() {
        console.log('Error refreshing token')
    });
};

keycloak.init({
    responseMode: 'fragment',
    flow: 'standard',
    onload: 'check-sso'
}).success(function(authenticated) {
    //authorization = new KeycloakAuthorization(keycloak);
});

const displayDiv = document.getElementById('display-div');

function getResource(name) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            displayDiv.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "http://localhost:3000/private/" + name, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + keycloak.token)
    xhttp.send();
}
