!(function (t) {
  var e = {},
    i = {};
  (t.startModule = function (t) {
    require(t).start();
  }),
    (t.define = function (t, i) {
      e[t] = i;
    }),
    (t.require = function (t) {
      return /\.js$/.test(t) || (t += ".js"), i[t] ? i[t] : (i[t] = e[t]({}));
    });
})(this),
  define("scripts/collide.js", function (t) {
    var e = require("scripts/factory/fruit"),
      i = (require("scripts/lib/ucren"), e.getFruitInView());
    function r(t) {
      return t * t;
    }
    function n(t) {
      return t < 0 ? -1 : t > 0 ? 1 : 0;
    }
    return (
      (t.check = function (t) {
        var e = [],
          s = 0;
        return (
          i.forEach(function (i) {
            var o,
              c =
                ((o = (function (t, e, i, s, o) {
                  if (!(s <= 0)) {
                    var c,
                      u = s,
                      h = s * (o = void 0 === o ? 1 : o);
                    if (
                      ((a = r(h) * r(t[0] - e[0]) + r(u) * r(t[1] - e[1])),
                      !(a <= 0) &&
                        ((b =
                          2 * r(h) * (e[0] - t[0]) * (t[0] - i[0]) +
                          2 * r(u) * (e[1] - t[1]) * (t[1] - i[1])),
                        (i =
                          r(h) * r(t[0] - i[0]) +
                          r(u) * r(t[1] - i[1]) -
                          r(u) * r(h)),
                        (c = (function (t, e, i) {
                          if (0 != t) {
                            var r = e * e - 4 * t * i;
                            return 0 == r
                              ? [(-1 * e) / (2 * t), (-1 * e) / (2 * t)]
                              : r > 0
                              ? [
                                  (-1 * e + Math.sqrt(r)) / (2 * t),
                                  (-1 * e - Math.sqrt(r)) / (2 * t),
                                ]
                              : void 0;
                          }
                        })(a, b, i))))
                    ) {
                      var l = [
                        [
                          t[0] + c[0] * (e[0] - t[0]),
                          t[1] + c[0] * (e[1] - t[1]),
                        ],
                        [
                          t[0] + c[1] * (e[0] - t[0]),
                          t[1] + c[1] * (e[1] - t[1]),
                        ],
                      ];
                      return (
                        (n(l[0][0] - t[0]) * n(l[0][0] - e[0]) <= 0 &&
                          n(l[0][1] - t[1]) * n(l[0][1] - e[1]) <= 0) ||
                          (l[0] = null),
                        (n(l[1][0] - t[0]) * n(l[1][0] - e[0]) <= 0 &&
                          n(l[1][1] - t[1]) * n(l[1][1] - e[1]) <= 0) ||
                          (l[1] = null),
                        l
                      );
                    }
                  }
                })(
                  t.slice(0, 2),
                  t.slice(2, 4),
                  [i.originX, i.originY],
                  i.radius,
                  void 0
                )),
                o && (o[0] || o[1]));
            c && (e[s++] = i);
          }),
          e
        );
      }),
      t
    );
  }),
  define("scripts/control.js", function (t) {
    var e,
      i,
      r = require("scripts/lib/ucren"),
      n = require("scripts/object/knife"),
      s = require("scripts/message"),
      o = require("scripts/state");
    return (
      (e = i = 0),
      (t.init = function () {
        this.fixCanvasPos(), this.installDragger(), this.installClicker();
      }),
      (t.installDragger = function () {
        var t = new r.BasicDrag({ type: "calc" });
        t.on("returnValue", function (t, r, o, a, c) {
          (c = n.through(o - e, a - i)) && s.postMessage(c, "slice");
        }),
          t.on("startDrag", function () {
            n.newKnife();
          }),
          t.bind(document.documentElement);
      }),
      (t.installClicker = function () {
        r.addEvent(document, "click", function () {
          o("click-enable").ison() && s.postMessage("click");
        });
      }),
      (t.fixCanvasPos = function () {
        var t = document.documentElement,
          n = function (r) {
            (e = (t.clientWidth - 640) / 2),
              (i = (t.clientHeight - 480) / 2 - 40);
          };
        n(), r.addEvent(window, "resize", n);
      }),
      t
    );
  }),
  define("scripts/game.js", function (t) {
    var e,
      i,
      r,
      n = require("scripts/timeline"),
      s = require("scripts/lib/ucren"),
      o = require("scripts/lib/sound"),
      a = require("scripts/factory/fruit"),
      c = require("scripts/object/score"),
      u = require("scripts/message"),
      h = require("scripts/state"),
      l = require("scripts/object/lose"),
      f = require("scripts/object/game-over"),
      d = require("scripts/object/knife"),
      p = require("scripts/object/background"),
      m = require("scripts/object/light"),
      g = 0,
      v = s.randomNumber,
      y = 2,
      b = 5,
      x = [],
      w = function () {
        if (!(x.length >= y)) {
          var t = v(640),
            e = v(640),
            r = a.create(t, 600).shotOut(0, e);
          x.push(r), i.play(), w();
        }
      };
    (t.start = function () {
      (i = o.create("sound/throw")),
        (r = o.create("sound/boom")),
        n.setTimeout(function () {
          h("game-state").set("playing"), (e = n.setInterval(w, 1e3));
        }, 500);
    }),
      (t.gameOver = function () {
        h("game-state").set("over"),
          e.stop(),
          f.show(),
          (g = 0),
          (y = 2),
          (x.length = 0);
      }),
      (t.applyScore = function (t) {
        t > y * b && (y++, (b += 50));
      }),
      (t.sliceAt = function (t, e) {
        var i;
        h("game-state").isnot("playing") ||
          ("boom" != t.type
            ? (t.broken(e),
              (i = x.indexOf(t)) && x.splice(i, 1),
              c.number(++g),
              this.applyScore(g))
            : (r.play(), this.pauseAllFruit(), p.wobble(), m.start(t)));
      }),
      (t.pauseAllFruit = function () {
        e.stop(), d.pause(), x.invoke("pause");
      }),
      u.addEventListener("fruit.remove", function (t) {
        var e;
        (e = x.indexOf(t)) > -1 && x.splice(e, 1);
      });
    var k = function (t) {
      "boom" != t.type && l.showLoseAt(t.originX);
    };
    return (
      h("game-state").hook(function (t) {
        "playing" == t
          ? u.addEventListener("fruit.fallOutOfViewer", k)
          : u.removeEventListener("fruit.fallOutOfViewer", k);
      }),
      u.addEventListener("game.over", function () {
        t.gameOver(), d.switchOn();
      }),
      u.addEventListener("overWhiteLight.show", function () {
        d.endAll();
        for (var t = x.length - 1; t >= 0; t--) x[t].remove();
        p.stop();
      }),
      u.addEventListener("click", function () {
        h("click-enable").off(),
          f.hide(),
          u.postMessage("home-menu", "sence.switchSence");
      }),
      t
    );
  }),
  define("scripts/layer.js", function (t) {
    var e = require("scripts/lib/raphael"),
      i = require("scripts/lib/ucren"),
      r = {},
      n = {
        default: s(),
        light: s(),
        knife: s(),
        fruit: s(),
        juice: s(),
        flash: s(),
        mask: s(),
      };
    function s() {
      return (s.num = ++s.num || 2);
    }
    return (
      (t.createImage = function (t, e, i, r, n, s) {
        return (t = this.getLayer(t)).image(e, i, r, n, s);
      }),
      (t.createText = function (t, e, r, n, s, o) {
        return (
          (t = this.getLayer(t)),
          i.isIe && (n += 2),
          t
            .text(r, n, e)
            .attr({
              fill: s || "#fff",
              "font-size": o || "14px",
              "font-family": "黑体",
              "text-anchor": "start",
            })
        );
      }),
      (t.getLayer = function (t) {
        var s, o;
        return (s = r[(t = t || "default")])
          ? s
          : ((o = i.makeElement("div", {
              class: "layer",
              style: "z-index: " + (n[t] || 0) + ";",
            })),
            i.Element("extra").add(o),
            (s = r[t] = e(o, 640, 480)));
      }),
      t
    );
  }),
  define("scripts/main.js", function (t) {
    var e,
      i,
      r = require("scripts/timeline"),
      n = require("scripts/tools"),
      s = require("scripts/sence"),
      o = require("scripts/lib/ucren"),
      a = require("scripts/lib/buzz"),
      c = require("scripts/control"),
      u = require("scripts/object/console"),
      h = require("scripts/message"),
      l = require("scripts/state"),
      f = require("scripts/game"),
      d = require("scripts/collide"),
      p = r.setTimeout.bind(r),
      m =
        ((i = 1e3),
        ((e = function (t) {
          p(function () {
            u.log(t);
          }, i),
            (i += 300);
        }).clear = function () {
          p(u.clear.bind(u), i), (i += 300);
        }),
        e);
    (t.start = function () {
      [r, s, c].invoke("init"),
        m("마우스 제어 스크립트 불러오는 중"),
        m("이미지 자원을 로드 중"),
        m("게임 스크립트 불러오는 중"),
        m("줄거리를 로드 중"),
        m("초기화 중"),
        m("게임을 시작 중"),
        m.clear(),
        p(s.switchSence.saturate(s, "home-menu"), 3e3);
    }),
      h.addEventListener("slice", function (t) {
        var e,
          i = d.check(t);
        i.length &&
          ((e = n.getAngleByRadian(
            n.pointToRadian(t.slice(0, 2), t.slice(2, 4))
          )),
          i.forEach(function (t) {
            h.postMessage(t, e, "slice.at");
          }));
      }),
      h.addEventListener("slice.at", function (t, e) {
        if (!l("sence-state").isnot("ready"))
          if (l("sence-name").is("game-body")) f.sliceAt(t, e);
          else if (
            l("sence-name").is("home-menu") &&
            (t.broken(e), t.isHomeMenu)
          )
            switch (1) {
              case t.isDojoIcon:
                s.switchSence("dojo-body");
                break;
              case t.isNewGameIcon:
                s.switchSence("game-body");
                break;
              case t.isQuitIcon:
                s.switchSence("quit-body");
            }
      });
    var g = "";
    return (
      o.isChrome ||
        (g =
          "$최상의 매끄러움을 위해 <span class='b'>Google Chrome</span>을 추천드립니다"),
      a.isSupported() || (g = g.replace("$", "브라우저가 지원되지 않습니다")),
      (g = g.replace("$", "")),
      o.Element("browser").html(g),
      t
    );
  }),
  define("scripts/message.js", function (t) {
    var e = require("scripts/lib/ucren");
    return (
      (t.postMessage = function (t, i) {
        var r = [].slice.call(arguments, 0),
          n = r.length - 1;
        (i = r[n]), r.slice(0, n), e.dispatch(i, r);
      }),
      (t.addEventListener = function (t, i) {
        e.dispatch(t, i);
      }),
      (t.removeEventListener = function (t, i) {
        e.dispatch.remove(t, i);
      }),
      t
    );
  }),
  define("scripts/sence.js", function (t) {
    require("scripts/lib/ucren");
    var e,
      i,
      r,
      n,
      s,
      o = require("scripts/lib/sound"),
      a = require("scripts/factory/fruit"),
      c = require("scripts/object/flash"),
      u = require("scripts/state"),
      h = require("scripts/message"),
      l = require("scripts/object/background"),
      f = (require("scripts/object/fps"), require("scripts/object/home-mask")),
      d = require("scripts/object/logo"),
      p = require("scripts/object/ninja"),
      m = require("scripts/object/home-desc"),
      g = require("scripts/object/dojo"),
      v = require("scripts/object/new-game"),
      y = require("scripts/object/quit"),
      b = require("scripts/object/new"),
      x = require("scripts/object/score"),
      w = require("scripts/object/lose"),
      k = require("scripts/game"),
      T = require("scripts/object/developing"),
      E = require("scripts/object/game-over"),
      S = ((h = require("scripts/message")), require("scripts/timeline")),
      q = S.setTimeout.bind(S);
    return (
      S.setInterval.bind(S),
      (t.init = function () {
        (n = o.create("sound/menu")),
          (s = o.create("sound/start")),
          [l, f, d, p, m, g, b, v, y, x, w, T, E, c].invoke("set");
      }),
      (t.switchSence = function (e) {
        var i = u("sence-name"),
          r = u("sence-state");
        if (!i.is(e)) {
          var n = function () {
              switch ((i.set(e), r.set("entering"), e)) {
                case "home-menu":
                  this.showMenu(s);
                  break;
                case "dojo-body":
                  this.showDojo(s);
                  break;
                case "game-body":
                  this.showNewGame(s);
                  break;
                case "quit-body":
                  this.showQuit(s);
              }
            }.bind(this),
            s = function () {
              r.set("ready"),
                ("dojo-body" != e && "quit-body" != e) ||
                  t.switchSence("home-menu");
            };
          r.set("exiting"),
            i.isunset()
              ? n()
              : i.is("home-menu")
              ? this.hideMenu(n)
              : i.is("dojo-body")
              ? this.hideDojo(n)
              : i.is("game-body")
              ? this.hideNewGame(n)
              : i.is("quit-body") && this.hideQuit(n);
        }
      }),
      (t.showMenu = function (t) {
        var s = arguments.callee;
        (s.times = ++s.times || 1),
          (e = a.create("peach", 137, 333, !0)),
          (i = a.create("sandia", 330, 322, !0)),
          (r = a.create("boom", 552, 367, !0, 2500)),
          [e, i, r].forEach(function (t) {
            t.isHomeMenu = 1;
          }),
          (e.isDojoIcon = i.isNewGameIcon = r.isQuitIcon = 1),
          [
            [f, 0],
            [d, 0],
            [p, 500],
            [m, 1500],
            [g, 2e3],
            [v, 2e3],
            [y, 2e3],
            [b, 2e3],
            [e, 2e3],
            [i, 2e3],
            [r, 2e3],
          ].invoke("show"),
          [e, i].invoke("rotate", 2500),
          n.play(),
          q(t, 2500);
      }),
      (t.hideMenu = function (t) {
        [b, g, v, y].invoke("hide"),
          [f, d, p, m].invoke("hide"),
          [e, i, r].invoke("fallOff", 150),
          n.stop(),
          q(t, a.getDropTimeSetting());
      }),
      (t.showNewGame = function (t) {
        x.show(), w.show(), k.start(), s.play(), q(t, 1e3);
      }),
      (t.hideNewGame = function (t) {
        x.hide(), w.hide(), s.stop(), q(t, 1e3);
      }),
      (t.showDojo = function (t) {
        T.show(250), q(t, 1500);
      }),
      (t.hideDojo = function (t) {
        q(t, 1e3);
      }),
      (t.showQuit = function (t) {
        T.show(250), q(t, 1500);
      }),
      (t.hideQuit = function (t) {
        q(t, 1e3);
      }),
      h.addEventListener("sence.switchSence", function (e) {
        t.switchSence(e);
      }),
      t
    );
  }),
  define("scripts/state.js", function (t) {
    require("scripts/lib/ucren");
    var e = require("scripts/timeline"),
      i = {},
      r = {},
      n = {};
    return function (t) {
      return r[t]
        ? r[t]
        : (r[t] = {
            is: function (e) {
              return i[t] === e;
            },
            isnot: function (e) {
              return i[t] !== e;
            },
            ison: function () {
              return this.is(!0);
            },
            isoff: function () {
              return this.isnot(!0);
            },
            isunset: function () {
              return this.is(void 0);
            },
            set:
              ((s = NaN),
              function (e) {
                var r;
                if (((i[t] = e), s !== e && (r = n[t])))
                  for (var o = 0, a = r.length; o < a; o++) r[o].call(this, e);
                s = e;
              }),
            get: function () {
              return i[t];
            },
            on: function () {
              var t = this;
              return (
                t.set(!0),
                {
                  keep: function (i) {
                    e.setTimeout(t.set.saturate(t, !1), i);
                  },
                }
              );
            },
            off: function () {
              var t = this;
              return (
                t.set(!1),
                {
                  keep: function (i) {
                    e.setTimeout(t.set.saturate(t, !0), i);
                  },
                }
              );
            },
            hook: function (e) {
              var i;
              (i = n[t]) ? i.push(e) : (n[t] = [e]);
            },
            unhook: function () {},
          });
      var s;
    };
  }),
  define("scripts/timeline.js", function (t) {
    var e = require("scripts/lib/ucren"),
      i = {},
      r = {};
    class n {
      constructor() {
        (this.tasks = []), (this.addingTasks = []), (this.adding = 0);
      }
      init(t) {
        var e = this;
        if (!e.inited)
          return (
            (e.inited = 1),
            (e.startTime = s()),
            (e.intervalTime = t || 5),
            (e.count = 0),
            (e.intervalFn = function () {
              e.count++, e.update(s());
            }),
            e.start(),
            e
          );
      }
      createTask(t) {
        var e = o(t);
        return (
          this.addingTasks.unshift(e),
          (this.adding = 1),
          t.recycle && this.taskList(t.recycle, e),
          this.start(),
          e
        );
      }
      taskList(t, e) {
        return (
          t.clear ||
            (t.clear = function () {
              for (var t = this.length; t--; )
                (e = this[t]).stop(), this.splice(t, 1);
              return this;
            }),
          e && t.unshift(e),
          t
        );
      }
      setTimeout(t, e) {
        return this.createTask({ start: e, duration: 0, onTimeStart: t });
      }
      setInterval(t, e) {
        var i = setInterval(t, e);
        return {
          stop: function () {
            clearInterval(i);
          },
        };
      }
      getFPS() {
        var t = s(),
          e = this.count,
          i = (e / (t - this.startTime)) * 1e3;
        return e > 1e3 && ((this.count = 0), (this.startTime = t)), i;
      }
      start() {
        clearInterval(this.interval),
          (this.interval = setInterval(this.intervalFn, this.intervalTime));
      }
      stop() {
        clearInterval(this.interval);
      }
      update(t) {
        for (
          var e,
            i,
            r,
            n,
            s = this.tasks,
            o = this.addingTasks,
            u = this.adding,
            h = s.length;
          h--;

        )
          if (((r = (i = s[h]).start), (n = i.duration), t >= r)) {
            if (i.stopped) {
              s.splice(h, 1);
              continue;
            }
            c(i),
              (e = t - r) < n
                ? a(i, e)
                : (a(i, n),
                  i.onTimeEnd.apply(i.object, i.data.slice(1)),
                  s.splice(h, 1));
          }
        u && (s.unshift.apply(s, o), (o.length = u = 0)),
          s.length || this.stop();
      }
    }
    r.use = function (t) {
      var e;
      return (e = i[t]) ? e : (e = i[t] = new n());
    };
    var s = function () {
        return new Date().getTime();
      },
      o = function (t) {
        var i = t.object || {};
        return (
          (t.start = t.start || 0),
          {
            start: t.start + s(),
            duration: -1 == t.duration ? 864e5 : t.duration,
            data: t.data ? [0].concat(t.data) : [0],
            started: 0,
            object: i,
            onTimeStart: t.onTimeStart || i.onTimeStart || e.nul,
            onTimeUpdate: t.onTimeUpdate || i.onTimeUpdate || e.nul,
            onTimeEnd: t.onTimeEnd || i.onTimeEnd || e.nul,
            stop: function () {
              this.stopped = 1;
            },
          }
        );
      },
      a = function (t, e) {
        var i = t.data;
        (i[0] = e), t.onTimeUpdate.apply(t.object, i);
      },
      c = function (t) {
        t.started ||
          ((t.started = 1),
          t.onTimeStart.apply(t.object, t.data.slice(1)),
          a(t, 0));
      };
    return (
      ((t = r.use("default").init(10)).use = function (t) {
        return e.isIe, r.use(t);
      }),
      t
    );
  }),
  define("scripts/tools.js", function (t) {
    return (
      (t.unsetObject = function (t) {
        for (var e in t)
          t.hasOwnProperty(e) &&
            "function" == typeof t[e] &&
            (t[e] = function () {});
      }),
      (t.getAngleByRadian = function (t) {
        return (180 * t) / Math.PI;
      }),
      (t.pointToRadian = function (t, e) {
        var i = Math.PI;
        if (e[0] === t[0]) return e[1] > t[1] ? 0.5 * i : 1.5 * i;
        if (e[1] === t[1]) return e[0] > t[0] ? 0 : i;
        var r = Math.atan((t[1] - e[1]) / (t[0] - e[0]));
        return e[0] > t[0] && e[1] < t[1]
          ? r + 2 * i
          : e[0] > t[0] && e[1] > t[1]
          ? r
          : r + i;
      }),
      t
    );
  }),
  define("scripts/factory/displacement.js", function (t) {
    var e = require("scripts/layer"),
      i = require("scripts/timeline");
    return (
      require("scripts/lib/tween"),
      (t.create = function (t, r, n, s, o, a, c, u, h) {
        var l,
          f = {},
          d = {};
        "function" == typeof u ? (d.show = d.hide = u) : (d = u);
        var p = function (t, e, r, n, s, o, a, c) {
          i.createTask({
            start: t,
            duration: e,
            object: f,
            data: [r, n, s, o, a, c],
            onTimeUpdate: f.onTimeUpdate,
            onTimeStart: f.onTimeStart,
            onTimeEnd: f.onTimeEnd,
            recycle: f.anims,
          });
        };
        return (
          (f.anims = []),
          (f.set = function () {
            l = e.createImage("default", t, s, o, r, n);
          }),
          (f.show = function (t) {
            p(t, h, s, o, a, c, d.show, "show");
          }),
          (f.hide = function () {
            this.anims.clear(), p(0, h, a, c, s, o, d.hide, "hide");
          }),
          (f.onTimeUpdate = function (t, e, i, r, n, s) {
            l.attr({ x: s(t, e, r - e, h), y: s(t, i, n - i, h) });
          }),
          (f.onTimeStart = function () {}),
          (f.onTimeEnd = function (t, e, i, r, n) {
            "hide" === n && l.hide();
          }),
          f
        );
      }),
      t
    );
  }),
  define("scripts/factory/fruit.js", function (t) {
    var e,
      i = require("scripts/layer"),
      r = require("scripts/lib/ucren"),
      n = require("scripts/timeline").use("fruit").init(1),
      s = require("scripts/timeline").use("fruit-apart").init(1),
      o = require("scripts/lib/tween"),
      a = require("scripts/message"),
      c = require("scripts/object/flame"),
      u = require("scripts/object/flash"),
      h = require("scripts/factory/juice"),
      l = (r.isIe, r.isSafari, o.exponential.co),
      f = (o.circular, o.linear),
      d = o.quadratic.ci,
      p = o.quadratic.co,
      m = r.randomNumber,
      g = Math.min,
      v = 1200,
      y = {
        boom: ["images/fruit/boom.png", 66, 68, 26, 0, 0, null],
        peach: ["images/fruit/peach.png", 62, 59, 37, -50, 0, "#e6c731"],
        sandia: ["images/fruit/sandia.png", 98, 85, 38, -100, 0, "#c00"],
        apple: ["images/fruit/apple.png", 66, 66, 31, -54, 0, "#c8e925"],
        banana: ["images/fruit/banana.png", 126, 50, 43, 90, 0, null],
        basaha: ["images/fruit/basaha.png", 68, 72, 32, -135, 0, "#c00"],
      },
      b = ["peach", "sandia", "apple", "banana", "basaha"],
      x = [60, 50, 40, -40, -50, -60],
      w = [];
    class k {
      constructor(t) {
        var e = y[t.type][3];
        (this.type = t.type),
          (this.originX = t.originX),
          (this.originY = t.originY),
          (this.radius = e),
          (this.startX = t.originX),
          (this.startY = t.originY),
          (this.radius = e),
          (this.anims = []),
          "boom" === this.type &&
            (this.flame = c.create(
              this.startX - e + 4,
              this.startY - e + 5,
              t.flameStart || 0
            ));
      }
      set(t) {
        var e = y[this.type],
          r = this.radius;
        return (
          (this.shadow = i.createImage(
            "fruit",
            "images/shadow.png",
            this.startX - r,
            this.startY - r + 50,
            106,
            77
          )),
          (this.image = i.createImage(
            "fruit",
            e[0],
            this.startX - r,
            this.startY - r,
            e[1],
            e[2]
          )),
          t && (this.image.hide(), this.shadow.hide()),
          this
        );
      }
      pos(t, e) {
        if (t != this.originX || e != this.originY) {
          var i = this.radius;
          (this.originX = t),
            (this.originY = e),
            this.image.attr({ x: (t -= i), y: (e -= i) }),
            this.shadow.attr({ x: t, y: e + 50 }),
            "boom" === this.type && this.flame.pos(t + 4, e + 5);
        }
      }
      show(t) {
        n.createTask({
          start: t,
          duration: 500,
          data: [1e-5, 1, "show"],
          object: this,
          onTimeUpdate: this.onScaling,
          onTimeStart: this.onShowStart,
          recycle: this.anims,
        });
      }
      hide(t) {
        "boom" === this.type &&
          (this.anims.clear(),
          this.flame.remove(),
          n.createTask({
            start: t,
            duration: 500,
            data: [1, 1e-5, "hide"],
            object: this,
            onTimeUpdate: this.onScaling,
            onTimeEnd: this.onHideEnd,
            recycle: this.anims,
          }));
      }
      rotate(t, e) {
        (this.rotateSpeed = e || x[m(6)]),
          (this.rotateAnim = n.createTask({
            start: t,
            duration: -1,
            object: this,
            onTimeUpdate: this.onRotating,
            recycle: this.anims,
          }));
      }
      broken(t) {
        var e;
        this.brokend ||
          ((this.brokend = !0),
          (e = w.indexOf(this)) > -1 && w.splice(e, 1),
          "boom" !== this.type
            ? (u.showAt(this.originX, this.originY, t),
              h.create(this.originX, this.originY, y[this.type][6]),
              this.apart(t))
            : this.hide());
      }
      pause() {
        this.brokend ||
          (this.anims.clear(), "boom" == this.type && this.flame.remove());
      }
      apart(t) {
        this.anims.clear(),
          this.image.hide(),
          this.shadow.hide(),
          (this.aparted = !0);
        var e = y[this.type],
          r = e[0].replace(".png", ""),
          n = this.radius,
          o = i.createImage.saturate(
            i,
            this.startX - n,
            this.startY - n,
            e[1],
            e[2]
          );
        (t = ((t % 180) + 360 + e[4]) % 360),
          (this.bImage1 = o("fruit", r + "-1.png")),
          (this.bImage2 = o("fruit", r + "-2.png")),
          [this.bImage1, this.bImage2].invoke("rotate", t),
          (this.apartAngle = t),
          s.createTask({
            start: 0,
            duration: v,
            object: this,
            onTimeUpdate: this.onBrokenDropUpdate,
            onTimeStart: this.onBrokenDropStart,
            onTimeEnd: this.onBrokenDropEnd,
            recycle: this.anims,
          });
      }
      remove() {
        var t;
        for (var e in (this.anims.clear(),
        this.image && (this.image.remove(), this.shadow.remove()),
        this.bImage1 && (this.bImage1.remove(), this.bImage2.remove()),
        "boom" === this.type && this.flame.remove(),
        (t = w.indexOf(this)) > -1 && w.splice(t, 1),
        this))
          "function" == typeof this[e]
            ? (this[e] = (function (t) {
                return function () {
                  throw new Error("method " + t + " has been removed");
                };
              })(e))
            : delete this[e];
        a.postMessage(this, "fruit.remove");
      }
      onShowStart() {
        this.image.show();
      }
      onScaling(t, e, i, r) {
        this.image.scale((r = l(t, e, i - e, 500)), r), this.shadow.scale(r, r);
      }
      onHideEnd() {
        this.remove();
      }
      onRotateStart() {}
      onRotating(t) {
        this.image.rotate(((this.rotateSpeed * t) / 1e3) % 360, !0);
      }
      onBrokenDropUpdate(t) {
        var e = this.radius;
        this.bImage1
          .attr({
            x: f(t, this.brokenPosX - e, this.brokenTargetX1, v),
            y: d(
              t,
              this.brokenPosY - e,
              this.brokenTargetY1 - this.brokenPosY + e,
              v
            ),
          })
          .rotate(f(t, this.apartAngle, this.bImage1RotateAngle, v), !0),
          this.bImage2
            .attr({
              x: f(t, this.brokenPosX - e, this.brokenTargetX2, v),
              y: d(
                t,
                this.brokenPosY - e,
                this.brokenTargetY2 - this.brokenPosY + e,
                v
              ),
            })
            .rotate(f(t, this.apartAngle, this.bImage2RotateAngle, v), !0);
      }
      onBrokenDropStart() {
        (this.brokenTargetX1 = -(m(200) + 75)),
          (this.brokenTargetX2 = m(275)),
          (this.brokenTargetY1 = 600),
          (this.brokenTargetY2 = 600),
          (this.brokenPosX = this.originX),
          (this.brokenPosY = this.originY),
          (this.bImage1RotateAngle = -m(150) - 50),
          (this.bImage2RotateAngle = m(150) + 50);
        for (var t = w.length - 1; t >= 0; t--) w[t] === this && w.splice(t, 1);
      }
      onBrokenDropEnd() {
        this.remove();
      }
      onShotOuting(t) {
        this.pos(
          f(t, this.shotOutStartX, this.shotOutEndX - this.shotOutStartX, v),
          p(t, this.shotOutStartY, this.shotOutEndY - this.shotOutStartY, v)
        );
      }
      onShotOutStart() {}
      onShotOutEnd() {
        this.fallOff(0, this.fallOffToX);
      }
      onFalling(t) {
        var e;
        this.pos(
          f(t, this.brokenPosX, this.fallTargetX - this.brokenPosX, v),
          (e = d(t, this.brokenPosY, this.fallTargetY - this.brokenPosY, v))
        ),
          this.checkForFallOutOfViewer(e);
      }
      onFallStart() {
        (this.brokenPosX = this.originX), (this.brokenPosY = this.originY);
      }
      onFallEnd() {
        a.postMessage(this, "fruit.fallOff"), this.remove();
      }
      checkForFallOutOfViewer(t) {
        t > 480 + this.radius &&
          ((this.checkForFallOutOfViewer = r.nul),
          this.rotateAnim && this.rotateAnim.stop(),
          a.postMessage(this, "fruit.fallOutOfViewer"));
      }
    }
    return (
      (k.prototype.shotOut =
        ((e = [-1, 1]),
        function (t, i) {
          return (
            (this.shotOutStartX = this.originX),
            (this.shotOutStartY = this.originY),
            (this.shotOutEndX = (function (t, e) {
              return ((t + e) / 2) >> 0;
            })(this.originX, i)),
            (this.shotOutEndY = g(this.startY - m(this.startY - 100), 200)),
            (this.fallOffToX = i),
            n.createTask({
              start: t,
              duration: v,
              object: this,
              onTimeUpdate: this.onShotOuting,
              onTimeStart: this.onShotOutStart,
              onTimeEnd: this.onShotOutEnd,
              recycle: this.anims,
            }),
            "boom" != this.type && this.rotate(0, (m(180) + 90) * e[m(2)]),
            this
          );
        })),
      (k.prototype.fallOff = (function () {
        var t = [-1, 1],
          e = 0;
        return function (i, r) {
          this.aparted ||
            this.brokend ||
            ("number" != typeof r && (r = this.originX + m(200) * t[e++ % 2]),
            (this.fallTargetX = r),
            (this.fallTargetY = 600),
            n.createTask({
              start: i,
              duration: v,
              object: this,
              onTimeUpdate: this.onFalling,
              onTimeStart: this.onFallStart,
              onTimeEnd: this.onFallEnd,
              recycle: this.anims,
            }));
        };
      })()),
      (t.create = function (t, e, i, r, n) {
        "number" == typeof t &&
          ((r = i), (i = e), (e = t), (t = 4 == m(8) ? "boom" : b[m(5)]));
        var s = new k({ type: t, originX: e, originY: i, flameStart: n }).set(
          r
        );
        return w.unshift(s), s;
      }),
      (t.getFruitInView = function () {
        return w;
      }),
      (t.getDropTimeSetting = function () {
        return v;
      }),
      t
    );
  }),
  define("scripts/factory/juice.js", function (t) {
    var e = require("scripts/lib/ucren"),
      i = require("scripts/layer").getLayer("juice"),
      r = require("scripts/timeline").use("juice").init(10),
      n = require("scripts/lib/tween"),
      s = require("scripts/tools"),
      o = e.randomNumber,
      a = 1500,
      c = n.exponential.co,
      u = n.quadratic.co,
      h = Math.sin,
      l = Math.cos;
    class f {
      constructor(t, e, i) {
        (this.originX = t),
          (this.originY = e),
          (this.color = i),
          (this.distance = o(200) + 100),
          (this.radius = 10),
          (this.dir = (o(360) * Math.PI) / 180);
      }
      render() {
        this.circle = i
          .circle(this.originX, this.originY, this.radius)
          .attr({ fill: this.color, stroke: "none" });
      }
      sputter() {
        r.createTask({
          start: 0,
          duration: a,
          object: this,
          onTimeUpdate: this.onTimeUpdate,
          onTimeEnd: this.onTimeEnd,
        });
      }
      onTimeUpdate(t) {
        var e, i, r, n;
        (e = c(t, 0, this.distance, a)),
          (i = this.originX + e * l(this.dir)),
          (r = this.originY + e * h(this.dir) + u(t, 0, 200, a)),
          (n = c(t, 1, -1, a)),
          this.circle.attr({ cx: i, cy: r }).scale(n, n);
      }
      onTimeEnd() {
        this.circle.remove(), s.unsetObject(this);
      }
    }
    return (
      (t.create = function (t, e, i) {
        for (var r = 0; r < 10; r++) this.createOne(t, e, i);
      }),
      (t.createOne = function (t, e, i) {
        if (i) {
          var r = new f(t, e, i);
          r.render(), r.sputter();
        }
      }),
      t
    );
  }),
  define("scripts/factory/rotate.js", function (t) {
    var e = require("scripts/layer"),
      i = require("scripts/timeline"),
      r = require("scripts/lib/ucren");
    return (
      (t.create = function (t, n, s, o, a, c, u, h) {
        var l,
          f,
          d,
          p = {},
          m = [12, -12][r.randomNumber(2)],
          g = r.randomNumber(360);
        return (
          (p.anims = []),
          (p.set = function () {
            l = e
              .createImage("default", t, n, s, o, a)
              .scale(c, c)
              .rotate(g, !0);
          }),
          (p.show = function (t) {
            i.createTask({
              start: t,
              duration: h,
              object: this,
              data: [c, 1],
              onTimeUpdate: this.onZooming,
              onTimeEnd: this.onShowEnd,
              recycle: this.anims,
            });
          }),
          (p.hide = function (t) {
            this.anims.clear(),
              i.createTask({
                start: t,
                duration: h,
                object: this,
                data: [1, c],
                onTimeUpdate: this.onZooming,
                recycle: this.anims,
              });
          }),
          (p.onShowEnd = function (t) {
            this.anims.clear(),
              i.createTask({
                start: 0,
                duration: -1,
                object: this,
                onTimeUpdate: p.onRotating,
                recycle: this.anims,
              });
          }),
          (p.onZooming = (function () {
            var t;
            return function (e, i, r) {
              l.scale((t = u(e, i, r - i, h)), t);
            };
          })()),
          (p.onRotating =
            ((f = 0),
            (d = g),
            function (t, e, i, r) {
              (d = (d + ((t - f) / 1e3) * m) % 360), l.rotate(d, !0), (f = t);
            })),
          p
        );
      }),
      t
    );
  }),
  define("scripts/lib/buzz.js", function (t) {
    var e = {
      defaults: {
        autoplay: !1,
        duration: 5e3,
        formats: [],
        loop: !1,
        placeholder: "--",
        preload: "metadata",
        volume: 80,
      },
      types: {
        mp3: "audio/mpeg",
        ogg: "audio/ogg",
        wav: "audio/wav",
        aac: "audio/aac",
        m4a: "audio/x-m4a",
      },
      sounds: [],
      el: document.createElement("audio"),
      sound: function (t, i) {
        i = i || {};
        var r = 0,
          n = [],
          s = {},
          o = e.isSupported();
        function a(t) {
          for (var e = [], i = t.length - 1, r = 0; r <= i; r++)
            e.push({ start: t.start(i), end: t.end(i) });
          return e;
        }
        function c(t) {
          return t.split(".").pop();
        }
        function u(t, i) {
          var r = document.createElement("source");
          (r.src = i),
            e.types[c(i)] && (r.type = e.types[c(i)]),
            t.appendChild(r);
        }
        if (
          ((this.load = function () {
            return o ? (this.sound.load(), this) : this;
          }),
          (this.play = function () {
            return o ? (this.sound.play(), this) : this;
          }),
          (this.togglePlay = function () {
            return o
              ? (this.sound.paused ? this.sound.play() : this.sound.pause(),
                this)
              : this;
          }),
          (this.pause = function () {
            return o ? (this.sound.pause(), this) : this;
          }),
          (this.isPaused = function () {
            return o ? this.sound.paused : null;
          }),
          (this.stop = function () {
            return o
              ? (this.setTime(this.getDuration()), this.sound.pause(), this)
              : this;
          }),
          (this.isEnded = function () {
            return o ? this.sound.ended : null;
          }),
          (this.loop = function () {
            return o
              ? ((this.sound.loop = "loop"),
                this.bind("ended.buzzloop", function () {
                  (this.currentTime = 0), this.play();
                }),
                this)
              : this;
          }),
          (this.unloop = function () {
            return o
              ? (this.sound.removeAttribute("loop"),
                this.unbind("ended.buzzloop"),
                this)
              : this;
          }),
          (this.mute = function () {
            return o ? ((this.sound.muted = !0), this) : this;
          }),
          (this.unmute = function () {
            return o ? ((this.sound.muted = !1), this) : this;
          }),
          (this.toggleMute = function () {
            return o ? ((this.sound.muted = !this.sound.muted), this) : this;
          }),
          (this.isMuted = function () {
            return o ? this.sound.muted : null;
          }),
          (this.setVolume = function (t) {
            return o
              ? (t < 0 && (t = 0),
                t > 100 && (t = 100),
                (this.volume = t),
                (this.sound.volume = t / 100),
                this)
              : this;
          }),
          (this.getVolume = function () {
            return o ? this.volume : this;
          }),
          (this.increaseVolume = function (t) {
            return this.setVolume(this.volume + (t || 1));
          }),
          (this.decreaseVolume = function (t) {
            return this.setVolume(this.volume - (t || 1));
          }),
          (this.setTime = function (t) {
            return o
              ? (this.whenReady(function () {
                  this.sound.currentTime = t;
                }),
                this)
              : this;
          }),
          (this.getTime = function () {
            if (!o) return null;
            var t = Math.round(100 * this.sound.currentTime) / 100;
            return isNaN(t) ? e.defaults.placeholder : t;
          }),
          (this.setPercent = function (t) {
            return o
              ? this.setTime(e.fromPercent(t, this.sound.duration))
              : this;
          }),
          (this.getPercent = function () {
            if (!o) return null;
            var t = Math.round(
              e.toPercent(this.sound.currentTime, this.sound.duration)
            );
            return isNaN(t) ? e.defaults.placeholder : t;
          }),
          (this.setSpeed = function (t) {
            if (!o) return this;
            this.sound.playbackRate = t;
          }),
          (this.getSpeed = function () {
            return o ? this.sound.playbackRate : null;
          }),
          (this.getDuration = function () {
            if (!o) return null;
            var t = Math.round(100 * this.sound.duration) / 100;
            return isNaN(t) ? e.defaults.placeholder : t;
          }),
          (this.getPlayed = function () {
            return o ? a(this.sound.played) : null;
          }),
          (this.getBuffered = function () {
            return o ? a(this.sound.buffered) : null;
          }),
          (this.getSeekable = function () {
            return o ? a(this.sound.seekable) : null;
          }),
          (this.getErrorCode = function () {
            return o && this.sound.error ? this.sound.error.code : 0;
          }),
          (this.getErrorMessage = function () {
            if (!o) return null;
            switch (this.getErrorCode()) {
              case 1:
                return "MEDIA_ERR_ABORTED";
              case 2:
                return "MEDIA_ERR_NETWORK";
              case 3:
                return "MEDIA_ERR_DECODE";
              case 4:
                return "MEDIA_ERR_SRC_NOT_SUPPORTED";
              default:
                return null;
            }
          }),
          (this.getStateCode = function () {
            return o ? this.sound.readyState : null;
          }),
          (this.getStateMessage = function () {
            if (!o) return null;
            switch (this.getStateCode()) {
              case 0:
                return "HAVE_NOTHING";
              case 1:
                return "HAVE_METADATA";
              case 2:
                return "HAVE_CURRENT_DATA";
              case 3:
                return "HAVE_FUTURE_DATA";
              case 4:
                return "HAVE_ENOUGH_DATA";
              default:
                return null;
            }
          }),
          (this.getNetworkStateCode = function () {
            return o ? this.sound.networkState : null;
          }),
          (this.getNetworkStateMessage = function () {
            if (!o) return null;
            switch (this.getNetworkStateCode()) {
              case 0:
                return "NETWORK_EMPTY";
              case 1:
                return "NETWORK_IDLE";
              case 2:
                return "NETWORK_LOADING";
              case 3:
                return "NETWORK_NO_SOURCE";
              default:
                return null;
            }
          }),
          (this.set = function (t, e) {
            return o ? ((this.sound[t] = e), this) : this;
          }),
          (this.get = function (t) {
            return o ? (t ? this.sound[t] : this.sound) : null;
          }),
          (this.bind = function (t, e) {
            if (!o) return this;
            t = t.split(" ");
            for (
              var i = this,
                r = function (t) {
                  e.call(i, t);
                },
                s = 0;
              s < t.length;
              s++
            ) {
              var a = t[s],
                c = a;
              (a = c.split(".")[0]),
                n.push({ idx: c, func: r }),
                this.sound.addEventListener(a, r, !0);
            }
            return this;
          }),
          (this.unbind = function (t) {
            if (!o) return this;
            t = t.split(" ");
            for (var e = 0; e < t.length; e++)
              for (
                var i = t[e], r = i.split(".")[0], s = 0;
                s < n.length;
                s++
              ) {
                var a = n[s].idx.split(".");
                (n[s].idx == i || (a[1] && a[1] == i.replace(".", ""))) &&
                  (this.sound.removeEventListener(r, n[s].func, !0),
                  n.splice(s, 1));
              }
            return this;
          }),
          (this.bindOnce = function (t, e) {
            if (!o) return this;
            var i = this;
            (s[r++] = !1),
              this.bind(r + t, function () {
                s[r] || ((s[r] = !0), e.call(i)), i.unbind(r + t);
              });
          }),
          (this.trigger = function (t) {
            if (!o) return this;
            t = t.split(" ");
            for (var e = 0; e < t.length; e++)
              for (var i = t[e], r = 0; r < n.length; r++) {
                var s = n[r].idx.split(".");
                if (n[r].idx == i || (s[0] && s[0] == i.replace(".", ""))) {
                  var a = document.createEvent("HTMLEvents");
                  a.initEvent(s[0], !1, !0), this.sound.dispatchEvent(a);
                }
              }
            return this;
          }),
          (this.fadeTo = function (t, i, r) {
            if (!o) return this;
            i instanceof Function
              ? ((r = i), (i = e.defaults.duration))
              : (i = i || e.defaults.duration);
            var n = this.volume,
              s = i / Math.abs(n - t),
              a = this;
            function c() {
              setTimeout(function () {
                n < t && a.volume < t
                  ? (a.setVolume((a.volume += 1)), c())
                  : n > t && a.volume > t
                  ? (a.setVolume((a.volume -= 1)), c())
                  : r instanceof Function && r.apply(a);
              }, s);
            }
            return (
              this.play(),
              this.whenReady(function () {
                c();
              }),
              this
            );
          }),
          (this.fadeIn = function (t, e) {
            return o ? this.setVolume(0).fadeTo(100, t, e) : this;
          }),
          (this.fadeOut = function (t, e) {
            return o ? this.fadeTo(0, t, e) : this;
          }),
          (this.fadeWith = function (t, e) {
            return o
              ? (this.fadeOut(e, function () {
                  this.stop();
                }),
                t.play().fadeIn(e),
                this)
              : this;
          }),
          (this.whenReady = function (t) {
            if (!o) return null;
            var e = this;
            0 === this.sound.readyState
              ? this.bind("canplay.buzzwhenready", function () {
                  t.call(e);
                })
              : t.call(e);
          }),
          o && t)
        ) {
          for (var h in e.defaults)
            e.defaults.hasOwnProperty(h) && (i[h] = i[h] || e.defaults[h]);
          if (
            ((this.sound = document.createElement("audio")), t instanceof Array)
          )
            for (var l in t) t.hasOwnProperty(l) && u(this.sound, t[l]);
          else if (i.formats.length)
            for (var f in i.formats)
              i.formats.hasOwnProperty(f) &&
                u(this.sound, t + "." + i.formats[f]);
          else u(this.sound, t);
          i.loop && this.loop(),
            i.autoplay && (this.sound.autoplay = "autoplay"),
            !0 === i.preload
              ? (this.sound.preload = "auto")
              : !1 === i.preload
              ? (this.sound.preload = "none")
              : (this.sound.preload = i.preload),
            this.setVolume(i.volume),
            e.sounds.push(this);
        }
      },
      group: function (t) {
        function e() {
          for (
            var e = i(null, arguments), r = e.shift(), n = 0;
            n < t.length;
            n++
          )
            t[n][r].apply(t[n], e);
        }
        function i(t, e) {
          return t instanceof Array ? t : Array.prototype.slice.call(e);
        }
        (t = i(t, arguments)),
          (this.getSounds = function () {
            return t;
          }),
          (this.add = function (e) {
            e = i(e, arguments);
            for (var r = 0; r < e.length; r++) t.push(e[r]);
          }),
          (this.remove = function (e) {
            e = i(e, arguments);
            for (var r = 0; r < e.length; r++)
              for (var n = 0; n < t.length; n++)
                if (t[n] == e[r]) {
                  delete t[n];
                  break;
                }
          }),
          (this.load = function () {
            return e("load"), this;
          }),
          (this.play = function () {
            return e("play"), this;
          }),
          (this.togglePlay = function () {
            return e("togglePlay"), this;
          }),
          (this.pause = function (t) {
            return e("pause", t), this;
          }),
          (this.stop = function () {
            return e("stop"), this;
          }),
          (this.mute = function () {
            return e("mute"), this;
          }),
          (this.unmute = function () {
            return e("unmute"), this;
          }),
          (this.toggleMute = function () {
            return e("toggleMute"), this;
          }),
          (this.setVolume = function (t) {
            return e("setVolume", t), this;
          }),
          (this.increaseVolume = function (t) {
            return e("increaseVolume", t), this;
          }),
          (this.decreaseVolume = function (t) {
            return e("decreaseVolume", t), this;
          }),
          (this.loop = function () {
            return e("loop"), this;
          }),
          (this.unloop = function () {
            return e("unloop"), this;
          }),
          (this.setTime = function (t) {
            return e("setTime", t), this;
          }),
          (this.setduration = function (t) {
            return e("setduration", t), this;
          }),
          (this.set = function (t, i) {
            return e("set", t, i), this;
          }),
          (this.bind = function (t, i) {
            return e("bind", t, i), this;
          }),
          (this.unbind = function (t) {
            return e("unbind", t), this;
          }),
          (this.bindOnce = function (t, i) {
            return e("bindOnce", t, i), this;
          }),
          (this.trigger = function (t) {
            return e("trigger", t), this;
          }),
          (this.fade = function (t, i, r, n) {
            return e("fade", t, i, r, n), this;
          }),
          (this.fadeIn = function (t, i) {
            return e("fadeIn", t, i), this;
          }),
          (this.fadeOut = function (t, i) {
            return e("fadeOut", t, i), this;
          });
      },
      all: function () {
        return new e.group(e.sounds);
      },
      isSupported: function () {
        return !!e.el.canPlayType;
      },
      isOGGSupported: function () {
        return (
          !!e.el.canPlayType && e.el.canPlayType('audio/ogg; codecs="vorbis"')
        );
      },
      isWAVSupported: function () {
        return !!e.el.canPlayType && e.el.canPlayType('audio/wav; codecs="1"');
      },
      isMP3Supported: function () {
        return !!e.el.canPlayType && e.el.canPlayType("audio/mpeg;");
      },
      isAACSupported: function () {
        return (
          !!e.el.canPlayType &&
          (e.el.canPlayType("audio/x-m4a;") || e.el.canPlayType("audio/aac;"))
        );
      },
      toTimer: function (t, e) {
        var i, r, n;
        return (
          (i = Math.floor(t / 3600)),
          (i = isNaN(i) ? "--" : i >= 10 ? i : "0" + i),
          (r = e ? Math.floor((t / 60) % 60) : Math.floor(t / 60)),
          (r = isNaN(r) ? "--" : r >= 10 ? r : "0" + r),
          (n = Math.floor(t % 60)),
          (n = isNaN(n) ? "--" : n >= 10 ? n : "0" + n),
          e ? i + ":" + r + ":" + n : r + ":" + n
        );
      },
      fromTimer: function (t) {
        var e = t.toString().split(":");
        return (
          e &&
            3 == e.length &&
            (t =
              3600 * parseInt(e[0], 10) +
              60 * parseInt(e[1], 10) +
              parseInt(e[2], 10)),
          e &&
            2 == e.length &&
            (t = 60 * parseInt(e[0], 10) + parseInt(e[1], 10)),
          t
        );
      },
      toPercent: function (t, e, i) {
        var r = Math.pow(10, i || 0);
        return Math.round(((100 * t) / e) * r) / r;
      },
      fromPercent: function (t, e, i) {
        var r = Math.pow(10, i || 0);
        return Math.round((e / 100) * t * r) / r;
      },
    };
    return e;
  }),
  define("scripts/lib/raphael.js", function (t) {
    var e,
      i = {};
    return (
      (function () {
        function t() {
          if (t.is(arguments[0], O)) {
            for (
              var e = arguments[0],
                i = Ft[p](t, e.splice(0, 3 + t.is(e[0], C))),
                r = i.set(),
                n = 0,
                o = e[E];
              n < o;
              n++
            ) {
              var a = e[n] || {};
              s[c](a.type) && r[P](i[a.type]().attr(a));
            }
            return r;
          }
          return Ft[p](t, arguments);
        }
        t.version = "1.5.2";
        var r,
          n = /[, ]+/,
          s = { circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1 },
          o = /\{(\d+)\}/g,
          a = "prototype",
          c = "hasOwnProperty",
          u = document,
          h = i,
          l = { was: Object[a][c].call(h, "Raphael"), is: h.Raphael },
          f = function () {
            this.customAttributes = {};
          },
          d = "appendChild",
          p = "apply",
          m = "concat",
          g = "createTouch" in u,
          v = "",
          y = " ",
          b = String,
          x = "split",
          w =
            "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend"[
              x
            ](y),
          k = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend",
          },
          T = "join",
          E = "length",
          S = b[a].toLowerCase,
          q = Math,
          j = q.max,
          M = q.min,
          A = q.abs,
          N = q.pow,
          U = q.PI,
          C = "number",
          I = "string",
          O = "array",
          _ = "toString",
          B = "fill",
          L = Object[a][_],
          P = "push",
          R = /^url\(['"]?([^\)]+?)['"]?\)$/i,
          X =
            /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
          D = { NaN: 1, Infinity: 1, "-Infinity": 1 },
          Y = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
          V = q.round,
          z = "setAttribute",
          G = parseFloat,
          H = parseInt,
          F = " progid:DXImageTransform.Microsoft",
          W = b[a].toUpperCase,
          Z = {
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rotation: 0,
            rx: 0,
            ry: 0,
            scale: "1 1",
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            translation: "0 0",
            width: 0,
            x: 0,
            y: 0,
          },
          $ = {
            along: "along",
            blur: C,
            "clip-rect": "csv",
            cx: C,
            cy: C,
            fill: "colour",
            "fill-opacity": C,
            "font-size": C,
            height: C,
            opacity: C,
            path: "path",
            r: C,
            rotation: "csv",
            rx: C,
            ry: C,
            scale: "csv",
            stroke: "colour",
            "stroke-opacity": C,
            "stroke-width": C,
            translation: "csv",
            width: C,
            x: C,
            y: C,
          },
          Q = "replace",
          K = /^(from|to|\d+%?)$/,
          J = /\s*,\s*/,
          tt = { hs: 1, rg: 1 },
          et = /,?([achlmqrstvxz]),?/gi,
          it = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/gi,
          rt = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/gi,
          nt = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
          st = function (t, e) {
            return t.key - e.key;
          };
        if (
          ((t.type =
            h.SVGAngle ||
            u.implementation.hasFeature(
              "http://www.w3.org/TR/SVG11/feature#BasicStructure",
              "1.1"
            )
              ? "SVG"
              : "VML"),
          "VML" == t.type)
        ) {
          var ot,
            at = u.createElement("div");
          if (
            ((at.innerHTML = '<v:shape adj="1"/>'),
            ((ot = at.firstChild).style.behavior = "url(#default#VML)"),
            !ot || "object" != typeof ot.adj)
          )
            return (t.type = null);
          at = null;
        }
        function ct() {
          for (var t = [], e = 0; e < 32; e++)
            t[e] = (~~(16 * q.random()))[_](16);
          return (
            (t[12] = 4), (t[16] = ((3 & t[16]) | 8)[_](16)), "r-" + t[T]("")
          );
        }
        (t.svg = !(t.vml = "VML" == t.type)),
          (f[a] = t[a]),
          (r = f[a]),
          (t._id = 0),
          (t._oid = 0),
          (t.fn = {}),
          (t.is = function (t, e) {
            return "finite" == (e = S.call(e))
              ? !D[c](+t)
              : ("null" == e && null === t) ||
                  e == typeof t ||
                  ("object" == e && t === Object(t)) ||
                  ("array" == e && Array.isArray && Array.isArray(t)) ||
                  L.call(t).slice(8, -1).toLowerCase() == e;
          }),
          (t.angle = function (e, i, r, n, s, o) {
            if (null == s) {
              var a = e - r,
                c = i - n;
              return a || c
                ? (180 * (a < 0) + (180 * q.atan(-c / -a)) / U + 360) % 360
                : 0;
            }
            return t.angle(e, i, s, o) - t.angle(r, n, s, o);
          }),
          (t.rad = function (t) {
            return ((t % 360) * U) / 180;
          }),
          (t.deg = function (t) {
            return ((180 * t) / U) % 360;
          }),
          (t.snapTo = function (e, i, r) {
            if (((r = t.is(r, "finite") ? r : 10), t.is(e, O))) {
              for (var n = e.length; n--; ) if (A(e[n] - i) <= r) return e[n];
            } else {
              var s = i % (e = +e);
              if (s < r) return i - s;
              if (s > e - r) return i - s + e;
            }
            return i;
          }),
          (t.setWindow = function (t) {
            u = (h = t).document;
          });
        var ut = function (e) {
            if (t.vml) {
              var i,
                r = /^\s+|\s+$/g;
              try {
                var n = new ActiveXObject("htmlfile");
                n.write("<body>"), n.close(), (i = n.body);
              } catch (t) {
                i = createPopup().document.body;
              }
              var s = i.createTextRange();
              ut = dt(function (t) {
                try {
                  i.style.color = b(t)[Q](r, v);
                  var e = s.queryCommandValue("ForeColor");
                  return (
                    "#" +
                    (
                      "000000" +
                      (e =
                        ((255 & e) << 16) |
                        (65280 & e) |
                        ((16711680 & e) >>> 16))[_](16)
                    ).slice(-6)
                  );
                } catch (t) {
                  return "none";
                }
              });
            } else {
              var o = u.createElement("i");
              (o.title = "Raphaël Colour Picker"),
                (o.style.display = "none"),
                u.body[d](o),
                (ut = dt(function (t) {
                  return (
                    (o.style.color = t),
                    u.defaultView
                      .getComputedStyle(o, v)
                      .getPropertyValue("color")
                  );
                }));
            }
            return ut(e);
          },
          ht = function () {
            return "hsb(" + [this.h, this.s, this.b] + ")";
          },
          lt = function () {
            return "hsl(" + [this.h, this.s, this.l] + ")";
          },
          ft = function () {
            return this.hex;
          };
        function dt(t, e, i) {
          return function r() {
            var n = Array[a].slice.call(arguments, 0),
              s = n[T]("►"),
              o = (r.cache = r.cache || {}),
              u = (r.count = r.count || []);
            return (
              o[c](s) ||
                (u[E] >= 1e3 && delete o[u.shift()],
                u[P](s),
                (o[s] = t[p](e, n))),
              i ? i(o[s]) : o[s]
            );
          };
        }
        (t.hsb2rgb = function (e, i, r, n) {
          return (
            t.is(e, "object") &&
              "h" in e &&
              "s" in e &&
              "b" in e &&
              ((r = e.b), (i = e.s), (n = (e = e.h).o)),
            t.hsl2rgb(e, i, r / 2, n)
          );
        }),
          (t.hsl2rgb = function (e, i, r, n) {
            t.is(e, "object") &&
              "h" in e &&
              "s" in e &&
              "l" in e &&
              ((r = e.l), (i = e.s), (e = e.h)),
              (e > 1 || i > 1 || r > 1) && ((e /= 360), (i /= 100), (r /= 100));
            var s,
              o,
              a,
              c = {},
              u = ["r", "g", "b"];
            if (i) {
              o = 2 * r - (s = r < 0.5 ? r * (1 + i) : r + i - r * i);
              for (var h = 0; h < 3; h++)
                (a = e + (1 / 3) * -(h - 1)) < 0 && a++,
                  a > 1 && a--,
                  (c[u[h]] =
                    6 * a < 1
                      ? o + 6 * (s - o) * a
                      : 2 * a < 1
                      ? s
                      : 3 * a < 2
                      ? o + (s - o) * (2 / 3 - a) * 6
                      : o);
            } else c = { r: r, g: r, b: r };
            return (
              (c.r *= 255),
              (c.g *= 255),
              (c.b *= 255),
              (c.hex =
                "#" +
                (16777216 | c.b | (c.g << 8) | (c.r << 16))
                  .toString(16)
                  .slice(1)),
              t.is(n, "finite") && (c.opacity = n),
              (c.toString = ft),
              c
            );
          }),
          (t.rgb2hsb = function (e, i, r) {
            if (
              (null == i &&
                t.is(e, "object") &&
                "r" in e &&
                "g" in e &&
                "b" in e &&
                ((r = e.b), (i = e.g), (e = e.r)),
              null == i && t.is(e, I))
            ) {
              var n = t.getRGB(e);
              (e = n.r), (i = n.g), (r = n.b);
            }
            (e > 1 || i > 1 || r > 1) && ((e /= 255), (i /= 255), (r /= 255));
            var s,
              o = j(e, i, r),
              a = M(e, i, r);
            if (a == o) return { h: 0, s: 0, b: o, toString: ht };
            var c = o - a;
            return (
              (s =
                e == o
                  ? (i - r) / c
                  : i == o
                  ? 2 + (r - e) / c
                  : 4 + (e - i) / c),
              (s /= 6) < 0 && s++,
              s > 1 && s--,
              { h: s, s: c / o, b: o, toString: ht }
            );
          }),
          (t.rgb2hsl = function (e, i, r) {
            if (
              (null == i &&
                t.is(e, "object") &&
                "r" in e &&
                "g" in e &&
                "b" in e &&
                ((r = e.b), (i = e.g), (e = e.r)),
              null == i && t.is(e, I))
            ) {
              var n = t.getRGB(e);
              (e = n.r), (i = n.g), (r = n.b);
            }
            (e > 1 || i > 1 || r > 1) && ((e /= 255), (i /= 255), (r /= 255));
            var s,
              o,
              a = j(e, i, r),
              c = M(e, i, r),
              u = (a + c) / 2;
            if (c == a) o = { h: 0, s: 0, l: u };
            else {
              var h = a - c;
              (s =
                e == a
                  ? (i - r) / h
                  : i == a
                  ? 2 + (r - e) / h
                  : 4 + (e - i) / h),
                (s /= 6) < 0 && s++,
                s > 1 && s--,
                (o = {
                  h: s,
                  s: u < 0.5 ? h / (a + c) : h / (2 - a - c),
                  l: u,
                });
            }
            return (o.toString = lt), o;
          }),
          (t._path2string = function () {
            return this.join(",")[Q](et, "$1");
          }),
          (t.getRGB = dt(function (e) {
            if (!e || (e = b(e)).indexOf("-") + 1)
              return { r: -1, g: -1, b: -1, hex: "none", error: 1 };
            if ("none" == e) return { r: -1, g: -1, b: -1, hex: "none" };
            !tt[c](e.toLowerCase().substring(0, 2)) &&
              "#" != e.charAt() &&
              (e = ut(e));
            var i,
              r,
              n,
              s,
              o,
              a,
              u = e.match(X);
            return u
              ? (u[2] &&
                  ((n = H(u[2].substring(5), 16)),
                  (r = H(u[2].substring(3, 5), 16)),
                  (i = H(u[2].substring(1, 3), 16))),
                u[3] &&
                  ((n = H((o = u[3].charAt(3)) + o, 16)),
                  (r = H((o = u[3].charAt(2)) + o, 16)),
                  (i = H((o = u[3].charAt(1)) + o, 16))),
                u[4] &&
                  ((a = u[4][x](J)),
                  (i = G(a[0])),
                  "%" == a[0].slice(-1) && (i *= 2.55),
                  (r = G(a[1])),
                  "%" == a[1].slice(-1) && (r *= 2.55),
                  (n = G(a[2])),
                  "%" == a[2].slice(-1) && (n *= 2.55),
                  "rgba" == u[1].toLowerCase().slice(0, 4) && (s = G(a[3])),
                  a[3] && "%" == a[3].slice(-1) && (s /= 100)),
                u[5]
                  ? ((a = u[5][x](J)),
                    (i = G(a[0])),
                    "%" == a[0].slice(-1) && (i *= 2.55),
                    (r = G(a[1])),
                    "%" == a[1].slice(-1) && (r *= 2.55),
                    (n = G(a[2])),
                    "%" == a[2].slice(-1) && (n *= 2.55),
                    ("deg" == a[0].slice(-3) || "°" == a[0].slice(-1)) &&
                      (i /= 360),
                    "hsba" == u[1].toLowerCase().slice(0, 4) && (s = G(a[3])),
                    a[3] && "%" == a[3].slice(-1) && (s /= 100),
                    t.hsb2rgb(i, r, n, s))
                  : u[6]
                  ? ((a = u[6][x](J)),
                    (i = G(a[0])),
                    "%" == a[0].slice(-1) && (i *= 2.55),
                    (r = G(a[1])),
                    "%" == a[1].slice(-1) && (r *= 2.55),
                    (n = G(a[2])),
                    "%" == a[2].slice(-1) && (n *= 2.55),
                    ("deg" == a[0].slice(-3) || "°" == a[0].slice(-1)) &&
                      (i /= 360),
                    "hsla" == u[1].toLowerCase().slice(0, 4) && (s = G(a[3])),
                    a[3] && "%" == a[3].slice(-1) && (s /= 100),
                    t.hsl2rgb(i, r, n, s))
                  : (((u = { r: i, g: r, b: n }).hex =
                      "#" +
                      (16777216 | n | (r << 8) | (i << 16))
                        .toString(16)
                        .slice(1)),
                    t.is(s, "finite") && (u.opacity = s),
                    u))
              : { r: -1, g: -1, b: -1, hex: "none", error: 1 };
          }, t)),
          (t.getColor = function (t) {
            var e = (this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: t || 0.75,
              }),
              i = this.hsb2rgb(e.h, e.s, e.b);
            return (
              (e.h += 0.075),
              e.h > 1 &&
                ((e.h = 0),
                (e.s -= 0.2),
                e.s <= 0 && (this.getColor.start = { h: 0, s: 1, b: e.b })),
              i.hex
            );
          }),
          (t.getColor.reset = function () {
            delete this.start;
          }),
          (t.parsePathString = dt(function (e) {
            if (!e) return null;
            var i = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0,
              },
              r = [];
            return (
              t.is(e, O) && t.is(e[0], O) && (r = mt(e)),
              r[E] ||
                b(e)[Q](it, function (t, e, n) {
                  var s = [],
                    o = S.call(e);
                  for (
                    n[Q](rt, function (t, e) {
                      e && s[P](+e);
                    }),
                      "m" == o &&
                        s[E] > 2 &&
                        (r[P]([e][m](s.splice(0, 2))),
                        (o = "l"),
                        (e = "m" == e ? "l" : "L"));
                    s[E] >= i[o] && (r[P]([e][m](s.splice(0, i[o]))), i[o]);

                  );
                }),
              (r[_] = t._path2string),
              r
            );
          })),
          (t.findDotsAtSegment = function (t, e, i, r, n, s, o, a, c) {
            var u = 1 - c,
              h =
                N(u, 3) * t +
                3 * N(u, 2) * c * i +
                3 * u * c * c * n +
                N(c, 3) * o,
              l =
                N(u, 3) * e +
                3 * N(u, 2) * c * r +
                3 * u * c * c * s +
                N(c, 3) * a,
              f = t + 2 * c * (i - t) + c * c * (n - 2 * i + t),
              d = e + 2 * c * (r - e) + c * c * (s - 2 * r + e),
              p = i + 2 * c * (n - i) + c * c * (o - 2 * n + i),
              m = r + 2 * c * (s - r) + c * c * (a - 2 * s + r),
              g = (1 - c) * t + c * i,
              v = (1 - c) * e + c * r,
              y = (1 - c) * n + c * o,
              b = (1 - c) * s + c * a,
              x = 90 - (180 * q.atan((f - p) / (d - m))) / U;
            return (
              (f > p || d < m) && (x += 180),
              {
                x: h,
                y: l,
                m: { x: f, y: d },
                n: { x: p, y: m },
                start: { x: g, y: v },
                end: { x: y, y: b },
                alpha: x,
              }
            );
          });
        var pt = dt(function (t) {
            if (!t) return { x: 0, y: 0, width: 0, height: 0 };
            for (
              var e, i = 0, r = 0, n = [], s = [], o = 0, a = (t = Tt(t))[E];
              o < a;
              o++
            )
              if ("M" == (e = t[o])[0])
                (i = e[1]), (r = e[2]), n[P](i), s[P](r);
              else {
                var c = kt(i, r, e[1], e[2], e[3], e[4], e[5], e[6]);
                (n = n[m](c.min.x, c.max.x)),
                  (s = s[m](c.min.y, c.max.y)),
                  (i = e[5]),
                  (r = e[6]);
              }
            var u = M[p](0, n),
              h = M[p](0, s);
            return {
              x: u,
              y: h,
              width: j[p](0, n) - u,
              height: j[p](0, s) - h,
            };
          }),
          mt = function (e) {
            var i = [];
            (t.is(e, O) && t.is(e && e[0], O)) || (e = t.parsePathString(e));
            for (var r = 0, n = e[E]; r < n; r++) {
              i[r] = [];
              for (var s = 0, o = e[r][E]; s < o; s++) i[r][s] = e[r][s];
            }
            return (i[_] = t._path2string), i;
          },
          gt = dt(
            function (e) {
              (t.is(e, O) && t.is(e && e[0], O)) || (e = t.parsePathString(e));
              var i = [],
                r = 0,
                n = 0,
                s = 0,
                o = 0,
                a = 0;
              "M" == e[0][0] &&
                ((s = r = e[0][1]), (o = n = e[0][2]), a++, i[P](["M", r, n]));
              for (var c = a, u = e[E]; c < u; c++) {
                var h = (i[c] = []),
                  l = e[c];
                if (l[0] != S.call(l[0]))
                  switch (((h[0] = S.call(l[0])), h[0])) {
                    case "a":
                      (h[1] = l[1]),
                        (h[2] = l[2]),
                        (h[3] = l[3]),
                        (h[4] = l[4]),
                        (h[5] = l[5]),
                        (h[6] = +(l[6] - r).toFixed(3)),
                        (h[7] = +(l[7] - n).toFixed(3));
                      break;
                    case "v":
                      h[1] = +(l[1] - n).toFixed(3);
                      break;
                    case "m":
                      (s = l[1]), (o = l[2]);
                    default:
                      for (var f = 1, d = l[E]; f < d; f++)
                        h[f] = +(l[f] - (f % 2 ? r : n)).toFixed(3);
                  }
                else {
                  (h = i[c] = []),
                    "m" == l[0] && ((s = l[1] + r), (o = l[2] + n));
                  for (var p = 0, m = l[E]; p < m; p++) i[c][p] = l[p];
                }
                var g = i[c][E];
                switch (i[c][0]) {
                  case "z":
                    (r = s), (n = o);
                    break;
                  case "h":
                    r += +i[c][g - 1];
                    break;
                  case "v":
                    n += +i[c][g - 1];
                    break;
                  default:
                    (r += +i[c][g - 2]), (n += +i[c][g - 1]);
                }
              }
              return (i[_] = t._path2string), i;
            },
            0,
            mt
          ),
          vt = dt(
            function (e) {
              (t.is(e, O) && t.is(e && e[0], O)) || (e = t.parsePathString(e));
              var i = [],
                r = 0,
                n = 0,
                s = 0,
                o = 0,
                a = 0;
              "M" == e[0][0] &&
                ((s = r = +e[0][1]),
                (o = n = +e[0][2]),
                a++,
                (i[0] = ["M", r, n]));
              for (var c = a, u = e[E]; c < u; c++) {
                var h = (i[c] = []),
                  l = e[c];
                if (l[0] != W.call(l[0]))
                  switch (((h[0] = W.call(l[0])), h[0])) {
                    case "A":
                      (h[1] = l[1]),
                        (h[2] = l[2]),
                        (h[3] = l[3]),
                        (h[4] = l[4]),
                        (h[5] = l[5]),
                        (h[6] = +(l[6] + r)),
                        (h[7] = +(l[7] + n));
                      break;
                    case "V":
                      h[1] = +l[1] + n;
                      break;
                    case "H":
                      h[1] = +l[1] + r;
                      break;
                    case "M":
                      (s = +l[1] + r), (o = +l[2] + n);
                    default:
                      for (var f = 1, d = l[E]; f < d; f++)
                        h[f] = +l[f] + (f % 2 ? r : n);
                  }
                else for (var p = 0, m = l[E]; p < m; p++) i[c][p] = l[p];
                switch (h[0]) {
                  case "Z":
                    (r = s), (n = o);
                    break;
                  case "H":
                    r = h[1];
                    break;
                  case "V":
                    n = h[1];
                    break;
                  case "M":
                    (s = i[c][i[c][E] - 2]), (o = i[c][i[c][E] - 1]);
                  default:
                    (r = i[c][i[c][E] - 2]), (n = i[c][i[c][E] - 1]);
                }
              }
              return (i[_] = t._path2string), i;
            },
            null,
            mt
          ),
          yt = function (t, e, i, r) {
            return [t, e, i, r, i, r];
          },
          bt = function (t, e, i, r, n, s) {
            var o = 1 / 3,
              a = 2 / 3;
            return [
              o * t + a * i,
              o * e + a * r,
              o * n + a * i,
              o * s + a * r,
              n,
              s,
            ];
          },
          xt = function (t, e, i, r, n, s, o, a, c, u) {
            var h,
              l = (120 * U) / 180,
              f = (U / 180) * (+n || 0),
              d = [],
              p = dt(function (t, e, i) {
                return {
                  x: t * q.cos(i) - e * q.sin(i),
                  y: t * q.sin(i) + e * q.cos(i),
                };
              });
            if (u) (M = u[0]), (N = u[1]), (S = u[2]), (j = u[3]);
            else {
              (t = (h = p(t, e, -f)).x),
                (e = h.y),
                (a = (h = p(a, c, -f)).x),
                (c = h.y),
                q.cos((U / 180) * n),
                q.sin((U / 180) * n);
              var g = (t - a) / 2,
                v = (e - c) / 2,
                y = (g * g) / (i * i) + (v * v) / (r * r);
              y > 1 && ((i *= y = q.sqrt(y)), (r *= y));
              var b = i * i,
                w = r * r,
                k =
                  (s == o ? -1 : 1) *
                  q.sqrt(
                    A((b * w - b * v * v - w * g * g) / (b * v * v + w * g * g))
                  ),
                S = (k * i * v) / r + (t + a) / 2,
                j = (k * -r * g) / i + (e + c) / 2,
                M = q.asin(((e - j) / r).toFixed(9)),
                N = q.asin(((c - j) / r).toFixed(9));
              (M = t < S ? U - M : M) < 0 && (M = 2 * U + M),
                (N = a < S ? U - N : N) < 0 && (N = 2 * U + N),
                o && M > N && (M -= 2 * U),
                !o && N > M && (N -= 2 * U);
            }
            var C = N - M;
            if (A(C) > l) {
              var I = N,
                O = a,
                _ = c;
              (N = M + l * (o && N > M ? 1 : -1)),
                (a = S + i * q.cos(N)),
                (c = j + r * q.sin(N)),
                (d = xt(a, c, i, r, n, 0, o, O, _, [N, I, S, j]));
            }
            C = N - M;
            var B = q.cos(M),
              L = q.sin(M),
              P = q.cos(N),
              R = q.sin(N),
              X = q.tan(C / 4),
              D = (4 / 3) * i * X,
              Y = (4 / 3) * r * X,
              V = [t, e],
              z = [t + D * L, e - Y * B],
              G = [a + D * R, c - Y * P],
              H = [a, c];
            if (((z[0] = 2 * V[0] - z[0]), (z[1] = 2 * V[1] - z[1]), u))
              return [z, G, H][m](d);
            for (
              var F = [], W = 0, Z = (d = [z, G, H][m](d)[T]()[x](","))[E];
              W < Z;
              W++
            )
              F[W] = W % 2 ? p(d[W - 1], d[W], f).y : p(d[W], d[W + 1], f).x;
            return F;
          },
          wt = function (t, e, i, r, n, s, o, a, c) {
            var u = 1 - c;
            return {
              x:
                N(u, 3) * t +
                3 * N(u, 2) * c * i +
                3 * u * c * c * n +
                N(c, 3) * o,
              y:
                N(u, 3) * e +
                3 * N(u, 2) * c * r +
                3 * u * c * c * s +
                N(c, 3) * a,
            };
          },
          kt = dt(function (t, e, i, r, n, s, o, a) {
            var c,
              u = n - 2 * i + t - (o - 2 * n + i),
              h = 2 * (i - t) - 2 * (n - i),
              l = t - i,
              f = (-h + q.sqrt(h * h - 4 * u * l)) / 2 / u,
              d = (-h - q.sqrt(h * h - 4 * u * l)) / 2 / u,
              m = [e, a],
              g = [t, o];
            return (
              A(f) > "1e12" && (f = 0.5),
              A(d) > "1e12" && (d = 0.5),
              f > 0 &&
                f < 1 &&
                ((c = wt(t, e, i, r, n, s, o, a, f)), g[P](c.x), m[P](c.y)),
              d > 0 &&
                d < 1 &&
                ((c = wt(t, e, i, r, n, s, o, a, d)), g[P](c.x), m[P](c.y)),
              (u = s - 2 * r + e - (a - 2 * s + r)),
              (l = e - r),
              (f =
                (-(h = 2 * (r - e) - 2 * (s - r)) + q.sqrt(h * h - 4 * u * l)) /
                2 /
                u),
              (d = (-h - q.sqrt(h * h - 4 * u * l)) / 2 / u),
              A(f) > "1e12" && (f = 0.5),
              A(d) > "1e12" && (d = 0.5),
              f > 0 &&
                f < 1 &&
                ((c = wt(t, e, i, r, n, s, o, a, f)), g[P](c.x), m[P](c.y)),
              d > 0 &&
                d < 1 &&
                ((c = wt(t, e, i, r, n, s, o, a, d)), g[P](c.x), m[P](c.y)),
              {
                min: { x: M[p](0, g), y: M[p](0, m) },
                max: { x: j[p](0, g), y: j[p](0, m) },
              }
            );
          }),
          Tt = dt(
            function (t, e) {
              for (
                var i = vt(t),
                  r = e && vt(e),
                  n = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null,
                  },
                  s = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null,
                  },
                  o = function (t, e) {
                    if (!t) return ["C", e.x, e.y, e.x, e.y, e.x, e.y];
                    switch (
                      (!(t[0] in { T: 1, Q: 1 }) && (e.qx = e.qy = null), t[0])
                    ) {
                      case "M":
                        (e.X = t[1]), (e.Y = t[2]);
                        break;
                      case "A":
                        t = ["C"][m](xt[p](0, [e.x, e.y][m](t.slice(1))));
                        break;
                      case "S":
                        t = [
                          "C",
                          e.x + (e.x - (e.bx || e.x)),
                          e.y + (e.y - (e.by || e.y)),
                        ][m](t.slice(1));
                        break;
                      case "T":
                        (e.qx = e.x + (e.x - (e.qx || e.x))),
                          (e.qy = e.y + (e.y - (e.qy || e.y))),
                          (t = ["C"][m](bt(e.x, e.y, e.qx, e.qy, t[1], t[2])));
                        break;
                      case "Q":
                        (e.qx = t[1]),
                          (e.qy = t[2]),
                          (t = ["C"][m](bt(e.x, e.y, t[1], t[2], t[3], t[4])));
                        break;
                      case "L":
                        t = ["C"][m](yt(e.x, e.y, t[1], t[2]));
                        break;
                      case "H":
                        t = ["C"][m](yt(e.x, e.y, t[1], e.y));
                        break;
                      case "V":
                        t = ["C"][m](yt(e.x, e.y, e.x, t[1]));
                        break;
                      case "Z":
                        t = ["C"][m](yt(e.x, e.y, e.X, e.Y));
                    }
                    return t;
                  },
                  a = function (t, e) {
                    if (t[e][E] > 7) {
                      t[e].shift();
                      for (var n = t[e]; n[E]; )
                        t.splice(e++, 0, ["C"][m](n.splice(0, 6)));
                      t.splice(e, 1), (h = j(i[E], (r && r[E]) || 0));
                    }
                  },
                  c = function (t, e, n, s, o) {
                    t &&
                      e &&
                      "M" == t[o][0] &&
                      "M" != e[o][0] &&
                      (e.splice(o, 0, ["M", s.x, s.y]),
                      (n.bx = 0),
                      (n.by = 0),
                      (n.x = t[o][1]),
                      (n.y = t[o][2]),
                      (h = j(i[E], (r && r[E]) || 0)));
                  },
                  u = 0,
                  h = j(i[E], (r && r[E]) || 0);
                u < h;
                u++
              ) {
                (i[u] = o(i[u], n)),
                  a(i, u),
                  r && (r[u] = o(r[u], s)),
                  r && a(r, u),
                  c(i, r, n, s, u),
                  c(r, i, s, n, u);
                var l = i[u],
                  f = r && r[u],
                  d = l[E],
                  g = r && f[E];
                (n.x = l[d - 2]),
                  (n.y = l[d - 1]),
                  (n.bx = G(l[d - 4]) || n.x),
                  (n.by = G(l[d - 3]) || n.y),
                  (s.bx = r && (G(f[g - 4]) || s.x)),
                  (s.by = r && (G(f[g - 3]) || s.y)),
                  (s.x = r && f[g - 2]),
                  (s.y = r && f[g - 1]);
              }
              return r ? [i, r] : i;
            },
            null,
            mt
          ),
          Et = dt(function (e) {
            for (var i = [], r = 0, n = e[E]; r < n; r++) {
              var s = {},
                o = e[r].match(/^([^:]*):?([\d\.]*)/);
              if (((s.color = t.getRGB(o[1])), s.color.error)) return null;
              (s.color = s.color.hex), o[2] && (s.offset = o[2] + "%"), i[P](s);
            }
            for (r = 1, n = i[E] - 1; r < n; r++)
              if (!i[r].offset) {
                for (
                  var a = G(i[r - 1].offset || 0), c = 0, u = r + 1;
                  u < n;
                  u++
                )
                  if (i[u].offset) {
                    c = i[u].offset;
                    break;
                  }
                c || ((c = 100), (u = n));
                for (var h = ((c = G(c)) - a) / (u - r + 1); r < u; r++)
                  (a += h), (i[r].offset = a + "%");
              }
            return i;
          }),
          St = function (e, i, r, n) {
            var s;
            return t.is(e, I) || t.is(e, "object")
              ? (s = t.is(e, I) ? u.getElementById(e) : e).tagName
                ? null == i
                  ? {
                      container: s,
                      width: s.style.pixelWidth || s.offsetWidth,
                      height: s.style.pixelHeight || s.offsetHeight,
                    }
                  : { container: s, width: i, height: r }
                : void 0
              : { container: 1, x: e, y: i, width: r, height: n };
          },
          qt = function (t, e) {
            var i = this;
            for (var r in e)
              if (e[c](r) && !(r in t))
                switch (typeof e[r]) {
                  case "function":
                    !(function (e) {
                      t[r] =
                        t === i
                          ? e
                          : function () {
                              return e[p](i, arguments);
                            };
                    })(e[r]);
                    break;
                  case "object":
                    (t[r] = t[r] || {}), qt.call(this, t[r], e[r]);
                    break;
                  default:
                    t[r] = e[r];
                }
          },
          jt = function (t, e) {
            t == e.top && (e.top = t.prev),
              t == e.bottom && (e.bottom = t.next),
              t.next && (t.next.prev = t.prev),
              t.prev && (t.prev.next = t.next);
          },
          Mt = function (t, e) {
            e.top !== t &&
              (jt(t, e),
              (t.next = null),
              (t.prev = e.top),
              (e.top.next = t),
              (e.top = t));
          },
          At = function (t, e) {
            e.bottom !== t &&
              (jt(t, e),
              (t.next = e.bottom),
              (t.prev = null),
              (e.bottom.prev = t),
              (e.bottom = t));
          },
          Nt = function (t, e, i) {
            jt(t, i),
              e == i.top && (i.top = t),
              e.next && (e.next.prev = t),
              (t.next = e.next),
              (t.prev = e),
              (e.next = t);
          },
          Ut = function (t, e, i) {
            jt(t, i),
              e == i.bottom && (i.bottom = t),
              e.prev && (e.prev.next = t),
              (t.prev = e.prev),
              (e.prev = t),
              (t.next = e);
          },
          Ct = function (t) {
            return function () {
              throw new Error(
                "Raphaël: you are calling to method “" +
                  t +
                  "” of removed object"
              );
            };
          };
        if (((t.pathToRelative = gt), t.svg)) {
          (r.svgns = "http://www.w3.org/2000/svg"),
            (r.xlink = "http://www.w3.org/1999/xlink"),
            (V = function (t) {
              return +t + 0.5 * (~~t === t);
            });
          var It = function (t, e) {
            if (!e)
              return (
                ((t = u.createElementNS(
                  r.svgns,
                  t
                )).style.webkitTapHighlightColor = "rgba(0,0,0,0)"),
                t
              );
            for (var i in e) e[c](i) && t[z](i, b(e[i]));
          };
          t[_] = function () {
            return (
              "Your browser supports SVG.\nYou are running Raphaël " +
              this.version
            );
          };
          var Ot = function (t, e) {
              var i = It("path");
              e.canvas && e.canvas[d](i);
              var r = new Rt(i, e);
              return (
                (r.type = "path"),
                Lt(r, { fill: "none", stroke: "#000", path: t }),
                r
              );
            },
            _t = function (t, e, i) {
              var r = "linear",
                n = 0.5,
                s = 0.5,
                o = t.style;
              if (
                ((e = b(e)[Q](nt, function (t, e, i) {
                  if (((r = "radial"), e && i)) {
                    n = G(e);
                    var o = 2 * ((s = G(i)) > 0.5) - 1;
                    N(n - 0.5, 2) + N(s - 0.5, 2) > 0.25 &&
                      (s = q.sqrt(0.25 - N(n - 0.5, 2)) * o + 0.5) &&
                      0.5 != s &&
                      (s = s.toFixed(5) - 1e-5 * o);
                  }
                  return v;
                })),
                (e = e[x](/\s*\-\s*/)),
                "linear" == r)
              ) {
                var a = e.shift();
                if (((a = -G(a)), isNaN(a))) return null;
                var c = [0, 0, q.cos((a * U) / 180), q.sin((a * U) / 180)],
                  h = 1 / (j(A(c[2]), A(c[3])) || 1);
                (c[2] *= h),
                  (c[3] *= h),
                  c[2] < 0 && ((c[0] = -c[2]), (c[2] = 0)),
                  c[3] < 0 && ((c[1] = -c[3]), (c[3] = 0));
              }
              var l = Et(e);
              if (!l) return null;
              var f = t.getAttribute(B);
              (f = f.match(/^url\(#(.*)\)$/)) &&
                i.defs.removeChild(u.getElementById(f[1]));
              var p = It(r + "Gradient");
              (p.id = ct()),
                It(
                  p,
                  "radial" == r
                    ? { fx: n, fy: s }
                    : { x1: c[0], y1: c[1], x2: c[2], y2: c[3] }
                ),
                i.defs[d](p);
              for (var m = 0, g = l[E]; m < g; m++) {
                var y = It("stop");
                It(y, {
                  offset: l[m].offset ? l[m].offset : m ? "100%" : "0%",
                  "stop-color": l[m].color || "#fff",
                }),
                  p[d](y);
              }
              return (
                It(t, {
                  fill: "url(#" + p.id + ")",
                  opacity: 1,
                  "fill-opacity": 1,
                }),
                (o.fill = v),
                (o.opacity = 1),
                (o.fillOpacity = 1),
                1
              );
            },
            Bt = function (e) {
              var i = e.getBBox();
              It(e.pattern, {
                patternTransform: t.format("translate({0},{1})", i.x, i.y),
              });
            },
            Lt = function (e, i) {
              var r = {
                  "": [0],
                  none: [0],
                  "-": [3, 1],
                  ".": [1, 1],
                  "-.": [3, 1, 1, 1],
                  "-..": [3, 1, 1, 1, 1, 1],
                  ". ": [1, 3],
                  "- ": [4, 3],
                  "--": [8, 3],
                  "- .": [4, 3, 1, 3],
                  "--.": [8, 3, 1, 3],
                  "--..": [8, 3, 1, 3, 1, 3],
                },
                s = e.node,
                o = e.attrs,
                a = e.rotate(),
                h = function (t, e) {
                  if ((e = r[S.call(e)])) {
                    for (
                      var n = t.attrs["stroke-width"] || "1",
                        o =
                          { round: n, square: n, butt: 0 }[
                            t.attrs["stroke-linecap"] || i["stroke-linecap"]
                          ] || 0,
                        a = [],
                        c = e[E];
                      c--;

                    )
                      a[c] = e[c] * n + (c % 2 ? 1 : -1) * o;
                    It(s, { "stroke-dasharray": a[T](",") });
                  }
                };
              i[c]("rotation") && (a = i.rotation);
              var l = b(a)[x](n);
              for (var f in (l.length - 1
                ? ((l[1] = +l[1]), (l[2] = +l[2]))
                : (l = null),
              G(a) && e.rotate(0, !0),
              i))
                if (i[c](f)) {
                  if (!Z[c](f)) continue;
                  var p = i[f];
                  switch (((o[f] = p), f)) {
                    case "blur":
                      e.blur(p);
                      break;
                    case "rotation":
                      e.rotate(p, !0);
                      break;
                    case "href":
                    case "title":
                    case "target":
                      var m = s.parentNode;
                      if ("a" != S.call(m.tagName)) {
                        var g = It("a");
                        m.insertBefore(g, s), g[d](s), (m = g);
                      }
                      "target" == f && "blank" == p
                        ? m.setAttributeNS(e.paper.xlink, "show", "new")
                        : m.setAttributeNS(e.paper.xlink, f, p);
                      break;
                    case "cursor":
                      s.style.cursor = p;
                      break;
                    case "clip-rect":
                      var w = b(p)[x](n);
                      if (4 == w[E]) {
                        e.clip &&
                          e.clip.parentNode.parentNode.removeChild(
                            e.clip.parentNode
                          );
                        var k = It("clipPath"),
                          q = It("rect");
                        (k.id = ct()),
                          It(q, {
                            x: w[0],
                            y: w[1],
                            width: w[2],
                            height: w[3],
                          }),
                          k[d](q),
                          e.paper.defs[d](k),
                          It(s, { "clip-path": "url(#" + k.id + ")" }),
                          (e.clip = q);
                      }
                      if (!p) {
                        var j = u.getElementById(
                          s.getAttribute("clip-path")[Q](/(^url\(#|\)$)/g, v)
                        );
                        j && j.parentNode.removeChild(j),
                          It(s, { "clip-path": v }),
                          delete e.clip;
                      }
                      break;
                    case "path":
                      "path" == e.type &&
                        It(s, { d: p ? (o.path = vt(p)) : "M0,0" });
                      break;
                    case "width":
                      if ((s[z](f, p), !o.fx)) break;
                      (f = "x"), (p = o.x);
                    case "x":
                      o.fx && (p = -o.x - (o.width || 0));
                    case "rx":
                      if ("rx" == f && "rect" == e.type) break;
                    case "cx":
                      l && ("x" == f || "cx" == f) && (l[1] += p - o[f]),
                        s[z](f, p),
                        e.pattern && Bt(e);
                      break;
                    case "height":
                      if ((s[z](f, p), !o.fy)) break;
                      (f = "y"), (p = o.y);
                    case "y":
                      o.fy && (p = -o.y - (o.height || 0));
                    case "ry":
                      if ("ry" == f && "rect" == e.type) break;
                    case "cy":
                      l && ("y" == f || "cy" == f) && (l[2] += p - o[f]),
                        s[z](f, p),
                        e.pattern && Bt(e);
                      break;
                    case "r":
                      "rect" == e.type ? It(s, { rx: p, ry: p }) : s[z](f, p);
                      break;
                    case "src":
                      "image" == e.type &&
                        s.setAttributeNS(e.paper.xlink, "href", p);
                      break;
                    case "stroke-width":
                      (s.style.strokeWidth = p),
                        s[z](f, p),
                        o["stroke-dasharray"] && h(e, o["stroke-dasharray"]);
                      break;
                    case "stroke-dasharray":
                      h(e, p);
                      break;
                    case "translation":
                      var M = b(p)[x](n);
                      (M[0] = +M[0] || 0),
                        (M[1] = +M[1] || 0),
                        l && ((l[1] += M[0]), (l[2] += M[1])),
                        Ee.call(e, M[0], M[1]);
                      break;
                    case "scale":
                      (M = b(p)[x](n)),
                        e.scale(
                          +M[0] || 1,
                          +M[1] || +M[0] || 1,
                          isNaN(G(M[2])) ? null : +M[2],
                          isNaN(G(M[3])) ? null : +M[3]
                        );
                      break;
                    case B:
                      var A = b(p).match(R);
                      if (A) {
                        k = It("pattern");
                        var N = It("image");
                        (k.id = ct()),
                          It(k, {
                            x: 0,
                            y: 0,
                            patternUnits: "userSpaceOnUse",
                            height: 1,
                            width: 1,
                          }),
                          It(N, { x: 0, y: 0 }),
                          N.setAttributeNS(e.paper.xlink, "href", A[1]),
                          k[d](N);
                        var U = u.createElement("img");
                        (U.style.cssText =
                          "position:absolute;left:-9999em;top-9999em"),
                          (U.onload = function () {
                            It(k, {
                              width: this.offsetWidth,
                              height: this.offsetHeight,
                            }),
                              It(N, {
                                width: this.offsetWidth,
                                height: this.offsetHeight,
                              }),
                              u.body.removeChild(this),
                              e.paper.safari();
                          }),
                          u.body[d](U),
                          (U.src = A[1]),
                          e.paper.defs[d](k),
                          (s.style.fill = "url(#" + k.id + ")"),
                          It(s, { fill: "url(#" + k.id + ")" }),
                          (e.pattern = k),
                          e.pattern && Bt(e);
                        break;
                      }
                      var C = t.getRGB(p);
                      if (C.error) {
                        if (
                          ({ circle: 1, ellipse: 1 }[c](e.type) ||
                            "r" != b(p).charAt()) &&
                          _t(s, p, e.paper)
                        ) {
                          (o.gradient = p), (o.fill = "none");
                          break;
                        }
                        delete i.gradient,
                          delete o.gradient,
                          !t.is(o.opacity, "undefined") &&
                            t.is(i.opacity, "undefined") &&
                            It(s, { opacity: o.opacity }),
                          !t.is(o["fill-opacity"], "undefined") &&
                            t.is(i["fill-opacity"], "undefined") &&
                            It(s, { "fill-opacity": o["fill-opacity"] });
                      }
                      C[c]("opacity") &&
                        It(s, {
                          "fill-opacity":
                            C.opacity > 1 ? C.opacity / 100 : C.opacity,
                        });
                    case "stroke":
                      (C = t.getRGB(p)),
                        s[z](f, C.hex),
                        "stroke" == f &&
                          C[c]("opacity") &&
                          It(s, {
                            "stroke-opacity":
                              C.opacity > 1 ? C.opacity / 100 : C.opacity,
                          });
                      break;
                    case "gradient":
                      (({ circle: 1, ellipse: 1 })[c](e.type) ||
                        "r" != b(p).charAt()) &&
                        _t(s, p, e.paper);
                      break;
                    case "opacity":
                      o.gradient &&
                        !o[c]("stroke-opacity") &&
                        It(s, { "stroke-opacity": p > 1 ? p / 100 : p });
                    case "fill-opacity":
                      if (o.gradient) {
                        var I = u.getElementById(
                          s.getAttribute(B)[Q](/^url\(#|\)$/g, v)
                        );
                        if (I) {
                          var O = I.getElementsByTagName("stop");
                          O[O[E] - 1][z]("stop-opacity", p);
                        }
                        break;
                      }
                    default:
                      "font-size" == f && (p = H(p, 10) + "px");
                      var _ = f[Q](/(\-.)/g, function (t) {
                        return W.call(t.substring(1));
                      });
                      (s.style[_] = p), s[z](f, p);
                  }
                }
              Pt(e, i), l ? e.rotate(l.join(y)) : G(a) && e.rotate(a, !0);
            },
            Pt = function (e, i) {
              if (
                "text" == e.type &&
                (i[c]("text") ||
                  i[c]("font") ||
                  i[c]("font-size") ||
                  i[c]("x") ||
                  i[c]("y"))
              ) {
                var r = e.attrs,
                  n = e.node,
                  s = n.firstChild
                    ? H(
                        u.defaultView
                          .getComputedStyle(n.firstChild, v)
                          .getPropertyValue("font-size"),
                        10
                      )
                    : 10;
                if (i[c]("text")) {
                  for (r.text = i.text; n.firstChild; )
                    n.removeChild(n.firstChild);
                  for (var o = b(i.text)[x]("\n"), a = 0, h = o[E]; a < h; a++)
                    if (o[a]) {
                      var l = It("tspan");
                      a && It(l, { dy: 1.2 * s, x: r.x }),
                        l[d](u.createTextNode(o[a])),
                        n[d](l);
                    }
                } else
                  for (
                    a = 0, h = (o = n.getElementsByTagName("tspan"))[E];
                    a < h;
                    a++
                  )
                    a && It(o[a], { dy: 1.2 * s, x: r.x });
                It(n, { y: r.y });
                var f = e.getBBox(),
                  p = r.y - (f.y + f.height / 2);
                p && t.is(p, "finite") && It(n, { y: r.y + p });
              }
            },
            Rt = function (e, i) {
              (this[0] = e),
                (this.id = t._oid++),
                (this.node = e),
                (e.raphael = this),
                (this.paper = i),
                (this.attrs = this.attrs || {}),
                (this.transformations = []),
                (this._ = {
                  tx: 0,
                  ty: 0,
                  rt: { deg: 0, cx: 0, cy: 0 },
                  sx: 1,
                  sy: 1,
                }),
                !i.bottom && (i.bottom = this),
                (this.prev = i.top),
                i.top && (i.top.next = this),
                (i.top = this),
                (this.next = null);
            },
            Xt = Rt[a];
          (Rt[a].rotate = function (e, i, r) {
            if (this.removed) return this;
            if (null == e)
              return this._.rt.cx
                ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][T](y)
                : this._.rt.deg;
            var s = this.getBBox();
            return (
              (e = b(e)[x](n))[E] - 1 && ((i = G(e[1])), (r = G(e[2]))),
              (e = G(e[0])),
              null != i && !1 !== i
                ? (this._.rt.deg = e)
                : (this._.rt.deg += e),
              null == r && (i = null),
              (this._.rt.cx = i),
              (this._.rt.cy = r),
              (i = null == i ? s.x + s.width / 2 : i),
              (r = null == r ? s.y + s.height / 2 : r),
              this._.rt.deg
                ? ((this.transformations[0] = t.format(
                    "rotate({0} {1} {2})",
                    this._.rt.deg,
                    i,
                    r
                  )),
                  this.clip &&
                    It(this.clip, {
                      transform: t.format(
                        "rotate({0} {1} {2})",
                        -this._.rt.deg,
                        i,
                        r
                      ),
                    }))
                : ((this.transformations[0] = v),
                  this.clip && It(this.clip, { transform: v })),
              It(this.node, { transform: this.transformations[T](y) }),
              this
            );
          }),
            (Rt[a].hide = function () {
              return !this.removed && (this.node.style.display = "none"), this;
            }),
            (Rt[a].show = function () {
              return !this.removed && (this.node.style.display = ""), this;
            }),
            (Rt[a].remove = function () {
              if (!this.removed) {
                for (var t in (jt(this, this.paper),
                this.node.parentNode.removeChild(this.node),
                this))
                  delete this[t];
                this.removed = !0;
              }
            }),
            (Rt[a].getBBox = function () {
              if (this.removed) return this;
              if ("path" == this.type) return pt(this.attrs.path);
              if ("none" == this.node.style.display) {
                this.show();
                var t = !0;
              }
              var e = {};
              try {
                e = this.node.getBBox();
              } catch (t) {
              } finally {
                e = e || {};
              }
              if ("text" == this.type) {
                e = { x: e.x, y: 1 / 0, width: 0, height: 0 };
                for (var i = 0, r = this.node.getNumberOfChars(); i < r; i++) {
                  var n = this.node.getExtentOfChar(i);
                  n.y < e.y && (e.y = n.y),
                    n.y + n.height - e.y > e.height &&
                      (e.height = n.y + n.height - e.y),
                    n.x + n.width - e.x > e.width &&
                      (e.width = n.x + n.width - e.x);
                }
              }
              return t && this.hide(), e;
            }),
            (Rt[a].attr = function (e, i) {
              if (this.removed) return this;
              if (null == e) {
                var r = {};
                for (var n in this.attrs)
                  this.attrs[c](n) && (r[n] = this.attrs[n]);
                return (
                  this._.rt.deg && (r.rotation = this.rotate()),
                  (1 != this._.sx || 1 != this._.sy) &&
                    (r.scale = this.scale()),
                  r.gradient &&
                    "none" == r.fill &&
                    (r.fill = r.gradient) &&
                    delete r.gradient,
                  r
                );
              }
              if (null == i && t.is(e, I))
                return "translation" == e
                  ? Ee.call(this)
                  : "rotation" == e
                  ? this.rotate()
                  : "scale" == e
                  ? this.scale()
                  : e == B && "none" == this.attrs.fill && this.attrs.gradient
                  ? this.attrs.gradient
                  : this.attrs[e];
              if (null == i && t.is(e, O)) {
                for (var s = {}, o = 0, a = e.length; o < a; o++)
                  s[e[o]] = this.attr(e[o]);
                return s;
              }
              if (null != i) {
                var u = {};
                u[e] = i;
              } else null != e && t.is(e, "object") && (u = e);
              for (var h in this.paper.customAttributes)
                if (
                  this.paper.customAttributes[c](h) &&
                  u[c](h) &&
                  t.is(this.paper.customAttributes[h], "function")
                ) {
                  var l = this.paper.customAttributes[h].apply(
                    this,
                    [][m](u[h])
                  );
                  for (var f in ((this.attrs[h] = u[h]), l))
                    l[c](f) && (u[f] = l[f]);
                }
              return Lt(this, u), this;
            }),
            (Rt[a].toFront = function () {
              if (this.removed) return this;
              this.node.parentNode[d](this.node);
              var t = this.paper;
              return t.top != this && Mt(this, t), this;
            }),
            (Rt[a].toBack = function () {
              return (
                this.removed ||
                  (this.node.parentNode.firstChild != this.node &&
                    (this.node.parentNode.insertBefore(
                      this.node,
                      this.node.parentNode.firstChild
                    ),
                    At(this, this.paper),
                    this.paper)),
                this
              );
            }),
            (Rt[a].insertAfter = function (t) {
              if (this.removed) return this;
              var e = t.node || t[t.length - 1].node;
              return (
                e.nextSibling
                  ? e.parentNode.insertBefore(this.node, e.nextSibling)
                  : e.parentNode[d](this.node),
                Nt(this, t, this.paper),
                this
              );
            }),
            (Rt[a].insertBefore = function (t) {
              if (this.removed) return this;
              var e = t.node || t[0].node;
              return (
                e.parentNode.insertBefore(this.node, e),
                Ut(this, t, this.paper),
                this
              );
            }),
            (Rt[a].blur = function (t) {
              var e = this;
              if (0 != +t) {
                var i = It("filter"),
                  r = It("feGaussianBlur");
                (e.attrs.blur = t),
                  (i.id = ct()),
                  It(r, { stdDeviation: +t || 1.5 }),
                  i.appendChild(r),
                  e.paper.defs.appendChild(i),
                  (e._blur = i),
                  It(e.node, { filter: "url(#" + i.id + ")" });
              } else
                e._blur &&
                  (e._blur.parentNode.removeChild(e._blur),
                  delete e._blur,
                  delete e.attrs.blur),
                  e.node.removeAttribute("filter");
            });
          var Dt = function (t, e, i, r) {
              var n = It("circle");
              t.canvas && t.canvas[d](n);
              var s = new Rt(n, t);
              return (
                (s.attrs = {
                  cx: e,
                  cy: i,
                  r: r,
                  fill: "none",
                  stroke: "#000",
                }),
                (s.type = "circle"),
                It(n, s.attrs),
                s
              );
            },
            Yt = function (t, e, i, r, n, s) {
              var o = It("rect");
              t.canvas && t.canvas[d](o);
              var a = new Rt(o, t);
              return (
                (a.attrs = {
                  x: e,
                  y: i,
                  width: r,
                  height: n,
                  r: s || 0,
                  rx: s || 0,
                  ry: s || 0,
                  fill: "none",
                  stroke: "#000",
                }),
                (a.type = "rect"),
                It(o, a.attrs),
                a
              );
            },
            Vt = function (t, e, i, r, n) {
              var s = It("ellipse");
              t.canvas && t.canvas[d](s);
              var o = new Rt(s, t);
              return (
                (o.attrs = {
                  cx: e,
                  cy: i,
                  rx: r,
                  ry: n,
                  fill: "none",
                  stroke: "#000",
                }),
                (o.type = "ellipse"),
                It(s, o.attrs),
                o
              );
            },
            zt = function (t, e, i, r, n, s) {
              var o = It("image");
              It(o, {
                x: i,
                y: r,
                width: n,
                height: s,
                preserveAspectRatio: "none",
              }),
                o.setAttributeNS(t.xlink, "href", e),
                t.canvas && t.canvas[d](o);
              var a = new Rt(o, t);
              return (
                (a.attrs = { x: i, y: r, width: n, height: s, src: e }),
                (a.type = "image"),
                a
              );
            },
            Gt = function (t, e, i, r) {
              var n = It("text");
              It(n, { x: e, y: i, "text-anchor": "middle" }),
                t.canvas && t.canvas[d](n);
              var s = new Rt(n, t);
              return (
                (s.attrs = {
                  x: e,
                  y: i,
                  "text-anchor": "middle",
                  text: r,
                  font: Z.font,
                  stroke: "none",
                  fill: "#000",
                }),
                (s.type = "text"),
                Lt(s, s.attrs),
                s
              );
            },
            Ht = function (t, e) {
              return (
                (this.width = t || this.width),
                (this.height = e || this.height),
                this.canvas[z]("width", this.width),
                this.canvas[z]("height", this.height),
                this
              );
            },
            Ft = function () {
              var e = St[p](0, arguments),
                i = e && e.container,
                r = e.x,
                n = e.y,
                s = e.width,
                o = e.height;
              if (!i) throw new Error("SVG container not found.");
              var a = It("svg");
              return (
                (r = r || 0),
                (n = n || 0),
                It(a, {
                  xmlns: "http://www.w3.org/2000/svg",
                  version: 1.1,
                  width: (s = s || 512),
                  height: (o = o || 342),
                }),
                1 == i
                  ? ((a.style.cssText =
                      "position:absolute;left:" + r + "px;top:" + n + "px"),
                    u.body[d](a))
                  : i.firstChild
                  ? i.insertBefore(a, i.firstChild)
                  : i[d](a),
                ((i = new f()).width = s),
                (i.height = o),
                (i.canvas = a),
                qt.call(i, i, t.fn),
                i.clear(),
                i
              );
            };
          (r.clear = function () {
            for (var t = this.canvas; t.firstChild; )
              t.removeChild(t.firstChild);
            (this.bottom = this.top = null),
              (this.desc = It("desc"))[d](
                u.createTextNode("Created with Raphaël")
              ),
              t[d](this.desc),
              t[d]((this.defs = It("defs")));
          }),
            (r.remove = function () {
              for (var t in (this.canvas.parentNode &&
                this.canvas.parentNode.removeChild(this.canvas),
              this))
                this[t] = Ct(t);
            });
        }
        if (t.vml) {
          var Wt,
            Zt = {
              M: "m",
              L: "l",
              C: "c",
              Z: "x",
              m: "t",
              l: "r",
              c: "v",
              z: "x",
            },
            $t = /([clmz]),?([^clmz]*)/gi,
            Qt = / progid:\S+Blur\([^\)]+\)/g,
            Kt = /-?[^,\s-]+/g,
            Jt = "1000 1000",
            te = { path: 1, rect: 1 },
            ee = function (t) {
              var e = /[ahqstv]/gi,
                i = vt;
              if (
                (b(t).match(e) && (i = Tt),
                (e = /[clmz]/g),
                i == vt && !b(t).match(e))
              ) {
                var r = b(t)[Q]($t, function (t, e, i) {
                  var r = [],
                    n = "m" == S.call(e),
                    s = Zt[e];
                  return (
                    i[Q](Kt, function (t) {
                      n &&
                        2 == r[E] &&
                        ((s += r + Zt["m" == e ? "l" : "L"]), (r = [])),
                        r[P](V(10 * t));
                    }),
                    s + r
                  );
                });
                return r;
              }
              var n,
                s,
                o = i(t);
              r = [];
              for (var a = 0, c = o[E]; a < c; a++) {
                (n = o[a]), "z" == (s = S.call(o[a][0])) && (s = "x");
                for (var u = 1, h = n[E]; u < h; u++)
                  s += V(10 * n[u]) + (u != h - 1 ? "," : v);
                r[P](s);
              }
              return r[T](y);
            };
          function ie(e, i, r, n, s) {
            return s
              ? t.format(
                  "M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z",
                  e + s,
                  i,
                  r - 2 * s,
                  s,
                  -s,
                  n - 2 * s,
                  2 * s - r,
                  2 * s - n
                )
              : t.format("M{0},{1}l{2},0,0,{3},{4},0z", e, i, r, n, -r);
          }
          (t[_] = function () {
            return (
              "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " +
              this.version
            );
          }),
            (Ot = function (t, e) {
              var i = Wt("group");
              (i.style.cssText =
                "position:absolute;left:0;top:0;width:" +
                e.width +
                "px;height:" +
                e.height +
                "px"),
                (i.coordsize = e.coordsize),
                (i.coordorigin = e.coordorigin);
              var r = Wt("shape"),
                n = r.style;
              (n.width = e.width + "px"),
                (n.height = e.height + "px"),
                (r.coordsize = Jt),
                (r.coordorigin = e.coordorigin),
                i[d](r);
              var s = new Rt(r, i, e),
                o = { fill: "none", stroke: "#000" };
              return (
                t && (o.path = t),
                (s.type = "path"),
                (s.path = []),
                (s.Path = v),
                Lt(s, o),
                e.canvas[d](i),
                s
              );
            }),
            (Lt = function (e, i) {
              e.attrs = e.attrs || {};
              var r,
                s = e.node,
                o = e.attrs,
                a = s.style,
                h =
                  (i.x != o.x ||
                    i.y != o.y ||
                    i.width != o.width ||
                    i.height != o.height ||
                    i.r != o.r) &&
                  "rect" == e.type,
                l = e;
              for (var f in i) i[c](f) && (o[f] = i[f]);
              if (
                (h &&
                  ((o.path = ie(o.x, o.y, o.width, o.height, o.r)),
                  (e.X = o.x),
                  (e.Y = o.y),
                  (e.W = o.width),
                  (e.H = o.height)),
                i.href && (s.href = i.href),
                i.title && (s.title = i.title),
                i.target && (s.target = i.target),
                i.cursor && (a.cursor = i.cursor),
                "blur" in i && e.blur(i.blur),
                ((i.path && "path" == e.type) || h) && (s.path = ee(o.path)),
                null != i.rotation && e.rotate(i.rotation, !0),
                i.translation &&
                  ((r = b(i.translation)[x](n)),
                  Ee.call(e, r[0], r[1]),
                  null != e._.rt.cx &&
                    ((e._.rt.cx += +r[0]),
                    (e._.rt.cy += +r[1]),
                    e.setBox(e.attrs, r[0], r[1]))),
                i.scale &&
                  ((r = b(i.scale)[x](n)),
                  e.scale(
                    +r[0] || 1,
                    +r[1] || +r[0] || 1,
                    +r[2] || null,
                    +r[3] || null
                  )),
                "clip-rect" in i)
              ) {
                var p = b(i["clip-rect"])[x](n);
                if (4 == p[E]) {
                  (p[2] = +p[2] + +p[0]), (p[3] = +p[3] + +p[1]);
                  var m = s.clipRect || u.createElement("div"),
                    g = m.style,
                    y = s.parentNode;
                  (g.clip = t.format("rect({1}px {2}px {3}px {0}px)", p)),
                    s.clipRect ||
                      ((g.position = "absolute"),
                      (g.top = 0),
                      (g.left = 0),
                      (g.width = e.paper.width + "px"),
                      (g.height = e.paper.height + "px"),
                      y.parentNode.insertBefore(m, y),
                      m[d](y),
                      (s.clipRect = m));
                }
                i["clip-rect"] || (s.clipRect && (s.clipRect.style.clip = v));
              }
              if (
                ("image" == e.type && i.src && (s.src = i.src),
                "image" == e.type &&
                  i.opacity &&
                  ((s.filterOpacity =
                    F + ".Alpha(opacity=" + 100 * i.opacity + ")"),
                  (a.filter = (s.filterMatrix || v) + (s.filterOpacity || v))),
                i.font && (a.font = i.font),
                i["font-family"] &&
                  (a.fontFamily =
                    '"' +
                    i["font-family"][x](",")[0][Q](/^['"]+|['"]+$/g, v) +
                    '"'),
                i["font-size"] && (a.fontSize = i["font-size"]),
                i["font-weight"] && (a.fontWeight = i["font-weight"]),
                i["font-style"] && (a.fontStyle = i["font-style"]),
                null != i.opacity ||
                  null != i["stroke-width"] ||
                  null != i.fill ||
                  null != i.stroke ||
                  null != i["stroke-width"] ||
                  null != i["stroke-opacity"] ||
                  null != i["fill-opacity"] ||
                  null != i["stroke-dasharray"] ||
                  null != i["stroke-miterlimit"] ||
                  null != i["stroke-linejoin"] ||
                  null != i["stroke-linecap"])
              ) {
                var w =
                    (s = e.shape || s).getElementsByTagName(B) &&
                    s.getElementsByTagName(B)[0],
                  k = !1;
                if (
                  (!w && (k = w = Wt(B)), "fill-opacity" in i || "opacity" in i)
                ) {
                  var T =
                    ((+o["fill-opacity"] + 1 || 2) - 1) *
                    ((+o.opacity + 1 || 2) - 1) *
                    ((+t.getRGB(i.fill).o + 1 || 2) - 1);
                  (T = M(j(T, 0), 1)), (w.opacity = T);
                }
                if (
                  (i.fill && (w.on = !0),
                  (null != w.on && "none" != i.fill) || (w.on = !1),
                  w.on && i.fill)
                ) {
                  var S = i.fill.match(R);
                  S
                    ? ((w.src = S[1]), (w.type = "tile"))
                    : ((w.color = t.getRGB(i.fill).hex),
                      (w.src = v),
                      (w.type = "solid"),
                      t.getRGB(i.fill).error &&
                        (l.type in { circle: 1, ellipse: 1 } ||
                          "r" != b(i.fill).charAt()) &&
                        _t(l, i.fill) &&
                        ((o.fill = "none"), (o.gradient = i.fill)));
                }
                k && s[d](w);
                var q =
                    s.getElementsByTagName("stroke") &&
                    s.getElementsByTagName("stroke")[0],
                  A = !1;
                !q && (A = q = Wt("stroke")),
                  ((i.stroke && "none" != i.stroke) ||
                    i["stroke-width"] ||
                    null != i["stroke-opacity"] ||
                    i["stroke-dasharray"] ||
                    i["stroke-miterlimit"] ||
                    i["stroke-linejoin"] ||
                    i["stroke-linecap"]) &&
                    (q.on = !0),
                  ("none" == i.stroke ||
                    null == q.on ||
                    0 == i.stroke ||
                    0 == i["stroke-width"]) &&
                    (q.on = !1);
                var N = t.getRGB(i.stroke);
                q.on && i.stroke && (q.color = N.hex),
                  (T =
                    ((+o["stroke-opacity"] + 1 || 2) - 1) *
                    ((+o.opacity + 1 || 2) - 1) *
                    ((+N.o + 1 || 2) - 1));
                var U = 0.75 * (G(i["stroke-width"]) || 1);
                if (
                  ((T = M(j(T, 0), 1)),
                  null == i["stroke-width"] && (U = o["stroke-width"]),
                  i["stroke-width"] && (q.weight = U),
                  U && U < 1 && (T *= U) && (q.weight = 1),
                  (q.opacity = T),
                  i["stroke-linejoin"] &&
                    (q.joinstyle = i["stroke-linejoin"] || "miter"),
                  (q.miterlimit = i["stroke-miterlimit"] || 8),
                  i["stroke-linecap"] &&
                    (q.endcap =
                      "butt" == i["stroke-linecap"]
                        ? "flat"
                        : "square" == i["stroke-linecap"]
                        ? "square"
                        : "round"),
                  i["stroke-dasharray"])
                ) {
                  var C = {
                    "-": "shortdash",
                    ".": "shortdot",
                    "-.": "shortdashdot",
                    "-..": "shortdashdotdot",
                    ". ": "dot",
                    "- ": "dash",
                    "--": "longdash",
                    "- .": "dashdot",
                    "--.": "longdashdot",
                    "--..": "longdashdotdot",
                  };
                  q.dashstyle = C[c](i["stroke-dasharray"])
                    ? C[i["stroke-dasharray"]]
                    : v;
                }
                A && s[d](q);
              }
              if ("text" == l.type)
                switch (
                  ((a = l.paper.span.style),
                  o.font && (a.font = o.font),
                  o["font-family"] && (a.fontFamily = o["font-family"]),
                  o["font-size"] && (a.fontSize = o["font-size"]),
                  o["font-weight"] && (a.fontWeight = o["font-weight"]),
                  o["font-style"] && (a.fontStyle = o["font-style"]),
                  l.node.string &&
                    (l.paper.span.innerHTML = b(l.node.string)
                      [Q](/</g, "&#60;")
                      [Q](/&/g, "&#38;")
                      [Q](/\n/g, "<br>")),
                  (l.W = o.w = l.paper.span.offsetWidth),
                  (l.H = o.h = l.paper.span.offsetHeight),
                  (l.X = o.x),
                  (l.Y = o.y + V(l.H / 2)),
                  o["text-anchor"])
                ) {
                  case "start":
                    (l.node.style["v-text-align"] = "left"),
                      (l.bbx = V(l.W / 2));
                    break;
                  case "end":
                    (l.node.style["v-text-align"] = "right"),
                      (l.bbx = -V(l.W / 2));
                    break;
                  default:
                    l.node.style["v-text-align"] = "center";
                }
            }),
            (_t = function (t, e) {
              (t.attrs = t.attrs || {}), t.attrs;
              var i,
                r = "linear",
                n = ".5 .5";
              if (
                ((t.attrs.gradient = e),
                (e = b(e)[Q](nt, function (t, e, i) {
                  return (
                    (r = "radial"),
                    e &&
                      i &&
                      ((e = G(e)),
                      (i = G(i)),
                      N(e - 0.5, 2) + N(i - 0.5, 2) > 0.25 &&
                        (i =
                          q.sqrt(0.25 - N(e - 0.5, 2)) * (2 * (i > 0.5) - 1) +
                          0.5),
                      (n = e + y + i)),
                    v
                  );
                })),
                (e = e[x](/\s*\-\s*/)),
                "linear" == r)
              ) {
                var s = e.shift();
                if (((s = -G(s)), isNaN(s))) return null;
              }
              var o = Et(e);
              if (!o) return null;
              if (
                (!(i =
                  (t = t.shape || t.node).getElementsByTagName(B)[0] || Wt(B))
                  .parentNode && t.appendChild(i),
                o[E])
              ) {
                (i.on = !0),
                  (i.method = "none"),
                  (i.color = o[0].color),
                  (i.color2 = o[o[E] - 1].color);
                for (var a = [], c = 0, u = o[E]; c < u; c++)
                  o[c].offset && a[P](o[c].offset + y + o[c].color);
                i.colors && (i.colors.value = a[E] ? a[T]() : "0% " + i.color),
                  "radial" == r
                    ? ((i.type = "gradientradial"),
                      (i.focus = "100%"),
                      (i.focussize = n),
                      (i.focusposition = n))
                    : ((i.type = "gradient"), (i.angle = (270 - s) % 360));
              }
              return 1;
            }),
            (Rt = function (e, i, r) {
              (this[0] = e),
                (this.id = t._oid++),
                (this.node = e),
                (e.raphael = this),
                (this.X = 0),
                (this.Y = 0),
                (this.attrs = {}),
                (this.Group = i),
                (this.paper = r),
                (this._ = { tx: 0, ty: 0, rt: { deg: 0 }, sx: 1, sy: 1 }),
                !r.bottom && (r.bottom = this),
                (this.prev = r.top),
                r.top && (r.top.next = this),
                (r.top = this),
                (this.next = null);
            }),
            ((Xt = Rt[a]).rotate = function (t, e, i) {
              return this.removed
                ? this
                : null == t
                ? this._.rt.cx
                  ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][T](y)
                  : this._.rt.deg
                : ((t = b(t)[x](n))[E] - 1 && ((e = G(t[1])), (i = G(t[2]))),
                  (t = G(t[0])),
                  null != e ? (this._.rt.deg = t) : (this._.rt.deg += t),
                  null == i && (e = null),
                  (this._.rt.cx = e),
                  (this._.rt.cy = i),
                  this.setBox(this.attrs, e, i),
                  (this.Group.style.rotation = this._.rt.deg),
                  this);
            }),
            (Xt.setBox = function (t, e, i) {
              if (this.removed) return this;
              var r = this.Group.style,
                n = (this.shape && this.shape.style) || this.node.style;
              for (var s in (t = t || {})) t[c](s) && (this.attrs[s] = t[s]);
              (e = e || this._.rt.cx), (i = i || this._.rt.cy);
              var o,
                a,
                u,
                h,
                l = this.attrs;
              switch (this.type) {
                case "circle":
                  (o = l.cx - l.r), (a = l.cy - l.r), (u = h = 2 * l.r);
                  break;
                case "ellipse":
                  (o = l.cx - l.rx),
                    (a = l.cy - l.ry),
                    (u = 2 * l.rx),
                    (h = 2 * l.ry);
                  break;
                case "image":
                  (o = +l.x),
                    (a = +l.y),
                    (u = l.width || 0),
                    (h = l.height || 0);
                  break;
                case "text":
                  (this.textpath.v = [
                    "m",
                    V(l.x),
                    ", ",
                    V(l.y - 2),
                    "l",
                    V(l.x) + 1,
                    ", ",
                    V(l.y - 2),
                  ][T](v)),
                    (o = l.x - V(this.W / 2)),
                    (a = l.y - this.H / 2),
                    (u = this.W),
                    (h = this.H);
                  break;
                case "rect":
                case "path":
                  if (this.attrs.path) {
                    var f = pt(this.attrs.path);
                    (o = f.x), (a = f.y), (u = f.width), (h = f.height);
                  } else
                    (o = 0),
                      (a = 0),
                      (u = this.paper.width),
                      (h = this.paper.height);
                  break;
                default:
                  (o = 0),
                    (a = 0),
                    (u = this.paper.width),
                    (h = this.paper.height);
              }
              i = null == i ? a + h / 2 : i;
              var d,
                p = (e = null == e ? o + u / 2 : e) - this.paper.width / 2,
                m = i - this.paper.height / 2;
              r.left != (d = p + "px") && (r.left = d),
                r.top != (d = m + "px") && (r.top = d),
                (this.X = te[c](this.type) ? -p : o),
                (this.Y = te[c](this.type) ? -m : a),
                (this.W = u),
                (this.H = h),
                te[c](this.type)
                  ? (n.left != (d = 10 * -p + "px") && (n.left = d),
                    n.top != (d = 10 * -m + "px") && (n.top = d))
                  : "text" == this.type
                  ? (n.left != (d = -p + "px") && (n.left = d),
                    n.top != (d = -m + "px") && (n.top = d))
                  : (r.width != (d = this.paper.width + "px") && (r.width = d),
                    r.height != (d = this.paper.height + "px") &&
                      (r.height = d),
                    n.left != (d = o - p + "px") && (n.left = d),
                    n.top != (d = a - m + "px") && (n.top = d),
                    n.width != (d = u + "px") && (n.width = d),
                    n.height != (d = h + "px") && (n.height = d));
            }),
            (Xt.hide = function () {
              return !this.removed && (this.Group.style.display = "none"), this;
            }),
            (Xt.show = function () {
              return (
                !this.removed && (this.Group.style.display = "block"), this
              );
            }),
            (Xt.getBBox = function () {
              return this.removed
                ? this
                : te[c](this.type)
                ? pt(this.attrs.path)
                : {
                    x: this.X + (this.bbx || 0),
                    y: this.Y,
                    width: this.W,
                    height: this.H,
                  };
            }),
            (Xt.remove = function () {
              if (!this.removed) {
                for (var t in (jt(this, this.paper),
                this.node.parentNode.removeChild(this.node),
                this.Group.parentNode.removeChild(this.Group),
                this.shape && this.shape.parentNode.removeChild(this.shape),
                this))
                  delete this[t];
                this.removed = !0;
              }
            }),
            (Xt.attr = function (e, i) {
              if (this.removed) return this;
              if (null == e) {
                var r = {};
                for (var n in this.attrs)
                  this.attrs[c](n) && (r[n] = this.attrs[n]);
                return (
                  this._.rt.deg && (r.rotation = this.rotate()),
                  (1 != this._.sx || 1 != this._.sy) &&
                    (r.scale = this.scale()),
                  r.gradient &&
                    "none" == r.fill &&
                    (r.fill = r.gradient) &&
                    delete r.gradient,
                  r
                );
              }
              if (null == i && t.is(e, "string"))
                return "translation" == e
                  ? Ee.call(this)
                  : "rotation" == e
                  ? this.rotate()
                  : "scale" == e
                  ? this.scale()
                  : e == B && "none" == this.attrs.fill && this.attrs.gradient
                  ? this.attrs.gradient
                  : this.attrs[e];
              if (this.attrs && null == i && t.is(e, O)) {
                var s,
                  o = {};
                for (n = 0, s = e[E]; n < s; n++) o[e[n]] = this.attr(e[n]);
                return o;
              }
              var a;
              if (
                (null != i && ((a = {})[e] = i),
                null == i && t.is(e, "object") && (a = e),
                a)
              ) {
                for (var u in this.paper.customAttributes)
                  if (
                    this.paper.customAttributes[c](u) &&
                    a[c](u) &&
                    t.is(this.paper.customAttributes[u], "function")
                  ) {
                    var h = this.paper.customAttributes[u].apply(
                      this,
                      [][m](a[u])
                    );
                    for (var l in ((this.attrs[u] = a[u]), h))
                      h[c](l) && (a[l] = h[l]);
                  }
                a.text && "text" == this.type && (this.node.string = a.text),
                  Lt(this, a),
                  a.gradient &&
                    ({ circle: 1, ellipse: 1 }[c](this.type) ||
                      "r" != b(a.gradient).charAt()) &&
                    _t(this, a.gradient),
                  (!te[c](this.type) || this._.rt.deg) &&
                    this.setBox(this.attrs);
              }
              return this;
            }),
            (Xt.toFront = function () {
              return (
                !this.removed && this.Group.parentNode[d](this.Group),
                this.paper.top != this && Mt(this, this.paper),
                this
              );
            }),
            (Xt.toBack = function () {
              return (
                this.removed ||
                  (this.Group.parentNode.firstChild != this.Group &&
                    (this.Group.parentNode.insertBefore(
                      this.Group,
                      this.Group.parentNode.firstChild
                    ),
                    At(this, this.paper))),
                this
              );
            }),
            (Xt.insertAfter = function (t) {
              return (
                this.removed ||
                  (t.constructor == je && (t = t[t.length - 1]),
                  t.Group.nextSibling
                    ? t.Group.parentNode.insertBefore(
                        this.Group,
                        t.Group.nextSibling
                      )
                    : t.Group.parentNode[d](this.Group),
                  Nt(this, t, this.paper)),
                this
              );
            }),
            (Xt.insertBefore = function (t) {
              return (
                this.removed ||
                  (t.constructor == je && (t = t[0]),
                  t.Group.parentNode.insertBefore(this.Group, t.Group),
                  Ut(this, t, this.paper)),
                this
              );
            }),
            (Xt.blur = function (e) {
              var i = this.node.runtimeStyle,
                r = i.filter;
              (r = r.replace(Qt, v)),
                0 != +e
                  ? ((this.attrs.blur = e),
                    (i.filter =
                      r + y + F + ".Blur(pixelradius=" + (+e || 1.5) + ")"),
                    (i.margin = t.format("-{0}px 0 0 -{0}px", V(+e || 1.5))))
                  : ((i.filter = r), (i.margin = 0), delete this.attrs.blur);
            }),
            (Dt = function (t, e, i, r) {
              var n = Wt("group"),
                s = Wt("oval");
              s.style,
                (n.style.cssText =
                  "position:absolute;left:0;top:0;width:" +
                  t.width +
                  "px;height:" +
                  t.height +
                  "px"),
                (n.coordsize = Jt),
                (n.coordorigin = t.coordorigin),
                n[d](s);
              var o = new Rt(s, n, t);
              return (
                (o.type = "circle"),
                Lt(o, { stroke: "#000", fill: "none" }),
                (o.attrs.cx = e),
                (o.attrs.cy = i),
                (o.attrs.r = r),
                o.setBox({ x: e - r, y: i - r, width: 2 * r, height: 2 * r }),
                t.canvas[d](n),
                o
              );
            }),
            (Yt = function (t, e, i, r, n, s) {
              var o = ie(e, i, r, n, s),
                a = t.path(o),
                c = a.attrs;
              return (
                (a.X = c.x = e),
                (a.Y = c.y = i),
                (a.W = c.width = r),
                (a.H = c.height = n),
                (c.r = s),
                (c.path = o),
                (a.type = "rect"),
                a
              );
            }),
            (Vt = function (t, e, i, r, n) {
              var s = Wt("group"),
                o = Wt("oval");
              o.style,
                (s.style.cssText =
                  "position:absolute;left:0;top:0;width:" +
                  t.width +
                  "px;height:" +
                  t.height +
                  "px"),
                (s.coordsize = Jt),
                (s.coordorigin = t.coordorigin),
                s[d](o);
              var a = new Rt(o, s, t);
              return (
                (a.type = "ellipse"),
                Lt(a, { stroke: "#000" }),
                (a.attrs.cx = e),
                (a.attrs.cy = i),
                (a.attrs.rx = r),
                (a.attrs.ry = n),
                a.setBox({ x: e - r, y: i - n, width: 2 * r, height: 2 * n }),
                t.canvas[d](s),
                a
              );
            }),
            (zt = function (t, e, i, r, n, s) {
              var o = Wt("group"),
                a = Wt("image");
              (o.style.cssText =
                "position:absolute;left:0;top:0;width:" +
                t.width +
                "px;height:" +
                t.height +
                "px"),
                (o.coordsize = Jt),
                (o.coordorigin = t.coordorigin),
                (a.src = e),
                o[d](a);
              var c = new Rt(a, o, t);
              return (
                (c.type = "image"),
                (c.attrs.src = e),
                (c.attrs.x = i),
                (c.attrs.y = r),
                (c.attrs.w = n),
                (c.attrs.h = s),
                c.setBox({ x: i, y: r, width: n, height: s }),
                t.canvas[d](o),
                c
              );
            }),
            (Gt = function (e, i, r, n) {
              var s = Wt("group"),
                o = Wt("shape"),
                a = o.style,
                c = Wt("path"),
                u = (c.style, Wt("textpath"));
              (s.style.cssText =
                "position:absolute;left:0;top:0;width:" +
                e.width +
                "px;height:" +
                e.height +
                "px"),
                (s.coordsize = Jt),
                (s.coordorigin = e.coordorigin),
                (c.v = t.format(
                  "m{0},{1}l{2},{1}",
                  V(10 * i),
                  V(10 * r),
                  V(10 * i) + 1
                )),
                (c.textpathok = !0),
                (a.width = e.width),
                (a.height = e.height),
                (u.string = b(n)),
                (u.on = !0),
                o[d](u),
                o[d](c),
                s[d](o);
              var h = new Rt(u, s, e);
              return (
                (h.shape = o),
                (h.textpath = c),
                (h.type = "text"),
                (h.attrs.text = n),
                (h.attrs.x = i),
                (h.attrs.y = r),
                (h.attrs.w = 1),
                (h.attrs.h = 1),
                Lt(h, { font: Z.font, stroke: "none", fill: "#000" }),
                h.setBox(),
                e.canvas[d](s),
                h
              );
            }),
            (Ht = function (t, e) {
              var i = this.canvas.style;
              return (
                t == +t && (t += "px"),
                e == +e && (e += "px"),
                (i.width = t),
                (i.height = e),
                (i.clip = "rect(0 " + t + " " + e + " 0)"),
                this
              );
            }),
            u.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
          try {
            !u.namespaces.rvml &&
              u.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"),
              (Wt = function (t) {
                return u.createElement("<rvml:" + t + ' class="rvml">');
              });
          } catch (t) {
            Wt = function (t) {
              return u.createElement(
                "<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">'
              );
            };
          }
          (Ft = function () {
            var e = St[p](0, arguments),
              i = e.container,
              r = e.height,
              n = e.width,
              s = e.x,
              o = e.y;
            if (!i) throw new Error("VML container not found.");
            var a = new f(),
              c = (a.canvas = u.createElement("div")),
              h = c.style;
            return (
              (s = s || 0),
              (o = o || 0),
              (n = n || 512) == +n && (n += "px"),
              (r = r || 342) == +r && (r += "px"),
              (a.width = 1e3),
              (a.height = 1e3),
              (a.coordsize = "10000 10000"),
              (a.coordorigin = "0 0"),
              (a.span = u.createElement("span")),
              (a.span.style.cssText =
                "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;"),
              c[d](a.span),
              (h.cssText = t.format(
                "top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",
                n,
                r
              )),
              1 == i
                ? (u.body[d](c),
                  (h.left = s + "px"),
                  (h.top = o + "px"),
                  (h.position = "absolute"))
                : i.firstChild
                ? i.insertBefore(c, i.firstChild)
                : i[d](c),
              qt.call(a, a, t.fn),
              a
            );
          }),
            (r.clear = function () {
              (this.canvas.innerHTML = v),
                (this.span = u.createElement("span")),
                (this.span.style.cssText =
                  "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;"),
                this.canvas[d](this.span),
                (this.bottom = this.top = null);
            }),
            (r.remove = function () {
              for (var t in (this.canvas.parentNode.removeChild(this.canvas),
              this))
                this[t] = Ct(t);
              return !0;
            });
        }
        var re = navigator.userAgent.match(/Version\\x2f(.*?)\s/);
        "Apple Computer, Inc." == navigator.vendor &&
        ((re && re[1] < 4) || "iP" == navigator.platform.slice(0, 2))
          ? (r.safari = function () {
              var t = this.rect(
                -99,
                -99,
                this.width + 99,
                this.height + 99
              ).attr({ stroke: "none" });
              h.setTimeout(function () {
                t.remove();
              });
            })
          : (r.safari = function () {});
        for (
          var ne = function () {
              this.returnValue = !1;
            },
            se = function () {
              return this.originalEvent.preventDefault();
            },
            oe = function () {
              this.cancelBubble = !0;
            },
            ae = function () {
              return this.originalEvent.stopPropagation();
            },
            ce = u.addEventListener
              ? function (t, e, i, r) {
                  var n = g && k[e] ? k[e] : e,
                    s = function (n) {
                      if (g && k[c](e))
                        for (
                          var s = 0,
                            o = n.targetTouches && n.targetTouches.length;
                          s < o;
                          s++
                        )
                          if (n.targetTouches[s].target == t) {
                            var a = n;
                            ((n = n.targetTouches[s]).originalEvent = a),
                              (n.preventDefault = se),
                              (n.stopPropagation = ae);
                            break;
                          }
                      return i.call(r, n);
                    };
                  return (
                    t.addEventListener(n, s, !1),
                    function () {
                      return t.removeEventListener(n, s, !1), !0;
                    }
                  );
                }
              : u.attachEvent
              ? function (t, e, i, r) {
                  var n = function (t) {
                    return (
                      ((t = t || h.event).preventDefault =
                        t.preventDefault || ne),
                      (t.stopPropagation = t.stopPropagation || oe),
                      i.call(r, t)
                    );
                  };
                  return (
                    t.attachEvent("on" + e, n),
                    function () {
                      return t.detachEvent("on" + e, n), !0;
                    }
                  );
                }
              : void 0,
            ue = [],
            he = function (t) {
              for (
                var e,
                  i = t.clientX,
                  r = t.clientY,
                  n = u.documentElement.scrollTop || u.body.scrollTop,
                  s = u.documentElement.scrollLeft || u.body.scrollLeft,
                  o = ue.length;
                o--;

              ) {
                if (((e = ue[o]), g)) {
                  for (var a, c = t.touches.length; c--; )
                    if ((a = t.touches[c]).identifier == e.el._drag.id) {
                      (i = a.clientX),
                        (r = a.clientY),
                        (t.originalEvent
                          ? t.originalEvent
                          : t
                        ).preventDefault();
                      break;
                    }
                } else t.preventDefault();
                (i += s),
                  (r += n),
                  e.move &&
                    e.move.call(
                      e.move_scope || e.el,
                      i - e.el._drag.x,
                      r - e.el._drag.y,
                      i,
                      r,
                      t
                    );
              }
            },
            le = function (e) {
              t.unmousemove(he).unmouseup(le);
              for (var i, r = ue.length; r--; )
                ((i = ue[r]).el._drag = {}),
                  i.end &&
                    i.end.call(
                      i.end_scope || i.start_scope || i.move_scope || i.el,
                      e
                    );
              ue = [];
            },
            fe = w[E];
          fe--;

        )
          !(function (e) {
            (t[e] = Rt[a][e] =
              function (i, r) {
                return (
                  t.is(i, "function") &&
                    ((this.events = this.events || []),
                    this.events.push({
                      name: e,
                      f: i,
                      unbind: ce(this.shape || this.node || u, e, i, r || this),
                    })),
                  this
                );
              }),
              (t["un" + e] = Rt[a]["un" + e] =
                function (t) {
                  for (var i = this.events, r = i[E]; r--; )
                    if (i[r].name == e && i[r].f == t)
                      return (
                        i[r].unbind(),
                        i.splice(r, 1),
                        !i.length && delete this.events,
                        this
                      );
                  return this;
                });
          })(w[fe]);
        function de() {
          return this.x + y + this.y;
        }
        (Xt.hover = function (t, e, i, r) {
          return this.mouseover(t, i).mouseout(e, r || i);
        }),
          (Xt.unhover = function (t, e) {
            return this.unmouseover(t).unmouseout(e);
          }),
          (Xt.drag = function (e, i, r, n, s, o) {
            return (
              (this._drag = {}),
              this.mousedown(function (a) {
                (a.originalEvent || a).preventDefault();
                var c = u.documentElement.scrollTop || u.body.scrollTop,
                  h = u.documentElement.scrollLeft || u.body.scrollLeft;
                (this._drag.x = a.clientX + h),
                  (this._drag.y = a.clientY + c),
                  (this._drag.id = a.identifier),
                  i && i.call(s || n || this, a.clientX + h, a.clientY + c, a),
                  !ue.length && t.mousemove(he).mouseup(le),
                  ue.push({
                    el: this,
                    move: e,
                    end: r,
                    move_scope: n,
                    start_scope: s,
                    end_scope: o,
                  });
              }),
              this
            );
          }),
          (Xt.undrag = function (e, i, r) {
            for (var n = ue.length; n--; )
              ue[n].el == this &&
                ue[n].move == e &&
                ue[n].end == r &&
                ue.splice(n++, 1);
            !ue.length && t.unmousemove(he).unmouseup(le);
          }),
          (r.circle = function (t, e, i) {
            return Dt(this, t || 0, e || 0, i || 0);
          }),
          (r.rect = function (t, e, i, r, n) {
            return Yt(this, t || 0, e || 0, i || 0, r || 0, n || 0);
          }),
          (r.ellipse = function (t, e, i, r) {
            return Vt(this, t || 0, e || 0, i || 0, r || 0);
          }),
          (r.path = function (e) {
            return (
              e && !t.is(e, I) && !t.is(e[0], O) && (e += v),
              Ot(t.format[p](t, arguments), this)
            );
          }),
          (r.image = function (t, e, i, r, n) {
            return zt(this, t || "about:blank", e || 0, i || 0, r || 0, n || 0);
          }),
          (r.text = function (t, e, i) {
            return Gt(this, t || 0, e || 0, b(i));
          }),
          (r.set = function (t) {
            return (
              arguments[E] > 1 &&
                (t = Array[a].splice.call(arguments, 0, arguments[E])),
              new je(t)
            );
          }),
          (r.setSize = Ht),
          (r.top = r.bottom = null),
          (r.raphael = t),
          (Xt.resetScale = function () {
            if (this.removed) return this;
            (this._.sx = 1), (this._.sy = 1), (this.attrs.scale = "1 1");
          }),
          (Xt.scale = function (t, e, i, r) {
            if (this.removed) return this;
            if (null == t && null == e)
              return { x: this._.sx, y: this._.sy, toString: de };
            !+(e = e || t) && (e = t);
            var n,
              s,
              o = this.attrs;
            if (0 != t) {
              var a = this.getBBox(),
                c = a.x + a.width / 2,
                u = a.y + a.height / 2,
                h = A(t / this._.sx),
                l = A(e / this._.sy);
              (i = +i || 0 == i ? i : c), (r = +r || 0 == r ? r : u);
              var f = this._.sx > 0,
                d = this._.sy > 0,
                p = ~~(t / A(t)),
                g = ~~(e / A(e)),
                b = h * p,
                x = l * g,
                w = this.node.style,
                k = i + A(c - i) * b * (c > i == f ? 1 : -1),
                S = r + A(u - r) * x * (u > r == d ? 1 : -1),
                q = t * p > e * g ? l : h;
              switch (this.type) {
                case "rect":
                case "image":
                  var j = o.width * h,
                    M = o.height * l;
                  this.attr({
                    height: M,
                    r: o.r * q,
                    width: j,
                    x: k - j / 2,
                    y: S - M / 2,
                  });
                  break;
                case "circle":
                case "ellipse":
                  this.attr({
                    rx: o.rx * h,
                    ry: o.ry * l,
                    r: o.r * q,
                    cx: k,
                    cy: S,
                  });
                  break;
                case "text":
                  this.attr({ x: k, y: S });
                  break;
                case "path":
                  for (
                    var N = gt(o.path),
                      U = !0,
                      C = f ? b : h,
                      I = d ? x : l,
                      O = 0,
                      _ = N[E];
                    O < _;
                    O++
                  ) {
                    var B = N[O],
                      L = W.call(B[0]);
                    if ("M" != L || !U)
                      if (((U = !1), "A" == L))
                        (B[N[O][E] - 2] *= C),
                          (B[N[O][E] - 1] *= I),
                          (B[1] *= h),
                          (B[2] *= l),
                          (B[5] = +(p + g ? !!+B[5] : !+B[5]));
                      else if ("H" == L)
                        for (var P = 1, R = B[E]; P < R; P++) B[P] *= C;
                      else if ("V" == L)
                        for (P = 1, R = B[E]; P < R; P++) B[P] *= I;
                      else
                        for (P = 1, R = B[E]; P < R; P++) B[P] *= P % 2 ? C : I;
                  }
                  var X = pt(N);
                  (n = k - X.x - X.width / 2),
                    (s = S - X.y - X.height / 2),
                    (N[0][1] += n),
                    (N[0][2] += s),
                    this.attr({ path: N });
              }
              !(this.type in { text: 1, image: 1 }) || (1 == p && 1 == g)
                ? this.transformations
                  ? ((this.transformations[2] = v),
                    this.node[z]("transform", this.transformations[T](y)),
                    (o.fx = 0),
                    (o.fy = 0))
                  : ((this.node.filterMatrix = v),
                    (w.filter =
                      (this.node.filterMatrix || v) +
                      (this.node.filterOpacity || v)))
                : this.transformations
                ? ((this.transformations[2] = "scale("[m](p, ",", g, ")")),
                  this.node[z]("transform", this.transformations[T](y)),
                  (n = -1 == p ? -o.x - (j || 0) : o.x),
                  (s = -1 == g ? -o.y - (M || 0) : o.y),
                  this.attr({ x: n, y: s }),
                  (o.fx = p - 1),
                  (o.fy = g - 1))
                : ((this.node.filterMatrix =
                    F +
                    ".Matrix(M11="[m](
                      p,
                      ", M12=0, M21=0, M22=",
                      g,
                      ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')"
                    )),
                  (w.filter =
                    (this.node.filterMatrix || v) +
                    (this.node.filterOpacity || v))),
                (o.scale = [t, e, i, r][T](y)),
                (this._.sx = t),
                (this._.sy = e);
            }
            return this;
          }),
          (Xt.clone = function () {
            if (this.removed) return null;
            var t = this.attr();
            return (
              delete t.scale,
              delete t.translation,
              this.paper[this.type]().attr(t)
            );
          });
        var pe = {},
          me = function (e, i, r, n, s, o, a, c, u) {
            var h,
              l,
              f = 0,
              d = 100,
              p = [e, i, r, n, s, o, a, c].join(),
              m = pe[p];
            !m && (pe[p] = m = { data: [] }),
              m.timer && clearTimeout(m.timer),
              (m.timer = setTimeout(function () {
                delete pe[p];
              }, 2e3)),
              null != u && (d = 10 * ~~me(e, i, r, n, s, o, a, c));
            for (var g = 0; g < d + 1; g++) {
              if (
                (m.data[u] > g
                  ? (l = m.data[g * d])
                  : ((l = t.findDotsAtSegment(e, i, r, n, s, o, a, c, g / d)),
                    (m.data[g] = l)),
                g && (f += N(N(h.x - l.x, 2) + N(h.y - l.y, 2), 0.5)),
                null != u && f >= u)
              )
                return l;
              h = l;
            }
            if (null == u) return f;
          },
          ge = function (e, i) {
            return function (r, n, s) {
              for (
                var o,
                  a,
                  c,
                  u,
                  h,
                  l = "",
                  f = {},
                  d = 0,
                  p = 0,
                  m = (r = Tt(r)).length;
                p < m;
                p++
              ) {
                if ("M" == (c = r[p])[0]) (o = +c[1]), (a = +c[2]);
                else {
                  if (
                    d + (u = me(o, a, c[1], c[2], c[3], c[4], c[5], c[6])) >
                    n
                  ) {
                    if (i && !f.start) {
                      if (
                        ((l += [
                          "C",
                          (h = me(
                            o,
                            a,
                            c[1],
                            c[2],
                            c[3],
                            c[4],
                            c[5],
                            c[6],
                            n - d
                          )).start.x,
                          h.start.y,
                          h.m.x,
                          h.m.y,
                          h.x,
                          h.y,
                        ]),
                        s)
                      )
                        return l;
                      (f.start = l),
                        (l = [
                          "M",
                          h.x,
                          h.y + "C",
                          h.n.x,
                          h.n.y,
                          h.end.x,
                          h.end.y,
                          c[5],
                          c[6],
                        ][T]()),
                        (d += u),
                        (o = +c[5]),
                        (a = +c[6]);
                      continue;
                    }
                    if (!e && !i)
                      return {
                        x: (h = me(
                          o,
                          a,
                          c[1],
                          c[2],
                          c[3],
                          c[4],
                          c[5],
                          c[6],
                          n - d
                        )).x,
                        y: h.y,
                        alpha: h.alpha,
                      };
                  }
                  (d += u), (o = +c[5]), (a = +c[6]);
                }
                l += c;
              }
              return (
                (f.end = l),
                (h = e
                  ? d
                  : i
                  ? f
                  : t.findDotsAtSegment(
                      o,
                      a,
                      c[1],
                      c[2],
                      c[3],
                      c[4],
                      c[5],
                      c[6],
                      1
                    )).alpha && (h = { x: h.x, y: h.y, alpha: h.alpha }),
                h
              );
            };
          },
          ve = ge(1),
          ye = ge(),
          be = ge(0, 1);
        (Xt.getTotalLength = function () {
          if ("path" == this.type)
            return this.node.getTotalLength
              ? this.node.getTotalLength()
              : ve(this.attrs.path);
        }),
          (Xt.getPointAtLength = function (t) {
            if ("path" == this.type) return ye(this.attrs.path, t);
          }),
          (Xt.getSubpath = function (t, e) {
            if ("path" == this.type) {
              if (A(this.getTotalLength() - e) < "1e-6")
                return be(this.attrs.path, t).end;
              var i = be(this.attrs.path, e, 1);
              return t ? be(i, t).end : i;
            }
          }),
          (t.easing_formulas = {
            linear: function (t) {
              return t;
            },
            "<": function (t) {
              return N(t, 3);
            },
            ">": function (t) {
              return N(t - 1, 3) + 1;
            },
            "<>": function (t) {
              return (t *= 2) < 1 ? N(t, 3) / 2 : (N((t -= 2), 3) + 2) / 2;
            },
            backIn: function (t) {
              var e = 1.70158;
              return t * t * ((e + 1) * t - e);
            },
            backOut: function (t) {
              var e = 1.70158;
              return (t -= 1) * t * ((e + 1) * t + e) + 1;
            },
            elastic: function (t) {
              return 0 == t || 1 == t
                ? t
                : N(2, -10 * t) * q.sin((2 * U * (t - 0.075)) / 0.3) + 1;
            },
            bounce: function (t) {
              var e = 7.5625,
                i = 2.75;
              return t < 1 / i
                ? e * t * t
                : t < 2 / i
                ? e * (t -= 1.5 / i) * t + 0.75
                : t < 2.5 / i
                ? e * (t -= 2.25 / i) * t + 0.9375
                : e * (t -= 2.625 / i) * t + 0.984375;
            },
          });
        var xe = [],
          we = function () {
            for (var e = +new Date(), i = 0; i < xe[E]; i++) {
              var r = xe[i];
              if (!r.stop && !r.el.removed) {
                var n,
                  s = e - r.start,
                  o = r.ms,
                  a = r.easing,
                  u = r.from,
                  h = r.diff,
                  l = r.to,
                  f = r.t,
                  d = r.el,
                  p = {};
                if (s < o) {
                  var m = a(s / o);
                  for (var g in u)
                    if (u[c](g)) {
                      switch ($[g]) {
                        case "along":
                          (n = m * o * h[g]), l.back && (n = l.len - n);
                          var b = ye(l[g], n);
                          d.translate(h.sx - h.x || 0, h.sy - h.y || 0),
                            (h.x = b.x),
                            (h.y = b.y),
                            d.translate(b.x - h.sx, b.y - h.sy),
                            l.rot && d.rotate(h.r + b.alpha, b.x, b.y);
                          break;
                        case C:
                          n = +u[g] + m * o * h[g];
                          break;
                        case "colour":
                          n =
                            "rgb(" +
                            [
                              Te(V(u[g].r + m * o * h[g].r)),
                              Te(V(u[g].g + m * o * h[g].g)),
                              Te(V(u[g].b + m * o * h[g].b)),
                            ][T](",") +
                            ")";
                          break;
                        case "path":
                          n = [];
                          for (var x = 0, w = u[g][E]; x < w; x++) {
                            n[x] = [u[g][x][0]];
                            for (var k = 1, S = u[g][x][E]; k < S; k++)
                              n[x][k] = +u[g][x][k] + m * o * h[g][x][k];
                            n[x] = n[x][T](y);
                          }
                          n = n[T](y);
                          break;
                        case "csv":
                          switch (g) {
                            case "translation":
                              var q = m * o * h[g][0] - f.x,
                                j = m * o * h[g][1] - f.y;
                              (f.x += q), (f.y += j), (n = q + y + j);
                              break;
                            case "rotation":
                              (n = +u[g][0] + m * o * h[g][0]),
                                u[g][1] && (n += "," + u[g][1] + "," + u[g][2]);
                              break;
                            case "scale":
                              n = [
                                +u[g][0] + m * o * h[g][0],
                                +u[g][1] + m * o * h[g][1],
                                2 in l[g] ? l[g][2] : v,
                                3 in l[g] ? l[g][3] : v,
                              ][T](y);
                              break;
                            case "clip-rect":
                              for (n = [], x = 4; x--; )
                                n[x] = +u[g][x] + m * o * h[g][x];
                          }
                          break;
                        default:
                          var M = [].concat(u[g]);
                          for (
                            n = [], x = d.paper.customAttributes[g].length;
                            x--;

                          )
                            n[x] = +M[x] + m * o * h[g][x];
                      }
                      p[g] = n;
                    }
                  d.attr(p), d._run && d._run.call(d);
                } else
                  l.along &&
                    ((b = ye(l.along, l.len * !l.back)),
                    d.translate(
                      h.sx - (h.x || 0) + b.x - h.sx,
                      h.sy - (h.y || 0) + b.y - h.sy
                    ),
                    l.rot && d.rotate(h.r + b.alpha, b.x, b.y)),
                    (f.x || f.y) && d.translate(-f.x, -f.y),
                    l.scale && (l.scale += v),
                    d.attr(l),
                    xe.splice(i--, 1);
              }
            }
            t.svg && d && d.paper && d.paper.safari(), xe[E] && setTimeout(we);
          },
          ke = function (e, i, r, n, s) {
            var o = r - n;
            i.timeouts.push(
              setTimeout(function () {
                t.is(s, "function") && s.call(i), i.animate(e, o, e.easing);
              }, n)
            );
          },
          Te = function (t) {
            return j(M(t, 255), 0);
          },
          Ee = function (t, e) {
            if (null == t) return { x: this._.tx, y: this._.ty, toString: de };
            switch (((this._.tx += +t), (this._.ty += +e), this.type)) {
              case "circle":
              case "ellipse":
                this.attr({ cx: +t + this.attrs.cx, cy: +e + this.attrs.cy });
                break;
              case "rect":
              case "image":
              case "text":
                this.attr({ x: +t + this.attrs.x, y: +e + this.attrs.y });
                break;
              case "path":
                var i = gt(this.attrs.path);
                (i[0][1] += +t), (i[0][2] += +e), this.attr({ path: i });
            }
            return this;
          };
        function Se(e) {
          return function (i, r, n, s) {
            var o = { back: e };
            return (
              t.is(n, "function") ? (s = n) : (o.rot = n),
              i && i.constructor == Rt && (i = i.attrs.path),
              i && (o.along = i),
              this.animate(o, r, s)
            );
          };
        }
        function qe(t, e, i, r, n, s) {
          var o = 3 * e,
            a = 3 * (r - e) - o,
            c = 1 - o - a,
            u = 3 * i,
            h = 3 * (n - i) - u,
            l = 1 - u - h;
          function f(t) {
            return ((c * t + a) * t + o) * t;
          }
          return (function (t, e) {
            var i = (function (t, e) {
              var i, r, n, s, u, h;
              for (n = t, h = 0; h < 8; h++) {
                if (((s = f(n) - t), A(s) < e)) return n;
                if (A((u = (3 * c * n + 2 * a) * n + o)) < 1e-6) break;
                n -= s / u;
              }
              if ((n = t) < (i = 0)) return i;
              if (n > (r = 1)) return r;
              for (; i < r; ) {
                if (((s = f(n)), A(s - t) < e)) return n;
                t > s ? (i = n) : (r = n), (n = (r - i) / 2 + i);
              }
              return n;
            })(t, e);
            return ((l * i + h) * i + u) * i;
          })(t, 1 / (200 * s));
        }
        (Xt.animateWith = function (t, e, i, r, n) {
          for (var s = 0, o = xe.length; s < o; s++)
            xe[s].el.id == t.id && (e.start = xe[s].start);
          return this.animate(e, i, r, n);
        }),
          (Xt.animateAlong = Se()),
          (Xt.animateAlongBack = Se(1)),
          (Xt.onAnimation = function (t) {
            return (this._run = t || 0), this;
          }),
          (Xt.animate = function (e, i, r, s) {
            var o = this;
            if (
              ((o.timeouts = o.timeouts || []),
              (!t.is(r, "function") && r) || (s = r || null),
              o.removed)
            )
              return s && s.call(o), o;
            var a = {},
              u = {},
              h = !1,
              l = {};
            for (var f in e)
              if (e[c](f) && ($[c](f) || o.paper.customAttributes[c](f)))
                switch (
                  ((h = !0),
                  (a[f] = o.attr(f)),
                  null == a[f] && (a[f] = Z[f]),
                  (u[f] = e[f]),
                  $[f])
                ) {
                  case "along":
                    var d = ve(e[f]),
                      p = ye(e[f], d * !!e.back),
                      m = o.getBBox();
                    (l[f] = d / i),
                      (l.tx = m.x),
                      (l.ty = m.y),
                      (l.sx = p.x),
                      (l.sy = p.y),
                      (u.rot = e.rot),
                      (u.back = e.back),
                      (u.len = d),
                      e.rot && (l.r = G(o.rotate()) || 0);
                    break;
                  case C:
                    l[f] = (u[f] - a[f]) / i;
                    break;
                  case "colour":
                    a[f] = t.getRGB(a[f]);
                    var g = t.getRGB(u[f]);
                    l[f] = {
                      r: (g.r - a[f].r) / i,
                      g: (g.g - a[f].g) / i,
                      b: (g.b - a[f].b) / i,
                    };
                    break;
                  case "path":
                    var v = Tt(a[f], u[f]);
                    a[f] = v[0];
                    var y = v[1];
                    l[f] = [];
                    for (var w = 0, k = a[f][E]; w < k; w++) {
                      l[f][w] = [0];
                      for (var T = 1, S = a[f][w][E]; T < S; T++)
                        l[f][w][T] = (y[w][T] - a[f][w][T]) / i;
                    }
                    break;
                  case "csv":
                    var q = b(e[f])[x](n),
                      j = b(a[f])[x](n);
                    switch (f) {
                      case "translation":
                        (a[f] = [0, 0]), (l[f] = [q[0] / i, q[1] / i]);
                        break;
                      case "rotation":
                        (a[f] =
                          j[1] == q[1] && j[2] == q[2] ? j : [0, q[1], q[2]]),
                          (l[f] = [(q[0] - a[f][0]) / i, 0, 0]);
                        break;
                      case "scale":
                        (e[f] = q),
                          (a[f] = b(a[f])[x](n)),
                          (l[f] = [
                            (q[0] - a[f][0]) / i,
                            (q[1] - a[f][1]) / i,
                            0,
                            0,
                          ]);
                        break;
                      case "clip-rect":
                        for (a[f] = b(a[f])[x](n), l[f] = [], w = 4; w--; )
                          l[f][w] = (q[w] - a[f][w]) / i;
                    }
                    u[f] = q;
                    break;
                  default:
                    for (
                      q = [].concat(e[f]),
                        j = [].concat(a[f]),
                        l[f] = [],
                        w = o.paper.customAttributes[f][E];
                      w--;

                    )
                      l[f][w] = ((q[w] || 0) - (j[w] || 0)) / i;
                }
            if (h) {
              var M = t.easing_formulas[r];
              if (!M)
                if ((M = b(r).match(Y)) && 5 == M[E]) {
                  var A = M;
                  M = function (t) {
                    return qe(t, +A[1], +A[2], +A[3], +A[4], i);
                  };
                } else
                  M = function (t) {
                    return t;
                  };
              xe.push({
                start: e.start || +new Date(),
                ms: i,
                easing: M,
                from: a,
                diff: l,
                to: u,
                el: o,
                t: { x: 0, y: 0 },
              }),
                t.is(s, "function") &&
                  (o._ac = setTimeout(function () {
                    s.call(o);
                  }, i)),
                1 == xe[E] && setTimeout(we);
            } else {
              var N,
                U = [];
              for (var I in e)
                e[c](I) &&
                  K.test(I) &&
                  ((f = { value: e[I] }),
                  "from" == I && (I = 0),
                  "to" == I && (I = 100),
                  (f.key = H(I, 10)),
                  U.push(f));
              for (
                U.sort(st),
                  U[0].key && U.unshift({ key: 0, value: o.attrs }),
                  w = 0,
                  k = U[E];
                w < k;
                w++
              )
                ke(
                  U[w].value,
                  o,
                  (i / 100) * U[w].key,
                  (i / 100) * ((U[w - 1] && U[w - 1].key) || 0),
                  U[w - 1] && U[w - 1].value.callback
                );
              (N = U[U[E] - 1].value.callback) &&
                o.timeouts.push(
                  setTimeout(function () {
                    N.call(o);
                  }, i)
                );
            }
            return this;
          }),
          (Xt.stop = function () {
            for (var t = 0; t < xe.length; t++)
              xe[t].el.id == this.id && xe.splice(t--, 1);
            for (t = 0, ii = this.timeouts && this.timeouts.length; t < ii; t++)
              clearTimeout(this.timeouts[t]);
            return (
              (this.timeouts = []),
              clearTimeout(this._ac),
              delete this._ac,
              this
            );
          }),
          (Xt.translate = function (t, e) {
            return this.attr({ translation: t + " " + e });
          }),
          (Xt[_] = function () {
            return "Raphaël’s object";
          }),
          (t.ae = xe);
        var je = function (t) {
          if (((this.items = []), (this[E] = 0), (this.type = "set"), t))
            for (var e = 0, i = t[E]; e < i; e++)
              !t[e] ||
                (t[e].constructor != Rt && t[e].constructor != je) ||
                ((this[this.items[E]] = this.items[this.items[E]] = t[e]),
                this[E]++);
        };
        for (var Me in ((je[a][P] = function () {
          for (var t, e, i = 0, r = arguments[E]; i < r; i++)
            !(t = arguments[i]) ||
              (t.constructor != Rt && t.constructor != je) ||
              ((this[(e = this.items[E])] = this.items[e] = t), this[E]++);
          return this;
        }),
        (je[a].pop = function () {
          return delete this[this[E]--], this.items.pop();
        }),
        Xt))
          Xt[c](Me) &&
            (je[a][Me] = (function (t) {
              return function () {
                for (var e = 0, i = this.items[E]; e < i; e++)
                  this.items[e][t][p](this.items[e], arguments);
                return this;
              };
            })(Me));
        (je[a].attr = function (e, i) {
          if (e && t.is(e, O) && t.is(e[0], "object"))
            for (var r = 0, n = e[E]; r < n; r++) this.items[r].attr(e[r]);
          else
            for (var s = 0, o = this.items[E]; s < o; s++)
              this.items[s].attr(e, i);
          return this;
        }),
          (je[a].animate = function (e, i, r, n) {
            (t.is(r, "function") || !r) && (n = r || null);
            var s,
              o,
              a = this.items[E],
              c = a,
              u = this;
            for (
              n &&
                (o = function () {
                  !--a && n.call(u);
                }),
                r = t.is(r, I) ? r : o,
                s = this.items[--c].animate(e, i, r, o);
              c--;

            )
              this.items[c] &&
                !this.items[c].removed &&
                this.items[c].animateWith(s, e, i, r, o);
            return this;
          }),
          (je[a].insertAfter = function (t) {
            for (var e = this.items[E]; e--; ) this.items[e].insertAfter(t);
            return this;
          }),
          (je[a].getBBox = function () {
            for (var t = [], e = [], i = [], r = [], n = this.items[E]; n--; ) {
              var s = this.items[n].getBBox();
              t[P](s.x), e[P](s.y), i[P](s.x + s.width), r[P](s.y + s.height);
            }
            return {
              x: (t = M[p](0, t)),
              y: (e = M[p](0, e)),
              width: j[p](0, i) - t,
              height: j[p](0, r) - e,
            };
          }),
          (je[a].clone = function (t) {
            t = new je();
            for (var e = 0, i = this.items[E]; e < i; e++)
              t[P](this.items[e].clone());
            return t;
          }),
          (t.registerFont = function (t) {
            if (!t.face) return t;
            this.fonts = this.fonts || {};
            var e = { w: t.w, face: {}, glyphs: {} },
              i = t.face["font-family"];
            for (var r in t.face) t.face[c](r) && (e.face[r] = t.face[r]);
            if (
              (this.fonts[i] ? this.fonts[i][P](e) : (this.fonts[i] = [e]),
              !t.svg)
            )
              for (var n in ((e.face["units-per-em"] = H(
                t.face["units-per-em"],
                10
              )),
              t.glyphs))
                if (t.glyphs[c](n)) {
                  var s = t.glyphs[n];
                  if (
                    ((e.glyphs[n] = {
                      w: s.w,
                      k: {},
                      d:
                        s.d &&
                        "M" +
                          s.d[Q](/[mlcxtrv]/g, function (t) {
                            return (
                              {
                                l: "L",
                                c: "C",
                                x: "z",
                                t: "m",
                                r: "l",
                                v: "c",
                              }[t] || "M"
                            );
                          }) +
                          "z",
                    }),
                    s.k)
                  )
                    for (var o in s.k) s[c](o) && (e.glyphs[n].k[o] = s.k[o]);
                }
            return t;
          }),
          (r.getFont = function (e, i, r, n) {
            if (
              ((n = n || "normal"),
              (r = r || "normal"),
              (i =
                +i ||
                { normal: 400, bold: 700, lighter: 300, bolder: 800 }[i] ||
                400),
              t.fonts)
            ) {
              var s,
                o = t.fonts[e];
              if (!o) {
                var a = new RegExp(
                  "(^|\\s)" + e[Q](/[^\w\d\s+!~.:_-]/g, v) + "(\\s|$)",
                  "i"
                );
                for (var u in t.fonts)
                  if (t.fonts[c](u) && a.test(u)) {
                    o = t.fonts[u];
                    break;
                  }
              }
              if (o)
                for (
                  var h = 0, l = o[E];
                  h < l &&
                  ((s = o[h]).face["font-weight"] != i ||
                    (s.face["font-style"] != r && s.face["font-style"]) ||
                    s.face["font-stretch"] != n);
                  h++
                );
              return s;
            }
          }),
          (r.print = function (e, i, r, s, o, a, c) {
            (a = a || "middle"), (c = j(M(c || 0, 1), -1));
            var u,
              h = this.set(),
              l = b(r)[x](v),
              f = 0;
            if ((t.is(s, r) && (s = this.getFont(s)), s)) {
              u = (o || 16) / s.face["units-per-em"];
              for (
                var d = s.face.bbox.split(n),
                  p = +d[0],
                  m =
                    +d[1] +
                    ("baseline" == a
                      ? d[3] - d[1] + +s.face.descent
                      : (d[3] - d[1]) / 2),
                  g = 0,
                  y = l[E];
                g < y;
                g++
              ) {
                var w = (g && s.glyphs[l[g - 1]]) || {},
                  k = s.glyphs[l[g]];
                (f += g
                  ? (w.w || s.w) + ((w.k && w.k[l[g]]) || 0) + s.w * c
                  : 0),
                  k &&
                    k.d &&
                    h[P](
                      this.path(k.d).attr({
                        fill: "#000",
                        stroke: "none",
                        translation: [f, 0],
                      })
                    );
              }
              h.scale(u, u, p, m).translate(e - p, i - m);
            }
            return h;
          }),
          (t.format = function (e, i) {
            var r = t.is(i, O) ? [0][m](i) : arguments;
            return (
              e &&
                t.is(e, I) &&
                r[E] - 1 &&
                (e = e[Q](o, function (t, e) {
                  return null == r[++e] ? v : r[e];
                })),
              e || v
            );
          }),
          (t.ninja = function () {
            return l.was ? (h.Raphael = l.is) : delete e, t;
          }),
          (t.el = Xt),
          (t.st = je[a]),
          l.was ? (h.Raphael = t) : (e = t);
      })(),
      e
    );
  }),
  define("scripts/lib/sound.js", function (t) {
    var e = require("scripts/lib/buzz"),
      i = e.isSupported(),
      r = { formats: ["ogg", "mp3"], preload: !0, autoload: !0, loop: !1 };
    function n(t) {
      this.sound = new e.sound(t, r);
    }
    function s() {}
    return (
      (n.prototype.play = function (t) {
        (t = this.sound).setPercent(0), t.setVolume(100), t.play();
      }),
      (n.prototype.stop = function () {
        this.sound.fadeOut(1e3, function () {
          this.pause();
        });
      }),
      (t.create = function (t) {
        return i ? new n(t) : s;
      }),
      (s.play = s.stop = function () {}),
      t
    );
  }),
  define("scripts/lib/tween.js", function (t) {
    return (
      (t.exponential = function () {}),
      (t.exponential.co = function (t, e, i, r) {
        return t == r ? e + i : i * (1 - Math.pow(2, (-10 * t) / r)) + e;
      }),
      (t.bounce = function () {}),
      (t.bounce.co = function (t, e, i, r) {
        return (t /= r) < 1 / 2.75
          ? i * (7.5625 * t * t) + e
          : t < 2 / 2.75
          ? i * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + e
          : t < 2.5 / 2.75
          ? i * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + e
          : i * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + e;
      }),
      (t.quadratic = function () {}),
      (t.quadratic.ci = function (t, e, i, r) {
        return i * (t /= r) * t + e;
      }),
      (t.quadratic.co = function (t, e, i, r) {
        return -i * (t /= r) * (t - 2) + e;
      }),
      (t.quadratic.cio = function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (i / 2) * t * t + e
          : (-i / 2) * (--t * (t - 2) - 1) + e;
      }),
      (t.circular = function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (-i / 2) * (Math.sqrt(1 - t * t) - 1) + e
          : (i / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + e;
      }),
      (t.linear = function (t, e, i, r) {
        return (i * t) / r + e;
      }),
      (t.back = function () {}),
      (t.back.ci = function (t, e, i, r, n) {
        return i * (t /= r) * t * (2.70158 * t - 1.70158) + e;
      }),
      (t.back.co = function (t, e, i, r, n) {
        return i * ((t = t / r - 1) * t * (2.70158 * t + 1.70158) + 1) + e;
      }),
      t
    );
  }),
  define("scripts/lib/ucren.js", function (exports) {
    var Ucren,
      blankArray = [],
      slice = blankArray.slice,
      join = blankArray.join,
      div,
      send,
      incept,
      ret,
      map,
      reOpacity,
      getStyle;
    for (var i in (String.prototype.trim ||
      (String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/, "");
      }),
    (String.prototype.format = function (t) {
      var e = this;
      return (
        Ucren.each(t, function (t, i) {
          (t = t.toString().replace(/\$/g, "$$$$")),
            (e = e.replace(RegExp("@{" + i + "}", "g"), t));
        }),
        e.toString()
      );
    }),
    (String.prototype.htmlEncode =
      ((div = document.createElement("div")),
      function () {
        var t;
        return (
          div.appendChild(document.createTextNode(this)),
          (t = div.innerHTML),
          (div.innerHTML = ""),
          t
        );
      })),
    (String.prototype.byteLength = function () {
      return this.replace(/[^\x00-\xff]/g, "  ").length;
    }),
    (String.prototype.subByte = function (t, e) {
      var i = this;
      return i.byteLength() <= t
        ? i
        : ((t -= (e = e || "").byteLength()),
          i
            .slice(0, t)
            .replace(/( [^\x00-\xff] )/g, "$1 ")
            .slice(0, t)
            .replace(/[^\x00-\xff]$/, "")
            .replace(/( [^\x00-\xff] ) /g, "$1") + e);
    }),
    (Function.prototype.defer = function (t, e) {
      var i = this;
      return setTimeout(function () {
        i.apply(t, arguments);
      }, e);
    }),
    Function.prototype.bind ||
      (Function.prototype.bind = function (t) {
        var e = this;
        return function () {
          return e.apply(t, arguments);
        };
      }),
    (Function.prototype.saturate = function (t) {
      var e = this,
        i = slice.call(arguments, 1);
      return function () {
        return e.apply(t, slice.call(arguments, 0).concat(i));
      };
    }),
    (Array.prototype.indexOf = function (t, e) {
      var i = this.length;
      for (e || (e = 0), e < 0 && (e = i + e); e < i; e++)
        if (this[e] === t) return e;
      return -1;
    }),
    (Array.prototype.every = function (t, e) {
      for (var i = 0, r = this.length; i < r; i++)
        if (!t.call(e, this[i], i, this)) return !1;
      return !0;
    }),
    (Array.prototype.filter = function (t, e) {
      for (var i, r = [], n = 0, s = this.length; n < s; n++)
        (i = this[n]), t.call(e, i, n, this) && r.push(i);
      return r;
    }),
    (Array.prototype.forEach = function (t, e) {
      for (var i = 0, r = this.length; i < r; i++) t.call(e, this[i], i, this);
    }),
    (Array.prototype.map = function (t, e) {
      for (var i = [], r = 0, n = this.length; r < n; r++)
        i[r] = t.call(e, this[r], r, this);
      return i;
    }),
    (Array.prototype.some = function (t, e) {
      for (var i = 0, r = this.length; i < r; i++)
        if (t.call(e, this[i], i, this)) return !0;
      return !1;
    }),
    (Array.prototype.invoke = function (t) {
      var e = slice.call(arguments, 1);
      return (
        this.forEach(function (i) {
          i instanceof Array
            ? i[0][t].apply(i[0], i.slice(1))
            : i[t].apply(i, e);
        }),
        this
      );
    }),
    (Array.prototype.random = function () {
      for (var t = this.slice(0), e = [], i = t.length; i--; )
        e.push(t.splice(Ucren.randomNumber(i + 1), 1)[0]);
      return e;
    }),
    (Ucren = {
      isIe: /msie/i.test(navigator.userAgent),
      isIe6: /msie 6/i.test(navigator.userAgent),
      isFirefox: /firefox/i.test(navigator.userAgent),
      isSafari: /version\/[\d\.]+\s+safari/i.test(navigator.userAgent),
      isOpera: /opera/i.test(navigator.userAgent),
      isChrome: /chrome/i.test(navigator.userAgent),
      isStrict: "CSS1Compat" == document.compatMode,
      tempDom: document.createElement("div"),
      apply: function (t, e, i) {
        return (
          e || (e = {}),
          i
            ? Ucren.each(t, function (t, r) {
                r in i || (e[r] = t);
              })
            : Ucren.each(t, function (t, i) {
                e[i] = t;
              }),
          e
        );
      },
      appendStyle: function (t) {
        var e;
        arguments.length > 1 && (t = join.call(arguments, "")),
          document.createStyleSheet
            ? ((e = document.createStyleSheet()).cssText = t)
            : (((e = document.createElement("style")).type = "text/css"),
              e.appendChild(document.createTextNode(t)),
              document.getElementsByTagName("head")[0].appendChild(e));
      },
      addEvent: function (t, e, i) {
        var r = function () {
          i.apply(t, arguments);
        };
        return (
          t.dom && (t = t.dom),
          window.attachEvent
            ? t.attachEvent("on" + e, r)
            : window.addEventListener
            ? t.addEventListener(e, r, !1)
            : (t["on" + e] = r),
          r
        );
      },
      delEvent: function (t, e, i) {
        window.detachEvent
          ? t.detachEvent("on" + e, i)
          : window.removeEventListener
          ? t.removeEventListener(e, i, !1)
          : t["on" + e] == i && (t["on" + e] = null);
      },
      Class: function (t, e, i, r) {
        var n, s;
        return (
          (t = t || function () {}),
          (e = e || {}),
          (n = function () {
            (this.instanceId = Ucren.id()), t.apply(this, arguments);
          }),
          (s = n.prototype),
          Ucren.registerClassEvent.call(s),
          Ucren.each(e, function (t, e) {
            var n, o;
            s[e] =
              ((o = e),
              "function" == typeof (n = t)
                ? function () {
                    var t, e;
                    if (
                      ((t = slice.call(arguments, 0)),
                      !i || !1 !== i.apply(this, [o].concat(t)))
                    )
                      return (
                        this.fireEvent("before" + o, t),
                        (e = n.apply(this, t)),
                        r && r.apply(this, [o].concat(t)),
                        this.fireEvent(o, t),
                        e
                      );
                  }
                : n);
          }),
          (s.getOriginMethod = function (t) {
            return e[t];
          }),
          n
        );
      },
      registerClassEvent: function () {
        (this.on = function (t, e) {
          var i = this.instanceId;
          Ucren.dispatch(i + t, e.bind(this));
        }),
          (this.onbefore = function (t, e) {
            var i = this.instanceId;
            Ucren.dispatch(i + "before" + t, e.bind(this));
          }),
          (this.un = function (t, e) {}),
          (this.fireEvent = function (t, e) {
            var i = this.instanceId;
            Ucren.dispatch(i + t, e);
          });
      },
      createFuze: function () {
        var t, e, i;
        return (
          (t = []),
          ((e = function (e) {
            i ? e() : t.push(e);
          }).fire = function () {
            for (; t.length; ) t.shift()();
            i = !0;
          }),
          (e.extinguish = function () {
            i = !1;
          }),
          (e.wettish = function () {
            t.length && t.shift()();
          }),
          e
        );
      },
      dispatch:
        ((map = {}),
        (send = function (t, e, i) {
          var r;
          (r = map[t]) &&
            Ucren.each(r, function (t) {
              t.apply(i, e);
            });
        }),
        (incept = function (t, e) {
          var i;
          (i = map[t]) ? i.push(e) : (map[t] = [e]);
        }),
        (ret = function (t, e, i) {
          void 0 === e && (e = []),
            e instanceof Array
              ? send.apply(this, arguments)
              : "function" == typeof e && incept.apply(this, arguments);
        }),
        (ret.remove = function (t, e) {
          var i, r;
          (i = map[t]) && ~(r = i.indexOf(e)) && i.splice(r, 1);
        }),
        ret),
      each: function (t, e) {
        if (
          t instanceof Array ||
          ("object" == typeof t && void 0 !== t[0] && t.length)
        )
          "object" == typeof t && Ucren.isSafari && (t = slice.call(t)),
            t.forEach(e);
        else if ("object" == typeof t) {
          var i = {};
          for (var r in t) if (!i[r] && !1 === e(t[r], r)) break;
        } else if ("number" == typeof t)
          for (r = 0; r < t && !1 !== e(r, r); r++);
        else if ("string" == typeof t) {
          r = 0;
          for (var n = t.length; r < n && !1 !== e(t.charAt(r), r); r++);
        }
      },
      Element: function (t, e) {
        var i, r;
        return t && t.isUcrenElement
          ? e
            ? t.dom
            : t
          : (t = "string" == typeof t ? document.getElementById(t) : t)
          ? e
            ? t
            : "string" == typeof (r = t.getAttribute("handleId"))
            ? Ucren.handle(r - 0)
            : ((i = new Ucren.BasicElement(t)),
              (r = Ucren.handle(i)),
              t.setAttribute("handleId", r + ""),
              i)
          : null;
      },
      Event: function (t) {
        if (!(t = t || window.event))
          for (
            var e = arguments.callee.caller;
            e && (!(t = e.arguments[0]) || "boolean" != typeof t.altKey);

          )
            (e = e.caller), (t = null);
        return t;
      },
      fixNumber: function (t, e) {
        return "number" == typeof t ? t : e;
      },
      fixString: function (t, e) {
        return "string" == typeof t ? t : e;
      },
      fixConfig: function (t) {
        return void 0 === t ? {} : "function" == typeof t ? new t() : t;
      },
      handle: function (t) {
        var e, i, r;
        return (
          (e = arguments.callee).cache || (e.cache = {}),
          void 0 === e.number && (e.number = 0),
          "number" == (i = typeof t)
            ? e.cache[t.toString()]
            : "object" == i || "function" == i
            ? ((r = e.number++), (e.cache[r.toString()] = t), r)
            : void 0
        );
      },
      id: function () {
        var t = arguments.callee;
        return (t.number = ++t.number || 0), "_" + t.number;
      },
      loadImage: function (t, e) {
        var i = t.length,
          r = 0;
        Ucren.each(t, function (t) {
          var n = document.createElement("img");
          (n.onload = n.onerror =
            function () {
              (this.onload = this.onerror = null), ++r == i && e && e();
            }),
            Ucren.tempDom.appendChild(n),
            (n.src = t);
        });
      },
      loadScript: function (src, callback) {
        Ucren.request(src, function (text) {
          eval(text), callback && callback(text);
        });
      },
      makeElement: function (t, e) {
        var i,
          r = document.createElement(t);
        for (var n in e)
          "class" === n
            ? (r.className = e[n])
            : "for" === n
            ? (r.htmlFor = e[n])
            : "style" === n
            ? "string" == typeof (i = e[n])
              ? (r.style.cssText = i)
              : Ucren.apply(i, r.style)
            : r.setAttribute(n, e[n]);
        return r;
      },
      nul: function () {
        return !1;
      },
      randomNumber: function (t) {
        return Math.floor(Math.random() * t);
      },
      randomWord: function (t, e) {
        var i,
          r = [];
        return (
          (i =
            e ||
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
          Ucren.each(
            t,
            function (t) {
              r[t] = i.charAt(this.randomNumber(i.length));
            }.bind(this)
          ),
          r.join("")
        );
      },
      request: function (t, e) {
        request = Ucren.request;
        var i = request.xhr;
        request.xhr ||
          (i = window.XMLHttpRequest
            ? (request.xhr = new XMLHttpRequest())
            : (request.xhr = new ActiveXObject("Microsoft.XMLHTTP"))),
          i.open("GET", t, !0),
          (i.onreadystatechange = function () {
            4 == i.readyState && 200 == i.status && e(i.responseText);
          }),
          i.send(null);
      },
    }),
    (Ucren.BasicDrag = Ucren.Class(
      function (t) {
        (t = Ucren.fixConfig(t)),
          (this.type = Ucren.fixString(t.type, "normal"));
        var e = (this.isTouch = "ontouchstart" in window);
        (this.TOUCH_START = e ? "touchstart" : "mousedown"),
          (this.TOUCH_MOVE = e ? "touchmove" : "mousemove"),
          (this.TOUCH_END = e ? "touchend" : "mouseup");
      },
      {
        bind: function (t, e) {
          (t = Ucren.Element(t)), (e = Ucren.Element(e) || t);
          var i = {};
          (i[this.TOUCH_START] = function (t) {
            return (
              (t = Ucren.Event(t)),
              this.startDrag(),
              (t.cancelBubble = !0),
              t.stopPropagation && t.stopPropagation(),
              (t.returnValue = !1)
            );
          }.bind(this)),
            e.addEvents(i),
            (this.target = t);
        },
        getCoors: function (t) {
          var e = [];
          if (t.targetTouches && t.targetTouches.length) {
            var i = t.targetTouches[0];
            (e[0] = i.clientX), (e[1] = i.clientY);
          } else (e[0] = t.clientX), (e[1] = t.clientY);
          return e;
        },
        startDrag: function () {
          var t, e, i;
          (e = (t = this.target).draging = {}),
            (this.isDraging = !0),
            (e.x = parseInt(t.style("left"), 10) || 0),
            (e.y = parseInt(t.style("top"), 10) || 0),
            (i = Ucren.Event());
          var r = this.getCoors(i);
          (e.mouseX = r[0]), (e.mouseY = r[1]), this.registerDocumentEvent();
        },
        endDrag: function () {
          (this.isDraging = !1), this.unRegisterDocumentEvent();
        },
        registerDocumentEvent: function () {
          var t, e, i, r;
          (t = this.target),
            ((e = t.draging).documentSelectStart = Ucren.addEvent(
              document,
              "selectstart",
              function (t) {
                return (
                  (t = t || event).stopPropagation && t.stopPropagation(),
                  (t.cancelBubble = !0),
                  (t.returnValue = !1)
                );
              }
            )),
            (e.documentMouseMove = Ucren.addEvent(
              document,
              this.TOUCH_MOVE,
              function (t) {
                var i, r;
                (t = t || event),
                  (i = Ucren.isIe && 1 != t.button),
                  (r = !Ucren.isIe && 0 != t.button),
                  (!i && !r) || this.isTouch || this.endDrag();
                var n = this.getCoors(t);
                return (
                  (e.newMouseX = n[0]),
                  (e.newMouseY = n[1]),
                  t.stopPropagation && t.stopPropagation(),
                  (t.returnValue = !1)
                );
              }.bind(this)
            )),
            (e.documentMouseUp = Ucren.addEvent(
              document,
              this.TOUCH_END,
              function () {
                this.endDrag();
              }.bind(this)
            )),
            clearInterval(e.timer),
            (e.timer = setInterval(
              function () {
                var n, s, o, a;
                e.newMouseX != i &&
                  e.newMouseY != r &&
                  ((i = e.newMouseX),
                  (r = e.newMouseY),
                  (o = e.newMouseX - e.mouseX),
                  (a = e.newMouseY - e.mouseY),
                  (n = e.x + o),
                  (s = e.y + a),
                  "calc" == this.type
                    ? this.returnValue(o, a, e.newMouseX, e.newMouseY)
                    : t.left(n).top(s));
              }.bind(this),
              10
            ));
        },
        unRegisterDocumentEvent: function () {
          var t = this.target.draging;
          Ucren.delEvent(document, this.TOUCH_MOVE, t.documentMouseMove),
            Ucren.delEvent(document, this.TOUCH_END, t.documentMouseUp),
            Ucren.delEvent(document, "selectstart", t.documentSelectStart),
            clearInterval(t.timer);
        },
        returnValue: function (t, e, i, r) {},
      }
    )),
    (Ucren.Template = Ucren.Class(
      function () {
        this.string = join.call(arguments, "");
      },
      {
        apply: function (t) {
          return this.string.format(t);
        },
      }
    )),
    (Ucren.BasicElement = Ucren.Class(
      function (t) {
        (this.dom = t), (this.countMapping = {});
      },
      {
        isUcrenElement: !0,
        attr: function (t, e) {
          return "string" != typeof e
            ? this.dom.getAttribute(t)
            : (this.dom.setAttribute(t, e), this);
        },
        style:
          ((getStyle = Ucren.isIe
            ? function (t) {
                return this.dom.currentStyle[t];
              }
            : function (t) {
                return document.defaultView
                  .getComputedStyle(this.dom, null)
                  .getPropertyValue(t);
              }),
          function (t, e) {
            if ("object" == typeof t)
              Ucren.each(
                t,
                function (t, e) {
                  this[e] = t;
                }.bind(this.dom.style)
              );
            else {
              if ("string" == typeof t && void 0 === e)
                return getStyle.call(this, t);
              "string" == typeof t && void 0 !== e && (this.dom.style[t] = e);
            }
            return this;
          }),
        hasClass: function (t) {
          return (" " + this.dom.className + " ").indexOf(" " + t + " ") > -1;
        },
        setClass: function (t) {
          return "string" == typeof t && (this.dom.className = t.trim()), this;
        },
        addClass: function (t) {
          var e, i;
          return (
            -1 ==
              (i = " " + (e = this.dom).className + " ").indexOf(
                " " + t + " "
              ) &&
              ((i = (i = (i += t).trim()).replace(/ +/g, " ")),
              (e.className = i)),
            this
          );
        },
        delClass: function (t) {
          var e, i;
          return (
            (i = " " + (e = this.dom).className + " ").indexOf(" " + t + " ") >
              -1 &&
              ((i = (i = (i = i.replace(" " + t + " ", " ")).trim()).replace(
                / +/g,
                " "
              )),
              (e.className = i)),
            this
          );
        },
        html: function (t) {
          var e = this.dom;
          if ("string" == typeof t) e.innerHTML = t;
          else {
            if (!(t instanceof Array)) return e.innerHTML;
            e.innerHTML = t.join("");
          }
          return this;
        },
        left: function (t) {
          var e = this.dom;
          return "number" != typeof t
            ? this.getPos().x
            : ((e.style.left = t + "px"),
              this.fireEvent("infect", [{ left: t }]),
              this);
        },
        top: function (t) {
          var e = this.dom;
          return "number" != typeof t
            ? this.getPos().y
            : ((e.style.top = t + "px"),
              this.fireEvent("infect", [{ top: t }]),
              this);
        },
        width: function (t) {
          var e = this.dom;
          if ("number" == typeof t)
            (e.style.width = t + "px"),
              this.fireEvent("infect", [{ width: t }]);
          else {
            if ("string" != typeof t) return this.getSize().width;
            (e.style.width = t), this.fireEvent("infect", [{ width: t }]);
          }
          return this;
        },
        height: function (t) {
          var e = this.dom;
          if ("number" == typeof t)
            (e.style.height = t + "px"),
              this.fireEvent("infect", [{ height: t }]);
          else {
            if ("string" != typeof t) return this.getSize().height;
            (e.style.height = t), this.fireEvent("infect", [{ height: t }]);
          }
          return this;
        },
        count: function (t) {
          return (this.countMapping[t] = ++this.countMapping[t] || 1);
        },
        display: function (t) {
          var e = this.dom;
          return "boolean" != typeof t
            ? "none" != this.style("display")
            : ((e.style.display = t ? "block" : "none"),
              this.fireEvent("infect", [{ display: t }]),
              this);
        },
        first: function () {
          for (var t = this.dom.firstChild; t && !t.tagName && t.nextSibling; )
            t = t.nextSibling;
          return t;
        },
        add: function (t) {
          var e;
          return (e = Ucren.Element(t)), this.dom.appendChild(e.dom), this;
        },
        remove: function (t) {
          var e;
          return (
            t
              ? ((e = Ucren.Element(t)).html(""), this.dom.removeChild(e.dom))
              : (e = Ucren.Element(this.dom.parentNode)).remove(this),
            this
          );
        },
        insert: function (t) {
          var e;
          return (
            (e = this.dom).firstChild
              ? e.insertBefore(t, e.firstChild)
              : this.add(t),
            this
          );
        },
        addEvents: function (t) {
          var e, i;
          return (
            (i = {}),
            (e = this.dom),
            Ucren.each(t, function (t, r) {
              i[r] = Ucren.addEvent(e, r, t);
            }),
            i
          );
        },
        removeEvents: function (t) {
          var e;
          return (
            (e = this.dom),
            Ucren.each(t, function (t, i) {
              Ucren.delEvent(e, i, t);
            }),
            this
          );
        },
        getPos: function () {
          var t, e, i, r, n;
          if (((i = {}), (t = this.dom).getBoundingClientRect)) {
            (r = t.getBoundingClientRect()), (n = Ucren.isIe ? 2 : 0);
            var s = document,
              o = Math.max(s.documentElement.scrollTop, s.body.scrollTop),
              a = Math.max(s.documentElement.scrollLeft, s.body.scrollLeft);
            return { x: r.left + a - n, y: r.top + o - n };
          }
          if (
            ((i = { x: t.offsetLeft, y: t.offsetTop }),
            (e = t.offsetParent) != t)
          )
            for (; e; )
              (i.x += e.offsetLeft), (i.y += e.offsetTop), (e = e.offsetParent);
          for (
            Ucren.isSafari &&
              "absolute" == this.style("position") &&
              ((i.x -= document.body.offsetLeft),
              (i.y -= document.body.offsetTop)),
              e = t.parentNode ? t.parentNode : null;
            e &&
            "BODY" != e.tagName.toUpperCase() &&
            "HTML" != e.tagName.toUpperCase();

          )
            (i.x -= e.scrollLeft),
              (i.y -= e.scrollTop),
              (e = e.parentNode ? e.parentNode : null);
          return i;
        },
        getSize: function () {
          var t = this.dom,
            e = this.style("display");
          if (e && "none" !== e)
            return { width: t.offsetWidth, height: t.offsetHeight };
          var i = t.style,
            r = {
              visibility: i.visibility,
              position: i.position,
              display: i.display,
            },
            n = { visibility: "hidden", display: "block" };
          "fixed" !== r.position && (n.position = "absolute"), this.style(n);
          var s = { width: t.offsetWidth, height: t.offsetHeight };
          return this.style(r), s;
        },
        observe: function (t, e) {
          return (t = Ucren.Element(t)).on("infect", e.bind(this)), this;
        },
        usePNGbackground: function (t) {
          var e;
          return (
            (e = this.dom),
            /\.png$/i.test(t) && Ucren.isIe6
              ? (e.style.filter =
                  "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" +
                  t +
                  "',sizingMethod='scale' );")
              : (e.style.backgroundImage = "url( " + t + " )"),
            this
          );
        },
        setAlpha:
          ((reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/),
          function (t) {
            var e = this.dom,
              i = e.style;
            return (
              Ucren.isIe
                ? (e.currentStyle && !e.currentStyle.hasLayout && (i.zoom = 1),
                  reOpacity.test(i.filter)
                    ? ((t = t >= 99.99 ? "" : "alpha( opacity=" + t + " )"),
                      (i.filter = i.filter.replace(reOpacity, t)))
                    : (i.filter += " alpha( opacity=" + t + " )"))
                : (i.opacity = t / 100),
              this
            );
          }),
        fadeIn: function (t) {
          void 0 === this.fadingNumber && (this.fadingNumber = 0),
            this.setAlpha(this.fadingNumber);
          var e = function () {
            this.setAlpha(this.fadingNumber),
              100 == this.fadingNumber
                ? (clearInterval(this.fadingInterval), t && t())
                : (this.fadingNumber += 10);
          }.bind(this);
          return (
            this.display(!0),
            clearInterval(this.fadingInterval),
            (this.fadingInterval = setInterval(e, Ucren.isIe ? 20 : 30)),
            this
          );
        },
        fadeOut: function (t) {
          void 0 === this.fadingNumber && (this.fadingNumber = 100),
            this.setAlpha(this.fadingNumber);
          var e = function () {
            this.setAlpha(this.fadingNumber),
              0 == this.fadingNumber
                ? (clearInterval(this.fadingInterval),
                  this.display(!1),
                  t && t())
                : (this.fadingNumber -= 10);
          }.bind(this);
          return (
            clearInterval(this.fadingInterval),
            (this.fadingInterval = setInterval(e, Ucren.isIe ? 20 : 30)),
            this
          );
        },
        useMouseAction: function (t, e) {
          return (
            this.MouseAction ||
              (this.MouseAction = new Ucren.MouseAction({ element: this })),
            this.MouseAction.use(t, e),
            this
          );
        },
      }
    )),
    Ucren.isIe && document.execCommand("BackgroundImageCache", !1, !0),
    Ucren))
      exports[i] = Ucren[i];
    return exports;
  }),
  define("scripts/object/background.js", function (t) {
    var e,
      i,
      r = require("scripts/lib/ucren"),
      n = require("scripts/layer"),
      s = require("scripts/timeline"),
      o = r.randomNumber;
    function a() {
      var t, i;
      (t = o(12) - 6), (i = o(12) - 6), e.attr({ x: t, y: i });
    }
    return (
      (t.set = function () {
        e = n.createImage("default", "images/background.jpg", 0, 0, 640, 480);
      }),
      (t.wobble = function () {
        i = s.setInterval(a, 50);
      }),
      (t.stop = function () {
        i.stop(), e.attr({ x: 0, y: 0 });
      }),
      t
    );
  }),
  define("scripts/object/console.js", function (t) {
    var e = require("scripts/layer"),
      i = 0,
      r = [];
    return (
      (t.set = function () {}),
      (t.clear = function () {
        for (var t = 0, e = r.length; t < e; t++) r[t].remove();
        r.length = i = 0;
      }),
      (t.log = function (t) {
        (i += 20), r.push(e.createText("default", t, 16, i));
      }),
      t
    );
  }),
  define("scripts/object/developing.js", function (t) {
    var e = require("scripts/layer"),
      i = require("scripts/lib/tween"),
      r = require("scripts/timeline"),
      n = (require("scripts/message"), i.exponential.co);
    return (
      (t.anims = []),
      (t.set = function () {
        this.image = e
          .createImage("default", "images/developing.png", 103, 218, 429, 53)
          .hide()
          .scale(1e-5, 1e-5);
      }),
      (t.show = function (t) {
        r.createTask({
          start: t,
          duration: 500,
          data: [1e-5, 1, "show"],
          object: this,
          onTimeUpdate: this.onZooming,
          onTimeStart: this.onZoomStart,
          onTimeEnd: this.onZoomEnd,
          recycle: this.anims,
        }),
          this.hide(2e3);
      }),
      (t.hide = function (t) {
        r.createTask({
          start: t,
          duration: 500,
          data: [1, 1e-5, "hide"],
          object: this,
          onTimeUpdate: this.onZooming,
          onTimeStart: this.onZoomStart,
          onTimeEnd: this.onZoomEnd,
          recycle: this.anims,
        });
      }),
      (t.onZoomStart = function () {
        this.image.show();
      }),
      (t.onZooming = function (t, e, i, r) {
        this.image.scale((r = n(t, e, i - e, 500)), r);
      }),
      (t.onZoomEnd = function (t, e, i) {
        "hide" === i && this.image.hide();
      }),
      t
    );
  }),
  define("scripts/object/dojo.js", function (t) {
    var e = require("scripts/factory/rotate"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/dojo.png",
      41,
      240,
      175,
      175,
      1e-5,
      i.exponential.co,
      500
    );
  }),
  define("scripts/object/flame.js", function (t) {
    var e = require("scripts/layer").getLayer("fruit"),
      i = require("scripts/timeline"),
      r = require("scripts/lib/ucren"),
      n = Math,
      s = n.cos,
      o = n.sin,
      a = parseInt,
      c = n.random,
      u = n.PI,
      h = 0,
      l = 15;
    function f(t, e) {
      var i = t[e];
      if (i) {
        var r, n, c, h, f, d, p, m, g;
        if ((r = 1 - (new Date() - i.birthday) / i.life) <= 0)
          return i.path.remove(), void delete t[i.id];
        (p = i.angle),
          (m = i.center),
          (g = i.length),
          (n = [a(m[0] + s(p) * g * (1 - r)), a(m[1] + o(p) * g * (1 - r))]),
          (c = [a(n[0] - s(p) * l * r), a(n[1] - o(p) * l * r)]),
          (h = [a(n[0] + s(p) * l * r), a(n[1] + o(p) * l * r)]),
          (f = [
            a(n[0] - s(p + 0.5 * u) * l * 0.4 * r),
            a(n[1] - o(p + 0.5 * u) * l * 0.4 * r),
          ]),
          (d = [
            a(n[0] - s(p - 0.5 * u) * l * 0.4 * r),
            a(n[1] - o(p - 0.5 * u) * l * 0.4 * r),
          ]),
          i.path.attr({ path: "M" + c + " Q" + [f, h, d, c].join(" ") });
      }
    }
    function d(t, e) {
      var i = t[e];
      i && (i.path.remove(), delete t[e]);
    }
    return (
      (t.create = function (t, n, s) {
        var o,
          l,
          p = {
            pos: function (t, e) {
              (m = t), (g = e), v.attr("x", m - 21).attr("y", g - 21);
            },
            remove: function () {
              for (var t in ([o, l].invoke("stop"), v.remove(), y)) d(y, t);
            },
          },
          m = t,
          g = n,
          v = e.image("images/smoke.png", m - 21, g - 21, 43, 43).hide(),
          y = {};
        return (
          (o = i.setTimeout(function () {
            v.show(),
              (l = i.setInterval(
                function () {
                  for (var t in (c() < 0.9 &&
                    (function (t, i, r, n, s) {
                      s[h] = {
                        id: h++,
                        birthday: new Date(),
                        center: t,
                        angle: i,
                        length: 60,
                        life: n,
                        path: e
                          .path()
                          .attr({
                            stroke: "none",
                            fill: a((180 * i) / u) + "-#fafad9-#f0ef9c",
                          }),
                      };
                    })([m, g], 2 * u * c(), 0, 200 + 500 * c(), y),
                  y))
                    f(y, t);
                },
                r.isIe ? 20 : 40
              ));
          }, s || 0)),
          p
        );
      }),
      t
    );
  }),
  define("scripts/object/flash.js", function (t) {
    var e,
      i,
      r = require("scripts/layer"),
      n = require("scripts/timeline").use("flash").init(10),
      s = require("scripts/lib/tween"),
      o = require("scripts/lib/sound"),
      a = s.quadratic.cio,
      c = [],
      u = 100;
    return (
      (t.set = function () {
        (e = r.createImage("flash", "images/flash.png", 0, 0, 358, 20).hide()),
          (i = o.create("sound/splatter"));
      }),
      (t.showAt = function (t, r, s) {
        e
          .rotate(s, !0)
          .scale(1e-5, 1e-5)
          .attr({ x: t + 0, y: r + 0 })
          .show(),
          c.clear && c.clear(),
          i.play(),
          n.createTask({
            start: 0,
            duration: u,
            data: [1e-5, 1],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            recycle: c,
          }),
          n.createTask({
            start: u,
            duration: u,
            data: [1, 1e-5],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            recycle: c,
          });
      }),
      (t.onTimeUpdate = function (t, i, r, n) {
        e.scale((n = a(t, i, r - i, u)), n);
      }),
      t
    );
  }),
  define("scripts/object/fps.js", function (t) {
    return t;
  }),
  define("scripts/object/game-over.js", function (t) {
    var e = require("scripts/layer"),
      i = require("scripts/lib/tween"),
      r = require("scripts/timeline"),
      n = (require("scripts/message"), require("scripts/state")),
      s = i.exponential.co;
    return (
      (t.anims = []),
      (t.set = function () {
        this.image = e
          .createImage("default", "images/game-over.png", 75, 198, 490, 85)
          .hide()
          .scale(1e-5, 1e-5);
      }),
      (t.show = function (t) {
        r.createTask({
          start: t,
          duration: 500,
          data: [1e-5, 1, "show"],
          object: this,
          onTimeUpdate: this.onZooming,
          onTimeStart: this.onZoomStart,
          onTimeEnd: this.onZoomEnd,
          recycle: this.anims,
        });
      }),
      (t.hide = function (t) {
        r.createTask({
          start: t,
          duration: 500,
          data: [1, 1e-5, "hide"],
          object: this,
          onTimeUpdate: this.onZooming,
          onTimeStart: this.onZoomStart,
          onTimeEnd: this.onZoomEnd,
          recycle: this.anims,
        });
      }),
      (t.onZoomStart = function (t, e, i) {
        "show" == i && this.image.show();
      }),
      (t.onZooming = function (t, e, i, r) {
        this.image.scale((r = s(t, e, i - e, 500)), r);
      }),
      (t.onZoomEnd = function (t, e, i) {
        "show" == i
          ? n("click-enable").on()
          : "hide" === i && this.image.hide();
      }),
      t
    );
  }),
  define("scripts/object/home-desc.js", function (t) {
    var e = require("scripts/factory/displacement"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/home-desc.png",
      161,
      91,
      -161,
      140,
      7,
      127,
      i.exponential.co,
      500
    );
  }),
  define("scripts/object/home-mask.js", function (t) {
    var e = require("scripts/factory/displacement"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/home-mask.png",
      640,
      183,
      0,
      -183,
      0,
      0,
      i.exponential.co,
      1e3
    );
  }),
  define("scripts/object/knife.js", function (t) {
    var e = require("scripts/timeline"),
      i = require("scripts/layer").getLayer("knife"),
      r = (require("scripts/lib/ucren"), null),
      n = null,
      s = Math.abs,
      o = [],
      a = !0,
      c = [];
    class u {
      constructor(t) {
        (this.sx = t.sx),
          (this.sy = t.sy),
          (this.ex = t.ex),
          (this.ey = t.ey),
          c.push(this);
      }
      set() {
        var t, r, n, a, c, u, h, l;
        return (
          (t = this.sx),
          (r = this.sy),
          (n = this.ex),
          (u = r - (a = this.ey)),
          (h = s((c = t - n))) > (l = s(u))
            ? ((t += c < 0 ? -1 : 1), (r += u < 0 ? (-1 * l) / h : (1 * l) / h))
            : ((t += c < 0 ? (-1 * h) / l : (1 * h) / l),
              (r += u < 0 ? -1 : 1)),
          (this.line = i
            .path("M" + t + "," + r + "L" + n + "," + a)
            .attr({ stroke: "#cbd3db", "stroke-width": "10px" })),
          e.createTask({
            start: 0,
            duration: 200,
            object: this,
            onTimeUpdate: this.update,
            onTimeEnd: this.end,
            recycle: o,
          }),
          this
        );
      }
      update(t) {
        this.line.attr("stroke-width", 10 * (1 - t / 200) + "px");
      }
      end() {
        var t;
        this.line.remove(), (t = c.indexOf(this)) && c.splice(t, 1);
      }
    }
    return (
      (t.newKnife = function () {
        r = n = null;
      }),
      (t.through = function (t, e) {
        if (a) {
          var i = null;
          return (
            null === r ||
              (r == t && n == e) ||
              (new u({ sx: r, sy: n, ex: t, ey: e }).set(), (i = [r, n, t, e])),
            (r = t),
            (n = e),
            i
          );
        }
      }),
      (t.pause = function () {
        o.clear(), this.switchOff();
      }),
      (t.switchOff = function () {
        a = !1;
      }),
      (t.switchOn = function () {
        (a = !0), this.endAll();
      }),
      (t.endAll = function () {
        for (var t = c.length - 1; t >= 0; t--) c[t].end();
      }),
      t
    );
  }),
  define("scripts/object/light.js", function (t) {
    var e = require("scripts/layer"),
      i = e.getLayer("mask");
    e = e.getLayer("light");
    for (
      var r = require("scripts/lib/ucren"),
        n = require("scripts/timeline"),
        s = require("scripts/message"),
        o = r.randomNumber,
        a = Math.PI,
        c = Math.sin,
        u = Math.cos,
        h = [],
        l = [],
        f = 0;
      f < 10;
      f++
    )
      l[f] = f;
    return (
      (t.start = function (t) {
        for (
          var i = t.originX,
            r = t.originY,
            s = 0,
            f = l.random(),
            d = 10,
            p = function () {
              !(function (t, i, r) {
                var n, s, l, f, d, p;
                (n = 36 * r + o(10)),
                  (s = (a * (s = n + 5)) / 180),
                  (l = t + 640 * u((n = (a * n) / 180))),
                  (f = i + 640 * c(n)),
                  (d = t + 640 * u(s)),
                  (p = i + 640 * c(s));
                var m = e
                  .path(["M", t, i, "L", l, f, "L", d, p, "Z"])
                  .attr({ stroke: "none", fill: "#fff" });
                h.push(m);
              })(i, r, f[this]);
            };
          d--;

        )
          n.setTimeout(p.bind(d), (s += 100));
        n.setTimeout(
          function () {
            this.overWhiteLight();
          }.bind(this),
          s + 100
        );
      }),
      (t.overWhiteLight = function () {
        s.postMessage("overWhiteLight.show"), this.removeLights();
        var t = i.rect(0, 0, 640, 480).attr({ fill: "#fff", stroke: "none" }),
          e = {
            onTimeUpdate: function (e) {
              t.attr("opacity", 1 - e / 4e3);
            },
            onTimeEnd: function () {
              t.remove(), s.postMessage("game.over");
            },
          };
        n.createTask({
          start: 0,
          duration: 4e3,
          object: e,
          onTimeUpdate: e.onTimeUpdate,
          onTimeEnd: e.onTimeEnd,
        });
      }),
      (t.removeLights = function () {
        for (var t = 0, e = h.length; t < e; t++) h[t].remove();
        h.length = 0;
      }),
      t
    );
  }),
  define("scripts/object/logo.js", function (t) {
    var e = require("scripts/factory/displacement"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/logo.png",
      288,
      135,
      17,
      -182,
      17,
      1,
      i.exponential.co,
      1e3
    );
  }),
  define("scripts/object/lose.js", function (t) {
    var e,
      i,
      r,
      n = require("scripts/layer"),
      s = require("scripts/lib/tween"),
      o = require("scripts/timeline"),
      a = (require("scripts/lib/ucren"), require("scripts/message")),
      c = s.exponential.co,
      u = s.back.co,
      h = 500,
      l = { src: "images/x.png", sx: 650, ex: 561, y: 5, w: 22, h: 19 },
      f = { src: "images/xx.png", sx: 671, ex: 582, y: 5, w: 27, h: 26 },
      d = { src: "images/xxx.png", sx: 697, ex: 608, y: 6, w: 31, h: 32 },
      p = 0;
    return (
      (t.anims = []),
      (t.set = function () {
        (e = n.createImage("default", l.src, l.sx, l.y, l.w, l.h).hide()),
          (i = n.createImage("default", f.src, f.sx, f.y, f.w, f.h).hide()),
          (r = n.createImage("default", d.src, d.sx, d.y, d.w, d.h).hide());
      }),
      (t.reset = function () {
        (p = 0),
          [
            [e, l],
            [i, f],
            [r, d],
          ].forEach(function (t) {
            t[0].attr("src", t[1].src.replace("xf.png", "x.png"));
          });
      }),
      (t.show = function (t) {
        o.createTask({
          start: t,
          duration: h,
          data: ["show", l.sx, l.ex, f.sx, f.ex, d.sx, d.ex],
          object: this,
          onTimeUpdate: this.onTimeUpdate,
          onTimeStart: this.onTimeStart,
          onTimeEnd: this.onTimeEnd,
          recycle: this.anims,
        });
      }),
      (t.hide = function (t) {
        o.createTask({
          start: t,
          duration: h,
          data: ["hide", l.ex, l.sx, f.ex, f.sx, d.ex, d.sx],
          object: this,
          onTimeUpdate: this.onTimeUpdate,
          onTimeStart: this.onTimeStart,
          onTimeEnd: this.onTimeEnd,
          recycle: this.anims,
        });
      }),
      (t.showLoseAt = function (t) {
        var c,
          u = [
            [e, l],
            [i, f],
            [r, d],
          ];
        !(function (t) {
          var e = n
              .createImage("default", "images/lose.png", t - 27, 406, 54, 50)
              .scale(1e-5, 1e-5),
            i = {
              show: function (t) {
                o.createTask({
                  start: t,
                  duration: 500,
                  data: [s.back.co, 1e-5, 1],
                  object: this,
                  onTimeUpdate: this.onScaling,
                  onTimeEnd: this.onShowEnd,
                });
              },
              hide: function (t) {
                o.createTask({
                  start: t,
                  duration: 500,
                  data: [s.back.ci, 1, 1e-5],
                  object: this,
                  onTimeUpdate: this.onScaling,
                  onTimeEnd: this.onHideEnd,
                });
              },
              onScaling: function (t, i, r, n, s) {
                e.scale((s = i(t, r, n - r, 500)), s);
              },
              onShowEnd: function () {
                this.hide(1500);
              },
              onHideEnd: function () {
                e.remove();
              },
            };
          i.show(200);
        })(t),
          (c = u[++p - 1])[0]
            .attr("src", c[1].src.replace("x.png", "xf.png"))
            .scale(1e-5, 1e-5),
          this.scaleImage(c[0]),
          3 == p && a.postMessage("game.over");
      }),
      (t.scaleImage = function (t) {
        (t.myOnScaling =
          t.myOnScaling ||
          function (t, e) {
            this.scale((e = u(t, 1e-5, 0.99999, 500)), e);
          }),
          (t.myOnScaleEnd =
            t.myOnScaleEnd ||
            function () {
              this.scale(1, 1);
            }),
          o.createTask({
            start: 0,
            duration: 500,
            object: t,
            onTimeUpdate: t.myOnScaling,
            onTimeEnd: t.myOnScaleEnd,
            recycle: this.anims,
          });
      }),
      (t.onTimeUpdate = function (t, n, s, o, a, u, l, f) {
        e.attr("x", c(t, s, o - s, h)),
          i.attr("x", c(t, a, u - a, h)),
          r.attr("x", c(t, l, f - l, h));
      }),
      (t.onTimeStart = function (t) {
        "show" == t && [e, i, r].invoke("show");
      }),
      (t.onTimeEnd = function (t) {
        "hide" == t && ([e, i, r].invoke("hide"), this.reset());
      }),
      t
    );
  }),
  define("scripts/object/new-game.js", function (t) {
    var e = require("scripts/factory/rotate"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/new-game.png",
      244,
      231,
      195,
      195,
      1e-5,
      i.exponential.co,
      500
    );
  }),
  define("scripts/object/new.js", function (t) {
    var e,
      i = require("scripts/layer"),
      r = require("scripts/lib/tween"),
      n = require("scripts/timeline"),
      s = (require("scripts/lib/ucren"), 300),
      o = r.exponential.co,
      a = r.quadratic.ci;
    return (
      (t.anims = []),
      (t.set = function () {
        e = i.createImage("default", "images/new.png", 129, 328, 0, 0);
      }),
      (t.unset = function () {}),
      (t.show = function (t) {
        n.createTask({
          start: t,
          duration: 500,
          data: [129, 170, 328, 221, 0, 70, 0, 42],
          object: this,
          onTimeUpdate: this.onShowing,
          onTimeStart: this.onShowStart,
          onTimeEnd: this.onShowEnd,
          recycle: this.anims,
        });
      }),
      (t.hide = function (t) {
        this.anims.clear(),
          n.createTask({
            start: t,
            duration: 500,
            data: [170, 129, 221, 328, 70, 0, 42, 0],
            object: this,
            onTimeUpdate: this.onShowing,
            recycle: this.anims,
          });
      }),
      (t.jump = function () {
        this.anims.clear(),
          n.createTask({
            start: 0,
            duration: -1,
            object: this,
            onTimeUpdate: this.onJumping,
            recycle: this.anims,
          });
      }),
      (t.onShowStart = function () {}),
      (t.onShowing = function (t, i, r, n, s, a, c, u, h) {
        e.attr({
          x: o(t, i, r - i, 500),
          y: o(t, n, s - n, 500),
          width: o(t, a, c - a, 500),
          height: o(t, u, h - u, 500),
        });
      }),
      (t.onShowEnd = function () {
        this.jump();
      }),
      (t.onJumping = function (t) {
        var i = parseInt(t / s);
        (t %= s), i % 2 && (t = s - t), e.attr("y", a(t, 221, 8, s));
      }),
      t
    );
  }),
  define("scripts/object/ninja.js", function (t) {
    var e = require("scripts/factory/displacement"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/ninja.png",
      244,
      81,
      315,
      -140,
      315,
      43,
      { show: i.bounce.co, hide: i.exponential.co },
      1e3
    );
  }),
  define("scripts/object/quit.js", function (t) {
    var e = require("scripts/factory/rotate"),
      i = require("scripts/lib/tween");
    return e.create(
      "images/quit.png",
      493,
      311,
      141,
      141,
      1e-5,
      i.exponential.co,
      500
    );
  }),
  define("scripts/object/score.js", function (t) {
    var e,
      i,
      r,
      n = require("scripts/layer"),
      s = require("scripts/lib/tween"),
      o = require("scripts/timeline"),
      a = (require("scripts/lib/ucren"), o.setTimeout.bind(o)),
      c = s.exponential.co,
      u = (require("scripts/message"), 500);
    return (
      (t.anims = []),
      (t.set = function () {
        (e = n
          .createImage("default", "images/score.png", -94, 8, 29, 31)
          .hide()),
          (i = n
            .createText("default", "0", -59, 24, "90-#fc7f0c-#ffec53", "30px")
            .hide()),
          (r = n
            .createText("default", "BEST 999", -93, 48, "#af7c05", "14px")
            .hide());
      }),
      (t.show = function (t) {
        o.createTask({
          start: t,
          duration: u,
          data: ["show", -94, 6, -59, 41, -93, 7],
          object: this,
          onTimeUpdate: this.onTimeUpdate,
          onTimeStart: this.onTimeStart,
          onTimeEnd: this.onTimeEnd,
          recycle: this.anims,
        });
      }),
      (t.hide = function (t) {
        o.createTask({
          start: t,
          duration: u,
          data: ["hide", 6, -94, 41, -59, 7, -93],
          object: this,
          onTimeUpdate: this.onTimeUpdate,
          onTimeStart: this.onTimeStart,
          onTimeEnd: this.onTimeEnd,
          recycle: this.anims,
        });
      }),
      (t.number = function (t) {
        i.attr("text", t || 0),
          e.scale(1.2, 1.2),
          a(function () {
            e.scale(1, 1);
          }, 60);
      }),
      (t.onTimeUpdate = function (t, n, s, o, a, h, l, f) {
        e.attr("x", c(t, s, o - s, u)),
          i.attr("x", c(t, a, h - a, u)),
          r.attr("x", c(t, l, f - l, u));
      }),
      (t.onTimeStart = function (t) {
        "show" === t && [e, i, r].invoke("show");
      }),
      (t.onTimeEnd = function (t) {
        "hide" === t && ([e, i, r].invoke("hide"), i.attr("text", 0));
      }),
      t
    );
  }),
  startModule("scripts/main");
