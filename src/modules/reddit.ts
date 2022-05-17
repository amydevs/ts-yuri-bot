import clients from "./clients"

export function getRandomImage() {
    return clients.RedditClient.getSubreddit("wholesomeyuri").getHot({limit: 50}).then(
        (listing) => {
            const filtered = listing.filter(e => { 
                return !e.over_18 && e.url;
            });
            return filtered.at(randomIntFromInterval(0, filtered.length - 1))
        }
    );
}



function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}