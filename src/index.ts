import { CronJob } from "cron";
import { getRandomImage } from "./modules/reddit";

import clients from "./modules/clients";
import axios from "axios";
import { EUploadMimeType } from "twitter-api-v2";

// const CRONJOB = '* * * * * *';
const CRONJOB = "*/30 * * * *";

const RUNONCE = false;

let runtimes = 0;

(async ()=>{
    const functoberun = () => {
        if (RUNONCE && runtimes > 0) {
            return;
        }
        runtimes = 1;

        getRandomImage().then(async img => {
            if (img) {
                console.log(img.url)

                if (img.url.startsWith("https://twitter")) {
                    clients.TwitterClient.v2.tweet(
                        { text: `${img.title}\n${img.url}` }
                    )
                    return;
                }

                let mimetype = EUploadMimeType.Jpeg;
                if (img.url.endsWith(".png")) { mimetype = EUploadMimeType.Png }
                if (img.url.endsWith(".gif")) { mimetype = EUploadMimeType.Gif }

                const req = await axios.get(img.url, { 
                    responseType: 'arraybuffer'
                });
                const mediaId = await clients.TwitterClient.v1.uploadMedia(
                    Buffer.from(req.data),
                    {
                        mimeType: mimetype
                    }
                );
                await clients.TwitterClient.v2.tweet(
                    { text: `${img.title}\nhttps://www.reddit.com${img.permalink}`, media: { media_ids: [mediaId] } }
                )
            }
        });
    }
    functoberun();
    const job = new CronJob(
        CRONJOB,
            functoberun
        ,
        null,
        true,
        'America/Los_Angeles'
    )
})();