async function queryBackendAPI(tweetID) {
    const response = await fetch(`[SECRET_ENDPOINT_HERE]?value=${tweetID}`);
    
    const data = await response.json();
    console.log(data)
    return data.result === "true"
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
                

                const isVisited = await queryBackendAPI(id);
                if (isVisited) {
                    tweetElement.style.backgroundColor = '#212540';
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