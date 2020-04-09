// TO DO

// ----- MONDAY ----
// Issue with mission data not being up to date when explorers launched
// - e.g. missions available if explorers just previously run
// - Need to work out which userData needs recalculation for each mission type

// Total mission amount not working

// Get one planet at a time for user data and update planet table

// Clear planet table on logout / refresh (since user data recalculated)



// ----- USER DATA ----
// Check when user data last obtained (store this)
// If never then full user data

// If not then
// - Either pick up stored user data and partial update user data
// - Or pick up stored user data and full recalc

// Store key user data info

// Get list of user planets
// Start with 10 planets
// Add coloured button grid - exploration - build - ships (buttons should be drop downs effectively)

//setItemInLocalStorage('userData', "")
var keychainFunctioning = false


// On page load
window.addEventListener('load', async (event) => {


    // Temp
    //console.log(window.steem_keychain)

    // ----------------------------------
    // GET PAGE ELEMENTS ON LOADING
    // ----------------------------------

    // Get header links and section divs
    const sitePages = document.getElementById('links');
    const centralLogo = document.getElementById('centralLogo');
    const reportLink = document.getElementById('reportLink');
    const reportDiv = document.getElementById('report');
    const missionsLink = document.getElementById('missionsLink');
    const missionsDiv = document.getElementById('missions');
    const planetsLink = document.getElementById('planetsLink');
    const planetsDiv = document.getElementById('planets');
    const loginLink = document.getElementById('loginLink');
    const loginDiv = document.getElementById('login');
    const loginHeaderStatus = document.getElementById('loginHeaderStatus');

    // Create object to facilitate switching between sections
    const sections = [
            {sectionName: "report", sectionTitle: "Season Report", sectionLink: reportLink, sectionDiv: reportDiv},
            {sectionName: "missions", sectionTitle: "Mission Control", sectionLink: missionsLink, sectionDiv: missionsDiv},
            {sectionName: "planets", sectionTitle: "Planet Classification", sectionLink: planetsLink, sectionDiv: planetsDiv},
            {sectionName: "login", sectionTitle: "Login", sectionLink: loginLink, sectionDiv: loginDiv},
    ]
    const sectionLinks = sections.map(section => section.sectionLink)

    // Get planets elements
    const reportTable = document.getElementById('reportTable');

    // Get planets elements
    const planetsTable = document.getElementById('planetsTable');

    // Get transaction elements
    const transactionsTable = document.getElementById('transactionsTable');

    // Get login elements
    const usernameSelect = document.getElementById('usernameSelect');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const loginStatusDisplay = document.getElementById('loginStatus');



    // ----------------------------------
    // HEADER LINKS AND SECTION SWICTHING
    // ----------------------------------

    var currentPage = getCurrentPage()
    console.log(currentPage)

    // Event listener for click on header - switches between sections
    sitePages.addEventListener("click", function(e) {
        // e.target will be the item that was clicked on
        if (sectionLinks.includes(e.target)) {
            switchSection(e.target)
        }
    })

    // Switches between different "pages" (sections) using link
    function switchSection(sectionLink) {
        console.log(sectionLink)
        const index = sectionLinks.findIndex(link => link === sectionLink)

        for (let i = 0; i < sections.length; i+=1) {
            if (i === index) {
                sections[i].sectionDiv.style.display = "block";
                centralLogo.innerText = sections[i].sectionTitle
                setCurrentPage(sections[i].sectionName);
                if (sections[i].sectionName == "report") {
                    createSeasonReport()
                }
            } else {
                sections[i].sectionDiv.style.display = "none";
            }
        }
    }

    // Switches between different "pages" (sections) using link
    function switchSectionWithSectionName(sectionName) {
        const index = sections.findIndex(section => section.sectionName === sectionName)
        console.log(index)
        switchSection(sections[index].sectionLink)
    }

    // Store current page in local storage
    function setCurrentPage(sectionName) {
        //const index = sections.findIndex(name => sections.sectionName === sectionName)
        localStorage.setItem('currentPage', sectionName);
    }

    // Store current page in local storage
    function getCurrentPage() {
        const value = localStorage.getItem('currentPage');
        return (value !== null) ? value : false;
    }

    // ----------------------------------
    // KEYCHAIN
    // ----------------------------------

    // Check Steem Keychain extension installed and functioning
    if(window.steem_keychain) {
        let keychain = window.steem_keychain;
        console.log('Keychain installed');

        // Request handshake
        steem_keychain.requestHandshake(function() {
            console.log('Handshake received!');
            keychainFunctioning = true
        });
    // Steem Keychain extension not installed...
    } else {
        console.log('Keychain not installed');
    }


    // ----------------------------------
    // LOGIN
    // ----------------------------------

    // Check if anyone is already logged in or set for info
    let user = getUser();
    let logInStatus = getLogInStatus();

    let userData = [];
    if (user) {
        if (logInStatus == "keychain") {
            loginDisplay(user, "Keychain connected. <br> Logged in as @" + user)
        } else if (logInStatus == "setForInfo") {
            loginDisplay(user, "No keychain connection. <br> Logged in for info as @" + user)
        }

        // Set up / fetch user data
        setLoginUserData(user);

        // Switch to current page
        if (currentPage) {
            switchSectionWithSectionName(currentPage)
        } else {
            switchSectionWithSectionName("report")
        }

    } else {
        logoutDisplay();
        switchSectionWithSectionName("login")
    }


    // Store username in local storage
    function setLogInStatus(loginStatus) {
        localStorage.setItem('loginStatus', loginStatus);
        return loginStatus
    }

    // Check if user logged in
    function getLogInStatus() {
        const value = localStorage.getItem('loginStatus');
        return (value !== null) ? value : false;
    }

    // Store username in local storage
    function setUser(user) {
        localStorage.setItem('user', user);
        return user
    }

    function getUser() {
        const value = localStorage.getItem('user');
        return (value !== null) ? value : false;
    }

    // Remove username from local storage
    function logoutUser() {
        localStorage.setItem('loginStatus', false);
        localStorage.removeItem('user');
    }

    function loginDisplay(user, message) {
        console.log("loginDisplay")
        loginButton.style.display = 'none';
        usernameSelect.style.display = 'none';
        logoutButton.style.display = 'initial';
        loginStatusDisplay.innerHTML = message
        loginHeaderStatus.innerHTML = '@' + user
    }

    function logoutDisplay() {
        console.log("logoutDisplay")
        logoutButton.style.display = 'none';
        loginButton.style.display = 'initial';
        usernameSelect.style.display = 'initial';
        loginStatusDisplay.innerHTML = 'Log in with Steem keychain.';
        loginHeaderStatus.innerHTML = '@...'
    }


    // When login button is clicked
    loginButton.addEventListener('click', (e) => {
            // Stop the default action from doing anything
            e.preventDefault();

            // Get the value from the username field
            userValue = usernameSelect.value.slice(1, usernameSelect.value.length);

            // Check window.steem_keychain exists
            if (keychainFunctioning == true) {

                steem_keychain.requestSignBuffer(userValue, 'login', 'Posting', response => {
                    if (user && logInStatus == "keychain") {
                        // do nothing
                    } else {
                        user = setUser(userValue);
                        logInStatus = setLogInStatus("keychain")
                        loginDisplay(userValue, "Keychain connected. <br> Logged in as @" + user)
                        setLoginUserData(user);
                    }
                });
            } else {
                console.log('Keychain not installed');
                user = setUser(userValue);
                logInStatus = setLogInStatus("setForInfo")
                loginDisplay(userValue, "No keychain connection. <br> Logged in for info as @" + user)
                setLoginUserData(user);
            }
    });

    // When the logout button is clicked
    logoutButton.addEventListener('click', (e) => {
        // Stop the default action from doing anything
        e.preventDefault();
        user = false
        logInStatus = false
        logoutUser();
        logoutDisplay();
        userData = [];
    });

    async function setLoginUserData(user) {
        let updateType = "full"

        const previousUserDataTime = getItemFromLocalStorage('userDataTime')
        const userDataTime = Date.now();
        setItemInLocalStorage('userDataTime', userDataTime)


        if ((userDataTime - previousUserDataTime) < (1000 * 60 * 60 * 24)) {
            updateType = "minor"
        }

        userData = await updateAndStoreUserData(user, updateType);
        // USE IF WANT TO SWITCH OFF USER DATA COLLCECTION
        //userData = fetchUserDataFromStorage(user)

        // Currently put here as it needs to wait for user data
        fillPlanetsTable()
    }



    // Store username in local storage
    function setUserDataTime(time) {
        localStorage.setItem('userDataTime', userDataTime);
    }

    // Store username in local storage
    function getUserDataTime() {
        const value = localStorage.getItem('userDataTime');
        return (value !== null) ? value : false;
    }

    // ----------------------------------
    // YAMATO REPORT
    // ----------------------------------

    async function createSeasonReport() {
        const seasonPlayers = await getSeasonPlayers();
        console.log(seasonPlayers)
        let seasonStartDate = seasonPlayers.start_date
        fillSeasonTable(seasonPlayers.ranking, seasonStartDate)
    }

    async function fillSeasonTable(seasonPlayers, startDate) {
        reportTable.innerHTML = "";

        const columnHeaders = ["Rank", "User", "Build", "Destroy", "Total",]
        const columnWidths = ["4%", "14%", "7%", "7%", "7%", ]

        // Create row for table and label it with planet id
        let headerRow = document.createElement("div")
        headerRow.setAttribute('id', "headerRow");
        headerRow.setAttribute('class', "table");
        reportTable.appendChild(headerRow);

        for (let i = 0; i < columnHeaders.length; i+=1) {
            headerRow.appendChild(createTableDiv(columnHeaders[i], columnHeaders[i], columnWidths[i], false));
        }

        for (let i = 1; i <= 20; i+=1) {
            headerRow.appendChild(createTableDiv(i, i, "2%", false));
        }

        for (const [index, player] of seasonPlayers.entries()) {
            // Find yamato information based on missions


            let userMissions = await getMissionsByType(player.user, "upgradeyamato", 1000)
            let yamatoArray = Array(20).fill(0);
            console.log(userMissions)
            for (upgrade of userMissions) {
                if (upgrade.date > startDate) {
                    const yamatoUpgraded = Object.keys(upgrade.ships)[0]
                    let yamatoNumber = -1;
                    if (yamatoUpgraded == "yamato") {
                        yamatoNumber = 0;
                    } else {
                        yamatoNumber = yamatoUpgraded.substring(6, yamatoUpgraded.length);
                    }
                    yamatoArray[yamatoNumber] += 1;
                }
            }

            // Create row for table and label it with user id
            let newRow = document.createElement("div")
            newRow.setAttribute('id', player.user);
            newRow.setAttribute('class', "table");
            reportTable.appendChild(newRow);

            newRow.appendChild(createTableDiv("rank", index+1, columnWidths[0], true))
            newRow.appendChild(createTableDiv("user", player.user, columnWidths[1], true))
            newRow.appendChild(createTableDiv("build", player.build_reward/100000000, columnWidths[2], true))
            newRow.appendChild(createTableDiv("destroy", player.destroy_reward/100000000, columnWidths[3], true))
            newRow.appendChild(createTableDiv("total", player.total_reward/100000000, columnWidths[4], true))

            /*
            for (let i = yamatoArray.length-1; i >= 0; i-=1) {
                let reduction = yamatoArray[i];
                for (let j = 0; j < i; j+=1) {
                    yamatoArray[j] -= reduction;
                }
            }
            */

            for (let i = 0; i < yamatoArray.length; i+=1) {
                newRow.appendChild(createTableDiv(i+1, yamatoArray[i], "2%", true))
            }
        }
    }



    // ----------------------------------
    // PLANETS
    // ----------------------------------

    function createTableDiv(divId, text, width, derived) {
        let div = document.createElement("div");
        div.setAttribute('id', divId);
        if (derived === true) {
            div.setAttribute('class', 'tableBoxDerived');
        } else {
            div.setAttribute('class', 'tableBoxUser');
        }
        div.style.width = width;
        div.style.display = 'inline-block';

        let divText = document.createTextNode(text);
        div.appendChild(divText);
        return div
    }

    function fillPlanetsTable() {
        console.dir(userData)
        planetsTable.innerHTML = "";

        const columnHeaders = ["Name", "ID", "Coords", "Focus", "Build", "Shipbuild", "Explore", "Distance"]
        const columnWidths = ["12%", "12%", "8%", "8%", "8%", "8%", "8%", "8%"]

        // Create row for table and label it with planet id
        let headerRow = document.createElement("div")
        headerRow.setAttribute('id', "headerRow");
        headerRow.setAttribute('class', "table");
        planetsTable.appendChild(headerRow);

        for (let i = 0; i < columnHeaders.length; i+=1) {
            headerRow.appendChild(createTableDiv(columnHeaders[i], columnHeaders[i], columnWidths[i], false));
        }


        for (const planet of userData.planets) {


            // Create row for table and label it with planet id
            let newRow = document.createElement("div")
            newRow.setAttribute('id', planet.id);
            newRow.setAttribute('class', "table");
            planetsTable.appendChild(newRow);



            newRow.appendChild(createTableDiv("name", planet.name, columnWidths[0], true))
            newRow.appendChild(createTableDiv("id", planet.id, columnWidths[1], true))
            newRow.appendChild(createTableDiv("coords", "[" + planet.planetCoords + "]", columnWidths[2], true))

            if (planet.focus === planet.focusDerived) {
                newRow.appendChild(createTableDiv("focus", planet.focus, columnWidths[3], true))
            } else {
                newRow.appendChild(createTableDiv("focus", planet.focus, columnWidths[3], false))
            }

            if (planet.build === planet.buildDerived) {
                newRow.appendChild(createTableDiv("build", planet.build, columnWidths[4], true))
            } else {
                newRow.appendChild(createTableDiv("build", planet.build, columnWidths[4], false))
            }

            if (planet.shipbuild === planet.shipbuildDerived) {
                newRow.appendChild(createTableDiv("shipbuild", planet.shipbuild, columnWidths[5], true))
            } else {
                newRow.appendChild(createTableDiv("shipbuild", planet.shipbuild, columnWidths[5], false))
            }

            if (planet.explore === planet.exploreDerived) {
                newRow.appendChild(createTableDiv("explore", planet.explore, columnWidths[6], true))
            } else {
                newRow.appendChild(createTableDiv("explore", planet.explore, columnWidths[6], false))
            }

            newRow.appendChild(createTableDiv("distance", planet.shortestDistance, columnWidths[7], true))

            /*
            // Add div for planet name
            let planetName = document.createElement("div")
            let planetNameText = document.createTextNode(planet.name);
            planetName.appendChild(planetNameText);
            newRow.appendChild(planetName)

            // Add div for planet id
            let planetId = document.createElement("div")
            let planetIdText = document.createTextNode(planet.id);
            planetId.appendChild(planetIdText);
            newRow.appendChild(planetId)
            */

            // Add div for planet coordinates
            // Add div? dropdown? for build type classification
            // Add id for build type classification



        }

    }

    // Event listener for click on planetsTable
    planetsTable.addEventListener("click", function(e) {

        // "Enum" of values for Focus
        planetStates = Object.freeze({
            focus: {values: ["explore", "develop", "resource"], override: "focusOverride", derived: "focusDerived"} ,
            build: {values: ["new", "develop", "none"], override: "buildOverride", derived: "buildDerived"},
            shipbuild: {values: ["explorer", "all", "none"], override: "shipbuildOverride", derived: "shipbuildDerived"},
            explore: {values: ["true", "false"], override: "exploreOverride", derived: "exploreDerived"}
        });

        let userDataEntry = fetchUserDataFromStorage(user)

        // Identify cell clicked on (ignore header for the moment)
        const item = e.target.id
        const parentDivID = e.target.parentNode.id;
        let divValue = e.target.innerText
        console.log(item, parentDivID, divValue)

        // Rotate through possible values and update table and userData
        if (planetStates[item] !== undefined) {
            const columnValues = planetStates[item].values
            console.log(columnValues)
            const currentIndex = columnValues.findIndex(value => value == divValue);
            const newIndex = (currentIndex + 1) % columnValues.length
            const newValue = columnValues[newIndex]
            console.log(currentIndex, newIndex, newValue)


            let userDataPlanetsIndex = userDataEntry.planets.findIndex(entry => entry.id === parentDivID);
            console.log(userDataPlanetsIndex)
            if (userDataPlanetsIndex !== -1) {
                let override = planetStates[item].override
                let derived = planetStates[item].derived

                if (userDataEntry.planets[userDataPlanetsIndex][derived] === newValue) {
                    e.target.setAttribute('class', 'tableBoxDerived');
                    userDataEntry.planets[userDataPlanetsIndex][override] = false
                } else {
                    e.target.setAttribute('class', 'tableBoxUser');
                    userDataEntry.planets[userDataPlanetsIndex][override] = newValue
                }
                userDataEntry.planets[userDataPlanetsIndex][item] = newValue
                e.target.innerText = newValue

                setUserDataInStorage(user, userDataEntry)
            }


        }
    });








    // Get mission buttons
    const runLoginMissionButton = document.getElementById('runLoginMission');
    const runInfoMissionButton = document.getElementById('runInfoMission');

    var loginMissionSelect = document.getElementById("loginMissionSelect")
    var infoMissionSelect = document.getElementById("infoMissionSelect")

    // Other data inputs
    const xCoordinateField = document.getElementById("xCoordinate")
    const yCoordinateField = document.getElementById("yCoordinate")
    const maxProcessField = document.getElementById("numberOfTransactions")
    const explorerRangeField = document.getElementById("explorerRange")

    const outputNode = document.getElementById('output');




    //let user = inputs.elements[0].value
    //let mission = inputs.elements[0].value



    //for (const [index, userName] of userList.entries()) {
    //    await createUserData(userName.user);
    //    console.dir(userDataStore[index])
    //}

    runLoginMissionButton.addEventListener('click', (e) => {
        // Stop the default action from doing anything
        e.preventDefault();

        const mission = loginMissionSelect.value;
        const maxProcess = maxProcessField.value;
        const explorerRange = parseFloat(explorerRangeField.value);
        const xCoordinate = xCoordinateField.value;
        const yCoordinate = yCoordinateField.value;

        if (user && logInStatus == "keychain") {
            runLoginMission(user, userData, mission, maxProcess, explorerRange, xCoordinate, yCoordinate, outputNode);
        } else {
            console.log('User not logged in with keychain.');
        }
    });

    runInfoMissionButton.addEventListener('click', (e) => {
        // Stop the default action from doing anything
        e.preventDefault();

        const mission = infoMissionSelect.value;
        const explorerRange = parseFloat(explorerRangeField.value);
        const xCoordinate = xCoordinateField.value;
        const yCoordinate = yCoordinateField.value;

        if (user && (logInStatus == "setForInfo" || logInStatus == "keychain")) {
            runInfoMission(user, userData, mission, explorerRange, xCoordinate, yCoordinate, outputNode);
        } else {
            console.log('User not logged in for info.');
        }

    });





});










const launchTime = Date.now();
let missionLaunchTime = Date.now();
let workFlowMonitor = true


// --------------------------

async function runLoginMission(user, userData, mission, maxProcess, explorerRange, xCoordinate, yCoordinate, outputNode) {
    outputNode.innerHTML = "";
    missionLaunchTime = Date.now();
    let transactionDelay = 3000;

    if (mission == "check") {
        check(user)
    } else if (mission == "resource yamatos") {
        console.log("runLoginMission - resource yamatos")
        let transactions = await resourceForYamatos(user, userData, outputNode);
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "build explorers") {
        console.log("runLoginMission - build explorers")
        let transactions = await findExplorersToBuild(user, userData, outputNode)
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "build ships") {
        console.log("runLoginMission - build ships")
        let transactions = await findShipsToBuild(user, userData, outputNode)
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "upgrade buildings") {
        console.log("runLoginMission - upgrade buildings")
        let transactions = await findBuildingsToUpgrade(user, userData, outputNode)
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "build - new") {
        console.log("runLoginMission - build - new")
        let transactions = await findNewBuildTransactions(user, outputNode)
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "send explorers") {
        console.log("runLoginMission - send explorers")
        let transactions = await findExplorationTransactions(user, userData, explorerRange, outputNode)
        transactionDelay = 3000;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "send explorerII") {
        console.log("runLoginMission - send explorerII")
        let transactions = await findExplorerTwoTransactions(user, userData, explorerRange, xCoordinate, yCoordinate, outputNode)
        transactionDelay = 3000;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "sell ships") {
        console.log("runLoginMission - sell ships")
        let transactions = await findMarketTrades(user, userData, outputNode)
        transactionDelay = 500;
        processKeychainTransactions(user, transactions, maxProcess, transactionDelay);
    } else if (mission == "reset data") {
        await updateAndStoreUserData(user, "reset");
    }

}

async function runInfoMission(user, userData, mission, explorerRange, xCoordinate, yCoordinate, outputNode) {
    outputNode.innerHTML = "";
    missionLaunchTime = Date.now();

    if (mission == "targets") {
        targets(user, outputNode)
    } else if (mission == "resource yamatos") {
        let transportTransactions = await resourceForYamatos(user, userData, outputNode)
    } else if (mission == "snipes") {
        snipes(user,outputNode)
    } else if (mission == "buildings") {
        let buildingsTransactions = await findBuildingsToUpgrade(user, userData, outputNode)
    } else if (mission == "build - new") {
        let transactions = await findNewBuildTransactions(user, outputNode)
    } else if (mission == "ships") {
        let buildShipTransactions = await findShipsToBuild(user, userData, outputNode)
    } else if (mission == "build explorers") {
        let transactions = await findExplorersToBuild(user, userData, outputNode)
    } else if (mission == "market") {
        let marketInfo = await findMarketTrades(user, userData, outputNode)
    } else if (mission == "send explorers") {
        let explorationTransactions = await findExplorationTransactions(user, userData, explorerRange, outputNode)
    } else if (mission == "explorerII scoping") {
        let explorationTwoTransactions = await findExplorerTwoTransactions(user, userData, explorerRange, xCoordinate, yCoordinate, outputNode)
    } else if (mission == "define strategy") {
        await defineStrategy(user, outputNode)
    }
}

async function check(user) {

    // Steem Keychain extension installed
    if(window.steem_keychain) {
        console.log('Keychain installed');
        // Request handshake
        steem_keychain.requestHandshake(function() {
            console.log('Handshake received!');
        });
    // Steem Keychain extension not installed...
    } else {
        console.log('Keychain not installed');
    }

}


async function snipes(user, outputNode) {
    outputNode.innerHTML += "<br>"
    outputNode.innerHTML += "Explorer Missions And Snipes <br>"
    outputNode.innerHTML += "Time now: " + new Date(launchTime) + "<br>"

    let activeMissions = await getUserMissions(user, 1)
    let galaxyData = []

    let i = 0

    for (const mission of activeMissions) {

        let planetCoords = [mission.start_x, mission.start_y]
        let spaceCoords = [mission.end_x, mission.end_y]
        let missionDistance = distance(planetCoords, spaceCoords)

        galaxyData[i] = await getGalaxy(spaceCoords[0], spaceCoords[1], 0, 0)
        outputNode.innerHTML += "<br>"
        outputNode.innerHTML += mission.type + "<br>"
        outputNode.innerHTML += "Planet x: " + planetCoords[0] + " y: " + planetCoords[1] + "<br>"


        if (mission.type == "explorespace" && mission.result == null) {
            outputNode.innerHTML += "Space x: " + spaceCoords[0] + " y: " + spaceCoords[1] + "<br>"
            outputNode.innerHTML += "Distance: " + missionDistance.toFixed(2) + "<br>"

            for (explorer of galaxyData[i].explore) {

                if (explorer.date_return == null) {
                    outputNode.innerHTML += "explorer cancelled: " + explorer.user + "<br>"
                } else {
                    let arrival = new Date(explorer.date * 1000)
                    let timeRemaining = arrival - missionLaunchTime
                    outputNode.innerHTML += "explorer: " + explorer.user + " : " + arrival + "<br>"
                    let convertedTime = convertToHoursMinutes(timeRemaining)
                    outputNode.innerHTML += "time remaining: " + convertedTime[0] + "h " + convertedTime[1] + "m <br>"
                }
            }
        } else if (mission.type == "explorespace" && mission.result != null) {
            outputNode.innerHTML += mission.result + "<br>"
        } else {
            outputNode.innerHTML += "Destination x: " + spaceCoords[0] + " y: " + spaceCoords[1] + "<br>"
            outputNode.innerHTML += "Distance: " + missionDistance.toFixed(2) + "<br>"
        }

        i += 1
    }
}

function convertToHoursMinutes(time) {
    let hours = Math.floor(time/1000/3600)
    let minutes = Math.floor(time/1000/60 - hours*60)
    return [hours, minutes]
}

function convertDistanceToTimeInSeconds(speed, distance) {
    let timeToTravelInHours = distance / speed;
    let timeToTravelInSeconds = timeToTravelInHours * 60 * 60;
    return timeToTravelInSeconds;
}


function distance(planetCoords, spaceCoords) {
    let xDistance = spaceCoords[0] - planetCoords[0]
    let yDistance = spaceCoords[1] - planetCoords[1]
    let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)
    return distance
}



async function missions(user) {
    let dataPlanets = await getPlanetsOfUser(user)

    let missionsData = []
    let explorerMissions = []

    let i = 0
    for (const planet of dataPlanets.planets) {
        missionsData[i] = await getMissions(user, planet.id)

        for (const mission of missionsData[i]) {
            let planet = mission.from_planet.name
            let arrival = new Date(mission.arrival * 1000)
            let cancelled = mission.cancel_trx
            let type = mission.type
            let result = mission.result
        }
        i += 1
    }
}



async function targets(user, outputNode) {
    let targetAccounts = []
    if (user == "miniature-tiger") {
        targetAccounts = ['loliver', 'aniestudio', 'xunityx', 'giornalista', 'elprutest', 'z3ll', 'mcoinz79']
    } else if (user == "tiger-zaps") {
        targetAccounts = ['chilis', 'ga-sm', 'anshia', 'balder', 'jomeszaros', 'arteaga-juan', 'dungeonandpig', 'velazblog', 'szf', 'pladozero']
    }

    for (const target of targetAccounts) {
        await checkPotentialForAttack(target, outputNode)
    }
}

async function checkPotentialForAttack(target, outputNode) {
    outputNode.innerHTML += "<br>" + target + "<br>"
    let dataPlanets = await getPlanetsOfUser(target)

    let planetData = []
    let planetResources = []
    let planetInfo = []
    let planetShips = []
    let i = 0
    for (const planet of dataPlanets.planets) {
        planetData[i] = await getPlanetResources(planet.id)
        planetResources[i] = await calculateCurrentResources(planetData[i])
        planetInfo[i] = await getPlanetInfo(planet.id)
        planetShips[i] = await getPlanetShips(target, planet.id)

        outputNode.innerHTML += planet.id + " : " + planet.name + "<br>"
        outputNode.innerHTML += "Resources -> coal:" + planetResources[i].coal + " ore:" + planetResources[i].ore + " copper:" + planetResources[i].copper + " uranium:" + planetResources[i].uranium + "<br>";
        outputNode.innerHTML += "Depots -> coal:" + planetData[i].coaldepot + " ore:" + planetData[i].oredepot + " copper:" + planetData[i].copperdepot + " uranium:" + planetData[i].uraniumdepot + "<br>";
        outputNode.innerHTML += "Shield charge:" + ((planetInfo[i].shieldcharge_busy - missionLaunchTime/1000) / 3600) + " Shield charged:" + planetInfo[i].shieldcharged + " Shield protection:" + ((planetInfo[i].shieldprotection_busy - missionLaunchTime/1000)/ 3600) + "<br>";
        console.log(planetInfo[i].shieldcharge_busy, planetInfo[i].shieldprotection, missionLaunchTime)
        i += 1
    }
}




function timeTranslation(time) {
    return new Date(time * 1000)
}

async function calculateCurrentResources(planet) {
  let timeSinceUpdate = ((missionLaunchTime - planet.lastUpdate * 1000) / 3600 / 1000);

  let coal = Math.min(updateResource(planet.coal, planet.coalrate, timeSinceUpdate), planet.coaldepot)
  let ore = Math.min(updateResource(planet.ore, planet.orerate, timeSinceUpdate), planet.oredepot)
  let copper = Math.min(updateResource(planet.copper, planet.copperrate, timeSinceUpdate), planet.copperdepot)
  let uranium = Math.min(updateResource(planet.uranium, planet.uraniumrate, timeSinceUpdate), planet.uraniumdepot)

  return {coal: coal, ore: ore, copper: copper, uranium: uranium}
}


function updateResource(resource, rate, hours) {
    return (resource + (rate / 24) * hours).toFixed(2)
}

async function fetchBuildingsData(user) {
    let dataPlanets = await getPlanetsOfUser(user);
    let buildingsData = [];

    let i = 0;
    for (const planet of dataPlanets.planets) {
        buildingsData[i] = await getBuildings(planet.id);
    }
    return buildingsData;
}

async function shipsToUpgradeForPlanet(planetId, resources, shipyard, shipPriority, minimumShipPriority) {
    //let scarceResource = findScarceResource(JSON.parse(JSON.stringify(resources)));
    let remainingResources = JSON.parse(JSON.stringify(resources));

    let shipyardActivated = shipyard.filter(ship => ship.activated === true);
    //console.dir(shipyardActivated)
    //let shipyardPriorityOnly = shipyardActivated.filter(ship => shipHasPriority(ship.type, shipPriority) === true);
    let shipyardPriorityOnly = shipyardActivated.filter(ship => shipHasSufficientPriority(ship.type, shipPriority, minimumShipPriority) === true);
    //console.dir(shipyardPriorityOnly)

    let shipyardWithPriority = shipyardPriorityOnly.map(ship => ({...ship, priority: shipPriority[ship.type]}))
    //console.dir(shipyardWithPriority)

    let shipyardWithSkills = shipyardWithPriority.filter(ship => shipHasSkills(ship) === true)

    let shipyardAvailableToBuild = shipyardWithSkills.filter(ship => shipbuildingBusy(missionLaunchTime, ship.busy_until) === false);

    shipyardAvailableToBuild.sort((a, b) => b.priority - a.priority);
    //console.dir(shipyardAvailableToBuild)

    let shipsToUpgrade = [];

    for (const ship of shipyardAvailableToBuild) {
         if (checkIfSufficientResourcesForShip(ship, remainingResources) === true) {
              remainingResources = deductCostsForShip(ship, remainingResources)

              // Create ship transaction and push to transaction list
              let shipInfo = {}
              shipInfo.type = "buildShip"
              shipInfo.planetId = planetId
              shipInfo.name = ship.type
              shipsToUpgrade.push(shipInfo);
         } else {
              // Do not build any ships if cannot build
              console.log(planetId + " not enough resources to build " + ship.type)
              break
         }

    }

    //console.log(shipsToUpgrade)
    return shipsToUpgrade;
}

async function buildingsToUpgradeForPlanet(planetId, resources, buildings, minimumRequiredSkillLevel) {



    let scarceResource = findScarceResource(JSON.parse(JSON.stringify(resources)));
    let remainingResources = JSON.parse(JSON.stringify(resources));

    buildings.sort((a, b) => a[scarceResource] - b[scarceResource]);

    let buildingsToUpgrade = [];

    let sufficient = true;

    for (const building of buildings) {
        if (sufficient == true) {
            //console.log(remainingResources)
            // Check if building already being updated
            let busy = checkIfBuildingBusy(missionLaunchTime, building.busy)

            // Check if skill level greater than current level
            let nextSkill = checkIfNextSkillCompleted(building.current, building.skill)

            // Check if current skill below minimum required
            let upgradeRequired = false
            if (building.current < minimumRequiredSkillLevel) {
                upgradeRequired = true
            }

            //console.log(building.name, "busy", busy, "nextSkill", nextSkill, "upgradeRequired", upgradeRequired)

            if (busy == false && nextSkill == true && upgradeRequired == true) {
                let newRemainingResources = remainingResources;
                // Check if sufficient resources for upgrade
                sufficient = checkIfSufficientResources(building, remainingResources)
                //console.log("sufficient", sufficient)
                if (sufficient == true) {
                    remainingResources = deductCosts(building, remainingResources)

                    let buildingInfo = {}

                    // Include name and current skill level
                    buildingInfo.type = "upgradeBuilding"
                    buildingInfo.planetId = planetId
                    buildingInfo.name = building.name
                    buildingInfo.current = building.current

                    // Include costs to update
                    //buildingInfo.coal = building.coal
                    //buildingInfo.ore = building.ore
                    //buildingInfo.copper = building.copper
                    //buildingInfo.uranium = building.uranium

                    buildingsToUpgrade.push(buildingInfo);
                }
            }
        }
    }

    return buildingsToUpgrade;
}

async function newBuildTransactionsForPlanet(planetId, resources, buildings) {
    console.log(planetId)
    console.dir(resources)
    console.dir(buildings)

    let maximumLevel = 14;

    let buildingsPriority = []

    let buildingsPriorityOne = [
        {name: "base", priority: 1},
        {name: "coalmine", priority: 1},
        {name: "oremine", priority: 1},
        {name: "coppermine", priority: 1},
        {name: "uraniummine", priority: 1},
        {name: "shipyard", priority: 4},
        {name: "coaldepot", priority: 4},
        {name: "oredepot", priority: 4},
        {name: "copperdepot", priority: 4},
        {name: "uraniumdepot", priority: 4},
        {name: "researchcenter", priority: 6},
        {name: "bunker", priority: 7},
        {name: "shieldgenerator", priority: 7},
    ]

    let buildingsPriorityTwo = [
        {name: "base", priority: 1},
        {name: "coalmine", priority: 1},
        {name: "oremine", priority: 1},
        {name: "coppermine", priority: 1},
        {name: "uraniummine", priority: 1},
        {name: "shipyard", priority: 1},
        {name: "coaldepot", priority: 1},
        {name: "oredepot", priority: 1},
        {name: "copperdepot", priority: 1},
        {name: "uraniumdepot", priority: 1},
        {name: "researchcenter", priority: 1},
        {name: "bunker", priority: 1},
        {name: "shieldgenerator", priority: 1},
    ]

    let uranimumMineIndex = buildings.findIndex(building => building.name == "uraniummine");
    let uraniumMineLevel = buildings[uranimumMineIndex].current;
    if (uraniumMineLevel < 12) {
        buildingsPriority = buildingsPriorityOne;
    } else {
        buildingsPriority = buildingsPriorityTwo;
    }

    let buildingsToUpgrade = [];

    let remainingResources = JSON.parse(JSON.stringify(resources));
    let minimumPriorityCalc = 10000;

    for (const [i, buildPriority] of buildingsPriority.entries()) {
        let buildingsIndex = buildings.findIndex(building => building.name == buildPriority.name);
        let priorityCalc = buildPriority.priority + buildings[buildingsIndex].current;
        buildingsPriority[i]["priorityCalc"] = priorityCalc;

        buildingsPriority[i]["busy"] = buildings[buildingsIndex].busy;
        buildingsPriority[i]["current"] = buildings[buildingsIndex].current;
        buildingsPriority[i]["skill"] = buildings[buildingsIndex].skill;
        buildingsPriority[i]["coal"] = buildings[buildingsIndex].coal;
        buildingsPriority[i]["ore"] = buildings[buildingsIndex].ore;
        buildingsPriority[i]["copper"] = buildings[buildingsIndex].copper;
        buildingsPriority[i]["uranium"] = buildings[buildingsIndex].uranium;

        if (priorityCalc < minimumPriorityCalc && checkIfBuildingBusy(missionLaunchTime, buildings[buildingsIndex].busy) == false) {
            minimumPriorityCalc = priorityCalc;
        }
    }

    console.log(minimumPriorityCalc, maximumLevel+1)
    if (minimumPriorityCalc < (maximumLevel+1)) {
        let sufficient = true;

        for (const buildPriority of buildingsPriority) {
            if (sufficient == true) {
                // Check if building already being updated
                let busy = checkIfBuildingBusy(missionLaunchTime, buildPriority.busy)

                // Check if skill level greater than current level
                let nextSkill = checkIfNextSkillCompleted(buildPriority.current, buildPriority.skill)

                // Check if current skill below minimum required
                let upgradeRequired = false
                if (buildPriority.priorityCalc == minimumPriorityCalc) {
                    upgradeRequired = true
                }

                if (busy == false && nextSkill == true && upgradeRequired == true) {
                    let newRemainingResources = remainingResources;

                    // Check if sufficient resources for upgrade
                    sufficient = checkIfSufficientResources(buildPriority, remainingResources)

                    if (sufficient == true) {
                        remainingResources = deductCosts(buildPriority, remainingResources)

                        let buildingInfo = {}

                        // Include name and current skill level
                        buildingInfo.type = "upgradeBuilding"
                        buildingInfo.planetId = planetId
                        buildingInfo.name = buildPriority.name
                        buildingInfo.current = buildPriority.current

                        buildingsToUpgrade.push(buildingInfo);

                    }
                }
            }
        }
    }



    return buildingsToUpgrade;
}



function deductCosts(building, remainingResources) {
    resourceTypes = ["coal", "ore", "copper", "uranium"]
    for (const resourceType of resourceTypes) {
        remainingResources[resourceType] = remainingResources[resourceType] - building[resourceType];
    }
    return remainingResources;
}

function deductCostsForShip(ship, remainingResources) {
    resourceTypes = ["coal", "ore", "copper", "uranium"]
    for (const resourceType of resourceTypes) {
        remainingResources[resourceType] = remainingResources[resourceType] - ship.costs[resourceType];
    }
    return remainingResources;
}

function checkIfSufficientResources(building, remainingResources) {
    let sufficient = true;
    resourceTypes = ["coal", "ore", "copper", "uranium"]

    for (const resourceType of resourceTypes) {
        if (remainingResources[resourceType] - building[resourceType] < 0) {
            sufficient = false;
        }
    }

    return sufficient;
}

function checkIfSufficientResourcesForShip(ship, remainingResources) {
    let result = true;
    resourceTypes = ["coal", "ore", "copper", "uranium"]

    for (const resourceType of resourceTypes) {
        if (remainingResources[resourceType] - ship.costs[resourceType] < 0) {
            result = false;
        }
    }
    return result;
}


function findScarceResource(resources) {
    resources.coal = resources.coal / 8
    resources.ore = resources.ore / 4
    resources.copper = resources.copper / 2
    resources.uranium = resources.uranium
    let resourceArray = Object.values(resources);
    let scarceResourceValue = Math.min(...resourceArray);
    let scarceResource = Object.keys(resources).find(key => resources[key] === scarceResourceValue)
    return scarceResource
}

function checkIfBuildingBusy(launchTime, busyTime) {
    if (busyTime - launchTime/1000 > 0) {
        return true;
    } else {
        return false;
    }
}

function shipHasPriority(type, shipPriority) {
    if (shipPriority[type] == undefined) {
        return false;
    } else {
        return true;
    }
}

function shipHasSufficientPriority(type, shipPriority, minimumShipPriority) {
    let result = false;
    if (shipPriority[type] != undefined) {
        if (shipPriority[type] >= minimumShipPriority) {
            result = true;
        } else {
            //console.log("cannot build " + type + " as shipPriority of " + shipPriority + " < " + minimumShipPriority)
        }
    }
    return result;
}

function shipHasSkills(ship) {
    let result = true;

    // Check if ship skill completed - cannot build unless at 20
    if (ship.shipyard_skill != 20) {
        result = false;
    }

    // Check if shipyard at required skill level - cannot build ship otherwise
    if (ship.shipyard_level < ship.shipyard_min_level) {
        result = false;
    }

    return result;
}

function shipbuildingBusy(launchTime, busyUntil) {
    if (busyUntil === null || busyUntil - launchTime/1000 < 0) {
        return false;
    } else {
        return true;
    }
}


function checkIfNextSkillCompleted(current, skill) {
    if (skill > current) {
        return true
    } else {
        return false
    }
}


async function findBuildingsToUpgrade(user, userData, outputNode) {

    let minimumRequiredSkillLevel = 14;

    let planetData = [];
    let planetResources = [];
    let buildingsData = [];
    let buildingsToUpgrade = [];
    let buildingsTransactions = [];

    let dataPlanets = await getPlanetsOfUser(user);

    let i = 0;
    for (const planet of dataPlanets.planets) {

        let userDataPlanetIndex = userData.planets.findIndex(entry => entry.id == planet.id)
        let build = true;
        if (userDataPlanetIndex != -1) {
            build = userData.planets[userDataPlanetIndex].build;
        }

        if (build == true) {
            planetData[i] = await getPlanetResources(planet.id)
            planetResources[i] = await calculateCurrentResources(planetData[i])
            buildingsData[i] = await getBuildings(planet.id);
            buildingsToUpgrade[i] = await buildingsToUpgradeForPlanet(planet.id, planetResources[i], buildingsData[i], minimumRequiredSkillLevel)
            for (const upgrade of buildingsToUpgrade[i]) {
                outputNode.innerHTML += upgrade.type + " " + upgrade.planetId + " " + upgrade.name + " " + upgrade.current + "<br>"
                buildingsTransactions.push(upgrade)
            }
        }

        i += 1
    }

    console.dir(buildingsTransactions)
    return buildingsTransactions;
}

async function findNewBuildTransactions(user, outputNode) {
    let buildingsTransactions = [];

    // Fetch user data for user
    let userDataEntry = fetchUserDataFromStorage(user)

    for (const planet of userDataEntry.planets) {
        // Only process for "new build" planets
        if (planet.build === "new" || planet.build === "develop") {
            let planetData = await getPlanetResources(planet.id);
            let planetResources = await calculateCurrentResources(planetData);
            let buildingsData = await getBuildings(planet.id);
            let buildingsToUpgrade = await newBuildTransactionsForPlanet(planet.id, planetResources, buildingsData)
            for (const upgrade of buildingsToUpgrade) {
                outputNode.innerHTML += upgrade.type + " " + upgrade.planetId + " " + upgrade.name + " " + upgrade.current + "<br>"
                buildingsTransactions.push(upgrade)
            }
        }
    }
    console.dir(buildingsTransactions)
    return buildingsTransactions;

}

async function findExplorersToBuild(user, userData, outputNode) {
    let planetsToBuildExplorers = userData.planets.filter(planet => planet.shipbuild == "explorer")

    let planetData = [];
    let planetResources = [];
    let shipyardData = [];
    let shipsTransactions = [];
    let i=0;

    for (const planet of planetsToBuildExplorers) {
        planetData[i] = await getPlanetResources(planet.id)
        planetResources[i] = await calculateCurrentResources(planetData[i])
        shipyardData[i] = await getPlanetShipyard(user, planet.id)

        let explorerIndex = shipyardData[i].findIndex(entry => entry.type == "explorership")
        let ship = shipyardData[i][explorerIndex]
        let buildExplorer = true

        if (shipHasSkills(ship) === false) {
            buildExplorer = false
        }

        if (shipbuildingBusy(missionLaunchTime, ship.busy_until) === true) {
            buildExplorer = false
        }

        if (checkIfSufficientResourcesForShip(ship, planetResources[i]) === false) {
            buildExplorer = false
        }

        if (buildExplorer === true) {

             // Create ship transaction and push to transaction list
             let shipInfo = {};
             shipInfo.type = "buildShip";
             shipInfo.planetId = planet.id;
             shipInfo.name = "explorership"
             outputNode.innerHTML += shipInfo.type + " " + shipInfo.planetId + " " + shipInfo.name + "<br>"
             shipsTransactions.push(shipInfo)

        } else {
             // Do not build any ships if cannot build
             console.log(planet.id + " not enough resources to build " + ship.type)

        }
        i += 1
    }
    return shipsTransactions;
}


async function findShipsToBuild(user, userData, outputNode) {
    /*
    let shipPriority2 = {
        scout: 0,
        patrol: 0,
        cutter: 0,
        corvette: 63,
        frigate: 64,
        destroyer: 65,
        cruiser: 66,
        battlecruiser: 67,
        carrier: 68,
        transporter: 0,
        dreadnought: 69,
        explorer: 0,
        scout2: 0,
        patrol2: 0,
        cutter2: 82,
        corvette2: 83,
        frigate2: 84,
        destroyer2: 85,
        cruiser2: 86,
        battlecruiser2: 87,
        carrier2: 88,
        transporter2: 89,
        dreadnought2: 90,
        explorer2: 99
    }
    */

    let shipPriority = {
        corvette: 63,
        frigate: 64,
        destroyer: 65,
        cruiser: 66,
        battlecruiser: 67,
        carrier: 68,
        dreadnought: 69,
        cutter2: 81,
        corvette2: 82,
        frigate2: 83,
        destroyer2: 84,
        cruiser2: 85,
        battlecruiser2: 86,
        carrier2: 87,
        transportship2: 91,
        dreadnought2: 92,
        explorership1: 99
    }

    let planetData = [];
    let planetResources = [];
    let shipyardData = [];
    let shipsToUpgrade = [];
    let shipsTransactions = [];

    let dataPlanets = await getPlanetsOfUser(user);

    let i = 0;
    for (const planet of dataPlanets.planets) {

        let userDataPlanetIndex = userData.planets.findIndex(entry => entry.id == planet.id)
        let shipbuild = true;
        let minimumShipPriority = 0;
        if (userDataPlanetIndex != -1) {
            shipbuild = userData.planets[userDataPlanetIndex].shipbuild;
            minimumShipPriority = userData.planets[userDataPlanetIndex].minimumShipPriority;
        }
        console.log(planet.id, shipbuild, planet.name, minimumShipPriority)

        if (shipbuild == true) {
            planetData[i] = await getPlanetResources(planet.id)
            planetResources[i] = await calculateCurrentResources(planetData[i])
            shipyardData[i] = await getPlanetShipyard(user, planet.id)
            shipsToUpgrade[i] = await shipsToUpgradeForPlanet(planet.id, planetResources[i], shipyardData[i], shipPriority, minimumShipPriority)
            //console.dir(planet)
            //console.log(planet.id, planet.name)
            //}
            //buildingsToUpgrade[i] = await buildingsToUpgradeForPlanet(planet.id, planetResources[i], buildingsData[i], minimumRequiredSkillLevel)
            //for (const upgrade of buildingsToUpgrade[i]) {
            //    outputNode.innerHTML += upgrade.type + " " + upgrade.planetId + " " + upgrade.name + " " + upgrade.current + "<br>"
            //    buildingsTransactions.push(upgrade)
            //}
            for (const upgrade of shipsToUpgrade[i]) {
                outputNode.innerHTML += upgrade.type + " " + upgrade.planetId + " " + upgrade.name + "<br>"
                shipsTransactions.push(upgrade)
            }
        }
        i += 1
    }

    return shipsTransactions;
}


async function resourceForYamatos(user, userData, outputNode) {
    // In user data mark yamato planets
    // If resource planet
    // Find nearest yamatos planet (yamato mission or yamato in fleet)
    // Check ships available in fleet
    // Filter ships you want to use (level 3, 4)
    // Count resources available to transport (leave 50 uranium to pay for travel)
    // Only send if more than 2400
    // Send

    let transportTransactions = [];

    let shipPriority = {
        transportship2: 99,
        destroyer: 89,
        destroyer2: 89,
        frigate: 88,
        frigate2: 88,
        corvette: 79,
        corvette2: 79,
        cruiser: 69,
        cruiser2: 69,
        battlecruiser: 68,
        battlecruiser2: 68,
        //dreadnought: 59,
        //dreadnought2: 59,
        //carrier: 58,
        //carrier2: 58,
    }

    outputNode.innerHTML += "<br>";

    let yamatoPlanets = [];

    // Find yamato planets
    for (const planet of userData.planets) {

        let reg = new RegExp("yamato*");
        let yamatoFleetIndex = planet.planetFleetInfo.findIndex(fleet => reg.test(fleet.type));
        let yamatoInFleet = false;
        if (yamatoFleetIndex != -1) {
            yamatoInFleet = true
            outputNode.innerHTML += planet.name + " " + planet.id + " : " + "yamato available" + "<br>";
            console.log(planet.planetFleetInfo[yamatoFleetIndex])
        }

        let planetMissionsData = await getMissions(user, planet.id, 1)
        let yamatoMissions = planetMissionsData.filter(mission => mission.type == "upgradeyamato");
        if (yamatoMissions.length > 0) {
            yamatoInFleet = true
            outputNode.innerHTML += planet.name + " " + planet.id + " : " + "yamato on upgrade" + "<br>";
            console.log(yamatoMissions)
        }

        if (yamatoInFleet == true) {
            yamatoPlanets.push(planet)
        }


    }

    outputNode.innerHTML += "<br>";
    outputNode.innerHTML += "<br>";

    for (const planet of userData.planets) {
        //let planetCoords = planet.planetCoords;

        if (planet.focus == "resource" || planet.focus == "develop") {
            let distanceToNearestYamatoPlanet = 1000000;
            let nearestYamatoPlanet = planet;


            for (const yamatoPlanet of yamatoPlanets) {

                let nextDistance = distance(planet.planetCoords, yamatoPlanet.planetCoords);
                if (nextDistance < distanceToNearestYamatoPlanet) {
                    distanceToNearestYamatoPlanet = nextDistance;
                    nearestYamatoPlanet = yamatoPlanet;
                }
            }

            console.log(nearestYamatoPlanet)

            if (distanceToNearestYamatoPlanet > 0 && distanceToNearestYamatoPlanet < (24 * 4)) {
                let planetData = await getPlanetResources(planet.id);
                let planetResources = await calculateCurrentResources(planetData);
                resourceTypes = ["coal", "ore", "copper", "uranium"]

                let totalResources = 0;
                for (const resourceType of resourceTypes) {
                    totalResources += planetResources[resourceType];
                }

                if (totalResources > 3600) {


                    let transportShips = planet.planetFleetInfo;
                    transportShips = transportShips.filter(ship => shipPriority[ship.type] > 0);
                    transportShips = transportShips.sort((a, b) => shipPriority[b.type] - shipPriority[a.type]);

                    console.dir(transportShips)

                    let remainingResources = totalResources;
                    let resourcesToTransport = 0;
                    let shipList = {};
                    for (const transportShipClass of transportShips) {
                        if (remainingResources > 0) {
                            if (transportShipClass.quantity * transportShipClass.capacity > remainingResources) {
                                let partialNumber = Math.ceil(remainingResources / transportShipClass.capacity);
                                shipList[transportShipClass.type] = partialNumber;
                                resourcesToTransport += remainingResources;
                                remainingResources = 0;
                            } else {
                                shipList[transportShipClass.type] = transportShipClass.quantity;
                                remainingResources -= transportShipClass.quantity * transportShipClass.capacity;
                                resourcesToTransport += transportShipClass.quantity * transportShipClass.capacity;
                            }
                        }
                    }
                    console.dir(shipList)
                    console.log(resourcesToTransport)

                    if (resourcesToTransport > 3600) {
                        let resourceTransportRatio = resourcesToTransport / totalResources;
                        let resourcesByType = {};
                        for (const resourceType of resourceTypes) {
                            if (resourceTransportRatio > 0.99 & resourceType == "uranium") {
                                resourcesByType[resourceType] = Math.floor(planetResources[resourceType] * resourceTransportRatio - 20);
                            } else {
                                resourcesByType[resourceType] = Math.floor(planetResources[resourceType] * resourceTransportRatio);
                            }

                        }

                        let transaction = {};


                        // Include name and current skill level
                        transaction.type = "transport";
                        transaction.originPlanetId = planet.id;
                        transaction.x = nearestYamatoPlanet.planetCoords[0];
                        transaction.y = nearestYamatoPlanet.planetCoords[1];
                        transaction.shipList = shipList;
                        transaction.coal = resourcesByType.coal;
                        transaction.ore = resourcesByType.ore;
                        transaction.copper = resourcesByType.copper;
                        transaction.uranium = resourcesByType.uranium;

                        outputNode.innerHTML += "<br>";
                        outputNode.innerHTML += planet.name + " (" + planet.id + ") to: " + nearestYamatoPlanet.name + " [" + transaction.x + "/" + transaction.y + "] distance: " + distanceToNearestYamatoPlanet.toFixed(2) + "<br>";
                        outputNode.innerHTML += "resources transported: coal: " + transaction.coal + " ore: " + transaction.ore + " copper: " + transaction.copper + " uranium: " + transaction.uranium + "<br>";
                        outputNode.innerHTML += "total transported: " + (transaction.coal + transaction.ore + transaction.copper + transaction.uranium) + " out of: " +  totalResources.toFixed(0) + "<br>";
                        outputNode.innerHTML += JSON.stringify(transaction.shipList) + "<br>";

                        transportTransactions.push(transaction)
                    // capacity < 3600
                    } else {
                        outputNode.innerHTML += "<br>";
                        outputNode.innerHTML += planet.name + " (" + planet.id + ") to: " + nearestYamatoPlanet.name + " - NEEDS SHIPS" + "<br>";
                        outputNode.innerHTML += "Total resources: " + totalResources.toFixed(0) + "<br>";
                        outputNode.innerHTML += "Carrying capacity: " + resourcesToTransport.toFixed(0) + "<br>";
                        outputNode.innerHTML += JSON.stringify(shipList) + "<br>";

                    }


                // total resources < 3600
                } else {
                  outputNode.innerHTML += "<br>";
                  outputNode.innerHTML += planet.name + " (" + planet.id + "): Insufficient resources" + "<br>";
                  outputNode.innerHTML += "Total resources: " + totalResources.toFixed(0) + " less than 3600." + "<br>";

                }
            // distance
          } else if (distanceToNearestYamatoPlanet == 0) {
              outputNode.innerHTML += "<br>";
              outputNode.innerHTML += planet.name + " (" + planet.id + "): Yamato planet" + "<br>";
          } else if (distanceToNearestYamatoPlanet > (24 * 4)) {
              outputNode.innerHTML += "<br>";
              outputNode.innerHTML += planet.name + " (" + planet.id + "): Distance too far" + "<br>";
          }

        }

    }

    return transportTransactions;
}





async function findExplorerTwoTransactions(user, userData, explorerRange, xCoordinate, yCoordinate, outputNode) {
    let closeHour = 0;
    let reopenHour = 7;

    //let planetFleetInfo = [];
    //let planetMissionInfo = [];
    //let planetUserMissions = [];
    //let space = [];

    let explorationTransactions = [];
    //let userAvailableMissions = 0;


    //let userMissions = await getLimitedUserMissions(user, 400)
    //let finishedMissions = await getUserMissions(user, 0)
    //let userMissions = activeMissions.concat(finishedMissions)

    //console.log(xCoordinate)
    //console.log(yCoordinate)
    //console.dir(userMissions)
    //console.dir(finishedMissions)
    //console.dir(userMissions)
    //for (const mission of userMissions) {


        //let planetCoords = [mission.start_x, mission.start_y]
        //let spaceCoords = [mission.end_x, mission.end_y]
        //let missionDistance = distance(planetCoords, spaceCoords)

    //}

    galaxyData = await getGalaxy(xCoordinate, yCoordinate, explorerRange, explorerRange);
    console.dir(galaxyData)

    let xmin = galaxyData.area.xmin;
    let xmax = galaxyData.area.xmax;
    let ymin = galaxyData.area.ymin;
    let ymax = galaxyData.area.ymax;




    //let availableExplorerMissions = 0;
    outputNode.innerHTML += "<br>";
    outputNode.innerHTML += user + " available missions: " + userData.userAvailableMissions + "<br>";

    let i=0;
    //let dataPlanets = await getPlanetsOfUser(user);
    for (const planet of userData.planets) {
        let space = [];
        let proposedExplorations = [];
        //let planetUserMissions = userData.userMissions.filter(mission => mission.from_planet.id == dataPlanet.id)
        //let planetExplorerTwoMissions = planet.explorerTwoMissions
        //planetFleetInfo = userData.planetData.planetFleetInfo


        if (planet.explorerTwoAvailable > 0 || planet.explorerTwoMissions.length > 0) {
            let availableMissions = planet.planetMissionInfo.planet_unused;
            availableExplorerMissions = Math.min(availableMissions, planet.explorerTwoAvailable);
            outputNode.innerHTML += "<br>";
            outputNode.innerHTML += planet.id + " " + planet.name + ":<br>";
            outputNode.innerHTML += "available missions: " + availableMissions + " available explorers: " + planet.explorerTwoAvailable + ".<br>";
        }

        if (planet.explorerTwoAvailable > 0) {

            if (planet.explorerTwoMissions.length > 0) {
                outputNode.innerHTML += "recent ExplorerII missions:<br>";

                for (const mission of planet.explorerTwoMissions) {
                    let planetCoords = [mission.start_x, mission.start_y]
                    let spaceCoords = [mission.end_x, mission.end_y]
                    let missionDistance = distance(planetCoords, spaceCoords)
                    outputNode.innerHTML += "x: " + mission.end_x + " y: " + mission.end_y + " distance: " + missionDistance + " <br>";
                }
            }

            for (let x=xmin; x<=xmax; x+=1) {
                for (let y=ymin; y<=ymax; y+=1) {
                    let spaceInfo = {x: x, y: y};

                    //let planetCoords = planet.planetCoords;
                    let spaceCoords = [x, y];
                    spaceInfo["distance"] = distance(planet.planetCoords, spaceCoords);

                    let travelTime = convertDistanceToTimeInSeconds(1, spaceInfo.distance);
                    spaceInfo["arrival"] = (missionLaunchTime/1000) + travelTime;
                    spaceInfo["return"] = (missionLaunchTime/1000) + (travelTime * 2);
                    spaceInfo["returnDate"] = new Date(spaceInfo.return * 1000);
                    spaceInfo["returnHour"] = spaceInfo.returnDate.getHours();


                    let priorTransactionIndex = explorationTransactions.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["priorTransaction"] = true;
                    if (priorTransactionIndex == -1) {
                        spaceInfo["priorTransaction"] = false;
                    }

                    let planetsIndex = galaxyData.planets.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["planet"] = true;
                    if (planetsIndex == -1) {
                        spaceInfo["planet"] = false;
                    }

                    let exploredIndex = galaxyData.explored.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["explored"] = true;
                    if (exploredIndex == -1) {
                        spaceInfo["explored"] = false;
                    }

                    let explorations = galaxyData.explore.filter(entry => entry.x == x && entry.y == y)

                    spaceInfo["underSearch"] = false;
                    spaceInfo["sniped"] = "none";
                    if (explorations.length > 0) {
                        spaceInfo["exploration"] = true;

                        let snipes = [];

                        let k=0;
                        for (const exploration of explorations) {


                            if (exploration.user == user) {
                                spaceInfo["underSearch"] = true;
                            } else {
                                let snipeInfo = {x: x, y: y};
                                snipeInfo["rivalUser"] = exploration.user;
                                snipeInfo["rivalArrival"] = exploration.date;
                                snipeInfo["userArrival"] = spaceInfo.arrival;
                                snipeInfo["winner"] = "user";
                                if (snipeInfo.rivalArrival < snipeInfo.userArrival) {
                                    snipeInfo["winner"] = "rival"
                                    spaceInfo["sniped"] = "lost";
                                } else if (snipeInfo.rivalArrival >= snipeInfo.userArrival && spaceInfo["sniped"] != "lost") {
                                    spaceInfo["sniped"] = "opportunity";
                                }
                                snipes.push(snipeInfo)
                            }


                        //let spaceCoords = [mission.end_x, mission.end_y]
                        //let missionDistance = distance(planetCoords, spaceCoords)

                            k+=1;
                        }
                        if (snipes.length > 0) {
                            //console.dir(snipes)
                            //console.dir(spaceInfo)
                        }

                    } else {
                        spaceInfo["exploration"] = false;
                    }

                    //console.log(spaceInfo)
                    space.push(spaceInfo)
                }
            }

            proposedExplorations = space.filter(space => space.explored == false);
            //console.log(proposedExplorations[i])
            proposedExplorations = proposedExplorations.filter(space => space.priorTransaction == false);
            //console.log(proposedExplorations[i])
            proposedExplorations = proposedExplorations.filter(space => space.underSearch == false);
            proposedExplorations = proposedExplorations.filter(space => space.sniped != "lost");
            proposedExplorations = proposedExplorations.filter(space => space.returnHour > reopenHour);
            //console.log(proposedExplorations[i])
            proposedExplorations = proposedExplorations.filter(space => space.planet == false);
            //console.log(proposedExplorations[i])
            //proposedExplorations[i].sort((a, b) => a.distance - b.distance);
            //console.log(proposedExplorations[i])
            snipeOpportunities = proposedExplorations.filter(space => space.sniped == "opportunity");
            snipeOpportunities = snipeOpportunities.slice(0, availableExplorerMissions);

            nonSnipeExplorations = proposedExplorations.filter(space => space.sniped == "none");
            nonSnipeExplorations = nonSnipeExplorations.slice(0, availableExplorerMissions - snipeOpportunities.length);
            //proposedExplorations[i] = proposedExplorations[i].slice(0, availableExplorerMissions);
            //console.log(proposedExplorations[i])
            proposedExplorations = snipeOpportunities.concat(nonSnipeExplorations);

            for (const proposal of proposedExplorations) {
                let exploration = {};
                exploration.type = "explorespace";
                exploration.planetId = dataPlanet.id;
                exploration.x = proposal.x;
                exploration.y = proposal.y;
                exploration.shipName = "explorership1";
                exploration.sniped = proposal.sniped;
                if (proposal.sniped == "opportunity") {
                    let opportunityCount = explorationTransactions.filter(transaction => transaction.sniped == "opportunity").length;
                    explorationTransactions.splice(opportunityCount, 0, exploration);
                    outputNode.innerHTML += exploration.type + " " + exploration.x + " " + exploration.y + " " + exploration.shipName + " " + proposal.distance + " --- SNIPE HAS PRIORITY OVER PLANET ORDER --- <br>";
                } else {
                    explorationTransactions.push(exploration);
                    outputNode.innerHTML += exploration.type + " " + exploration.x + " " + exploration.y + " " + exploration.shipName + " " + proposal.distance + "<br>";
                }
            }

        }
        i+=1;
    }
    console.log("explorationTransactions", explorationTransactions)
    let finalExplorationTransactions = explorationTransactions.slice(0, userData.userAvailableMissions);
    console.dir(finalExplorationTransactions);
    return finalExplorationTransactions;


}




async function findExplorationTransactions(user, userData, explorerRange, outputNode) {

    //let planetPriority = [
    //    {user: "miniature-tiger", planets: ["P-Z3STEWYEMDC", "P-ZJWCQN4SU00", "P-Z7M914SV034", "P-ZUEF2H4ZVFK", "P-ZSHCI4Y9BBK", "P-Z6NP7GS7LN4", "P-Z9C2P737XQ8", "P-Z0OXZ5QK3GG"], planetNames: []},
    //    {user: "tiger-zaps", planets: ["P-ZS3RWN9D840", "P-ZXPZG03WPXC", "P-ZZA367LJYRK", "P-ZSJR1UCWGJK", "P-ZL1K8I8Y86O", "P-Z2A6EKIIC00", "P-ZKNJOCNKC0W", "P-Z142YAEQFO0", "P-ZE8TH46FVK0"], planetNames: []},
        //{user: "tiger-zaps", planets: ["P-ZZA367LJYRK"], planetNames: []},
    //]

    console.log("explorerRange", explorerRange)
    let closeHour = 0;
    let reopenHour = 7;

    let userAvailableMissions = 0;

    let galaxyData = [];

    let space = [];

    //let planetMissionInfo = [];
    let planetFleetInfo = [];

    let proposedExplorations = [];
    let explorationTransactions = [];

    ////let dataPlanets = await getPlanetsOfUser(user);
    //console.dir(dataPlanets)
    //let priorityPlanetIndex = planetPriority.findIndex(entry => entry.user == user)
    //let userPriorityPlanets = planetPriority[priorityPlanetIndex].planets;

    ////let userPriorityPlanets = fetchUserPlanetPriorityData(user).planets;
    let planetsToExploreFrom = userData.planets.filter(planet => planet.explore == true)

    let planetData = [];
    let i=0;

    ///for (const priorityPlanet of userPriorityPlanets) {
    for (const planet of planetsToExploreFrom) {
        ////let dataPlanetIndex = dataPlanets.planets.findIndex(planet => planet.id == priorityPlanet);
        ////let dataPlanet = dataPlanets.planets[dataPlanetIndex];
        ////let planetCoords = [dataPlanet.posx, dataPlanet.posy];
        let planetCoords = planet.planetCoords;

        ////planetFleetInfo[i] = await getPlanetFleet(user, priorityPlanet)
        planetFleetInfo[i] = planet.planetFleetInfo
        ////let explorerFleetIndex = planetFleetInfo[i].findIndex(fleet => fleet.type == "explorership");
        ////let explorersAvailable = 0;
        ////if (explorerFleetIndex != -1) {
        ////    explorersAvailable = planetFleetInfo[i][explorerFleetIndex].quantity;
        ////}
        let explorersAvailable = planet.explorerOneAvailable
        //console.dir(planetFleetInfo[i])

        //planetMissionInfo[i] = await getPlanetMissionInfo(user, priorityPlanet);
        //console.dir(planetMissionInfo[i])
        ////let availableMissions = userData.planetData.planetMissionInfo.planet_unused;
        let availableMissions = planet.planetMissionInfo.planet_unused;
        let availableExplorerMissions = Math.min(availableMissions, explorersAvailable);

        if (i==0) {
            //userAvailableMissions = planetMissionInfo[i].user_unused;
            outputNode.innerHTML += "<br>";
            outputNode.innerHTML += user + " available missions: " + userData.userAvailableMissions + "<br>";
        }

        outputNode.innerHTML += "<br>";
        outputNode.innerHTML += planet.id + " " + planet.name + ":<br>";
        outputNode.innerHTML += "available missions: " + availableMissions + " available explorers: " + explorersAvailable + " shortest distance: " + planet.shortestDistance + "<br>";

        console.log(planet.id, planet.name)
        console.log(planet.shortestDistance, explorerRange, planet.shortestDistance < explorerRange)
        if (planet.shortestDistance < explorerRange) {
            galaxyData[i] = await getGalaxy(planetCoords[0], planetCoords[1], explorerRange*2, explorerRange*2);

            console.dir(galaxyData[i])
            space[i] = [];
            let xmin = galaxyData[i].area.xmin;
            let xmax = galaxyData[i].area.xmax;
            let ymin = galaxyData[i].area.ymin;
            let ymax = galaxyData[i].area.ymax;

            for (let x=xmin; x<=xmax; x+=1) {
                for (let y=ymin; y<=ymax; y+=1) {
                    let spaceInfo = {x: x, y: y};

                    let spaceCoords = [x, y];
                    spaceInfo["distance"] = distance(planetCoords, spaceCoords);

                    let travelTime = convertDistanceToTimeInSeconds(1, spaceInfo.distance);
                    spaceInfo["arrival"] = (missionLaunchTime/1000) + travelTime;
                    spaceInfo["return"] = (missionLaunchTime/1000) + (travelTime * 2);
                    spaceInfo["returnDate"] = new Date(spaceInfo.return * 1000);
                    spaceInfo["returnHour"] = spaceInfo.returnDate.getHours();


                    let priorTransactionIndex = explorationTransactions.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["priorTransaction"] = true;
                    if (priorTransactionIndex == -1) {
                        spaceInfo["priorTransaction"] = false;
                    }

                    let planetsIndex = galaxyData[i].planets.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["planet"] = true;
                    if (planetsIndex == -1) {
                        spaceInfo["planet"] = false;
                    }

                    let exploredIndex = galaxyData[i].explored.findIndex(entry => entry.x == x && entry.y == y)
                    spaceInfo["explored"] = true;
                    if (exploredIndex == -1) {
                        spaceInfo["explored"] = false;
                    }

                    let explorations = galaxyData[i].explore.filter(entry => entry.x == x && entry.y == y)

                    spaceInfo["underSearch"] = false;
                    spaceInfo["sniped"] = "none";
                    if (explorations.length > 0) {
                        spaceInfo["exploration"] = true;

                        let snipes = [];

                        let k=0;
                        for (const exploration of explorations) {


                            if (exploration.user == user) {
                                spaceInfo["underSearch"] = true;
                            } else {
                                let snipeInfo = {x: x, y: y};
                                snipeInfo["rivalUser"] = exploration.user;
                                snipeInfo["rivalArrival"] = exploration.date;
                                snipeInfo["userArrival"] = spaceInfo.arrival;
                                snipeInfo["winner"] = "user";
                                if (snipeInfo.rivalArrival < snipeInfo.userArrival) {
                                    snipeInfo["winner"] = "rival"
                                    spaceInfo["sniped"] = "lost";
                                } else if (snipeInfo.rivalArrival >= snipeInfo.userArrival && spaceInfo["sniped"] != "lost") {
                                    spaceInfo["sniped"] = "opportunity";
                                }
                                snipes.push(snipeInfo)
                            }


                        //let spaceCoords = [mission.end_x, mission.end_y]
                        //let missionDistance = distance(planetCoords, spaceCoords)

                            k+=1;
                        }
                        if (snipes.length > 0) {
                            //console.dir(snipes)
                            //console.dir(spaceInfo)
                        }

                    } else {
                        spaceInfo["exploration"] = false;
                    }

                    //console.log(spaceInfo)
                    space[i].push(spaceInfo)
                }
            }
            //console.log(space[i])
            proposedExplorations[i] = space[i].filter(space => space.explored == false);
            console.log(proposedExplorations[i])
            proposedExplorations[i] = proposedExplorations[i].filter(space => space.priorTransaction == false);
            console.log(proposedExplorations[i])
            proposedExplorations[i] = proposedExplorations[i].filter(space => space.underSearch == false);
            console.log(proposedExplorations[i])
            proposedExplorations[i] = proposedExplorations[i].filter(space => space.sniped != "lost");
            console.log(proposedExplorations[i])
            proposedExplorations[i] = proposedExplorations[i].filter(space => space.returnHour > reopenHour);
            console.log(proposedExplorations[i])
            proposedExplorations[i] = proposedExplorations[i].filter(space => space.planet == false);
            console.log(proposedExplorations[i])
            proposedExplorations[i].sort((a, b) => a.distance - b.distance);
            console.log(proposedExplorations[i])
            snipeOpportunities = proposedExplorations[i].filter(space => space.sniped == "opportunity");
            snipeOpportunities = snipeOpportunities.slice(0, availableExplorerMissions);

            nonSnipeExplorations = proposedExplorations[i].filter(space => space.sniped == "none");
            nonSnipeExplorations = nonSnipeExplorations.slice(0, availableExplorerMissions - snipeOpportunities.length);
            //proposedExplorations[i] = proposedExplorations[i].slice(0, availableExplorerMissions);
            //console.log(proposedExplorations[i])
            proposedExplorations[i] = snipeOpportunities.concat(nonSnipeExplorations);
            console.log(proposedExplorations[i])
            /*
            let reportingExplorations = space[i].filter(space => space.explored == false);
            reportingExplorations = reportingExplorations.filter(space => space.priorTransaction == false);
            reportingExplorations = reportingExplorations.filter(space => space.underSearch == false);
            reportingExplorations = reportingExplorations.filter(space => space.planet == false);
            reportingExplorations = reportingExplorations.slice(0, availableExplorerMissions);
            */

            for (const proposal of proposedExplorations[i]) {
                let exploration = {};
                exploration.type = "explorespace";
                exploration.planetId = planet.id;
                exploration.x = proposal.x;
                exploration.y = proposal.y;
                exploration.shipName = "explorership";
                exploration.sniped = proposal.sniped;
                if (proposal.sniped == "opportunity") {
                    let opportunityCount = explorationTransactions.filter(transaction => transaction.sniped == "opportunity").length;
                    explorationTransactions.splice(opportunityCount, 0, exploration);
                    outputNode.innerHTML += exploration.type + " " + exploration.x + " " + exploration.y + " " + exploration.shipName + " " + proposal.distance + " --- SNIPE HAS PRIORITY OVER PLANET ORDER --- <br>";
                } else {
                    explorationTransactions.push(exploration);
                    outputNode.innerHTML += exploration.type + " " + exploration.x + " " + exploration.y + " " + exploration.shipName + " " + proposal.distance + "<br>";
                }
            }
        }
        i+=1;
    }

    let finalExplorationTransactions = explorationTransactions.slice(0, userData.userAvailableMissions);
    console.dir(finalExplorationTransactions);
    return finalExplorationTransactions;

}



async function findMarketTrades(user, userData, outputNode) {


    let priceFactor = 100000000;

    let planetData = [];

    let activeMarketData = [];
    let soldMarketData = [];
    let userActiveMarketData = [];
    let userSoldMarketData = [];
    let askPrices = [];
    let marketAsks = [];
    let currentUserAsks = [];

    let planetShips = [];
    let userVersionZeroShips = [];
    let userVersionTwoShips = [];
    let userAllShipsForSale = [];

    let marketCancelTransactions = [];
    let marketAskTransactions = [];
    let marketTransactions = [];
    //planetData[i] = await getPlanetResources(planet.id)

    // Fetch ships for sale on planets marked for ship sale
    let dataPlanets = await getPlanetsOfUser(user);
    let userPlanetOrderForShipSales = fetchUserPlanetOrderForShipSales(user);
    salePlanets = dataPlanets.planets.filter(planet => userPlanetOrderForShipSales.version0.includes(planet.id) || userPlanetOrderForShipSales.version2.includes(planet.id));
    console.log(salePlanets)
    //salePlanets = salePlanets.map(planet => ({...planet, version0: false, version2: false}));
    //for (const planet of salePlanets) {

    /*
    saleZeroPlanets = dataPlanets.planets.filter(planet => userPlanetOrderForShipSales.version0.includes(planet.id));
    saleZeroPlanets = saleZeroPlanets.map(planet => ({...planet, versionZero: true}));
    saleTwoPlanets = dataPlanets.planets.filter(planet => userPlanetOrderForShipSales.version2.includes(planet.id));
    saleTwoPlanets = saleTwoPlanets.map(planet => ({...planet, version: 2}));
    salePlanets = saleZeroPlanets.concat(saleTwoPlanets);
    console.log(salePlanets)
    */

    let i = 0;

    for (const planet of salePlanets) {
        console.log(user, planet.id)
        // Fetch ships on planet
        planetShips[i] = await getPlanetShips(user, planet.id);
        // Filter to ships on "shipMarket" sale list
        let planetShipsForMarket = planetShips[i].filter(ship => findIndexInShipMarket(ship.type) != -1);
        // Filter out ships already sold
        planetShipsForMarket = planetShipsForMarket.filter(ship => ship.for_sale == 0);
        // Filter out ships on missions
        planetShipsForMarket = planetShipsForMarket.filter(ship => ship.busy < missionLaunchTime/1000);
        // Crop ships to useful info only, including ship version tyep
        planetShipsForMarket = planetShipsForMarket.map(ship => ({type: ship.type, id: ship.id, planet: planet.id, version: shipMarket[findIndexInShipMarket(ship.type)].version}))
        //usefulShips = usefulShips.map(ship => ({...ship, priority: shipPriority[ship.type]}))
        console.dir(planetShipsForMarket)

        if (userPlanetOrderForShipSales.version0.includes(planet.id)) {
            let planetVersionZeroShips = planetShipsForMarket.filter(ship => ship.version == 0);
            //userVersionZeroShips = userVersionZeroShips.concat(planetVersionZeroShips);
            userAllShipsForSale = userAllShipsForSale.concat(planetVersionZeroShips);
        }

        if (userPlanetOrderForShipSales.version2.includes(planet.id)) {
            let planetVersionTwoShips = planetShipsForMarket.filter(ship => ship.version == 2);
            //userVersionTwoShips= userVersionTwoShips.concat(planetVersionTwoShips);
            userAllShipsForSale = userAllShipsForSale.concat(planetVersionTwoShips);
        }
        i += 1
    }
    //console.dir(userVersionZeroShips)
    //console.dir(userVersionTwoShips)
    console.dir(userAllShipsForSale)

    let marketAsksDesiredPerShipType = 20;

    let j=0
    for (const ship of shipMarket) {
        // Fetch current market prices and historic sale prices of all market and user
        activeMarketData[j] = await getMarketForShip(ship.type, 1, 0);
        nonUserActiveMarketData = activeMarketData[j].filter(ship => ship.user != user);
        soldMarketData[j] = await getMarketForShip(ship.type, 0, 1);
        nonUserSoldMarketData = soldMarketData[j].filter(ship => ship.user != user);
        userActiveMarketData[j] = await getMarketForShipAndUser(user, ship.type, 1, 0);
        userSoldMarketData[j] = await getMarketForShipAndUser(user, ship.type, 0, 1);

        marketAsks[j] = determineMarketAsks(nonUserActiveMarketData, nonUserSoldMarketData, shipMarket[j], marketAsksDesiredPerShipType)
        //console.log(marketAsks[j])
        currentUserAsks[j] = determineMarketAsks(userActiveMarketData[j], userSoldMarketData[j], shipMarket[j], 50)
        //console.log(currentUserAsks[j])
        console.log(userActiveMarketData[j])
        //console.log(activeMarketData[j])
        //console.log(soldMarketData[j])
        //console.log(userActiveMarketData[j])
        //console.log(userSoldMarketData[j])

        for (const userAsk of userActiveMarketData[j]) {
            let userAskPrice = (userAsk.price / priceFactor);
            let marketAskIndex = marketAsks[j].findIndex(marketAsk => marketAsk.price == userAskPrice);
            if (marketAskIndex == -1) {
                // Create cancel transaction for user ask
                let cancelInfo = {}
                cancelInfo.type = "cancelAsk";
                cancelInfo.askId = userAsk.id;
                cancelInfo.shipType = userAsk.type;
                marketCancelTransactions.push(cancelInfo);
                outputNode.innerHTML += cancelInfo.type + " " + cancelInfo.shipType + " " + cancelInfo.askId + " " + userAskPrice + "<br>"
            } else {
                // Remove market ask from list
                marketAsks[j].splice(marketAskIndex, 1);
                // Do not create cancel transaction
            }

        }


        for (const ask of marketAsks[j]) {
            let shipIndex = userAllShipsForSale.findIndex(ship => ship.type == ask.shipType);
            if (shipIndex == -1) {
                ask["haveShip"] == false
            } else {
                ask["haveShip"] == true
                let ship = userAllShipsForSale.splice(shipIndex, 1);
                ask["itemUID"] = ship[0].id;
                outputNode.innerHTML += ask.type + " " + ask.shipType + " " + ask.itemUID + " " + ask.price + "<br>"
                marketAskTransactions.push(ask)
            }
        }
        j+=1;
    }

    // If lots of ships at lowest price then match this
    // If only 3 ships at lowest price then match for match but sell rest at 1 below next price

    marketTransactions = marketCancelTransactions.concat(marketAskTransactions);
    console.dir(marketTransactions);
    return marketTransactions;
}

function summariseAndSort(data) {
    let summary = [];

    for (const ask of data) {
        let index = summary.findIndex(level => level.price == ask.price);
        if (index == -1) {
            summary.push({price: ask.price, count: 1})
        } else {
            summary[index].count+=1;
        }
    }

    summary.sort((a, b) => a.price - b.price);

    return summary;
}

// For one ship type
function determineMarketAsks(activeMarketData, soldMarketData, shipMarket, marketAsksDesiredPerShipType) {
    //for (const ask of activeMarketData) {

    //}

    let priceFactor = 100000000;
    let marketTransactions = [];

    let minPrice = shipMarket.minPrice * priceFactor;
    //console.log(shipMarket.type, minPrice)


    // Summarise active market data for ship
    let reducedActiveMarketData = activeMarketData.map(ask => ({price: ask.price}))
    let activeMarketSummary = summariseAndSort(reducedActiveMarketData);
    console.dir(activeMarketSummary)

    // Reduce market summary to number of totalTransactions
    let currentCount = 0;
    for (const level of activeMarketSummary) {
        level.price = Math.max(level.price, minPrice);
        level.count = Math.min(level.count, marketAsksDesiredPerShipType - currentCount);
        currentCount += level.count
    }
    activeMarketSummary = activeMarketSummary.filter(level => level.count > 0);

    //let askPrices = activeMarketSummary.map(ask => ({price: Math.max(ask.price, minPrice), count: ask.count-1}))

    for (const level of activeMarketSummary) {
        for (i = 0; i < level.count; i+=1) {
            // Create market transaction and push to transaction list
            let askInfo = {}
            askInfo.type = "sellShip";
            askInfo.category = "ship"
            askInfo.shipType = shipMarket.type;
            askInfo.version = shipMarket.version;
            //askInfo.price = activeMarketSummary.price / priceFactor;

            //askInfo.price = (level.price / priceFactor) - 0.01;
            askInfo.price = (level.price / priceFactor);
            marketTransactions.push(askInfo);
        }
    }



    //var activeMarketSummaryCount = activeMarketSummary.reduce(function(object, item) {
  //      object[item.price] = (object[item.price] || 0) + 1;
    //    return object;
    //}, {})



    //activeMarketSummaryCount = activeMarketSummaryCount.map(level => ({price: Object.keys[level][0], count: level[Object.keys[level][0]]})
    //activeMarketSummaryCount = activeMarketSummaryCount.map(level => ({price: Object.keys[level][0]}))

    //let lowestPrice = activeMarketSummaryCount[0]



    //let activeMarketSummaryCount = count(activeMarketSummary);

    /*
    let currentPrice = activeMarketData[0].price
    let activeMarketSummary = [{price: currentPrice, count: 0}];
    for (const ask of activeMarketData) {
        activeMarketSummary
        if (ask.price == currentPrice) {
            activeMarketSummary
        }
    }
    */

    //console.dir(marketTransactions)
    //console.dir(askPrices)
    return marketTransactions;
}



async function defineStrategy(user, outputNode) {
    //let userData = await createUserData(user);
    console.log(userData);
    /*
    let dataPlanets = await getPlanetsOfUser(user);
    let i = 0;
    for (const planet of dataPlanets.planets) {
        outputNode.innerHTML += "{id: \"" + planet.id + "\", name: \"" + planet.name + "\", build: true, shipbuild: true, minimumShipPriority: 0, explore: false}"
        + "<br>"
        //outputNode.innerHTML += "{id: """ + planet.id + """, name: "

        i+=1;
    }
    */

}


    //outputNode.innerHTML += upgrade.type + " " + upgrade.planetId + " " + upgrade.name + " " + upgrade.current + "<br>"
    //{id: "P-ZCBO9MBOJ2O", name: "Alpha", build: true, shipbuild: true, minimumShipPriority: 0, explore: false}
