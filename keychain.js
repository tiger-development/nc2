
// Functions to build and run keychain transactions on blockchain

function buildShip(user, planetId, shipName) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "buildship";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = shipName;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName')
}

function upgradeBuilding(user, planetId, buildingName) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "upgrade";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = buildingName;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName')
}

function ask(user, category, itemUID, price) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "ask";
    scCommand["tr_var1"] = category;
    scCommand["tr_var2"] = itemUID;
    scCommand["tr_var3"] = price;
    scCommand["tr_var4"] = "null";

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName')
}


function cancel_ask(user, askId) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "cancel_ask";
    scCommand["tr_var1"] = askId;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName');
}


function exploreSpace(user, planetId, x, y, shipName) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "explorespace";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = shipName;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName')
}

// shipList = { "transportship": 2, "explorership": 1 }
function transport(
    user,
    originPlanetId,
    x,
    y,
    shipList,
    coal,
    ore,
    copper,
    uranium
  ) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "transport";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = originPlanetId;
    scCommand["tr_var3"] = x;
    scCommand["tr_var4"] = y;
    scCommand["tr_var5"] = coal;
    scCommand["tr_var6"] = ore;
    scCommand["tr_var7"] = copper;
    scCommand["tr_var8"] = uranium;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);

    keychainCustomJson(user, 'nextcolony', 'Posting', finalJson, 'displayName')
  }




function processKeychainTransactions(user, transactions, maxProcess, waitTime) {

    let transactionsToProcess = Math.min(maxProcess, transactions.length)

    if (transactionsToProcess > 0) {
        processKeychainTransactionWithDelay()
    } else {
        console.log("No transactions to process.")
    }

    function processKeychainTransactionWithDelay() {
        transactionsToProcess-=1
        console.log(transactionsToProcess)
        let transaction = transactions.shift();
        if (transaction.type == "upgradeBuilding") {
            console.log(user, transaction.planetId, transaction.name)
            upgradeBuilding(user, transaction.planetId, transaction.name)
        } else if (transaction.type == "buildShip") {
            buildShip(user, transaction.planetId, transaction.name)
        } else if (transaction.type == "explorespace") {
            exploreSpace(user, transaction.planetId, transaction.x, transaction.y, transaction.shipName)
        } else if (transaction.type == "sellShip") {
            ask(user, transaction.category, transaction.itemUID, transaction.price)
        } else if (transaction.type == "cancelAsk") {
            cancel_ask(user, transaction.askId)
        } else if (transaction.type == "transport") {
            transport(user, transaction.originPlanetId, transaction.x, transaction.y, transaction.shipList, transaction.coal, transaction.ore, transaction.copper, transaction.uranium);
        }


        if (transactionsToProcess > 0) {
            setTimeout(processKeychainTransactionWithDelay, waitTime);
        } else {
            console.log("Transactions complete")
        }
    }
}

function keychainCustomJson(account_name, custom_json_id, key_type, json, display_name) {
    steem_keychain.requestCustomJson(account_name, custom_json_id, key_type, json, display_name, function(response) {
        console.log(response);
    });
}
