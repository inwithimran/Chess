! function () {
	"use strict";
	var e = function () {
		this.init()
	};
	e.prototype = {
		init: function () {
			var e = this || n;
			return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e
		},
		volume: function (e) {
			var o = this || n;
			if(e = parseFloat(e), o.ctx || _(), void 0 !== e && e >= 0 && e <= 1) {
				if(o._volume = e, o._muted) return o;
				o.usingWebAudio && (o.masterGain.gain.value = e);
				for(var t = 0; t < o._howls.length; t++)
					if(!o._howls[t]._webAudio)
						for(var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
							var i = o._howls[t]._soundById(r[a]);
							i && i._node && (i._node.volume = i._volume * e)
						}
				return o
			}
			return o._volume
		},
		mute: function (e) {
			var o = this || n;
			o.ctx || _(), o._muted = e, o.usingWebAudio && (o.masterGain.gain.value = e ? 0 : o._volume);
			for(var t = 0; t < o._howls.length; t++)
				if(!o._howls[t]._webAudio)
					for(var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
						var i = o._howls[t]._soundById(r[a]);
						i && i._node && (i._node.muted = !!e || i._muted)
					}
			return o
		},
		unload: function () {
			for(var e = this || n, o = e._howls.length - 1; o >= 0; o--) e._howls[o].unload();
			return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e
		},
		codecs: function (e) {
			return (this || n)._codecs[e.replace(/^x-/, "")]
		},
		_setup: function () {
			var e = this || n;
			if(e.state = e.ctx && e.ctx.state || "running", e._autoSuspend(), !e.usingWebAudio)
				if("undefined" != typeof Audio) try {
					void 0 === (new Audio).oncanplaythrough && (e._canPlayEvent = "canplay")
				} catch (n) {
					e.noAudio = !0
				} else e.noAudio = !0;
			try {
				(new Audio).muted && (e.noAudio = !0)
			} catch (e) {}
			return e.noAudio || e._setupCodecs(), e
		},
		_setupCodecs: function () {
			var e = this || n,
				o = null;
			try {
				o = "undefined" != typeof Audio ? new Audio : null
			} catch (n) {
				return e
			}
			if(!o || "function" != typeof o.canPlayType) return e;
			var t = o.canPlayType("audio/mpeg;").replace(/^no$/, ""),
				r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
				a = r && parseInt(r[0].split("/")[1], 10) < 33;
			return e._codecs = {
				mp3: !(a || !t && !o.canPlayType("audio/mp3;").replace(/^no$/, "")),
				mpeg: !!t,
				opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
				ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
				oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
				wav: !!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
				aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""),
				caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""),
				m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
				mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
				weba: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
				webm: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
				dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
				flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "")
			}, e
		},
		_enableMobileAudio: function () {
			var e = this || n,
				o = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent),
				t = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);
			if(!e._mobileEnabled && e.ctx && (o || t)) {
				e._mobileEnabled = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
				var r = function () {
					n._autoResume();
					var o = e.ctx.createBufferSource();
					o.buffer = e._scratchBuffer, o.connect(e.ctx.destination), void 0 === o.start ? o.noteOn(0) : o.start(0), "function" == typeof e.ctx.resume && e.ctx.resume(), o.onended = function () {
						o.disconnect(0), e._mobileEnabled = !0, e.mobileAutoEnable = !1, document.removeEventListener("touchend", r, !0)
					}
				};
				return document.addEventListener("touchend", r, !0), e
			}
		},
		_autoSuspend: function () {
			var e = this;
			if(e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) {
				for(var o = 0; o < e._howls.length; o++)
					if(e._howls[o]._webAudio)
						for(var t = 0; t < e._howls[o]._sounds.length; t++)
							if(!e._howls[o]._sounds[t]._paused) return e;
				return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function () {
					e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function () {
						e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume())
					}))
				}, 3e4), e
			}
		},
		_autoResume: function () {
			var e = this;
			if(e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio) return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function () {
				e.state = "running";
				for(var n = 0; n < e._howls.length; n++) e._howls[n]._emit("resume")
			}), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e
		}
	};
	var n = new e,
		o = function (e) {
			e.src && 0 !== e.src.length ? this.init(e) : console.error("An array of source files must be passed with any new Howl.")
		};
	o.prototype = {
		init: function (e) {
			var o = this;
			return n.ctx || _(), o._autoplay = e.autoplay || !1, o._format = "string" != typeof e.format ? e.format : [e.format], o._html5 = e.html5 || !1, o._muted = e.mute || !1, o._loop = e.loop || !1, o._pool = e.pool || 5, o._preload = "boolean" != typeof e.preload || e.preload, o._rate = e.rate || 1, o._sprite = e.sprite || {}, o._src = "string" != typeof e.src ? e.src : [e.src], o._volume = void 0 !== e.volume ? e.volume : 1, o._duration = 0, o._state = "unloaded", o._sounds = [], o._endTimers = {}, o._queue = [], o._onend = e.onend ? [{
				fn: e.onend
			}] : [], o._onfade = e.onfade ? [{
				fn: e.onfade
			}] : [], o._onload = e.onload ? [{
				fn: e.onload
			}] : [], o._onloaderror = e.onloaderror ? [{
				fn: e.onloaderror
			}] : [], o._onpause = e.onpause ? [{
				fn: e.onpause
			}] : [], o._onplay = e.onplay ? [{
				fn: e.onplay
			}] : [], o._onstop = e.onstop ? [{
				fn: e.onstop
			}] : [], o._onmute = e.onmute ? [{
				fn: e.onmute
			}] : [], o._onvolume = e.onvolume ? [{
				fn: e.onvolume
			}] : [], o._onrate = e.onrate ? [{
				fn: e.onrate
			}] : [], o._onseek = e.onseek ? [{
				fn: e.onseek
			}] : [], o._onresume = [], o._webAudio = n.usingWebAudio && !o._html5, void 0 !== n.ctx && n.ctx && n.mobileAutoEnable && n._enableMobileAudio(), n._howls.push(o), o._autoplay && o._queue.push({
				event: "play",
				action: function () {
					o.play()
				}
			}), o._preload && o.load(), o
		},
		load: function () {
			var e = this,
				o = null;
			if(!n.noAudio) {
				"string" == typeof e._src && (e._src = [e._src]);
				for(var r = 0; r < e._src.length; r++) {
					var i, u;
					if(e._format && e._format[r]) i = e._format[r];
					else {
						if("string" != typeof (u = e._src[r])) {
							e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
							continue
						}(i = /^data:audio\/([^;,]+);/i.exec(u)) || (i = /\.([^.]+)$/.exec(u.split("?", 1)[0])), i && (i = i[1].toLowerCase())
					}
					if(i || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), i && n.codecs(i)) {
						o = e._src[r];
						break
					}
				}
				return o ? (e._src = o, e._state = "loading", "https:" === window.location.protocol && "http:" === o.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new t(e), e._webAudio && a(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
			}
			e._emit("loaderror", null, "No audio support.")
		},
		play: function (e, o) {
			var t = this,
				r = null;
			if("number" == typeof e) r = e, e = null;
			else {
				if("string" == typeof e && "loaded" === t._state && !t._sprite[e]) return null;
				if(void 0 === e) {
					e = "__default";
					for(var a = 0, i = 0; i < t._sounds.length; i++) t._sounds[i]._paused && !t._sounds[i]._ended && (a++, r = t._sounds[i]._id);
					1 === a ? e = null : r = null
				}
			}
			var u = r ? t._soundById(r) : t._inactiveSound();
			if(!u) return null;
			if(r && !e && (e = u._sprite || "__default"), "loaded" !== t._state) {
				u._sprite = e, u._ended = !1;
				var d = u._id;
				return t._queue.push({
					event: "play",
					action: function () {
						t.play(d)
					}
				}), d
			}
			if(r && !u._paused) return o || setTimeout(function () {
				t._emit("play", u._id)
			}, 0), u._id;
			t._webAudio && n._autoResume();
			var _ = Math.max(0, u._seek > 0 ? u._seek : t._sprite[e][0] / 1e3),
				s = Math.max(0, (t._sprite[e][0] + t._sprite[e][1]) / 1e3 - _),
				l = 1e3 * s / Math.abs(u._rate);
			u._paused = !1, u._ended = !1, u._sprite = e, u._seek = _, u._start = t._sprite[e][0] / 1e3, u._stop = (t._sprite[e][0] + t._sprite[e][1]) / 1e3, u._loop = !(!u._loop && !t._sprite[e][2]);
			var c = u._node;
			if(t._webAudio) {
				var f = function () {
						t._refreshBuffer(u);
						var e = u._muted || t._muted ? 0 : u._volume;
						c.gain.setValueAtTime(e, n.ctx.currentTime), u._playStart = n.ctx.currentTime, void 0 === c.bufferSource.start ? u._loop ? c.bufferSource.noteGrainOn(0, _, 86400) : c.bufferSource.noteGrainOn(0, _, s) : u._loop ? c.bufferSource.start(0, _, 86400) : c.bufferSource.start(0, _, s), l !== 1 / 0 && (t._endTimers[u._id] = setTimeout(t._ended.bind(t, u), l)), o || setTimeout(function () {
							t._emit("play", u._id)
						}, 0)
					},
					p = "running" === n.state;
				if("loaded" === t._state && p) f();
				else {
					var v = p || "loaded" !== t._state ? "load" : "resume";
					t.once(v, f, p ? u._id : null), t._clearTimer(u._id)
				}
			} else {
				var m = function () {
						c.currentTime = _, c.muted = u._muted || t._muted || n._muted || c.muted, c.volume = u._volume * n.volume(), c.playbackRate = u._rate, c.play(), l !== 1 / 0 && (t._endTimers[u._id] = setTimeout(t._ended.bind(t, u), l)), o || t._emit("play", u._id)
					},
					h = "loaded" === t._state && (window && window.ejecta || !c.readyState && n._navigator.isCocoonJS);
				if(4 === c.readyState || h) m();
				else {
					var g = function () {
						m(), c.removeEventListener(n._canPlayEvent, g, !1)
					};
					c.addEventListener(n._canPlayEvent, g, !1), t._clearTimer(u._id)
				}
			}
			return u._id
		},
		pause: function (e) {
			var n = this;
			if("loaded" !== n._state) return n._queue.push({
				event: "pause",
				action: function () {
					n.pause(e)
				}
			}), n;
			for(var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
				n._clearTimer(o[t]);
				var r = n._soundById(o[t]);
				if(r && !r._paused && (r._seek = n.seek(o[t]), r._rateSeek = 0, r._paused = !0, n._stopFade(o[t]), r._node))
					if(n._webAudio) {
						if(!r._node.bufferSource) continue;
						void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node)
					} else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
				arguments[1] || n._emit("pause", r ? r._id : null)
			}
			return n
		},
		stop: function (e, n) {
			var o = this;
			if("loaded" !== o._state) return o._queue.push({
				event: "stop",
				action: function () {
					o.stop(e)
				}
			}), o;
			for(var t = o._getSoundIds(e), r = 0; r < t.length; r++) {
				o._clearTimer(t[r]);
				var a = o._soundById(t[r]);
				a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, o._stopFade(t[r]), a._node && (o._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), o._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0, a._node.pause())), n || o._emit("stop", a._id))
			}
			return o
		},
		mute: function (e, o) {
			var t = this;
			if("loaded" !== t._state) return t._queue.push({
				event: "mute",
				action: function () {
					t.mute(e, o)
				}
			}), t;
			if(void 0 === o) {
				if("boolean" != typeof e) return t._muted;
				t._muted = e
			}
			for(var r = t._getSoundIds(o), a = 0; a < r.length; a++) {
				var i = t._soundById(r[a]);
				i && (i._muted = e, t._webAudio && i._node ? i._node.gain.setValueAtTime(e ? 0 : i._volume, n.ctx.currentTime) : i._node && (i._node.muted = !!n._muted || e), t._emit("mute", i._id))
			}
			return t
		},
		volume: function () {
			var e, o, t, r = this,
				a = arguments;
			if(0 === a.length) return r._volume;
			if(1 === a.length || 2 === a.length && void 0 === a[1] ? r._getSoundIds().indexOf(a[0]) >= 0 ? o = parseInt(a[0], 10) : e = parseFloat(a[0]) : a.length >= 2 && (e = parseFloat(a[0]), o = parseInt(a[1], 10)), !(void 0 !== e && e >= 0 && e <= 1)) return (t = o ? r._soundById(o) : r._sounds[0]) ? t._volume : 0;
			if("loaded" !== r._state) return r._queue.push({
				event: "volume",
				action: function () {
					r.volume.apply(r, a)
				}
			}), r;
			void 0 === o && (r._volume = e), o = r._getSoundIds(o);
			for(var i = 0; i < o.length; i++)(t = r._soundById(o[i])) && (t._volume = e, a[2] || r._stopFade(o[i]), r._webAudio && t._node && !t._muted ? t._node.gain.setValueAtTime(e, n.ctx.currentTime) : t._node && !t._muted && (t._node.volume = e * n.volume()), r._emit("volume", t._id));
			return r
		},
		fade: function (e, o, t, r) {
			var a = this,
				i = Math.abs(e - o),
				u = e > o ? "out" : "in",
				d = i / .01,
				_ = d > 0 ? t / d : t;
			if(_ < 4 && (d = Math.ceil(d / (4 / _)), _ = 4), "loaded" !== a._state) return a._queue.push({
				event: "fade",
				action: function () {
					a.fade(e, o, t, r)
				}
			}), a;
			a.volume(e, r);
			for(var s = a._getSoundIds(r), l = 0; l < s.length; l++) {
				var c = a._soundById(s[l]);
				if(c) {
					if(r || a._stopFade(s[l]), a._webAudio && !c._muted) {
						var f = n.ctx.currentTime,
							p = f + t / 1e3;
						c._volume = e, c._node.gain.setValueAtTime(e, f), c._node.gain.linearRampToValueAtTime(o, p)
					}
					var v = e;
					c._interval = setInterval(function (n, t) {
						d > 0 && (v += "in" === u ? .01 : -.01), v = Math.max(0, v), v = Math.min(1, v), v = Math.round(100 * v) / 100, a._webAudio ? (void 0 === r && (a._volume = v), t._volume = v) : a.volume(v, n, !0), (o < e && v <= o || o > e && v >= o) && (clearInterval(t._interval), t._interval = null, a.volume(o, n), a._emit("fade", n))
					}.bind(a, s[l], c), _)
				}
			}
			return a
		},
		_stopFade: function (e) {
			var o = this,
				t = o._soundById(e);
			return t && t._interval && (o._webAudio && t._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(t._interval), t._interval = null, o._emit("fade", e)), o
		},
		loop: function () {
			var e, n, o, t = this,
				r = arguments;
			if(0 === r.length) return t._loop;
			if(1 === r.length) {
				if("boolean" != typeof r[0]) return !!(o = t._soundById(parseInt(r[0], 10))) && o._loop;
				e = r[0], t._loop = e
			} else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));
			for(var a = t._getSoundIds(n), i = 0; i < a.length; i++)(o = t._soundById(a[i])) && (o._loop = e, t._webAudio && o._node && o._node.bufferSource && (o._node.bufferSource.loop = e, e && (o._node.bufferSource.loopStart = o._start || 0, o._node.bufferSource.loopEnd = o._stop)));
			return t
		},
		rate: function () {
			var e, o, t, r = this,
				a = arguments;
			if(0 === a.length) o = r._sounds[0]._id;
			else if(1 === a.length) {
				r._getSoundIds().indexOf(a[0]) >= 0 ? o = parseInt(a[0], 10) : e = parseFloat(a[0])
			} else 2 === a.length && (e = parseFloat(a[0]), o = parseInt(a[1], 10));
			if("number" != typeof e) return (t = r._soundById(o)) ? t._rate : r._rate;
			if("loaded" !== r._state) return r._queue.push({
				event: "rate",
				action: function () {
					r.rate.apply(r, a)
				}
			}), r;
			void 0 === o && (r._rate = e), o = r._getSoundIds(o);
			for(var i = 0; i < o.length; i++)
				if(t = r._soundById(o[i])) {
					t._rateSeek = r.seek(o[i]), t._playStart = r._webAudio ? n.ctx.currentTime : t._playStart, t._rate = e, r._webAudio && t._node && t._node.bufferSource ? t._node.bufferSource.playbackRate.value = e : t._node && (t._node.playbackRate = e);
					var u = r.seek(o[i]),
						d = 1e3 * ((r._sprite[t._sprite][0] + r._sprite[t._sprite][1]) / 1e3 - u) / Math.abs(t._rate);
					!r._endTimers[o[i]] && t._paused || (r._clearTimer(o[i]), r._endTimers[o[i]] = setTimeout(r._ended.bind(r, t), d)), r._emit("rate", t._id)
				} return r
		},
		seek: function () {
			var e, o, t = this,
				r = arguments;
			if(0 === r.length) o = t._sounds[0]._id;
			else if(1 === r.length) {
				t._getSoundIds().indexOf(r[0]) >= 0 ? o = parseInt(r[0], 10) : (o = t._sounds[0]._id, e = parseFloat(r[0]))
			} else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
			if(void 0 === o) return t;
			if("loaded" !== t._state) return t._queue.push({
				event: "seek",
				action: function () {
					t.seek.apply(t, r)
				}
			}), t;
			var a = t._soundById(o);
			if(a) {
				if(!("number" == typeof e && e >= 0)) {
					if(t._webAudio) {
						var i = t.playing(o) ? n.ctx.currentTime - a._playStart : 0,
							u = a._rateSeek ? a._rateSeek - a._seek : 0;
						return a._seek + (u + i * Math.abs(a._rate))
					}
					return a._node.currentTime
				}
				var d = t.playing(o);
				d && t.pause(o, !0), a._seek = e, a._ended = !1, t._clearTimer(o), d && t.play(o, !0), !t._webAudio && a._node && (a._node.currentTime = e), t._emit("seek", o)
			}
			return t
		},
		playing: function (e) {
			var n = this;
			if("number" == typeof e) {
				var o = n._soundById(e);
				return !!o && !o._paused
			}
			for(var t = 0; t < n._sounds.length; t++)
				if(!n._sounds[t]._paused) return !0;
			return !1
		},
		duration: function (e) {
			var n = this,
				o = n._duration,
				t = n._soundById(e);
			return t && (o = n._sprite[t._sprite][1] / 1e3), o
		},
		state: function () {
			return this._state
		},
		unload: function () {
			for(var e = this, o = e._sounds, t = 0; t < o.length; t++) {
				o[t]._paused || e.stop(o[t]._id), e._webAudio || (/MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (o[t]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), o[t]._node.removeEventListener("error", o[t]._errorFn, !1), o[t]._node.removeEventListener(n._canPlayEvent, o[t]._loadFn, !1)), delete o[t]._node, e._clearTimer(o[t]._id);
				var a = n._howls.indexOf(e);
				a >= 0 && n._howls.splice(a, 1)
			}
			var i = !0;
			for(t = 0; t < n._howls.length; t++)
				if(n._howls[t]._src === e._src) {
					i = !1;
					break
				} return r && i && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null
		},
		on: function (e, n, o, t) {
			var r = this["_on" + e];
			return "function" == typeof n && r.push(t ? {
				id: o,
				fn: n,
				once: t
			} : {
				id: o,
				fn: n
			}), this
		},
		off: function (e, n, o) {
			var t = this,
				r = t["_on" + e],
				a = 0;
			if("number" == typeof n && (o = n, n = null), n || o)
				for(a = 0; a < r.length; a++) {
					var i = o === r[a].id;
					if(n === r[a].fn && i || !n && i) {
						r.splice(a, 1);
						break
					}
				} else if(e) t["_on" + e] = [];
				else {
					var u = Object.keys(t);
					for(a = 0; a < u.length; a++) 0 === u[a].indexOf("_on") && Array.isArray(t[u[a]]) && (t[u[a]] = [])
				} return t
		},
		once: function (e, n, o) {
			return this.on(e, n, o, 1), this
		},
		_emit: function (e, n, o) {
			for(var t = this, r = t["_on" + e], a = r.length - 1; a >= 0; a--) r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function (e) {
				e.call(this, n, o)
			}.bind(t, r[a].fn), 0), r[a].once && t.off(e, r[a].fn, r[a].id));
			return t
		},
		_loadQueue: function () {
			var e = this;
			if(e._queue.length > 0) {
				var n = e._queue[0];
				e.once(n.event, function () {
					e._queue.shift(), e._loadQueue()
				}), n.action()
			}
			return e
		},
		_ended: function (e) {
			var o = this,
				t = e._sprite;
			if(!o._webAudio && o._node && !o._node.ended) return setTimeout(o._ended.bind(o, e), 100), o;
			var r = !(!e._loop && !o._sprite[t][2]);
			if(o._emit("end", e._id), !o._webAudio && r && o.stop(e._id, !0).play(e._id), o._webAudio && r) {
				o._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;
				var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
				o._endTimers[e._id] = setTimeout(o._ended.bind(o, e), a)
			}
			return o._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, o._clearTimer(e._id), o._cleanBuffer(e._node), n._autoSuspend()), o._webAudio || r || o.stop(e._id), o
		},
		_clearTimer: function (e) {
			var n = this;
			return n._endTimers[e] && (clearTimeout(n._endTimers[e]), delete n._endTimers[e]), n
		},
		_soundById: function (e) {
			for(var n = this, o = 0; o < n._sounds.length; o++)
				if(e === n._sounds[o]._id) return n._sounds[o];
			return null
		},
		_inactiveSound: function () {
			var e = this;
			e._drain();
			for(var n = 0; n < e._sounds.length; n++)
				if(e._sounds[n]._ended) return e._sounds[n].reset();
			return new t(e)
		},
		_drain: function () {
			var e = this,
				n = e._pool,
				o = 0,
				t = 0;
			if(!(e._sounds.length < n)) {
				for(t = 0; t < e._sounds.length; t++) e._sounds[t]._ended && o++;
				for(t = e._sounds.length - 1; t >= 0; t--) {
					if(o <= n) return;
					e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0), e._sounds.splice(t, 1), o--)
				}
			}
		},
		_getSoundIds: function (e) {
			if(void 0 === e) {
				for(var n = [], o = 0; o < this._sounds.length; o++) n.push(this._sounds[o]._id);
				return n
			}
			return [e]
		},
		_refreshBuffer: function (e) {
			return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[this._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.value = e._rate, this
		},
		_cleanBuffer: function (e) {
			var n = this;
			if(n._scratchBuffer) {
				e.bufferSource.onended = null, e.bufferSource.disconnect(0);
				try {
					e.bufferSource.buffer = n._scratchBuffer
				} catch (e) {}
			}
			return e.bufferSource = null, n
		}
	};
	var t = function (e) {
		this._parent = e, this.init()
	};
	t.prototype = {
		init: function () {
			var e = this,
				o = e._parent;
			return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, o._sounds.push(e), e.create(), e
		},
		create: function () {
			var e = this,
				o = e._parent,
				t = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
			return o._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(t, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._node.src = o._src, e._node.preload = "auto", e._node.volume = t * n.volume(), e._node.load()), e
		},
		reset: function () {
			var e = this,
				o = e._parent;
			return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e
		},
		_errorListener: function () {
			var e = this;
			e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1)
		},
		_loadListener: function () {
			var e = this,
				o = e._parent;
			o._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(o._sprite).length && (o._sprite = {
				__default: [0, 1e3 * o._duration]
			}), "loaded" !== o._state && (o._state = "loaded", o._emit("load"), o._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1)
		}
	};
	var r = {},
		a = function (e) {
			var n = e._src;
			if(r[n]) return e._duration = r[n].duration, void d(e);
			if(/^data:[^;]+;base64,/.test(n)) {
				for(var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), a = 0; a < o.length; ++a) t[a] = o.charCodeAt(a);
				u(t.buffer, e)
			} else {
				var _ = new XMLHttpRequest;
				_.open("GET", n, !0), _.responseType = "arraybuffer", _.onload = function () {
					var n = (_.status + "")[0];
					"0" === n || "2" === n || "3" === n ? u(_.response, e) : e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".")
				}, _.onerror = function () {
					e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load())
				}, i(_)
			}
		},
		i = function (e) {
			try {
				e.send()
			} catch (n) {
				e.onerror()
			}
		},
		u = function (e, o) {
			n.ctx.decodeAudioData(e, function (e) {
				e && o._sounds.length > 0 && (r[o._src] = e, d(o, e))
			}, function () {
				o._emit("loaderror", null, "Decoding audio data failed.")
			})
		},
		d = function (e, n) {
			n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = {
				__default: [0, 1e3 * e._duration]
			}), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue())
		},
		_ = function () {
			try {
				"undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1
			} catch (e) {
				n.usingWebAudio = !1
			}
			var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform),
				o = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
				t = o ? parseInt(o[1], 10) : null;
			if(e && t && t < 9) {
				var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
				(n._navigator && n._navigator.standalone && !r || n._navigator && !n._navigator.standalone && !r) && (n.usingWebAudio = !1)
			}
			n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.value = n._muted ? 0 : 1, n.masterGain.connect(n.ctx.destination)), n._setup()
		};
	"function" == typeof define && define.amd && define([], function () {
		return {
			Howler: n,
			Howl: o
		}
	}), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = o), "undefined" != typeof window ? (window.HowlerGlobal = e, window.Howler = n, window.Howl = o, window.Sound = t) : "undefined" != typeof global && (global.HowlerGlobal = e, global.Howler = n, global.Howl = o, global.Sound = t)
}();





!function () {
	"use strict";
	HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function (e) {
		var n = this;
		if(!n.ctx || !n.ctx.listener) return n;
		for(var o = n._howls.length - 1; o >= 0; o--) n._howls[o].stereo(e);
		return n
	}, HowlerGlobal.prototype.pos = function (e, n, o) {
		var t = this;
		return t.ctx && t.ctx.listener ? (n = "number" != typeof n ? t._pos[1] : n, o = "number" != typeof o ? t._pos[2] : o, "number" != typeof e ? t._pos : (t._pos = [e, n, o], t.ctx.listener.setPosition(t._pos[0], t._pos[1], t._pos[2]), t)) : t
	}, HowlerGlobal.prototype.orientation = function (e, n, o, t, r, a) {
		var i = this;
		if(!i.ctx || !i.ctx.listener) return i;
		var u = i._orientation;
		return n = "number" != typeof n ? u[1] : n, o = "number" != typeof o ? u[2] : o, t = "number" != typeof t ? u[3] : t, r = "number" != typeof r ? u[4] : r, a = "number" != typeof a ? u[5] : a, "number" != typeof e ? u : (i._orientation = [e, n, o, t, r, a], i.ctx.listener.setOrientation(e, n, o, t, r, a), i)
	}, Howl.prototype.init = function (e) {
		return function (n) {
			var o = this;
			return o._orientation = n.orientation || [1, 0, 0], o._stereo = n.stereo || null, o._pos = n.pos || null, o._pannerAttr = {
				coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : 360,
				coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : 360,
				coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : 0,
				distanceModel: void 0 !== n.distanceModel ? n.distanceModel : "inverse",
				maxDistance: void 0 !== n.maxDistance ? n.maxDistance : 1e4,
				panningModel: void 0 !== n.panningModel ? n.panningModel : "HRTF",
				refDistance: void 0 !== n.refDistance ? n.refDistance : 1,
				rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : 1
			}, o._onstereo = n.onstereo ? [{
				fn: n.onstereo
			}] : [], o._onpos = n.onpos ? [{
				fn: n.onpos
			}] : [], o._onorientation = n.onorientation ? [{
				fn: n.onorientation
			}] : [], e.call(this, n)
		}
	}(Howl.prototype.init), Howl.prototype.stereo = function (n, o) {
		var t = this;
		if(!t._webAudio) return t;
		if("loaded" !== t._state) return t._queue.push({
			event: "stereo",
			action: function () {
				t.stereo(n, o)
			}
		}), t;
		var r = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
		if(void 0 === o) {
			if("number" != typeof n) return t._stereo;
			t._stereo = n, t._pos = [n, 0, 0]
		}
		for(var a = t._getSoundIds(o), i = 0; i < a.length; i++) {
			var u = t._soundById(a[i]);
			if(u) {
				if("number" != typeof n) return u._stereo;
				u._stereo = n, u._pos = [n, 0, 0], u._node && (u._pannerAttr.panningModel = "equalpower", u._panner && u._panner.pan || e(u, r), "spatial" === r ? u._panner.setPosition(n, 0, 0) : u._panner.pan.value = n), t._emit("stereo", u._id)
			}
		}
		return t
	}, Howl.prototype.pos = function (n, o, t, r) {
		var a = this;
		if(!a._webAudio) return a;
		if("loaded" !== a._state) return a._queue.push({
			event: "pos",
			action: function () {
				a.pos(n, o, t, r)
			}
		}), a;
		if(o = "number" != typeof o ? 0 : o, t = "number" != typeof t ? -.5 : t, void 0 === r) {
			if("number" != typeof n) return a._pos;
			a._pos = [n, o, t]
		}
		for(var i = a._getSoundIds(r), u = 0; u < i.length; u++) {
			var d = a._soundById(i[u]);
			if(d) {
				if("number" != typeof n) return d._pos;
				d._pos = [n, o, t], d._node && (d._panner && !d._panner.pan || e(d, "spatial"), d._panner.setPosition(n, o, t)), a._emit("pos", d._id)
			}
		}
		return a
	}, Howl.prototype.orientation = function (n, o, t, r) {
		var a = this;
		if(!a._webAudio) return a;
		if("loaded" !== a._state) return a._queue.push({
			event: "orientation",
			action: function () {
				a.orientation(n, o, t, r)
			}
		}), a;
		if(o = "number" != typeof o ? a._orientation[1] : o, t = "number" != typeof t ? a._orientation[2] : t, void 0 === r) {
			if("number" != typeof n) return a._orientation;
			a._orientation = [n, o, t]
		}
		for(var i = a._getSoundIds(r), u = 0; u < i.length; u++) {
			var d = a._soundById(i[u]);
			if(d) {
				if("number" != typeof n) return d._orientation;
				d._orientation = [n, o, t], d._node && (d._panner || (d._pos || (d._pos = a._pos || [0, 0, -.5]), e(d, "spatial")), d._panner.setOrientation(n, o, t)), a._emit("orientation", d._id)
			}
		}
		return a
	}, Howl.prototype.pannerAttr = function () {
		var n, o, t, r = this,
			a = arguments;
		if(!r._webAudio) return r;
		if(0 === a.length) return r._pannerAttr;
		if(1 === a.length) {
			if("object" != typeof a[0]) return (t = r._soundById(parseInt(a[0], 10))) ? t._pannerAttr : r._pannerAttr;
			n = a[0], void 0 === o && (r._pannerAttr = {
				coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : r._coneInnerAngle,
				coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : r._coneOuterAngle,
				coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : r._coneOuterGain,
				distanceModel: void 0 !== n.distanceModel ? n.distanceModel : r._distanceModel,
				maxDistance: void 0 !== n.maxDistance ? n.maxDistance : r._maxDistance,
				panningModel: void 0 !== n.panningModel ? n.panningModel : r._panningModel,
				refDistance: void 0 !== n.refDistance ? n.refDistance : r._refDistance,
				rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : r._rolloffFactor
			})
		} else 2 === a.length && (n = a[0], o = parseInt(a[1], 10));
		for(var i = r._getSoundIds(o), u = 0; u < i.length; u++)
			if(t = r._soundById(i[u])) {
				var d = t._pannerAttr;
				d = {
					coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : d.coneInnerAngle,
					coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : d.coneOuterAngle,
					coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : d.coneOuterGain,
					distanceModel: void 0 !== n.distanceModel ? n.distanceModel : d.distanceModel,
					maxDistance: void 0 !== n.maxDistance ? n.maxDistance : d.maxDistance,
					panningModel: void 0 !== n.panningModel ? n.panningModel : d.panningModel,
					refDistance: void 0 !== n.refDistance ? n.refDistance : d.refDistance,
					rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : d.rolloffFactor
				};
				var _ = t._panner;
				_ ? (_.coneInnerAngle = d.coneInnerAngle, _.coneOuterAngle = d.coneOuterAngle, _.coneOuterGain = d.coneOuterGain, _.distanceModel = d.distanceModel, _.maxDistance = d.maxDistance, _.panningModel = d.panningModel, _.refDistance = d.refDistance, _.rolloffFactor = d.rolloffFactor) : (t._pos || (t._pos = r._pos || [0, 0, -.5]), e(t, "spatial"))
			} return r
	}, Sound.prototype.init = function (e) {
		return function () {
			var n = this,
				o = n._parent;
			n._orientation = o._orientation, n._stereo = o._stereo, n._pos = o._pos, n._pannerAttr = o._pannerAttr, e.call(this), n._stereo ? o.stereo(n._stereo) : n._pos && o.pos(n._pos[0], n._pos[1], n._pos[2], n._id)
		}
	}(Sound.prototype.init), Sound.prototype.reset = function (e) {
		return function () {
			var n = this,
				o = n._parent;
			return n._orientation = o._orientation, n._pos = o._pos, n._pannerAttr = o._pannerAttr, e.call(this)
		}
	}(Sound.prototype.reset);
	var e = function (e, n) {
		"spatial" === (n = n || "spatial") ? (e._panner = Howler.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.panningModel = e._pannerAttr.panningModel, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]), e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = Howler.ctx.createStereoPanner(), e._panner.pan.value = e._stereo), e._panner.connect(e._node), e._paused || e._parent.pause(e._id, !0).play(e._id)
	}
}();



