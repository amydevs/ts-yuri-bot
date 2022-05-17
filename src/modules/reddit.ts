import clients from "./clients"

const cache: string[] = [];

export function getRandomImage() {
    return clients.RedditClient.getSubreddit("wholesomeyuri").getHot({limit: 100}).then(
        (listing) => {
            const filtered = listing.filter(e => { 
                return !e.over_18 && e.url && !cache.includes(e.url);
            });
            const returnval = filtered.at(randomIntFromInterval(0, filtered.length - 1));
            if (returnval) { cache.push(returnval.url); }
            return returnval;
        }
    );
}



function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}