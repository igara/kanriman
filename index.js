/* eslint-disable no-console */
const Botkit = require("botkit");
const nmap = require("node-nmap");
const tanmatsu = require("./tanmatsu.js");

/**
 * @const access_tokenやbot_log
 */
const setting = require("./setting.js");

const controller = Botkit.slackbot({
	debug: true
});

controller.spawn({
	token: setting.accsess_token
}).startRTM((err,bot,payload) => {
	// 初期処理
	if (err) {
		throw new Error("Could not connect to Slack");
	} else {
		// bot.say({
		// 	channel: "bot",
		// 	text: "再起動したぞ！",
		// 	username: "kanriman",
		// });
	}
});

/**
 * @kanriman help を実行した時にコマンド一覧を教えてくれる
 */
controller.hears("help", "direct_mention",(bot, message) => {
	console.log(message);
	const ask = (response, convo) => {
		console.log(response);
		convo.say("コマンドの説明するぞ！");
	};
	bot.startConversation(message, ask);
});

/**
 * @kanriman arp を実行した時に存在する端末を見る
 */
controller.hears("arp", "direct_mention", (bot, message) => {
	console.log(message);
	const ask = (response, convo) => {
		console.log(response);
		convo.say("端末の存在確認するぞ！");
        const nmapscan = new nmap.nodenmap.NmapScan("192.168.208.0/24", "-sP");
        nmapscan.on("complete", (data) => {
            console.log(data);
            for (var index = 0; index < tanmatsu.length; index++) {
                for (var i = 0; i < data.length; i++) {
                    if (tanmatsu[index].mac == data[i].mac) {
                        convo.say(tanmatsu[index].name + "存在するぞ！");
                        convo.say("IPは" + data[i].ip + "だ！");
                    }
                }
            }
        });
        nmapscan.emit("complete");
	};
	bot.startConversation(message, ask);
});
