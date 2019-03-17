import Axios from "axios";

class SlackManager {
  constructor() {
    this.URL = process.env.SLACK_URL;
  }

  sendMsg(msg) {
    Axios.post(this.URL, {
      text: msg
    });
  }
}

const slackManager = new SlackManager();

export default slackManager;
