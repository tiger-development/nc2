async function getPlanetsOfUser(user) {
    let response = await fetch("https://api.nextcolony.io/loadplanets?user=" + user);
    let data = await response.json();
    return data
}

async function getPlanetShipyard(user, planetId) {
    let response = await fetch("https://api.nextcolony.io/planetshipyard?user=" + user + "&planet=" + planetId);
    let data = await response.json();
    return data
}

async function getPlanetResources(planetID) {
    let response = await fetch("https://api.nextcolony.io/loadqyt?id=" + planetID);
    let data = await response.json();
    return data
}

async function getPlanetInfo(planetID) {
    let response = await fetch("https://api.nextcolony.io/loadplanet?id=" + planetID);
    let data = await response.json();
    return data
}

async function getPlanetShips(user, planetID) {
    let response = await fetch("https://api.nextcolony.io/loadfleet?user=" + user + "&planetid=" + planetID);
    let data = await response.json();
    return data
}

async function getBuildings(planetID) {
    let response = await fetch("https://api.nextcolony.io/loadbuildings?id=" + planetID);
    let data = await response.json();
    return data
}

async function getMissions(user, planetID, active) {
    let response = await fetch("https://api.nextcolony.io/loadfleetmission?user=" + user + "&active=" + active + "&planetid=" + planetID);
    let data = await response.json();
    return data
}

async function getUserMissions(user, active) {
    let response = await fetch("https://api.nextcolony.io/loadfleetmission?user=" + user + "&active=" + active);
    let data = await response.json();
    return data
}

async function getLimitedUserMissions(user, limit) {
    let response = await fetch("https://api.nextcolony.io/loadfleetmission?user=" + user + "&limit=" + limit);
    let data = await response.json();
    return data
}

async function getPlanetMissionInfo(user, planetId) {
    let response = await fetch("https://api.nextcolony.io/missioninfo?user=" + user + "&planet=" + planetId);
    let data = await response.json();
    return data
}

async function getPlanetFleet(user, planetId) {
    let response = await fetch("https://api.nextcolony.io/planetfleet?user=" + user + "&planet=" + planetId);
    let data = await response.json();
    return data
}

async function getGalaxy(xCoord, yCoord, height, width) {
    //let height = 0
    //let width = 0
    let response = await fetch("https://api.nextcolony.io/loadgalaxy?x=" + xCoord + "&y=" + yCoord + "&height=" + height + "&width=" + width);
    let data = await response.json();
    return data
}

async function getMarketForShip(shipType, active, sold) {
    let stringAPI = "";
    if (sold==0) {
        stringAPI = "https://api.nextcolony.io/asks?active=" + active + "&type=" + shipType;
    } else if (sold==1) {
        stringAPI = "https://api.nextcolony.io/asks?active=" + active + "&sold=" + sold + "&orderby=sold&order=desc&type=" + shipType;
    }
    let response = await fetch(stringAPI)
    let data = await response.json();
    return data
}

async function getMarketForShipAndUser(user, shipType, active, sold) {
    let stringAPI = "";
    if (sold==0) {
        stringAPI = "https://api.nextcolony.io/asks?active=" + active + "&user=" + user + "&type=" + shipType;
    } else if (sold==1) {
        stringAPI = "https://api.nextcolony.io/asks?active=" + active + "&user=" + user + "&sold=" + sold + "&orderby=sold&order=desc&type=" + shipType;
    }
    let response = await fetch(stringAPI)
    let data = await response.json();
    return data
}
