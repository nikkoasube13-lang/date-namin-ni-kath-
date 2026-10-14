# Want to go on a date? 💌

A small date invitation page built with plain HTML, CSS, and JavaScript. No install, no framework.

## How to use

1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Double-click `index.html` to open it in a browser.

To put it online, upload the files to GitHub Pages, Netlify, or Vercel.

## How it works

1. **Want to go on a date?** Each time **No** is pressed, it gets smaller, jumps to a new spot, and the message changes. **Yes** gets bigger.
2. Pressing **Yes** lets them pick **Walk** or **Coffee**.
3. They pick a date from a calendar (month and day). Past dates are disabled.
4. They can write an optional message (up to 300 characters).
5. The final screen shows their reply, like "Coffee on Saturday, October 18, 2026." They tap **Copy my reply** and send it to you.

## Files

| File | Contents |
| --- | --- |
| `index.html` | The five screens |
| `style.css` | Colors, layout, and animation |
| `script.js` | Yes/No logic, plan, day, message, and reply |
| `README.md` | This file |

## Getting the reply

The page has no server, so nothing is sent automatically. The person taps **Copy my reply** and sends the text to you in any chat.

## Customizing

All of these are in `script.js` unless noted.

- **Messages shown when No is pressed:** edit `NO_LINES`.
- **Earliest date allowed:** the calendar starts from today. Change `today` in `script.js` to set another start date.
- **How fast No shrinks:** change `0.16` in `1 - noCount * 0.16`. Bigger means faster.
- **How fast Yes grows:** change `0.55` in `1.1 + noCount * 0.55`.
- **More plans (Movie, Dinner):** add a `<button class="choice" data-plan="..." data-emoji="...">` inside `.choices` in `index.html`.
- **Colors:** edit the variables under `:root` in `style.css`.
- **Text and titles:** edit `index.html`.

## Notes

- The Bricolage Grotesque font needs internet. Offline, the page uses the device's default font.
- Nothing is saved. The answer only exists on the screen of whoever opens the page.
