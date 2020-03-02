// Strategy
// Get total user missions
// Explorer II missions determined first
// Explorer I missions determined afterwards



let userList = [
    {user: "miniature-tiger"},
    {user: "tiger-zaps"}
]

let userDataStore = []

let planetPriorityDataStore = [
    {user: "miniature-tiger", planets: ["P-ZEICSWT7R68", "P-ZNOZ9F27ALC", "P-Z5RLBT62MHC", "P-ZGJ95KHRNJ4", "P-ZHS6NCDEXZ4", "P-Z6CUYXXSSB4","P-ZN75ISQUAPS", "P-ZTAF77DLPMO", "P-ZAQ7HF0GG00", "P-ZQO2CAQAPDS", "P-ZFARKE21180", "P-ZTYHGPLTDXC", "P-Z6NP7GS7LN4", "P-Z3STEWYEMDC", "P-ZJWCQN4SU00", "P-ZUEF2H4ZVFK", "P-ZDTN5L88VBK", "P-Z32XHV5Q8IO", "P-ZWGG4451SJ4", "P-ZQ007X20RGG", "P-ZNZDJF1HE9C", "P-Z9MXBBN13RK", "P-Z8KKOX2ZOQO", "P-Z7M914SV034", "P-ZSHCI4Y9BBK", "P-ZG8IDE649Q8", "P-Z9C2P737XQ8", "P-Z0OXZ5QK3GG"], planetNames: []},
    {user: "tiger-zaps", planets: ["P-ZPAE32T725C", "P-ZQR6EWK4W74", "P-ZUO1JEPA1GG", "P-ZPYNKUAGBPC", "P-Z9FUOBRVDWG", "P-ZT1CJ3ZM6R4", "P-Z142YAEQFO0", "P-ZE8TH46FVK0"], planetNames: []},
    //"P-ZF2GU2MGRWG", "P-ZS3RWN9D840", "P-ZXPZG03WPXC", "P-ZZA367LJYRK", "P-ZSJR1UCWGJK", "P-ZL1K8I8Y86O", "P-Z2A6EKIIC00",
]

// minimumShipPriority: 80 is ship2, transportship2: 91, dreadnought2: 92, explorer2: 99
let minimumShipPriorityDataStore = [

    {user: "miniature-tiger", planets:
        [
            {id: "P-ZVLTZ1VY9LS", minimumShipPriority: 80}, // Rho(2) - ship2 only
            {id: "P-ZTUFNYRJSIO", minimumShipPriority: 80}, // Beta - ship2 and transporter2 only
            {id: "P-Z4QG9SYM1E8", minimumShipPriority: 80}, // Delta - ship2 only
            {id: "P-ZPMH4TWB6WW", minimumShipPriority: 99}, // Theta - ExII-Factory - explorer2 only
            {id: "P-Z9OF9M3G840", minimumShipPriority: 100}, // Eta - ExII-Base - no ship building
            {id: "P-Z5EHJS21S3K", minimumShipPriority: 100}, // Iota - ExII-Base - no ship building
            {id: "P-ZUEF2H4ZVFK", minimumShipPriority: 100}, // - Explorer / Base
            {id: "P-ZJWCQN4SU00", minimumShipPriority: 100},
            {id: "P-ZJ9690WS03K", minimumShipPriority: 100}, // Xi - ExII-Base - no ship building

        ]
    },
    {user: "tiger-zaps", planets:
        [
            {id: "P-ZY9Q75PXWWW", minimumShipPriority: 90}, // Delta - transporter2 and dreadnought2 only
            {id: "P-Z8JQAIQIU3K", minimumShipPriority: 80}, // Pi - ship2 only
            {id: "P-ZAF8WG5WM00", minimumShipPriority: 80}, // Kappa - ship2 only
            {id: "P-ZTNYF56W2VK", minimumShipPriority: 80}, // Beta - ship2 only
            {id: "P-ZR10UOAG7TS", minimumShipPriority: 99}, // ExII-Factory1 - explorer2 only
            {id: "P-ZQA36M3JUGW", minimumShipPriority: 100}, // ExII-Base2 - no ship building
            {id: "P-ZIIV5B7IU28", minimumShipPriority: 100}, // ExII-Base3 - no ship building
            {id: "P-ZLKBPD54FM8", minimumShipPriority: 100}, // ExII-Base4 - no ship building
            {id: "P-ZF2GU2MGRWG", minimumShipPriority: 100}, // Ap58 - new - Explorer / Base
            {id: "P-ZE8TH46FVK0", minimumShipPriority: 100}, // Ap54 - explorers only
            {id: "P-Z142YAEQFO0", minimumShipPriority: 100}, // Ap55 - explorers only

        ]
    },
]

let doNotBuildDataStore = [
    {user: "miniature-tiger", planets:
        ["P-ZVLTZ1VY9LS", "P-ZTUFNYRJSIO", "P-ZPMH4TWB6WW", "P-Z9OF9M3G840", "P-Z5EHJS21S3K", "P-ZUEF2H4ZVFK", "P-ZJWCQN4SU00", "P-ZJ9690WS03K"]
    },
    {user: "tiger-zaps", planets:
        // Delta, Pi, Kappa, ExII-Factory1, Ap-54, Ap-55
        ["P-ZY9Q75PXWWW", "P-Z8JQAIQIU3K", "P-ZAF8WG5WM00", "P-ZR10UOAG7TS"]
    },
]

let shipMarket = [
    {type: "corvette", version: 0, minPrice: 10},
    {type: "frigate", version: 0, minPrice: 20},
    {type: "destroyer", version: 0, minPrice: 30},
    {type: "cruiser", version: 0, minPrice: 40},
    {type: "battlecruiser", version: 0, minPrice: 100},
    {type: "carrier", version: 0, minPrice: 300},
    {type: "dreadnought", version: 0, minPrice: 800},
    {type: "cutter2", version: 2, minPrice: 20},
    {type: "corvette2", version: 2, minPrice: 40},
    {type: "frigate2", version: 2, minPrice: 70},
    {type: "destroyer2", version: 2, minPrice: 140},
    {type: "cruiser2", version: 2, minPrice: 200},
    {type: "battlecruiser2", version: 2, minPrice: 500},
    {type: "carrier2", version: 2, minPrice: 5000},
    //{type: "dreadnought2", version: 2, minPrice: 9000}
];

let planetOrderForShipSales = [
    // tiger-zaps
    // "Alpha", "Epsilon", "Zeta", "Theta", "Rho", "Sigma"
    // "Pi", "Kappa", "Beta", "Rho", "Sigma", "Delta"
    {user: "tiger-zaps", version0: ["P-ZCBO9MBOJ2O", "P-ZKEAGJ7U4LC", "P-ZF6H61862UO", "P-ZHC7OXN5PIO", "P-Z1T7TSC5EZ4", "P-ZI65C8IRYY8", "P-Z3OROQ7NVC0", "P-ZK5N7AA9HXC", "P-Z7QZW0I1B4G", "P-ZT3JJ1U11A8"], version2: ["P-Z8JQAIQIU3K", "P-ZAF8WG5WM00", "P-ZTNYF56W2VK", "P-Z1T7TSC5EZ4", "P-ZI65C8IRYY8", "P-ZY9Q75PXWWW", "P-Z3OROQ7NVC0"]},
];


async function updateAndStoreUserData(user, updateType) {
    console.log("updating user data", updateType)

    // Fetch previous userData of user in userDataStore of local storage (already parsed and correct user extracted - else false)
    let previousUserData = false
    if (updateType != "reset") {
        previousUserData = fetchUserDataFromStorage(user)
    }


    // If no previous user data create basis for object, otherwise use existing user data
    let userDataEntry = {};
    if (previousUserData === false) {
        userDataEntry["user"] = user;
        userDataEntry["planets"] = [];
    } else {
        userDataEntry = previousUserData;
    }

    // Get planet list from API
    let dataPlanets = await getPlanetsOfUser(user);

    // Mark as disposed those planets that are missing (burned, sold etc)
    for (const [i, planet] of userDataEntry.planets.entries()) {
        let dataPlanetsIndex = dataPlanets.planets.findIndex(entry => entry.id === planet.id);
        // Prior existing planet no longer in data planets - mark status as disposed
        if (dataPlanetsIndex === -1) {
            userDataEntry.planets[i].status = 'disposed'
        }
    }

    // Loop through planets from API and add any new planets to userDataEntry / update old planets
    for (const [i, planet] of dataPlanets.planets.entries()) {

        let planetFleetInfo = await getPlanetFleet(user, planet.id);
        let explorerOneFleetIndex = planetFleetInfo.findIndex(fleet => fleet.type == "explorership");
        let explorerOneAvailable = 0;
        if (explorerOneFleetIndex != -1) {
            explorerOneAvailable = planetFleetInfo[explorerOneFleetIndex].quantity;
        }
        let explorerTwoFleetIndex = planetFleetInfo.findIndex(fleet => fleet.type == "explorership1");
        let explorerTwoAvailable = 0;
        if (explorerTwoFleetIndex != -1) {
            explorerTwoAvailable = planetFleetInfo[explorerTwoFleetIndex].quantity;
        }

        let planetMissionInfo = await getPlanetMissionInfo(user, planet.id);
        if (i===0) {
            userDataEntry["userAvailableMissions"] = planetMissionInfo.user_unused;
        }

        let userDataPlanetsIndex = userDataEntry.planets.findIndex(entry => entry.id === planet.id);
        // Planet not previously existing - add to userDataEntry with details
        if (userDataPlanetsIndex === -1) {
            console.log(i, "new planet", planet.name)
            let planetData = {};
            planetData["id"] = planet.id; // updating - never
            planetData["name"] = planet.name; // update below
            planetData["date"] = planet.date; // updating - never
            planetData["planetCoords"] = [planet.posx, planet.posy]; // updating - never
            planetData["planetMissionInfo"] = planetMissionInfo;
            console.log(planet.name, planet.id)
            console.dir(planetMissionInfo)
            planetData["planetFleetInfo"] = planetFleetInfo;
            planetData["explorerOneAvailable"] = explorerOneAvailable;
            planetData["explorerTwoAvailable"] = explorerTwoAvailable;
            planetData["status"] = 'new';
            planetData["exploreDerived"] = true;
            planetData["shortestDistance"] = 0;
            planetData["exploreOverride"] = false;
            planetData["focusOverride"] = false;
            planetData["buildOverride"] = false;

            console.log(planetData)
            userDataEntry.planets.push(planetData)
        } else {
            userDataEntry.planets[userDataPlanetsIndex].name = planet.name; // update in case of name change
            userDataEntry.planets[userDataPlanetsIndex]["planetMissionInfo"] = planetMissionInfo;
            console.log(planet.name, planet.id)
            console.dir(planetMissionInfo)
            userDataEntry.planets[userDataPlanetsIndex]["planetFleetInfo"] = planetFleetInfo;
            userDataEntry.planets[userDataPlanetsIndex]["explorerOneAvailable"] = explorerOneAvailable;
            userDataEntry.planets[userDataPlanetsIndex]["explorerTwoAvailable"] = explorerTwoAvailable;
            if (userDataEntry.planets[userDataPlanetsIndex].status == 'new') {
                userDataEntry.planets[userDataPlanetsIndex].status = 'normal';
            }
        }

    }

    // Sort planets by most recent discovery
    userDataEntry.planets.sort((a, b) => b.date - a.date);

    // build:
    // - new: focus on mines, base and shipyard
    // - mature: - all buildings pushed to 18
    // - none: (user setting) - building halted as Yamato / explorer II etc



    let userMissions = await getLimitedUserMissions(user, 800)


    //let minimumShipPriorityData = fetchMinimumShipPriorityData(user);






    // Loop through all planets and update criteria
    for (const [i, planet] of userDataEntry.planets.entries()) {

        //if (i<=1) {

            //console.dir(galaxyData)
            //let planetCoords = [planet.posx, planet.posy]

            // Find available exploration - ignore is exploration already set to false
            if ( (updateType === "reset") || (updateType === "full" && planet.exploreDerived === true) || (updateType === "minor" && planet.status === "new")) {
                console.log(i, "galaxyData")
                let galaxyData = await getGalaxy(planet.planetCoords[0], planet.planetCoords[1], 48, 48);
                let spacesAvailable = checkAvailableExploration(planet.planetCoords, galaxyData);
                if (spacesAvailable.length === 0) {
                    userDataEntry.planets[i]["exploreDerived"] = false;
                } else {
                    userDataEntry.planets[i]["shortestDistance"] = spacesAvailable[0].distance.toFixed(2);
                }
            }

            // Apply explore override
            if (planet.exploreOverride !== false) {
                userDataEntry.planets[i]["explore"] = userDataEntry.planets[i]["exploreOverride"];
            } else {
                userDataEntry.planets[i]["explore"] = userDataEntry.planets[i]["exploreDerived"];
            }

            // Set focus and build criteria
            if (planet.explore === true) {
                userDataEntry.planets[i]["focusDerived"] = "explore";
                userDataEntry.planets[i]["buildDerived"] = "new";
            } else {
                userDataEntry.planets[i]["focusDerived"] = "develop";
                userDataEntry.planets[i]["buildDerived"] = "develop";
            }



            if (planet.focusOverride !== false) {
                userDataEntry.planets[i]["focus"] = userDataEntry.planets[i]["focusOverride"];
            } else {
                userDataEntry.planets[i]["focus"] = userDataEntry.planets[i]["focusDerived"];
            }

            if (planet.buildOverride !== false) {
                userDataEntry.planets[i]["build"] = userDataEntry.planets[i]["buildOverride"];
            } else {
                userDataEntry.planets[i]["build"] = userDataEntry.planets[i]["buildDerived"];
            }



            /*

            let minimumShipPriorityPlanetIndex = minimumShipPriorityData.planets.findIndex(entry => entry.id == planet.id);
            minimumShipPriority = 0;
            if (minimumShipPriorityPlanetIndex != -1) {
                minimumShipPriority = minimumShipPriorityData.planets[minimumShipPriorityPlanetIndex].minimumShipPriority;
            }

            let planetUserMissions = userMissions.filter(mission => mission.from_planet.id == planet.id);

            planetData = {};
            planetData["id"] = planet.id; // updating - never
            planetData["name"] = planet.name; // updating - always, can change at any time
            planetData["planetCoords"] = planetCoords; // updating - never
            planetData["focus"] = planetFocus; // updating - never
            planetData["focusOverride"] = userData; // updating - never
            planetData["build"] = buildOnThisPlanet; // check if criteria for

            planetData["shipbuild"] = true;
            planetData["minimumShipPriority"] = minimumShipPriority;
            planetData["explore"] = exploreFromThisPlanet;
            planetData["shortestDistance"] = shortestDistance;
            planetData["planetMissionInfo"] = await getPlanetMissionInfo(user, planet.id);
            planetData["explorerTwoMissions"] = planetUserMissions.filter(mission => Object.keys(mission.ships).includes("explorership1"))

            planetData["planetFleetInfo"] = await getPlanetFleet(user, planet.id)
            let explorerOneFleetIndex = planetData.planetFleetInfo.findIndex(fleet => fleet.type == "explorership");
            planetData["explorerOneAvailable"] = 0;
            if (explorerOneFleetIndex != -1) {
                planetData["explorerOneAvailable"] = planetData.planetFleetInfo[explorerOneFleetIndex].quantity;
            }
            let explorerTwoFleetIndex = planetData.planetFleetInfo.findIndex(fleet => fleet.type == "explorership1");
            planetData["explorerTwoAvailable"] = 0;
            if (explorerTwoFleetIndex != -1) {
                planetData["explorerTwoAvailable"] = planetData.planetFleetInfo[explorerTwoFleetIndex].quantity;
            }

            userDataEntry.planets.push(planetData)
            console.dir(planetData)

            */
        //}
    }



    //userDataStore.push(userDataEntry);

    // Store updated user data  for user
    setUserDataInStorage(user, userDataEntry)

    // Return user data for user
    return userDataEntry;
}

function checkAvailableExploration(planetCoords, galaxyData) {
    let xmin = galaxyData.area.xmin;
    let xmax = galaxyData.area.xmax;
    let ymin = galaxyData.area.ymin;
    let ymax = galaxyData.area.ymax;
    let space = []

    for (let x=xmin; x<=xmax; x+=1) {
        for (let y=ymin; y<=ymax; y+=1) {
            let spaceInfo = {x: x, y: y};

            let exploredIndex = galaxyData.explored.findIndex(entry => entry.x == x && entry.y == y)
            spaceInfo["explored"] = true;
            if (exploredIndex == -1) {
                spaceInfo["explored"] = false;
            }

            let planetsIndex = galaxyData.planets.findIndex(entry => entry.x == x && entry.y == y)
            spaceInfo["planet"] = true;
            if (planetsIndex == -1) {
                spaceInfo["planet"] = false;
            }

            if (spaceInfo.explored == false && spaceInfo.planet == false) {
                let spaceCoords = [x, y];
                spaceInfo["distance"] = distance(planetCoords, spaceCoords);
                space.push(spaceInfo)
            }

        }
    }
    space.sort((a, b) => a.distance - b.distance);
    return space
}


function fetchUserDataFromStorage(user) {
    let result = false
    let allUserData = getItemFromLocalStorage('userData')
    if (allUserData) {
        let allUserDataParsed = JSON.parse(allUserData)
        let userIndex = allUserDataParsed.findIndex(data => data.user == user);
        if (userIndex > -1) {
            result = allUserDataParsed[userIndex];
        }
    }
    return result;
}

function setUserDataInStorage(user, userDataEntry) {
    let finalParsedDataToStore = {};
    let allUserData = getItemFromLocalStorage('userData')
    if (allUserData) {
        allUserDataParsed = JSON.parse(allUserData)
        let userIndex = allUserDataParsed.findIndex(data => data.user === user);
        if (userIndex > -1) {
            allUserDataParsed[userIndex] = userDataEntry;
            finalParsedDataToStore = allUserDataParsed;
        } else {
            allUserDataParsed.push(userDataEntry);
            finalParsedDataToStore = allUserDataParsed;
        }
    } else {
        finalParsedDataToStore = [userDataEntry];
    }
    let stringData = JSON.stringify(finalParsedDataToStore);

    setItemInLocalStorage('userData', stringData)
}

function fetchUserData(user) {
    let userIndex = userDataStore.findIndex(data => data.user == user);
    return userDataStore[userIndex];
}

function fetchUserPlanetPriorityData(user) {
    let userIndex = planetPriorityDataStore.findIndex(data => data.user == user);
    return planetPriorityDataStore[userIndex];
}

function fetchDoNotBuildData(user) {
    let userIndex = doNotBuildDataStore.findIndex(data => data.user == user);
    return doNotBuildDataStore[userIndex];
}

function fetchMinimumShipPriorityData(user) {
    let userIndex = minimumShipPriorityDataStore.findIndex(data => data.user == user);
    return minimumShipPriorityDataStore[userIndex];
}

function findIndexInShipMarket(shipType) {
    return  shipMarket.findIndex(ship => ship.type == shipType);
}

function fetchUserPlanetOrderForShipSales(user) {
    let userIndex = planetOrderForShipSales.findIndex(data => data.user == user);
    return planetOrderForShipSales[userIndex];
}

// STORAGE

function setItemInLocalStorage(item, value) {
    localStorage.setItem(item, value);
}

function getItemFromLocalStorage(item) {
    const value = localStorage.getItem(item);
    return (value !== null) ? value : false;
}
