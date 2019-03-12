const APIKEY = '4442334d7a6250624c442f7551784d6f79556273536f3744555848772f6b415439547778614e692f4b5343';
const regist_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/registration?APIKEY=' + APIKEY;
const chat_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/dialogue?APIKEY=' + APIKEY;

function convertDateToString(date, format='YYYY-MM-DD hh:mm:ss') {
  // Date -> "YYYY-MM-DD hh:mm:ss"
  return format
  .replace(/YYYY/g, date.getFullYear())
  .replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  .replace(/DD/g, ('0' + date.getDate()).slice(-2))
  .replace(/hh/g, ('0' + date.getHours()).slice(-2))
  .replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  .replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
}

const vm = new Vue({
  el: '#app',
  data: {
    appId: '',
    message: '',
    response: '',
    chatlog: []
  },
  mounted: function() {
    // appIdを取得する
    axios({
      method : 'POST',
      url    : regist_URL,
      data   : {
        botId : 'Chatting',
        appKind : 'Typing'  // サービス毎に定義するアプリ種別（任意の値）
      },
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
     }).then(response => (this.appId = response.data.appId));
  },
  methods: {
    // メッセージを送信する
    postMessage: function() {
      this.chatlog.push('あなた:\t'+this.message);
      axios({
        method : 'POST',
        url    : chat_URL,
        data   : {
          language: "ja-JP",
          botId : 'Chatting',
          appId: this.appId,
          voiceText: this.message,
          appRecvTime: convertDateToString( new Date() ),
          appSendTime: convertDateToString( new Date() )
        },
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
       }).then(response => {
         this.response = response.data.systemText.expression;
         this.chatlog.push('AI:\t'+this.response);
       });
      this.message = '';
    }
  }
})