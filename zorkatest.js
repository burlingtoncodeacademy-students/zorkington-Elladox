// prebuilt code
const readline = require("readline");
const { start } = require("repl");
const rlInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rlInterface.question(questionText, resolve);
  });
}
//start of my code
class Item {
  constructor(iName, iDescription, iAction, iTakeable, Idurability) {
    this.name = iName;
    this.description = iDescription;
    this.takeable = iTakeable || false;
    this.action = iAction || "nothing happens";
    this.durability = Idurability;
  }
  take() {
    //check if item takable and is in room's inventory
    if (this.takeable && locationTable[curLoc].inventory.includes(this.name)) {
      //add item to player inventory
      playerInventory.push(this.name);
      //remove item from the room's inventory
      let takeIndex = locationTable[curLoc].inventory.indexOf(this.name);
      locationTable[curLoc].inventory.splice(takeIndex, 1);
      //return a confirmation value to user
      return `you picked up ${this.name}`;
    } else {
      return `you are unable to pick that up`;
    }
  }
  use() {
    //console.log(this.durability);
    if (playerInventory.includes(this.name)) {
      if (this.durability > 0) {
        this.durability--;
        //console.log(this.durability)
        if (this.name === `stick` && curLoc === `startRoom`) {
          return `you wave to stick around, ready to take on the world`;
        } else {
          //console.log(this.durability)
          return this.action;
        }
      } else if (this.durability <= 0) {
        return `you have used this as much as you can`;
      }
    } else {
      return `you don't have one of those to use`;
    }
  }

  drop() {
    //if its in your inventory remove it from you inventory and add it to your current location's inventory
    if (playerInventory.includes(this.name)) {
      //add it to the room's inventory
      locationTable[curLoc].inventory.push(this.name);
      //remove it from the player's inventory
      let dropIndex = playerInventory.indexOf(this.name);
      playerInventory.splice(dropIndex, 1);
      return `you dropped ${this.name},`;
    } else {
      return `you don't have one of those to drop`;
    }
  }
}
class Room {
  constructor(name, description, inventory, connectingRooms) {
    this.location = name;
    this.description = description;
    this.inventory = inventory;
    this.conRooms = connectingRooms;
  }
}

let startRoom = new Room(
  "The first room",
  "the room that you started in!",
  ["rock", "stick"],
  ["secRoom"]
);
let secRoom = new Room(
  "the second room",
  "the room after the first one!",
  [],
  ["startRoom"]
);

let rock = new Item(
  "rock",
  "its a small round rock",
  "you bash your ahead against the rock, much like I do against this code",
  true,
  Infinity
);

let stick = new Item(
  "stick",
  "its a small stick",
  "you break the stick in half",
  true,
  1
);

let torch = new Item(
  "torch",
  "a sputtering torch, the light it gives off is comforting however",
  `You raise the torch above your head, illuminating your surroundings`,
  true,
  Infinity
);

let plaque = new Item(
  "plaque",
  `You approach the plague. it is filled with colorful hieroglyphics. Using your immense adventuring skills you deduce the plaque to be a cautionary tale about greedy tombrobbers being punished. Filled with a sense of unease you resolve to be cautious and fully prepared before you do any robbing`,
  `how do you think you use a plaque?`,
  false,
  Infinity
);
let skeleton = new Item(
  "skeleton",
  "its a skeleton my man",
  "how do you plan to use a skeleton?",
  false,
  Infinity
);

let vial = new Item(
  "vial",
  "its a glass vial full of an amber liquid",
  "you guzzle it down, trying not to think about its previous owner",
  true,
  1
);

let gate = new Item(
  "gate",
  "its a elaborate metal gate. It has a large keyhole at the center",
  "the gate is locked. perhaps you need somthing that fits into that keyhole...",
  false,
  Infinity
);

let chest = new Item(
  "chest",
  "The chest opens with ease. Inside is a large key, inlaid with gold",
  "The chest opens with ease. Inside is a large key, inlaid with gold",
  false,
  Infinity
);
let treasure = new Item(
  "treasure",
  "glittering coins and priceless jewels",
  "You use this treasure to fufill your wildest dreams. Your journey has reached its conclusion",
  true,
  Infinity
);
let key = new Item(
  "key",
  "an ornate key, inlaid with gold",
  "you turn the key over in your hands, you'll need to find a door to use it properly",
  true,
  Infinity
);

let entrance = new Room(
  "entrance",
  `
  You are in the center of the entrance room. It is of a medium size and lit by sconces high up on the walls. In front of you is a large foreboding metal gate with a large keyhole at its center. Behind the gate, just out of reach, you see the entrance to the treasure [vault] that you so desperately seek
  To your left is a [tunnel], the light from the sconces doesn't go very far and you cannot see how deep the tunnel is
  to your right is a [corridor] with marble tiles and bright torches on the walls
  `,
  ["plaque", "rock", "torch", "gate"],
  ["tunnel", "corridor"]
);

let darkRoom = new Room(
  "a dark room",
  `
  You are in a dark cave. Your torchlight plays off the many stalagmites, throwing dozens of shadows about the room. In the center of the room is a skeleton curled up in the fetal position. Behind you is the [tunnel]
  `,
  ["skeleton"],
  ["tunnel"]
);

let tunnel = new Room(
  "tunnel",
  `
  You are in a long dark tunnel. The walls are covered in skittering shadows that make you queasy if you try to focus on them. At one end you see the warm light of the [entrance], at the other you see the opening of a [cave] 
  `,
  [],
  [`entrance`, "cave"]
);

let corridor = new Room(
  "corridor",
  `
  You are in a large white marble room. it is well lit and the walls are covered in intricate engravings. On the left wall there apears to be a plaque. To your right you see what looks to be the entrance to a [shrine], behind you is the [entrance]  
  `,
  ["plaque"],
  [`entrance`, "shrine"]
);

let vault = new Room(
  "vault",
  `You are in a glittering vault, full to the brim with [treasure].`,
  ["treasure"],
  ["entrance"]
);

let shrine = new Room(
  "shrine",
  `The walls of this small room are lined with hundreds of lit candles. In the center of the room is a podium with an elaborately decorated chest sitting on it. Behind you is the [corridor]`,
  ["chest"],
  ["corridor"]
);
//set up look up tables for user input
let itemTable = {
  rock: rock,
  stick: stick,
  plaque: plaque,
  torch: torch,
  skeleton: skeleton,
  vial: vial,
  gate: gate,
  chest: chest,
  treasure: treasure,
  key: key,
};
let locationTable = {
  startRoom: startRoom,
  secRoom: secRoom,
  tunnel: tunnel,
  entrance: entrance,
  corridor: corridor,
  cave: darkRoom,
  shrine: shrine,
  vault: vault,
};
let curLoc = "entrance";
let playerInventory = [];
let gLock = true;
let skeleSearch = false;
let poison = false;
let poisonTimer = 3;
chestSearch = false;
console.log(`
You have traveled far and wide searching for the lost dungeon of ZorkaMorka, having finally found it you stride forth. 
Carrying nothing but your wits and the clothes on your back you descend in search of Treasure!
 As you enter the dungeon you look around to get your bearings
 `);
console.log(`type help to get a list of available commands`);
console.log(entrance.description);

async function play() {
    //if plaer is poisoned, begin the countdown to failure
  if (poison === true && poisonTimer > 0) {
    --poisonTimer;
    console.log(`time is ticking, use that antidote soon!`);
  } else if (poison === true && poisonTimer <= 0) {
    console.log(
      "As the poison courses through your vision begins to fade and the room grows dark. You have failed in your quest"
    );
    process.exit();
  }
  //ask for user input
  let userAction = await ask("what would you like to do?");
  //sanitize and split user input
  let inputArray = userAction /* .toLowerCase() */
    .split(" ");
  //the first string of the user input becomes the action and the second becomes the target
  let action = inputArray[0];
  let target = inputArray[1];

  //if the action is valid do something, with the target as the argument
  if (action === "take") {
    //set up exception for the key
    if (itemTable[target].name === `key` && chestSearch === true) {
      itemTable[target].take();
      //player becomes poisoned after taking key
      poison = true;
      console.log(`
        as you you pick up the key you feel a prick on your finger! It appears that the chest was trapped and you have been poisoned! Find an antidote quiskly or you will soon perish.
        `);
        //check if the target is valid so it doesn't error out trying to use an undefined argument
    } else if(itemTable[target].name === 'treasure' && curLoc === 'vault') {
        console.log(`You have succeeded in your quest. Revel in the fact that your days wallowing about in dark caves are over!`)
        process.exit()
    } else if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].take());
    } else {
      //if the action isn't valid throw an error
      console.log("you cant pick that up!");
    }
  } else if (action === "help") {
      //allow user to check available commands
    console.log(`
      move : move to target location. Eligble targets will be highlighted in [] brackets
      take: take the targeted object, if it can be taken
      use: use an object that you have in your inventory
      drop: drop an object that you have in your inventory
      examine: take a closer look at the targeted object, use this to interact with objects that you cannot take
      lookAround: take a closer look at your surroundings, and list objects that can be interacted with
      inventory: check your current inventory
      
      `);
  } else if (action === "move") {
    //prevent the player from going through the tunnel without first picking up a torch
    if (
      locationTable[target] instanceof Room &&
      locationTable[target].location === `tunnel` &&
      !playerInventory.includes("torch")
    ) {
      console.log(
        `no way you can make it through that tunnel without a light source!`
      );
      //prevent player from just moving to the vualt
    } else if (
      locationTable[target] instanceof Room &&
      locationTable[target].location === "vault" &&
      gLock === true
    ) {
      console.log("you cannot reach the vault while the gate is still locked");
    } else {
      if (locationTable[target] instanceof Room) {
        //check if the target location is a valid place the user can go from the current location
        if (locationTable[target].conRooms.includes(curLoc)) {
          //if it is update the current location
          curLoc = target;
          console.log(`you are now in ${locationTable[curLoc].description}`);
        } else {
          //otherwise throw and error
          console.log(`you cannot go to ${target} from ${curLoc}`);
        }
      } else {
        console.log(`that isn't a place you can go`);
      }
    }
  } else if (action === "drop") {
    if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].drop());
    } else {
      console.log(`you don't have one of those to drop`);
    }
  } else if (action === "lookAround") {
    //re-display the description of the room, and then print the room's inventory as a list of interactive things within the room
    console.log(`
    
    you are in ${locationTable[curLoc].description}
    looking closer you see the following objects of note:
    a ${locationTable[curLoc].inventory.join(", a ")}
    `);
  } else if (action === "examine") {
    //set up exceptions for when cerating things are examined
    //check if a vial already exists, if it doesnt add one to the cave
    if (
      itemTable[target].name === "skeleton" &&
      !darkRoom.inventory.includes("vial") &&
      !playerInventory.includes("vial")
    ) {
      darkRoom.inventory.push("vial");
      skeleSearch = true;
      console.log(
        "It appears to be the skeleton of an unfortunate adventurer. As you search it a vial falls onto the ground from its hands"
      );
    } else if (itemTable[target].name === "skeleton" && skeleSearch === true) {
      return console.log(`You've gotten all you can out of this skeleton`);
    } else if (
      itemTable[target].name === "chest" &&
      !shrine.inventory.includes("key") &&
      !playerInventory.includes("key")
    ) {
      shrine.inventory.push("key");
      chestSearch = true;
      console.log(`${chest.description} sadasd`);
    } else if (itemTable[target] === "chest" && chestSearch === false) {
      console.log(`You've gotton all you can out of this chest`);
    }
    //return the description of an item. May cause some confusing if I dont also let the user examine locaitons
    else if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].description);
    } else {
      console.log(`you cant examine that`);
    }
  } else if (action === "use") {
    //use a given item. The use method has a number of exceptions that check for certain conditions
    if (target === "gate") {
      if (gLock === false) {
        console.log("you already unlocked that");
      } else if (playerInventory.includes("key")) {
        gLock = false;
        console.log(`you unlock the gate!`);
      } else {
        console.log(gate.action);
      }
    } else if (target === `vial` && poison === true) {
      poison = false;
      console.log(
        `you feel your strength return as the poison fades from your body `
      );
    } else if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].use());
      // itemTable[target].action = "You already used this buddy";
    } else {
      console.log(`You cant use that`);
    }
  } else if (action === "inventory") {
      //display the user's current inventory. I feel like the array looks better in the context of a game
    console.log(playerInventory /* .join(', a ' )*/);
  } else {
    console.log(`That was an invalid command, please try again`);
  }

  return play();
}

play();
