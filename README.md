Google Api Search App
=========================

Test assignment. About a simple and responsive PhoneGap app based on Google Api Search results.

## Assignment

Create a Google search page in HTML5 ( JavaScript, CSS3 and HTML ), according to the design specifications given below.

* You must use RequireJS in your solution and you’re not allowed to use any other JavaScript framework/library. You’re also not allowed to use any back-­‐end technology (for example: PHP, Node, etc. ).
* The code you write should run out of the box when we deploy it with no modifications needed in browser or server settings.


## Run the app

See complete running app from here:
[http://xdemocle.github.io/test-google-api-search-app/](http://xdemocle.github.io/test-google-api-search-app/)

Video demo of running app:
[https://www.youtube.com/watch?v=5a4otPwdAAE](https://www.youtube.com/watch?v=5a4otPwdAAE)


## Install on device

From the link below yo ucan also install the app on your device:
[https://build.phonegap.com/apps/1168175/share](https://build.phonegap.com/apps/1168175/share)

(Install link for iOS is not available due missing Apple certificates)


## Summary of set up
***

### Prepare dev environment

* [Install Node.js and npm (Node Package Manager)](http://nodejs.org/download/)
* [Install Sass](http://sass-lang.com/install)
* [Install Bower](http://bower.io/)
* [Install Grunt](http://gruntjs.com/getting-started)

### Prepare SDK environments (Only if you want compile/emulate the PhoneGap app locally)

* [Install iOS SDK and Xcode](https://developer.apple.com/xcode/downloads/)
* [Install Android SDK and tools](https://developer.android.com/sdk/installing/index.html)


## Usage
***

### First step after git clone

* Install all requirements described at "Prepare project environment".
* Running **bower install & npm install** to install the required dependencies. If this fails, try running the commands separately and check errors.
* Create an empty private.json file in root of the project.
* OPTIONAL: set username and password of your account build.phonegap.com

```javascript
{
    "phonegap": {
        "email": "yourBuildPhonegapEmail",
        "pass": "yourBuildPhonegapPass"
    }
}
```


### Phonegap/build tasks via command line

* type: grunt deploy (deploy to build.phonegap.com. Follow optional instructions of "First step after git clone")
  Go here: https://build.phonegap.com/apps/[appid]/install (to see the app installed. wait few minutes)
  [appid] need to be changed with appId present in package.json
* type: grunt serve (run a working instance in your browser for development purpose)
* type grunt build && ./deploy.sh (to build the app and deploy on GitHub static hosting pages)
  (The build files will be created in dist/ folder and are also available in the gh=pages branch of this repo).
