import clients from "./clients"

export function getRandomImage() {
    return clients.RedditClient.getSubreddit("wholesomeyuri").getHot().then(
        (listing) => {
            return listing.filter(e => { return !e.over_18 && e.url }).at(randomIntFromInterval(0, listing.length - 1))
        }
    );
}



function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}