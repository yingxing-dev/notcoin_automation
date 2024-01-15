// user values : you can edit this
powerLimitForAutotap = 1000
clickPeriod_ms = 150

// coin parameters : do not touch
notecoin = null
notecoin_x1 = 0;
notecoin_y1 = 0;
notecoin_x2 = 0;
notecoin_y2 = 0;

// power parameters : do not touch
power_recharging = true
current_power = 0

// click parameters : do not touch
next_click_points = {
    "x": 0,
    "y": 0,
    "id": 0
}
next_click_delay = clickPeriod_ms
last_click_at = 0
boost_mode = false;

function simulateTouchEvent(element, type, touches) {
  const touchEvents = [];

  touches.forEach((touch) => {
    touchEvents.push(new Touch({
      clientX: touch.x,
      clientY: touch.y,
      identifier: touch.id,
      target: element,
    }));
  });

  element.dispatchEvent(new TouchEvent(type, {
    touches: touchEvents,
    view: window,
    cancelable: true,
    bubbles: true,
  }));
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function updateNextClickDelay() {
    last_click_at = Date.now()
    next_click_delay = clickPeriod_ms + getRandomArbitrary(0, 75)
}

function updateCoinAndPositions() {
    try {
        notecoin = document.querySelectorAll('div[class^="_notcoin"]')[0]
        
        // update coin boundary data
        let coinBound = notecoin.getBoundingClientRect()
        let padding = coinBound.width / 100 * getRandomArbitrary(5, 20)
        notecoin_x1 = coinBound.left + padding
        notecoin_y1 = coinBound.top + padding
        notecoin_x2 = coinBound.right - padding
        notecoin_y2 = coinBound.bottom - padding
    
        // update next touch data
        next_click_points = {
            "x": getRandomArbitrary(notecoin_x1, notecoin_x2),
            "y": getRandomArbitrary(notecoin_y1, notecoin_y2),
            "id": 0
        }
    } catch(error) {
        return false
    }
    return true
}

function updateCurrentPower() {
    try {
        current_power = parseInt(document.querySelector('div[class^="_scoreCurrent"]').textContent);
    } catch (error) {
        return false
    }
    return true
}

function isPowerForClickAvailable() {
    if (power_recharging) {
        if (current_power >= powerLimitForAutotap) {
            power_recharging = false;
        }
    } else {
        if (current_power <= 0) {
            power_recharging = true;

            // disable boost mode
            boost_mode = false;
        }
    }
    return !power_recharging
}

function isBoostMode() {
    return boost_mode
}

function isUserNotOnClickerPage() {
    return window.location.href !== "https://clicker.joincommunity.xyz/clicker" && !window.location.href.includes('https://clicker.joincommunity.xyz/clicker#');
}

async function update() {
    if (Date.now() - last_click_at < next_click_delay || isUserNotOnClickerPage()) {
        return;
    }
    
    if (updateCurrentPower() && updateCoinAndPositions()) {
        if (!isPowerForClickAvailable() && !isBoostMode()) {
            return;
        }
        
        simulateTouchEvent(notecoin, 'touchstart', [next_click_points])
        updateNextClickDelay()
        
        setTimeout(function() {
            simulateTouchEvent(notecoin, 'touchend', [next_click_points])
        }, 100)
    }
}

// start updater
setInterval(update, 1);

// user function - set to console if you touch on rocket
function boost() {
    power_recharging = false;
    boost_mode = true;
}
