import { Submission } from "snoowrap";
import clients from "./clients"

const subreddits: string[] = [
    "wholesomeyuri",
    "yuri_jp",
    "yurification"
];
const cache: string[] = [];

export async function getRandomImage() {
    return (new Promise<Omit<Submission, "then"> | undefined>(async resolve => {
        let listing: Submission[] = [];
        for (const sub of subreddits) {
            const tempsublisting = (await clients.RedditClient.getSubreddit(sub).getHot({limit: 75})).filter(e => {
                return !e.over_18 && e.url && e.thumbnail !== "self" && !cache.includes(e.url);
            });
            listing = listing.concat(tempsublisting);
        }
        const returnval = listing.at(randomIntFromInterval(0, listing.length - 1))
        if (returnval) { cache.push(returnval.url); }
        resolve(returnval);
    }));
}



function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}