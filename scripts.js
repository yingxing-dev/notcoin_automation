powerLimitForAutotap = 100
countclicks = 34

// do not touch
recharging = false
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
    
    for (let step = 0; step < countclicks; step++) {
        score = parseInt(scoreElement.textContent);

        if (!_boost) {
            if (skipClick) {
                break;
            }
        
            if (recharging) {
                if (score >= powerLimitForAutotap) {
                    recharging = false;
                }
                break;
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
            break;
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
