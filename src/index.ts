import { CronJob } from "cron";
import { getRandomImage } from "./modules/reddit";

import clients from "./modules/clients";
import axios from "axios";
import { EUploadMimeType } from "twitter-api-v2";

// const CRONJOB = '* * * * * *';
const CRONJOB = "*/30 * * * *";

(async () => {
    const uploadImgToTwitter = async (url: string) => {
        let mimetype = EUploadMimeType.Jpeg;
        if (url.includes(".png")) { mimetype = EUploadMimeType.Png }
        if (url.includes(".gif")) { mimetype = EUploadMimeType.Gif }

        const req = await axios.get(url, { 
            responseType: 'arraybuffer'
        });
        
        return await clients.TwitterClient.v1.uploadMedia(
            Buffer.from(req.data),
            {
                mimeType: mimetype
            }
        );
    };
    const functoberun = async () => {
        await getRandomImage().then(async img => {
            if (img) {
                console.log(img.url);
                if ((img as any).gallery_data) {
                    let media_ids: string[] = [];
                    for (const gallery of (img as any).gallery_data.items) {
                        let path = 'media_metadata.' + gallery.media_id + '.p';
                        let media = path.split(".").reduce(function (o: any, x: any) { return o[x] }, img);
                        media.sort((a: any, b: any) => {
                            return b.y - a.y;
                        })
                        media_ids.push(await uploadImgToTwitter(media[0].u));
                    }
                    await clients.TwitterClient.v2.tweet(
                        { text: `${img.title}\nhttps://www.reddit.com${img.permalink}`, media: { media_ids: media_ids } }
                    )
                    return;
                }
                else if (img.url.startsWith("https://twitter")) {
                    clients.TwitterClient.v2.tweet(
                        { text: `${img.title}\n${img.url}` }
                    )
                    return;
                }
                else {
                    await clients.TwitterClient.v2.tweet(
                        { text: `${img.title}\nhttps://www.reddit.com${img.permalink}`, media: { media_ids: [await uploadImgToTwitter(img.url)] } }
                    )
                }
            }
        });
    }
    if (process.env.RUNTEST) { await functoberun(); }
    const job = new CronJob(
        CRONJOB,
            functoberun,
        null,
        true,
        'America/Los_Angeles'
    )
})();