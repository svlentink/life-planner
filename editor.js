/* @license GPLv3 */
import { orchestrator } from './shared.js'

import * as hack from 'https://cdn.lent.ink/js/npm/yamljs.js'
const YAML = window.npm['yamljs'].default


let EXAMPLE_URL = './example.yml' //'https://github.com/svlentink/life-planner/tree/master/example.yml'
let blob_url = "https://blob.huil.bid/yaml"
let blob_login_url = "https://blob.huil.bid/?redirect=" +
                     encodeURIComponent('https://lent.ink/projects/life-planner/#blobstorage')

function loadBlob(callback) {
  let url = blob_url + '_test_if_logged_in'
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText === 'ERROR please login first')
        return window.location = blob_login_url
      fetchBlob(callback)
    }
  };
  xhttp.open("GET", url, true)
  xhttp.withCredentials = true
  xhttp.send()
}
function fetchBlob(callback) {
  let url = blob_url
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText)
    }
  };
  xhttp.open("GET", url, true)
  xhttp.withCredentials = true
  xhttp.send()
}

function loadURL(callback) { //already
  if (window.location.hash === '#blobstorage') {
    console.log('Loading YAML from blobstorage service')
    loadBlob((txt) => {
      //document.querySelector('#input').value = txt
      let obj = YAML.parse(txt)
      window.data = obj
      if (callback) callback(window.data)
      console.log('Loaded from blobstorage')
    })
  } else {
    let url = window.location.hash.substr(1) || EXAMPLE_URL
    window.location.hash = url
    console.log('Loading YAML from url in found in window.location.hash')
    YAML.load(url,
    function(obj) {
      console.log('YAML.load callback',url)
      window.data = obj
      for (var key in window.data) {
        void function(key){ // IIFE to perserve variables during looping
          var val = window.data[key]
          if (typeof val === 'string' && val.substr(-2,2).toLowerCase() === 'ml') {
            console.log('Loading',key,'from',val)
            YAML.load(val, (data) => {
              window.data[key] = data
              if (callback) callback(window.data)
              console.log('Loaded',key,'from',val)
            })
          }
        }(key)
      }
      if (callback) callback(window.data)
    })
  }
}

function loadinput(callback) {
  var yamlinp = document.querySelector('#input').value
  if (window.location.hash === '#blobstorage'){
    let url = blob_url
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('Saved to blobstorage')
      }
    };
    xhttp.open("POST", url, true)
    xhttp.withCredentials = true
    xhttp.send(yamlinp)
  } else {
    window.localStorage.setItem('yaml',yamlinp)
    console.log('Saved to localstorage')
  }
  window.data = YAML.parse(yamlinp)
  if (callback) callback(window.data)
}

function init(){
  console.log('Start loading page from YAML')
  var hash = window.location.hash
  if (hash) {
    loadURL(orchestrator)
  } else if (window.localStorage.getItem('yaml')) {
    console.log('Found content in localstorage, using it')
    if (document.querySelector('#input'))
      document.querySelector('#input').value = window.localStorage.getItem('yaml')
    loadinput(orchestrator)
  } else loadURL(orchestrator) // will load example.yml
}
init()

//document.querySelector('#loadYAMLbtn').addEventListener('click',() => loadURL(glob.orchestrator))
let renderbtnlocalstorage = document.querySelector('#renderbtnlocalstorage')
if (renderbtnlocalstorage) renderbtnlocalstorage.addEventListener('click',() => loadinput(/*glob.orchestrator*/))
let renderbtnblobstorage = document.querySelector('#renderbtnblobstorage')
if (renderbtnblobstorage) renderbtnblobstorage.addEventListener('click',() => {
  window.location.hash = 'blobstorage'
  loadinput(/*glob.orchestrator*/)
})
let loadbsnblobstorage = document.querySelector('#loadbtnblobstorage')
if (loadbsnblobstorage) loadbsnblobstorage.addEventListener('click',() => {
  let loc = window.location
  let href = loc.origin + loc.pathname + '#blobstorage'
  window.open(href)
})

export { init }
