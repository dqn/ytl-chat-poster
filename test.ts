import fs from 'fs/promises';

import { postChat } from './src/index';

async function main() {
  const curlCmd = await fs.readFile('./curl.txt', { encoding: 'utf-8' });
  postChat({ text: 'てすと', curlCmd, times: 5 });
}

main();
