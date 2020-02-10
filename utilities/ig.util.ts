import axios from 'axios';

import { ResultListGenericVM, ResultCode } from '../view-models/result.vm';

export interface IgVM {
  href: string;
  src: string;
}

export const crawlerInstagramFanPage = async (igId: string) => {
  const result = new ResultListGenericVM<IgVM>();

  if (igId === 'ustylelife') {
    igId = '1916700274';
  }
  if (igId === 'howhowhasfriends') {
    igId = '6505088311'
  }

  const { data: ret } = await axios.get('https://www.instagram.com/graphql/query', {
    params: {
      query_hash: 'e769aa130647d2354c40ea6a439bfc08',
      variables: JSON.stringify({
        id: igId,
        first: 12,
      })
    }
  });

  if (!ret.status || ret.status.toLowerCase() !== 'ok') {
    throw Error(ret.message);
  }
  const edges = ret.data.user.edge_owner_to_timeline_media.edges;
  if (!edges.length) {
    throw Error('Empty');
  }

  const items: IgVM[] = ret.data.user.edge_owner_to_timeline_media.edges.map(item => {
    return {
      href: `https://www.instagram.com/p/${item.node.shortcode}`,
      src: item.node.display_url,
    }
  });

  result.items = items;

  return result.setResultValue(true, ResultCode.success);
}
