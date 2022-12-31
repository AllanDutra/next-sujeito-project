import { createClient } from "@prismicio/client";

export function getPrismicClient() {
  const prismic = createClient("https://sujeito-next.cdn.prismic.io/api/v2");

  return prismic;
}
