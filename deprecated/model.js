/* @license GPLv3 */
(function (glob) { // IIFE pattern
  'use strict'; var SVL = glob.SVL; var log = new SVL.log.Logger('model.js'); SVL.config.logLevel = 3

  var Storage = function (storageobj) {
    this.data = storageobj || {}
  }
  Storage.prototype.get = function (key) {
    if (!key || !key.length) return log.error('No key provided')
    if (!this.data[key]) return log.error('Key not found', {key: key})
    return this.data[key]
  }
  Storage.prototype.set = function (key, obj) {
    log.enter('Storage.set', arguments)
    if (!key || !key.length) return log.error('No key provided')
    this.data[key] = obj || {}
    return this.get(key)
  }
  Storage.prototype.getKeys = function () {
    var keys = []
    for (var key in this.data) if (this.data.hasOwnProperty(key)) {
      keys.push(key.toString()) // provide a copy
    }
    return keys
  }
  Storage.prototype.del = function (key) {
    delete this.data[key]
  }
  /**
   * Links can be stored as a string or array of strings
   * But are always returned as an array of string(s)
   */
  Storage.prototype.getLinks = function (name) {
    if (!name && !name.length) return this.getAllLinks()
    if (!this.data[name]) return log.error('No goal found', {name: name})
    var links = this.data[name].links || []
    if (typeof links === 'string') return [ links.toString() ] // provide a copy
    return links // allready an array
  }
  Goals.prototype.getAllLinks = function () {
    var links = []
    var names = this.getNames()
    for (var n = 0; n < names.length; n++) {
      var goalLinks = this.getLinks(names[n])
      for (var i = 0; i < goalLinks.length; i++) {
        var link = {source: names[n], target: goalLinks[i]}
        links.push(link)
      }
    }
    return links
  }
  Goals.prototype.toJSON = function () {
    return JSON.stringify(this.data)
  }
  Goals.prototype.d3js = function () {
    log.enter('Goals.d3js', arguments)
    var nodes = []
    var names = this.getNames() || []
    for (var n = 0; n < names.length; n++) {
      nodes.push({name: names[n]})
    }
    var links = []
    var allLinks = this.getAllLinks()
    for (var l = 0; l < allLinks.length; l++) {
      var link = {}
      var curr = allLinks[l]
      for (var s = 0; s < nodes.length; s++) if (nodes[s].name === curr.source) link.source = nodes[s]
      for (var t = 0; t < nodes.length; t++) if (nodes[t].name === curr.target) link.target = nodes[t]
      if (link.source && link.target) links.push(link)
      else log.warn('Connection could not be made', {source: curr.source, target: curr.target})
    }
    this.saveToBrowser() // save when newly rendered
    return {nodes: nodes, links: links}
  }
  Goals.prototype.saveToBrowser = function () {
    glob.localStorage.setItem('goals', this.toJSON())
  }
  Goals.prototype.loadFromBrowser = function () {
    this.data = JSON.parse(glob.localStorage.getItem('goals')) || this.loadExample()
    return this.data
  }

  SVL.set(['planning', 'Event'], Event)
  SVL.set(['planning', 'Goals'], Goals)
}(typeof window !== 'undefined' ? window : global))






/* @license GPLv3 */
(function (glob) { // IIFE pattern
  'use strict'; var SVL = glob.SVL; var log = new SVL.log.Logger('model.js'); SVL.config.logLevel = 3

  var Goals = function (storageobj) {
    this.data = storageobj || this.loadFromBrowser()
  }
  Goals.prototype.getGoal = function (name) {
    if (!name || !name.length) return log.error('No name provided')
    if (!this.data[name]) return log.error('Goal not found', {name: name})
    return this.data[name]
  }
  Goals.prototype.setGoal = function (name, obj) {
    log.enter('Goals.setGoal', arguments)
    if (!name || !name.length) return log.error('No name provided')
    this.data[name] = obj || {}
    return this.getGoal(name)
  }
  Goals.prototype.delGoal = function (name) {
    delete this.data[name]
  }
  Goals.prototype.getNames = function () {
    var goals = []
    for (var prop in this.data) if (this.data.hasOwnProperty(prop)) {
      goals.push(prop.toString()) // provide a copy
    }
    return goals
  }
  /**
   * Links can be stored as a string or array of strings
   * But are always returned as an array of string(s)
   */
  Goals.prototype.getLinks = function (name) {
    if (!name && !name.length) return this.getAllLinks()
    if (!this.data[name]) return log.error('No goal found', {name: name})
    var links = this.data[name].links || []
    if (typeof links === 'string') return [ links.toString() ] // provide a copy
    return links // allready an array
  }
  Goals.prototype.getAllLinks = function () {
    var links = []
    var names = this.getNames()
    for (var n = 0; n < names.length; n++) {
      var goalLinks = this.getLinks(names[n])
      for (var i = 0; i < goalLinks.length; i++) {
        var link = {source: names[n], target: goalLinks[i]}
        links.push(link)
      }
    }
    return links
  }
  Goals.prototype.toJSON = function () {
    return JSON.stringify(this.data)
  }
  Goals.prototype.d3js = function () {
    log.enter('Goals.d3js', arguments)
    var nodes = []
    var names = this.getNames() || []
    for (var n = 0; n < names.length; n++) {
      nodes.push({name: names[n]})
    }
    var links = []
    var allLinks = this.getAllLinks()
    for (var l = 0; l < allLinks.length; l++) {
      var link = {}
      var curr = allLinks[l]
      for (var s = 0; s < nodes.length; s++) if (nodes[s].name === curr.source) link.source = nodes[s]
      for (var t = 0; t < nodes.length; t++) if (nodes[t].name === curr.target) link.target = nodes[t]
      if (link.source && link.target) links.push(link)
      else log.warn('Connection could not be made', {source: curr.source, target: curr.target})
    }
    this.saveToBrowser() // save when newly rendered
    return {nodes: nodes, links: links}
  }
  Goals.prototype.saveToBrowser = function () {
    glob.localStorage.setItem('goals', this.toJSON())
  }
  Goals.prototype.loadFromBrowser = function () {
    this.data = JSON.parse(glob.localStorage.getItem('goals')) || this.loadExample()
    return this.data
  }
/*
  Goals.prototype.loadExample = function () {
    var example = {
      'intelligence': {desc: '9 types of intelligence\nhttp://fundersandfounders.com/9-types-of-intelligence/'},
      'naturalist': {
        links: ['intelligence'],
        desc: 'Naturalist intelligence designates the human ability to discriminate among living things (plants, animals) as well as sensitivity to other features of the natural world (clouds, rock configurations). This ability was clearly of value in our evolutionary past as hunters, gatherers, and farmers; it continues to be central in such roles as botanist or chef. It is also speculated that much of our consumer society exploits the naturalist intelligences, which can be mobilized in the discrimination among cars, sneakers, kinds of makeup, and the like.'
      },
      'musical': {
        links: ['intelligence'],
        desc: 'Musical intelligence is the capacity to discern pitch, rhythm, timbre, and tone. This intelligence enables us to recognize, create, reproduce, and reflect on music, as demonstrated by composers, conductors, musicians, vocalist, and sensitive listeners. Interestingly, there is often an affective connection between music and the emotions; and mathematical and musical intelligences may share common thinking processes. Young adults with this kind of intelligence are usually singing or drumming to themselves. They are usually quite aware of sounds others may miss.'
      },
      'logical-mathematical': {
        links: ['intelligence'],
        desc: 'Logical-mathematical intelligence is the ability to calculate, quantify, consider propositions and hypotheses, and carry out complete mathematical operations. It enables us to perceive relationships and connections and to use abstract, symbolic thought; sequential reasoning skills; and inductive and deductive thinking patterns. Logical intelligence is usually well developed in mathematicians, scientists, and detectives. Young adults with lots of logical intelligence are interested in patterns, categories, and relationships. They are drawn to arithmetic problems, strategy games and experiments.'
      },
      'existential': {
        links: 'intelligence',
        desc: 'Sensitivity and capacity to tackle deep questions about human existence, such as the meaning of life, why we die, and how did we get here.'
      },
      'interpersonal': {
        links: 'intelligence',
        desc: 'Interpersonal intelligence is the ability to understand and interact effectively with others. It involves effective verbal and nonverbal communication, the ability to note distinctions among others, sensitivity to the moods and temperaments of others, and the ability to entertain multiple perspectives. Teachers, social workers, actors, and politicians all exhibit interpersonal intelligence. Young adults with this kind of intelligence are leaders among their peers, are good at communicating, and seem to understand others’ feelings and motives.'
      },
      'bodily-kinesthetic': {
        links: 'intelligence',
        desc: 'Bodily kinesthetic intelligence is the capacity to manipulate objects and use a variety of physical skills. This intelligence also involves a sense of timing and the perfection of skills through mind–body union. Athletes, dancers, surgeons, and crafts people exhibit well-developed bodily kinesthetic intelligence.'
      },
      'linguistic': {
        links: 'intelligence',
        desc: 'Linguistic intelligence is the ability to think in words and to use language to express and appreciate complex meanings. Linguistic intelligence allows us to understand the order and meaning of words and to apply meta-linguistic skills to reflect on our use of language. Linguistic intelligence is the most widely shared human competence and is evident in poets, novelists, journalists, and effective public speakers. Young adults with this kind of intelligence enjoy writing, reading, telling stories or doing crossword puzzles.'
      },
      'intra-personal': {
        links: 'intelligence',
        desc: 'Intra-personal intelligence is the capacity to understand oneself and one’s thoughts and feelings, and to use such knowledge in planning and directioning one’s life. Intra-personal intelligence involves not only an appreciation of the self, but also of the human condition. It is evident in psychologist, spiritual leaders, and philosophers. These young adults may be shy. They are very aware of their own feelings and are self-motivated.'
      },
      'spatial': {
        links: 'intelligence',
        desc: 'Spatial intelligence is the ability to think in three dimensions. Core capacities include mental imagery, spatial reasoning, image manipulation, graphic and artistic skills, and an active imagination. Sailors, pilots, sculptors, painters, and architects all exhibit spatial intelligence. Young adults with this kind of intelligence may be fascinated with mazes or jigsaw puzzles, or spend free time drawing or daydreaming.'
      },
      'stamina': {links: 'bodily-kinesthetic'},
      'balance': {links: 'bodily-kinesthetic'},
      'strength': {links: 'bodily-kinesthetic'},
      'flexibility': {links: 'bodily-kinesthetic'},
      'vocabulary': {links: 'linguistic'},
      'languages': {links: 'linguistic'},
      'spanish': {links: 'languages'},
      'english': {links: 'languages'},
      'listening': {links: 'spanish'},
      'speaking': {links: 'spanish'},
      'audio-course': {links: ['listening', 'speaking']},
      'music-theory': {links: 'musical'},
      'guitar': {links: 'musical'},
      'electric': {links: 'guitar'},
      'acoustic': {links: 'guitar'},
      'BAND-REHEARSAL': {
        links: 'guitar',
        desc: 'My band rehearsal forces me to evolve as a guitarist.'
      },
      'strumming': {links: 'guitar'},
      'notes': {links: ['guitar', 'music-theory', 'piano']},
      'piano': {links: 'musical'},
      'vocally': {links: 'musical'},
      'core': {links: 'strength'},
      'balancing-ball': {
        links: 'core',
        desc: 'Sitting on a fitnessball behind desk at work'
      },
      'upper-body': {links: 'strength'},
      'pull-ups': {links: 'upper-body'},
      'push-ups': {links: 'upper-body'},
      'legs': {links: 'strength'},
      'running': {links: 'stamina'},
      'swimming': {links: 'stamina'},
      'biking': {
        links: ['legs', 'stamina'],
        desc: 'We in the Netherlands bike a lot, which allows us to skip leg day.\nIt is also good for stamina.'
      },
      'meditate': {links: 'existential'},
      'stretching': {links: 'flexibility'},
      'yoga': {links: ['balance', 'stretching', 'meditate']},
      'handstand': {links: ['yoga', 'upper-body']},
      'math': {links: 'logical-mathematical'},
      'physics': {links: 'logical-mathematical'},
      'coding': {links: 'logical-mathematical'},
      'DAILY-COMMUTE': {
        links: ['audio-course', 'biking'],
        desc: 'Listing to an audio course while biking to work.'
      },
      'WORK': {
        links: ['coding', 'balancing-ball', 'english'],
        desc: 'As a non-native English speaker, I write code and documentation in English, while sitting on a fitness ball.'
      },
      'MORNING-RITUAL': {
        links: ['push-ups', 'meditate'],
        desc: 'Besides the usual, I prepare for the cold outdoor bike ride by doing push-ups.'
      },
      'coordination': {links: ['bodily-kinesthetic']},
      'rithm': {links: 'musical'},
      'dance': {links: ['coordination', 'rithm']}
    }
    this.data = example
    return example
  }
*/

  /**
   * Get time for logging
   * @param {String} name
   * @param {String} desc description
   * @param {Array} when List of date intervals
   * @param {Array} goals List of goals
   */
  var Event = function (name, desc, when, goals, subevents) {
    this.name = name || 'No name found.'
    this.desc = desc || 'No description found.'
    this.when = when || []
    this.goals = goals || []
    this.subevents = subevents || []
  }

  /*
   * 16:00 is valid
   * 02:59 is valid
   * 02:22AM is not
   */
  function checkValidTime (time) {
    if (typeof time !== 'string' ||
      time.indexOf(':') !== 2 ||
      time.length !== 5) return null
    var hours = parseInt(time.substr(0,2))
    var min = parseInt(time.substr(3))
    return { hours: hours, minutes: min}
  }
  function checkValidDays (dias) {
    var semana = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
    var rtrn = []
    if (!(dias instanceof Array)) return []
    for (var i = 0; i < dias.length; i++) {
      var lower = dias[i].toString().toLowerCase()
      if (lower.length === 2 && semana.includes(lower)) rtrn.push(lower)
    }
    return rtrn
  }

  var Interval = function (starttime, duration, interval) {
    this.starttime = checkValidTime(starttime) || { hours: 0, minutes: 0}
    this.duration = checkValidTime(duration) || { hours: 0, minutes: 0}
    this.interval = checkValidDays(interval)
  }

  SVL.set(['planning', 'Event'], Event)
  SVL.set(['planning', 'Goals'], Goals)
}(typeof window !== 'undefined' ? window : global))
