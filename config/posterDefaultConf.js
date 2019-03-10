module.exports = {
  posterConfig: {
    width: 750,
    height: 1334,
    backgroundColor: "#fff",
    debug: false,
    blocks: [
      {
        width: 690,
        height: 910,
        x: 30,
        y: 153,
        borderWidth: 2,
        borderColor: "#f0c2a0",
        borderRadius: 20
      },
      {
        width: 634,
        height: 104,
        x: 59,
        y: 933,
        backgroundColor: "#fff",
        opacity: 0.7,
        zIndex: 100
      }
    ],
    texts: [
      {
        x: 30,
        y: 73,
        baseLine: "top",
        text: "颜值鉴定报告",
        fontSize: 38,
        color: "#080808"
      },
      {
        x: 92,
        y: 950,
        fontSize: 30,
        baseLine: "middle",
        text: "",
        width: 570,
        lineNum: 2,
        lineHeight: 40,
        color: "#000",
        zIndex: 200
      },
      {
        x: 360,
        y: 1125,
        baseLine: "top",
        text: "拼颜值啊",
        fontSize: 38,
        color: "#080808"
      },
      {
        x: 360,
        y: 1183,
        baseLine: "top",
        text: "长按识别二维码",
        fontSize: 28,
        color: "#929292"
      }
    ],
    images: [
      {
        width: 634,
        height: 845,
        x: 59,
        y: 190,
        url: ""
      },
      {
        width: 220,
        height: 220,
        x: 92,
        y: 1080,
        url: "/images/logo.jpg"
      }
    ]
  }
};
