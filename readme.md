Автор данного проекта: https://t.me/alexnotcoin

(Я всего лишь подредачил пару вещей и малость изменил функционал. Захотите поставить звезду - поставьте её лучше автору оригинальной версии!)

## ИГРАЕМ ЗА СКВАД БРАТИШКИНА:
https://t.me/notcoin_bot?start=rp_2842162

## Запуск Notcoin с компьютера

1. Авторизуйтесь с компьютера в [Telegram Web](https://web.telegram.org).
2. После авторизации перейдите в бота [Notcoin Bot](https://web.telegram.org/k/#@notcoin_bot).
3. Нажмите клавишу F12 (или откройте Исходный код страницы), затем перейдите на вкладку "Сеть". Если необходимо, обновите страницу нажатием клавиши F5.
4. Нажмите кнопку, отвечающую за вход в приложение.
   ![img.png](img.png)
5. Найдите событие "event" на вкладке "Сеть".
![img_2.png](img_2.png)
6. Из интересующего нас события скопируйте параметр "u" (ссылка будет иметь примерно следующий вид):
   ```
   https://clicker.joincommunity.xyz/clicker#tgWebAppData=query_id%*D**GO*-**AA**AI***gwalO3m%26user%3D%257B%2522id%2522%253A2****0478%252C%2522first_name%2522%253A%2522*******%2522%252C%2522last_name%2522%253A%2522*******%2522%252C%2522username%2522%253A%2522******%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D170**16279%26hash%3D7dfa***db35***b593aa80f3***9858ca0649c5***cd001bf888888b770a3ff0e&tgWebAppVersion=7.0&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%2300488f%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22text_color%22%3A%22%23000000%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%233390ec%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23df3f40%22%7D
   ```
7. В скопированной ссылке замените параметр "tgWebAppPlatform=web" на "tgWebAppPlatform=ios".
tgWebAppPlatform=web
Мы его заменяем на ios
tgWebAppPlatform=ios.
Измененную ссылку отправляем в браузер.
8. Откройте измененную ссылку в браузере.
![img_3.png](img_3.png)


### ВАЖНО
C 07.01 сессия с браузера держится не более 3ех часов.
Для того, чтобы все работало, необходимо проделать действия с 3 пункта

## Скрипт для автоматизации нажатий

Данный скрипт позволяет автоматически собирать ракеты, появляющиеся в игре, а также автоматически тапать до достижения определенного баланса. Ниже приведены параметры, которые можно редактировать для настройки скрипта:

- `powerLimitForAutotap`: параметр, отвечающий за определение целевого баланса. Скрипт будет автоматически тапать для достижения этого баланса.
`В отличие от оригинального скрипта энергия будет растрачиваться до 0 при достижении выставленного лимита`

- `clickPeriod_ms`: параметр, определяющий период нажатий в миллисекундах (минимум 150-200)

# Дополнительные функции для ручного контроля
## Остановка автокликера
```javascript
stop();
```
## Возобновление работы автокликера
```javascript
start();
```

## Запуск автокликера при бусте (кол-во энергии игнорируется, работает до тех пор, пока энергия не закончится, а после отключается сам)
```javascript
boost();
```

### Как запустить

1. Нажмите клавишу F12 (или откройте Исходный код страницы),
2. Вставляем скрипт ниже (если вставка в браузере запрещена, то https://stackoverflow.com/questions/77587864/disable-paste-protection-in-chrome-devtools)

Сам скрипт:
```javascript
powerLimitForAutotap = 100
clickPeriod_ms = 150

// do not touch
lastClickAt = 0
recharging = true
skipClick = false
_boost = false

async function click() {
    if (window.location.href !== "https://clicker.joincommunity.xyz/clicker" && !window.location.href.includes('https://clicker.joincommunity.xyz/clicker#')) {
        return
    }
    
    let cc = document.querySelectorAll('div[class^="_notcoin"]');
    let scoreElement = document.querySelector('div[class^="_scoreCurrent"]');
    let score = parseInt(scoreElement.textContent);
    
    try {
        let imrocket = document.querySelectorAll('img[class^="_root"]');
        imrocket[0][Object.keys(imrocket[0])[1]].onClick();
        setTimeout(boost, 550);
    } catch (error) {}

    if (Date.now() - lastClickAt >= clickPeriod_ms) {
        lastClickAt = Date.now();
        
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

setInterval(click, clickPeriod_ms);

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

```

# ИСПОЛЬЗУЙТЕ НА СВОЙ СТРАХ И РИСК, ИБО КОД ЭКСПЕРЕМЕНТАЛЬНЫЙ
