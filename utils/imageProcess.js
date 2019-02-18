const makeTid = function() {
    for (var e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", o = e.length, a = "", t = 0; t < 32; t++) a += e.charAt(Math.floor(Math.random() * o));
    return a
}


function formatTime(e) {
    var o = e.getFullYear(),
        r = e.getMonth() + 1,
        n = e.getDate(),
        a = e.getHours(),
        l = e.getMinutes(),
        i = e.getSeconds();
    return [o, r, n].map(t).join("/") + " " + [a, l, i].map(t).join(":")
}

function t(e) {
    return e = e.toString(), e[1] ? e : "0" + e
}

function stringFormat(e) {
    if (0 == arguments.length) return null;
    var t = Array.prototype.slice.call(arguments, 1);
    return e.replace(/\{(\d+)\}/g, function(e, o) {
        return t[o]
    })
}

function getScreenInfo() {
    var e = {};
    return wx.getSystemInfo({
        success: function(t) {
            e.width = t.windowWidth
            e.height = t.windowHeight
        }
    }), e
}

function getAutoImage(e, t, o, r) {
    var n = {},
        a = e,
        l = t,
        i = l / a;
    console.log("原图宽: " + a)
    console.log("原图高: " + l)
    console.log("屏幕宽: " + o)
    console.log("屏幕高: " + r);
    var c = r / o;
    return console.log("图片高宽比: " + i), console.log("屏幕高宽比: " + c), i < c ? (n.imageWidth = o, n.imageHeight = o * l / a) : (n.imageHeight = r, n.imageWidth = r * a / l), console.log("缩放后的宽: " + n.imageWidth), console.log("缩放后的高: " + n.imageHeight), n
}

function processingImage(e, t, o) {

    function r(e) {
        a.clearRect(0, 0, t, o)
        a.translate(0, e)
        a.setFillStyle(c)
        a.fillRect(0, 0, t, 2 * o)
        a.draw()
    }

    function n(e) {
        e.data.done || (r(i), i += o / 50, i >= o && (i = 0), d = setTimeout(function() {
            n(e)
        }, 25))
    }

    var a = wx.createCanvasContext("wx_canvas1"),
        l = wx.createCanvasContext("wx_canvas2"),
        i = 0,
        c = a.createLinearGradient(0, 0, 0, 2 * o),
        g = "rgba(30,180,240,0.8)",
        s = "rgba(30,180,240,0.0)";

    c.addColorStop(0, g)
    c.addColorStop(.05, s)
    c.addColorStop(.3, s)
    c.addColorStop(.5, g)
    c.addColorStop(.55, s)
    c.addColorStop(.8, s)
    c.addColorStop(1, g);

    var d = null,
        i = 0;
    0 == e.data.done ? (! function() {
        var e = wx.createCanvasContext("wx_canvas1"),
            r = wx.createCanvasContext("wx_canvas2");
        r.clearRect(0, 0, t, o)
        r.setLineWidth(1)
        r.setStrokeStyle("rgba(220,210,200,0.4)");

        for (var n = 80, a = 80, l = 0; l <= t; l += n) {
            r.beginPath()
            r.moveTo(l, 0)
            r.lineTo(l, 2 * o)
            r.stroke()
            r.closePath()
        }

        for (var i = 0; i <= o; i += a) {
            r.beginPath()
            r.moveTo(0, i)
            r.lineTo(t, i)
            r.stroke()
            r.closePath()
        }

        n /= 5
        a /= 5
        r.setStrokeStyle("rgba(220,210,200,0.2)");

        for (var l = 0; l <= t; l += n) {
            if (l % 5 != 0) {
                r.beginPath()
                r.translate(.5, .5)
                r.moveTo(l, 0)
                r.lineTo(l, o)
                r.stroke()
                r.translate(-.5, -.5)
                r.closePath();
            }
        }

        for (var i = 0; i <= o; i += a) {
            if (i % 5 != 0) {
                r.beginPath()
                r.translate(.5, .5)
                r.moveTo(0, i)
                r.lineTo(t, i)
                r.stroke()
                r.translate(-.5, -.5)
                r.closePath()
            }
        }

        r.draw()
        e.clearRect(0, 0, t, 2 * o);
        var c = e.createLinearGradient(0, 0, 0, 2 * o),
            g = "rgba(30,180,240,0.8)",
            s = "rgba(30,180,240,0.0)";
        c.addColorStop(0, g)
        c.addColorStop(.05, s)
        c.addColorStop(.3, s)
        c.addColorStop(.5, g)
        c.addColorStop(.55, s)
        c.addColorStop(.8, s)
        c.addColorStop(1, g)
        e.setFillStyle(c)
        e.fillRect(0, 0, t, 2 * o)
        e.draw()
    }(), n(e)) : 1 == e.data.done && function() {
        clearTimeout(d)
        l.clearRect(0, 0, t, o)
        l.draw()
        a.translate(0, i)
        a.clearRect(0, 0, t, 2 * o)
        a.draw()
    }()
}

function l(e, t) {
    for (var o = 0; o < e.length;) {
        for (var r = 0, n = o; n < o + t.length && n < e.length;) e[n] = e[n] ^ t[r], r += 1, n += 1;
        o += t.length
    }
    return e
}

function i(e) {
    for (var t, o, r, n, a, l = "", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = new Uint8Array(e), g = c.byteLength, s = g % 3, d = g - s, u = 0; u < d; u += 3) a = c[u] << 16 | c[u + 1] << 8 | c[u + 2], t = (16515072 & a) >> 18, o = (258048 & a) >> 12, r = (4032 & a) >> 6, n = 63 & a, l += i[t] + i[o] + i[r] + i[n];
    return 1 == s ? (a = c[d], t = (252 & a) >> 2, o = (3 & a) << 4, l += i[t] + i[o] + "==") : 2 == s && (a = c[d] << 8 | c[d + 1], t = (64512 & a) >> 10, o = (1008 & a) >> 4, r = (15 & a) << 2, l += i[t] + i[o] + i[r] + "="), l
}

function c(e) {
    for (var t, o, r = [], n = 0; n < e.length; n++) {
        t = e.charCodeAt(n), o = [];
        do {
            o.push(255 & t), t >>= 8
        } while (t);
        r = r.concat(o.reverse())
    }
    return r
}

function g(e) {
    var t = c("SimpleKey$");
    return i(l(c(e), t))
}

function s(e) {
    return parseInt(e.getTime() / 1e3, 10).toString()
}

function EncryptDateTimeForImageProcess() {
    return g("weapp_" + s(new Date))
}

function getScaleRatio(e, t, a) {
    var i = t.Face.Width,
        c = t.Face.Height,
        g = t.Face.Left,
        h = t.Face.Top,
        o = t.ImageWidth,
        r = t.ImageHeight,
        n = i / 2,
        F = c / 2,
        f = [g + n, o - g - n, h + F, r - h - F],
        m = [f[0] / n, f[1] / n, f[2] / F, f[3] / F],
        u = 1.618;
    a && 0 != a && (u = a);
    for (var d = -1, I = 0; I < m.length; ++I) m[I] < u && (d = I, u = m[I]);
    var l = 0;
    return l = -1 == d ? i > c ? i : c : 0 == d || 1 == d ? i : c, e / (l * u)
}

function getZoomImg(t, a, i) {
    var c = e(t, a, i),
        g = a.ImageWidth * c,
        h = a.ImageHeight * c,
        o = a.Face.Top * c;
    return {
        left: t / 2 - (a.Face.Left * c + a.Face.Width * c / 2),
        top: t / 2 - (o + a.Face.Height * c / 2),
        width: g,
        height: h
    }
}

module.exports = {
    formatTime: formatTime,
    processingImage: processingImage,
    getScreenInfo: getScreenInfo,
    getAutoImage: getAutoImage,
    stringFormat: stringFormat,
    EncryptDateTimeForImageProcess: EncryptDateTimeForImageProcess,
    makeTid: makeTid, //生成tid
    getScaleRatio: getScaleRatio,
    getZoomImg: getZoomImg
}