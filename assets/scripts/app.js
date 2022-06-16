const ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 30;
const MONSTER_ATTACK_VALUE = 20;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'PLAYER_HEAL';

//////////////////USER DECIDES ABOUT HP HERE/////////////////////////
const enteredHp = prompt("Chose your's and monster's health:", "100")
let chosenMaxLife = parseInt(enteredHp);
if(isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100
    alert(`Enter the correct number next time! \nNow you health settings will be set up to default ones.`)
}//////////////////USER DECIDES ABOUT HP HERE/////////////////////////


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = []

adjustHealthBars(chosenMaxLife);

//////////////////writeToLog FUNCTION/////////////////////////
function writeToLog(event, value, playerHealth, monsterHealth) {
    let logEntry = {
        event: event,
        value: value,
        newPlayerHealth: playerHealth,
        newMonsterHealth: monsterHealth,
    };

    switch(event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'
        break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER'
        break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER'
        break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER'
        break;
    default: logEntry = {}
    }
    battleLog.push(logEntry);
}//////////////////writeToLog FUNCTION/////////////////////////


//////////////////RESET GAME FUNCTION/////////////////////////
function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}//////////////////RESET GAME FUNCTION/////////////////////////


//////////////////FINAL STAGE OF THE GAME/////////////////////////
function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentPlayerHealth, currentMonsterHealth);

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You activated extra life!')
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You are the champion!');
        reset();
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentPlayerHealth, currentMonsterHealth);
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        reset();
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentPlayerHealth, currentMonsterHealth);
    }
    else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('You have a draw!');
        reset();
        writeToLog(LOG_EVENT_GAME_OVER, 'DRAW', currentPlayerHealth, currentMonsterHealth);
    }
}//////////////////FINAL STAGE OF THE GAME/////////////////////////

//////////////////OUR ATTACK/////////////////////////
function attackMonster(mode) {
    const maxDamage = 
    mode === MODE_ATTACK
      ? ATTACK_VALUE
      : STRONG_ATTACK_VALUE;

    const logEvent = 
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentPlayerHealth, currentMonsterHealth);
    endRound();
}//////////////////OUR ATTACK/////////////////////////

function attackHandler() {
    attackMonster("ATTACK");
}

function strongAttackHandler() {
    attackMonster("STRONG_ATTACK");
}

//////////////////HEAL ALGO/////////////////////////
function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than your max initial health!");
        healValue = chosenMaxLife - currentPlayerHealth
    }
    else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentPlayerHealth, currentMonsterHealth);
    endRound()
}//////////////////HEAL ALGO/////////////////////////

function logHandler() {
    for(const logEntry of battleLog){
        console.log(logEntry);
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
resetBtn.addEventListener('click', reset);
logBtn.addEventListener('click', logHandler);
