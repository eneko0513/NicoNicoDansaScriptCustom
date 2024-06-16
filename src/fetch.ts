import NiconiComments from "@xpadev-net/niconicomments";

import type { TCommentPublishData } from "@/@types/types";
import { Storage } from "@/libraries/localStorage";

const injectFetch = () => {
  const originalFetch = window.fetch;
  window.fetch = (
    input: URL | RequestInfo,
    init?: RequestInit | undefined,
  ): Promise<Response> => {
    try {
      const url = input instanceof Request ? input.url : input.toString();
      const urlPattern184 =
        /^https:\/\/nv-comment\.nicovideo\.jp\/v1\/threads\/\d+\/comments$/;
      if (
        urlPattern184.test(url) &&
        init?.method === "POST" &&
        typeof init.body === "string" &&
        Storage.get("options_disable184") === "true"
      ) {
        const body = JSON.parse(init.body) as TCommentPublishData;
        if (body.commands && Array.isArray(body.commands)) {
          if (body.commands.includes("184")) {
            body.commands = body.commands.filter(
              (command: string) => command !== "184",
            );
            init.body = JSON.stringify(body);
          }
        }
        return originalFetch(input, init);
      }
      const urlPatternComment =
        /^https:\/\/nv-comment\.nicovideo.jp\/v1\/threads$/;
      if (
        urlPatternComment.test(url) &&
        init?.method === "POST" &&
        typeof init.body === "string" &&
        Storage.get("options_enableColorCode") === "true"
      ) {
        return new Promise<Response>((resolve, reject) => {
          void (async () => {
            try {
              const request = await originalFetch(input, init);
              const result = (await request.clone().json()) as {
                data: {
                  threads: unknown;
                };
              };
              if (!NiconiComments.typeGuard.v1.threads(result?.data?.threads)) {
                resolve(request);
                return;
              }
              result.data.threads = result.data.threads.map((thread) => {
                thread.comments = thread.comments.map((comment) => {
                  return {
                    ...comment,
                    isPremium: true,
                  };
                });
                return thread;
              });
              return resolve(new Response(JSON.stringify(result)));
            } catch (e) {
              reject(e);
            }
          })();
        });
      }
    } catch (error) {
      console.error(error);
    }
    return originalFetch(input, init);
  };
};

const injectFetchTmp = () => {
  const originalFetch = window.fetch;
  window.fetch = (
    input: URL | RequestInfo,
    init?: RequestInit | undefined,
  ): Promise<Response> => {
    try {
      const url = input instanceof Request ? input.url : input.toString();
      const urlPattern184 =
        /^https:\/\/nvapi\.nicovideo\.jp\/v1\/tmp\/comments\/sm\d+.*$/;
      if (
        urlPattern184.test(url) &&
        init?.method === "POST" &&
        init?.body instanceof URLSearchParams
      ) {
        const message = init.body.get("message");
        if (message !== null) {
          const newMessage = message.replace(/ᜀ/g, "\n");
          init.body.set("message", newMessage);
        }
        return originalFetch(input, init);
      }
    } catch (error) {
      console.error(error);
    }
    return originalFetch(input, init);
  };
};

export { injectFetch, injectFetchTmp };
