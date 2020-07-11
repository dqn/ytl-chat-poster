import fs from 'fs/promises';
import { parse } from 'shell-quote';

function assertIsStringArray(array: any[]): asserts array is string[] {
  if (array.some((it) => typeof it !== 'string')) {
    throw new Error('failed to parse');
  }
}

async function main() {
  const cmd = await fs.readFile('./curl.txt', { encoding: 'utf-8' });
  const parsed = parse<string>(cmd.trim().replace(/\\\n/g, ''), (key: string) => key);

  assertIsStringArray(parsed);

  console.log(parsed);
}

main();
