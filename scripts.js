// user values : you can edit this
powerLimitForAutotap = 1000
clickPeriod_ms = 150
useDoubleClick = true

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
next_second_click_points = {
    "x": 0,
    "y": 0,
    "id": 0
}
next_click_delay = clickPeriod_ms
last_click_at = 0

// boost parameters : do not touch
boost_mode = false;
awaiting_finished = false;
awaiting_boost = false;
awaiting_from = 0;
awaiting_time = 0;

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

        if (useDoubleClick) {
            next_second_click_points = {
                "x": getRandomArbitrary(notecoin_x1, notecoin_x2),
                "y": getRandomArbitrary(notecoin_y1, notecoin_y2),
                "id": 1
            }
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

function detectBoost() {
    let imrocket = document.querySelectorAll('img[class^="_root"]');
    if (imrocket !== undefined && imrocket !== null) {
        try {
            let boost = imrocket[0][Object.keys(imrocket[0])[1]];
            return boost !== null && boost !== undefined;
        } catch (error) {}
    }
    return false
}

function updateBoostState() {
    try {
        if (!awaiting_boost) {
            if (detectBoost()) {
                awaiting_from = Date.now();
                awaiting_time = getRandomArbitrary(1250, 1950);
                awaiting_boost = true;
            }
            return false;
        } else if (!awaiting_finished) {
            if (Date.now() - awaiting_from >= awaiting_time) {
                 try {
                    let imrocket = document.querySelectorAll('img[class^="_root"]');
                    let boost = imrocket[0][Object.keys(imrocket[0])[1]];
                    if (boost !== null && boost !== undefined) {
                        boost.onClick();
                        awaiting_finished = true;
                        return awaiting_finished;
                    }
                } catch (error) {}
            }
        }
        return awaiting_finished;
    } catch (error) {
        return false;
    }
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

            // clear boost cache
            awaiting_from = 0;
            awaiting_time = 0;
            awaiting_boost = false;
            awaiting_finished = false;
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

    if (updateBoostState()) {
        power_recharging = false;
        boost_mode = true;
    }
    
    if (updateCurrentPower() && updateCoinAndPositions()) {
        if (!isPowerForClickAvailable() && !isBoostMode()) {
            return;
        }
        
        simulateTouchEvent(notecoin, 'touchstart', [next_click_points])
        updateNextClickDelay()
        
        setTimeout(function() {
            simulateTouchEvent(notecoin, 'touchend', [next_click_points])
        }, getRandomArbitrary(75, 120))

        if (useDoubleClick) {
            setTimeout(function() {
                simulateTouchEvent(notecoin, 'touchstart', [next_second_click_points])
                setTimeout(function() {
                    simulateTouchEvent(notecoin, 'touchend', [next_second_click_points])
                }, getRandomArbitrary(75, 120))
            }, getRandomArbitrary(30, 75));
        }
    }
}

// start updater
setInterval(update, 1);
