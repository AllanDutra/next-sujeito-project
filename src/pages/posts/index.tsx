import Head from "next/head";
import Link from "next/link";
import styles from "./styles.module.scss";

import Image from "next/image";
import thumbImg from "../../../public/images/thumb.png";

import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { GetStaticProps } from "next";

import { getPrismicClient } from "../../services/prismic";
import { predicate } from "@prismicio/client";
import { RichText } from "prismic-dom";
import { useState } from "react";

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
  page: number;
  totalPage: number;
}

export default function Posts({
  posts: postsBlog,
  page,
  totalPage,
}: PostsProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [posts, setPosts] = useState(postsBlog || []);

  async function reqPost(pageNumber: number) {
    const prismic = getPrismicClient();

    const response = await prismic.query(
      [predicate.at("document.type", "post")],
      {
        orderings: "document.last_publication_date desc", // Ordenar pelo mais recente
        fetch: ["post.title", "post.description", "post.cover"],
        pageSize: 3,
        page: pageNumber,
      }
    );

    return response;
  }

  async function navigatePage(pageNumber: number) {
    const response = await reqPost(pageNumber);

    if (response.results.length === 0) return;

    const getPosts = response.results.map((post) => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description:
          (post.data.description as { type: string; text: string }[]).find(
            (content) => content.type === "paragraph"
          )?.text ?? "",
        cover: post.data.cover.url,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      };
    });

    setCurrentPage(pageNumber);
    setPosts(getPosts as Post[]);
  }

  return (
    <>
      <Head>
        <title>Blog | Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <Image
                src={post.cover}
                alt={post.title}
                width={720}
                height={410}
                quality={100}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPUrQcAAN8ArguAKQcAAAAASUVORK5CYII="
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}</p>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {currentPage >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft size={25} color="#FFF" />
                </button>
                <button onClick={() => navigatePage(currentPage - 1)}>
                  <FiChevronLeft size={25} color="#FFF" />
                </button>
              </div>
            )}

            {currentPage < totalPage && (
              <div>
                <button onClick={() => navigatePage(currentPage + 1)}>
                  <FiChevronsRight size={25} color="#FFF" />
                </button>
                <button onClick={() => navigatePage(totalPage)}>
                  <FiChevronRight size={25} color="#FFF" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [predicate.at("document.type", "post")],
    {
      orderings: "document.last_publication_date desc", // Ordenar pelo mais recente
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 3,
    }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        (post.data.description as { type: string; text: string }[]).find(
          (content) => content.type === "paragraph"
        )?.text ?? "",
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 30, // Atualiza a cada 30 minutos.
  };
};
