var container = document.querySelector('#unity-container')
var canvas = document.querySelector('#unity-canvas')
var loadingBar = document.querySelector('#unity-loading-bar')
var progressBarFull = document.querySelector('#unity-progress-bar-full')
var warningBanner = document.querySelector('#unity-warning')
var logo = document.querySelector('#logo')

const LandingUrl = 'https://gamety.io'

window.AdControllerBooster = window.Adsgram.init({
  blockId: "1000",
  debug: true,
  debugBannerType: "RewardedVideo"
});

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
var divBanner

function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none'
    }

    if (divBanner == undefined) {
        divBanner = document.createElement('div')
        warningBanner.appendChild(divBanner)
    }

    divBanner.innerHTML = msg

    if (type == 'error' || type == 'message') {

    } else {
        setTimeout(function() {
            warningBanner.removeChild(divBanner)
            updateBannerVisibility()
        }, 5000)
    }

    updateBannerVisibility()
}

var versionStamp = '?v=' + "2.5.12-ads-log"

var buildUrl = 'Build';
var loaderUrl = buildUrl + '/GametyClicker.loader.js' + versionStamp;
var config = {
  dataUrl: buildUrl + '/GametyClicker.data' + versionStamp,
  frameworkUrl: buildUrl + '/GametyClicker.framework.js' + versionStamp,
  codeUrl: buildUrl + '/GametyClicker.wasm' + versionStamp,
  streamingAssetsUrl: "StreamingAssets",
  companyName: "Fruktorum",
  productName: "Gamety Clicker",
  productVersion: "2.5.12-ads-log",
  showBanner: unityShowBanner
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

// Mobile device style: fill the whole browser client area with the game canvas:
var meta = document.createElement('meta')
meta.name = 'viewport'
meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes'
document.getElementsByTagName('head')[0].appendChild(meta)

const platform = Telegram?.WebApp?.platform
Telegram.WebApp.disableVerticalSwipes()

window.getUserData = function() {
  return window.Telegram.WebApp.initData
}

if (window.self !== window.top) {
  window.addEventListener('message', (event) => {
      if (event.origin === LandingUrl && typeof event.data === 'string') {
          window.telegramUserData = event.data;
          checkData();
      }
  })
}

checkData()

function checkData() {
  if (platform === 'unknown' && (window.telegramUserData === undefined || window.telegramUserData === 'null')) {
      unityShowBanner('Please log in on the website using Telegram', 'error')
      return
  }

  unityShowBanner('Loading...', 'message')

  /*
  if (!(platform === 'android' || platform === 'ios')) {
      unityShowBanner('Your device is not supported.\nPlease switch to a mobile device', 'error');
  } else {
  */

  Telegram.WebApp.expand()

  // Mobile device style: fill the whole browser client area with the game canvas:
  var meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes'
  document.getElementsByTagName('head')[0].appendChild(meta)
  loadingBar.style.display = 'block'

  loadUnity()
}

function loadUnity() {
  var script = document.createElement('script')
  script.src = loaderUrl
  script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + '%'
      }).then((unityInstance) => {
          loadingBar.style.display = 'none'
          logo.style.display = 'none'
      }).catch((message) => {
          alert(message)
      })
  }

  document.body.appendChild(script)
}
