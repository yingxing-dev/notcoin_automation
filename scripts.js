powerLimitForAutotap = 1000
clickPeriod_ms = 150

// do not touch
recharging = true
skipClick = false
_boost = false

// coin parameters : do not touch
notecoin = null
notecoin_x1 = 0;
notecoin_y1 = 0;
notecoin_x2 = 0;
notecoin_y2 = 0;

// click parameters : do not touch
next_click_points = {
    "x": 0,
    "y": 0
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function updateCoinAndPositions() {
    try {
        notecoin = document.querySelectorAll('div[class^="_notcoin"]')[0]
        
        // update coin boundary data
        let coinBound = notecoin.getBoundingClientRect()
        notecoin_x1 = coinBound.left
        notecoin_y1 = coinBound.top
        notecoin_x2 = coinBound.right
        notecoin_y2 = coinBound.bottom
    
        // update next touch data
        next_click_points = {
            "x": getRandomArbitrary(notecoin_x1, notecoin_x2),
            "y": getRandomArbitrary(notecoin_y1, notecoin_y2)
        }
    } catch(error) {
        return false
    }
    return true
}

function isUserNotOnClickerPage() {
    return window.location.href !== "https://clicker.joincommunity.xyz/clicker" && !window.location.href.includes('https://clicker.joincommunity.xyz/clicker#');
}

async function update() {
    if (!isUserNotOnClickerPage() && updateCoinAndPositions()) {
        
    }
}

setInterval(update, clickPeriod_ms);

function start() {
    skipClick = false;
}

function stop() {
    skipClick = true;
    _boost = false;
}

function boost() {
    _boost = true;
}
