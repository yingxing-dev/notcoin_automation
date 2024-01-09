powerLimitForAutotap = 100
clickPeriod_ms = 250

// do not touch
lastClickAt = 0
recharging = true
skipClick = false
_boost = false

async function click() {
    let cc = document.querySelectorAll('div[class^="_notcoin"]');
    let scoreElement = document.querySelector('div[class^="_scoreCurrent"]');
    let score = parseInt(scoreElement.textContent);
    
    try {
        let imrocket = document.querySelectorAll('img[class^="_root"]');
        imrocket[0][Object.keys(imrocket[0])[1]].onClick();
    } catch (error) {}

    if (Date.now() - lastClickAt >= clickPeriod_ms) {
        clickPeriod_ms = Date.now();
        
        score = parseInt(scoreElement.textContent);

        if (!_boost) {
            if (skipClick) {
                return;
            }
        
            if (recharging) {
                if (score >= powerLimitForAutotap) {
                    recharging = false;
                }
                return;
            }
        }

        if (score > 0 || _boost) {
            try {
                await new Promise((resolve) => {
                    cc[0][Object.keys(cc[0])[1]].onTouchStart('');
                    setTimeout(resolve, 100);
                });
            } catch (error) {}
        } else {
            recharging = true;
            _boost = false;
        }
    }
}

setInterval(click, 500);

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
