import TargetWord from "./model/targetWord";

export async function getTargetWords() {
  const words = await new Promise((resolve, reject) => {
    TargetWord.find({}, (err, doc) => {
      if (!err) {
        resolve(doc);
      } else {
        reject(err);
      }
    });
  });

  return words;
}
