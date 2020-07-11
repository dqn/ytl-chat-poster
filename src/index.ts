import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { parse } from 'shell-quote';

function assertIsStringArray(array: any[]): asserts array is string[] {
  if (array.some((it) => typeof it !== 'string')) {
    throw new Error('failed to parse');
  }
}

export type PostChatConfig = {
  text: string;
  curlCmd: string;
  times?: number;
};

export async function postChat<T>({
  text,
  curlCmd,
  times = 1,
}: PostChatConfig): Promise<AxiosResponse<T>[]> {
  const parsed = parse(curlCmd.trim().replace(/\\\n/g, ''));

  assertIsStringArray(parsed);

  const config: AxiosRequestConfig = { method: 'POST', headers: {} };

  parsed.forEach((value, i) => {
    const nextValue = parsed[i + 1];

    switch (value) {
      case 'curl': {
        config.url = nextValue;
        break;
      }
      case '-H': {
        const [name, ...values] = nextValue.split(': ');
        config.headers[name.trim()] = values.join('').trim();
        break;
      }
      case '--data-binary': {
        config.data = JSON.parse(nextValue);
        break;
      }
      case '--compressed': {
        break;
      }
      default: {
        if (value.startsWith('-')) {
          throw new Error(`unknown option: ${value}`);
        }
        break;
      }
    }
  });

  config.data.richMessage.textSegments = [{ text }];

  return Promise.all(
    Array(times)
      .fill(void 0)
      .map(() => axios.request(config)),
  );
}
