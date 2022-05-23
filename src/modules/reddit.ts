import { Submission } from "snoowrap";
import clients from "./clients"

const subreddits: string[] = [
    "wholesomeyuri",
    "yuri_jp",
    "yurification",
    "PolyYuri",
    "NicoMaki"
];

export async function getRandomImage() {
    return (new Promise<Omit<Submission, "then"> | undefined>(async resolve => {
        const history = (await clients.RedditClient.getMe().getUpvotedContent()).flatMap(e => e.id);

        let listing: Submission[] = [];
        
        for (const sub of subreddits) {
            const tempsublisting = (await clients.RedditClient.getSubreddit(sub).getHot({limit: 75})).filter(e => {
                return Boolean(
                    !e.over_18 && 
                    e.url && 
                    e.thumbnail !== "self" &&
                    e.thumbnail !== "" && 
                    !history.includes(e.id) &&
                    !arrayHasDuplicates(getParents(e)?.flatMap(e => e.id).concat(history))
                );
            });
            listing = listing.concat(tempsublisting);
        }
        const returnval = listing.at(randomIntFromInterval(0, listing.length - 1))

        // upvote for history
        if (returnval) { 
            await returnval.upvote().then(() => { return; }); 
            const returnvalparents = getParents(returnval);
            if (returnvalparents) {
                for (const parent of returnvalparents) {
                    await parent.upvote().then(() => { return; });
                }
            }
        }
        resolve(returnval);
    }));
}

function getParents(s: Submission) {
    const parents = (s as any).crosspost_parent_list as Submission[] | undefined;
    if (parents) {
        return parents.map(e => clients.RedditClient.getSubmission(e.id))
    }
    else {
        return undefined;
    }
}


function arrayHasDuplicates(array: Array<any> | undefined) {
    if (array) {
        return (new Set(array)).size !== array.length;
    }   
    else {
        return false;
    }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}