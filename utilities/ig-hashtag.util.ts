import axios from 'axios';
import _uniqBy from 'lodash/uniqBy'
import _uniq from 'lodash/uniq'

interface PostVM {
  id: string;
  shortcode: string;
  edge_media_to_caption: {
    edges: {
      node: {
        text: string;
      }
    }[]
  },
  display_url: string;
  thumbnail_src: string;
  thumbnail_resources: {
    src: string;
    config_width: number;
    config_height: number;
  }[];

  taken_at_timestamp: number;
  owner: {
    id: string;
  };
}

interface PageInfoVM {
  has_next_page: boolean;
  end_cursor: string;
}

export interface HashtagResultVM {
  posts: PostVM[];
  page_info: PageInfoVM[]
}

export const fetchIgHashTag = async (tag: string, end_cursor?: string): Promise<HashtagResultVM> => {
  try {
    const { data } = await axios.get(`https://www.instagram.com/explore/tags/${encodeURIComponent(tag.trim())}/`, {
      params: {
        __a: 1,
        max_id: end_cursor
      }
    });

    const posts = data.graphql.hashtag.edge_hashtag_to_media.edges.map(edge => edge.node) as PostVM[];
    const page_info = data.graphql.hashtag.edge_hashtag_to_media.page_info as PageInfoVM;

    return {
      posts,
      page_info: [page_info]
    };
  } catch (err) {
    return {
      posts: [],
      page_info: []
    }
  }
}


export const fetchMultipleIgHashTag = async (tags: string[], end_cursors: string[] = []): Promise<HashtagResultVM> => {
  end_cursors = Array.isArray(end_cursors) ? end_cursors : [end_cursors];

  const resultArray: HashtagResultVM[] = await Promise.all(tags.map((tag, index) => {
    const end_cursor = end_cursors[index] || '';

    return fetchIgHashTag(tag, end_cursor)
  }));

  const mergeResult = resultArray.reduce((pre: null | HashtagResultVM, cur) => {
    return {
      posts: !pre ? cur.posts : pre.posts.concat(cur.posts),
      page_info: !pre ? cur.page_info : pre.page_info.concat(cur.page_info),
    };
  }, null)

  if (mergeResult) {
    mergeResult.posts = _uniqBy(mergeResult.posts, 'id')
    mergeResult.posts = mergeResult.posts.sort((a: PostVM, b: PostVM) => a.taken_at_timestamp > b.taken_at_timestamp ? -1 : 1)
  }

  return mergeResult || {
    posts: [],
    page_info: []
  };
}


export const fetchOwnerInfo = async (shortcode: string) => {
  try {
    const { data: ret } = await axios.get(`https://www.instagram.com/graphql/query/`, {
      params: {
        query_hash: '1451128a3ce596b72f20c738dc7f0f73',
        variables: JSON.stringify(
          {
            shortcode,
            include_reel: true,
            include_logged_out: false
          })
      }
    });

    const owner = ret.data.shortcode_media.owner.reel.owner;

    if (!owner) {
      throw Error('Owner not found.');
    }

    return owner;
  } catch (err) {
    console.error('[fetchOwnerInfo]', err.message)
    return;
  }
}

