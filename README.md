# desktopjs

## Test it out

### dpmjs

You need `dpmjs`, the desktopjs package manager, in order to install desktop.js apps. To install it, do the following:
```bash
git clone https://github.com/ArielAbreu/dpm.git
cd dpm
sudo npm install -g ./
cd ..
```

### Requirements
  - [Bower](http://bower.io/)
  - [Node.js](https://nodejs.org/) OR [io.js](https://iojs.org/en/index.html)

Note: you must have root privileges (su, sudo, etc...) to run this (it uses port 80)

### Run it
Clone the repo, `cd` into it and:
```bash
bower update
npm install
# done with desktopjs deps, now let's install some apps
dpm install files
dpm install edit
dpm install image
dpm install term
# now let's actually start the desktop
sudo node backend.js # for node
# OR
sudo iojs backend.js # for iojs
```
Then open up your browser (desktopjs has only been tested with Google Chrome, so if you're not using Google Chrome, don't complain if it doesn't work) and go to [localhost](http://localhost).

## Some info

desktop.js uses Express.js to create an http server and serve a desktop to the user via the browser, and uses socket.io for speedy frontend-to-backend communication. Honestly, the frontend looks crappy and needs some work, but i'll improve it by the end of this year.
