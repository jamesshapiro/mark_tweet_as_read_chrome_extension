async function isTweetVisited(tweetID) {
  return new Promise((resolve) => {
    chrome.storage.local.get(tweetID, (result) => {
      resolve(result[tweetID])
    })
  })
}

const allTweets = new Set();

async function extractTweetIDs() {
    const tweetElements = document.querySelectorAll('[data-testid="tweet"]');

    for (const tweetElement of tweetElements) {
        const tweetID = tweetElement.querySelector('a[href*="/status/"]');
        if (tweetID) {
            if (!allTweets.has(tweetID)) {
                allTweets.add(tweetID)
            } else {
                continue
            }
            const tweetIDMatch = tweetID.href.match(/\/status\/(\d+)/);
            if (tweetIDMatch && tweetIDMatch[1]) {
                const id = tweetIDMatch[1];
                console.log(`TweetID: ${id}`);
                

                const isVisited = await isTweetVisited(id)
                if (isVisited) {
                  tweetElement.style.backgroundColor = '#212540'
                } else {
                  chrome.storage.local.set({ [id]: true })
                }
            }
        }
    }
  }

var observer = new MutationObserver(function(mutationsList, observer) {
    extractTweetIDs();
});

observer.observe(document, { childList: true, subtree: true });
extractTweetIDs();