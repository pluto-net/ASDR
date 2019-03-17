import TwitterWatcher from "./twitter";
import Tweet from "./model/tweet";
import SlackManager from "./helpers/slack";
import { getTargetWords } from "./targetWord";

export async function searchCronJob() {
  const rawWords = await getTargetWords();
  const targetWords = rawWords.filter(w => w.monitoring).map(w => w.word);

  try {
    const twitPromises = targetWords.map(async q => {
      const res = await TwitterWatcher.searchTweets(q);
      res.forEach(t => {
        Tweet.findOne({ originId: t.id }, (err, savedTweet) => {
          if (err) {
            console.error(err);
          } else {
            if (!savedTweet) {
              const tweet = new Tweet({
                originId: t.id,
                content: t.content,
                destURL: t.destURL,
                originCreatedAt: new Date(t.createdAt),
                userId: t.user.id_str,
                userName: t.user.name
              });

              SlackManager.sendMsg(
                `*${tweet.userName}* - ${tweet.content}
                <${tweet.destURL}> 
                  `
              );
              tweet.save();
            }
          }
        });
      });
    });

    Promise.all(twitPromises).then(() => {
      console.log("DONE!");
    });
  } catch (err) {
    console.error(err);
  }
}
