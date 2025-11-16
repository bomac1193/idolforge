/**
 * API Integration Layer
 * Handles posting to different platforms
 */

import axios from 'axios';

/**
 * TikTok Content Posting API
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
 */
export async function postToTikTok(post, credentials) {
  const { accessToken } = credentials;

  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      {
        post_info: {
          title: post.concept,
          description: post.caption,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: 0, // Set actual video size
          chunk_size: 10000000,
          total_chunk_count: 1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      platform: 'tiktok',
      publish_id: response.data.data.publish_id,
      upload_url: response.data.data.upload_url
    };
  } catch (error) {
    return {
      success: false,
      platform: 'tiktok',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Instagram Graph API - Content Publishing
 * Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */
export async function postToInstagram(post, credentials) {
  const { accessToken, igUserId } = credentials;

  try {
    // Step 1: Create container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${igUserId}/media`,
      {
        image_url: post.imageUrl, // Must be publicly accessible
        caption: `${post.caption}\n\n${post.hashtags.join(' ')}`,
        access_token: accessToken
      }
    );

    const creationId = containerResponse.data.id;

    // Step 2: Publish container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
      {
        creation_id: creationId,
        access_token: accessToken
      }
    );

    return {
      success: true,
      platform: 'instagram',
      media_id: publishResponse.data.id
    };
  } catch (error) {
    return {
      success: false,
      platform: 'instagram',
      error: error.response?.data || error.message
    };
  }
}

/**
 * X (Twitter) API v2 - Create Tweet
 * Docs: https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
 */
export async function postToX(post, credentials) {
  const { bearerToken } = credentials;

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      {
        text: post.caption
      },
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      platform: 'x',
      tweet_id: response.data.data.id
    };
  } catch (error) {
    return {
      success: false,
      platform: 'x',
      error: error.response?.data || error.message
    };
  }
}

/**
 * OnlyFans - No official API
 * Manual upload required or use third-party services at your own risk
 */
export function postToOnlyFans(post, credentials) {
  return {
    success: false,
    platform: 'onlyfans',
    error: 'OnlyFans has no official posting API. Manual upload required or use third-party service at your own risk.',
    post_data: {
      caption: post.caption,
      visual_idea: post.visual_idea
    }
  };
}

/**
 * Batch post to multiple platforms
 */
export async function batchPost(posts, credentialsByPlatform) {
  const results = [];

  for (const post of posts) {
    const platform = post.platform.toLowerCase();
    const credentials = credentialsByPlatform[platform];

    if (!credentials) {
      results.push({
        success: false,
        platform,
        error: 'No credentials provided for this platform'
      });
      continue;
    }

    let result;

    switch (platform) {
      case 'tiktok':
        result = await postToTikTok(post, credentials);
        break;
      case 'instagram':
      case 'ig':
        result = await postToInstagram(post, credentials);
        break;
      case 'x':
      case 'twitter':
        result = await postToX(post, credentials);
        break;
      case 'onlyfans':
        result = postToOnlyFans(post, credentials);
        break;
      default:
        result = {
          success: false,
          platform,
          error: 'Unsupported platform'
        };
    }

    results.push(result);
  }

  return results;
}
