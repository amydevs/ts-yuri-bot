import { TwitterApi } from 'twitter-api-v2';
import snoowrap from 'snoowrap';
import dotenv from 'dotenv';
dotenv.config();

export const TwitterClient = new TwitterApi({ 
    appKey: process.env.CONSUMERKEY as string, 
    appSecret: process.env.CONSUMERSECRET as string,
    accessToken: process.env.ACCESSTOKEN as string,
    accessSecret: process.env.ACCESSSECRET as string,
}).readWrite;

export const RedditClient = new snoowrap({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
    username: process.env.REDDITUSER,
    password: process.env.REDDITPASS,
    clientId: process.env.REDDITID,
    clientSecret: process.env.REDDITSECRET
});

export default { TwitterClient, RedditClient };