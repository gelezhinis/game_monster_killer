const attackValue = 10;
const strongAttackValue = 17;
const monsterAttackValue = 14;
const healValue = 20;

const modeAttack = 'ATTACK';
const modeStrongAttack = 'STRONG_ATTACK';
const playerAttackLog = 'PLAYER_ATTACK';
const playerStrongAttackLog = 'PLAYER_STRONG_ATTACK';
const monsterAttackLog = 'MONSTER_ATTACK';
const playerHealLog = 'PLAYER_HEAL';
const gameOverLog = 'GAME_OVER';

function getMaxLifeValues() {
  const enteredValue = prompt('Maximum life for you and the monster', '100');
  const parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: 'invalid user input' };
    chosenMaxLife = 100;
    alert('wrong input');
  }
  return parsedValue;
}

let chosenMaxLife = getMaxLifeValues();
let battleLog = [];

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

// Error handling with try & catch

// try {
//   let chosenMaxLife = getMaxLifeValues(); // wrap only that code, where you can't control                                                 things (like user input information)
// } catch (error) {
//   console.log(error);
//   chosenMaxLife = 100;
//   alert('You entered wrong value, default value of 100 was used');
// }
// finally {
// this code executes no matter error was thrown or not, but 'finnaly' is used very rarely.
// }

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
  // if (ev === playerAttackLog) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === playerStrongAttackLog) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === monsterAttackLog) {
  //   logEntry.target = 'PLAYER';
  // } else if (ev === playerHealLog) {
  //   logEntry.target = 'PLAYER';
  // } else if (ev === gameOverLog) {
  //   logEntry.status = 'GAME_OVER';
  // }
  //instead of if/else, we can use switch operator
  switch (ev) {
    case playerAttackLog:
      logEntry.target = 'MONSTER';
      break;
    case playerStrongAttackLog:
      logEntry.target = 'MONSTER';
      break;
    case monsterAttackLog:
      logEntry.target = 'PLAYER';
      break;
    case playerHealLog:
      logEntry.target = 'PLAYER';
      break;
    case gameOverLog:
      logEntry.status = 'GAME OVER';
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

// function that damages the player and checks if someone wins or losts
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(monsterAttackValue);
  currentPlayerHealth = currentPlayerHealth - playerDamage;
  writeToLog(
    monsterAttackLog,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead, but the bonus life saved you!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeToLog(
      gameOverLog,
      'PLAYER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeToLog(
      gameOverLog,
      'MONSTER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw..');
    writeToLog(
      gameOverLog,
      'A DRAW!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  //we can use ternary operator here instead of if/else
  let maxDamage = mode === modeAttack ? attackValue : strongAttackValue;
  let logEvent = mode === modeAttack ? playerAttackLog : playerStrongAttackLog;
  // if (mode === modeAttack) {
  //   maxDamage = attackValue;
  //   logEvent = playerAttackLog;
  // } else if (mode === modeStrongAttack) {
  //   maxDamage = strongAttackValue;
  //   logEvent = playerStrongAttackLog;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth = currentMonsterHealth - damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(modeAttack);
}

function strongAttackHandler() {
  attackMonster(modeStrongAttack);
}

function healPlayerHandler() {
  let healVal;
  if (currentPlayerHealth >= chosenMaxLife - healValue) {
    alert("You can't heal to more than  your max initial health");
    healVal = chosenMaxLife - currentPlayerHealth;
  } else {
    healVal = healValue;
  }
  increasePlayerHealth(healVal);
  currentPlayerHealth = currentPlayerHealth + healVal;
  writeToLog(playerHealLog, healVal, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function printLogHandler() {
  // for loop
  for (let i = 0; i < battleLog.length; i++) {
    console.log('---------');
  }
  // you can use "while loop" instead of for loop
  // let j = 0;
  // // while loop
  // while (j < 3) {
  //   console.log('---------');
  //   j++;
  // }
  // or you can use "do while loop"
  // do {
  //   console.log('---------');
  //   j++;} while (j < 3);

  // for of loop (of arrays)
  for (const log of battleLog) {
    console.log(log);
    // for in loop (in objects)
    for (const key in log) {
      console.log(`${key} ==> ${log[key]}`);
    }
  }
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
