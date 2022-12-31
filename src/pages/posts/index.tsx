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

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Blog | Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="/">
            <Image
              src={thumbImg}
              alt="Post título 1"
              width={720}
              height={410}
              quality={100}
            />
            <strong>Criando meu primeiro aplicativo</strong>
            <time>14 JULHO 2021</time>
            <p>
              Hoje vamos criar o controle de mostrar a senha no input, uma opção
              para os nossos formulários de cadastro e login. Mas chega de
              conversa e bora pro código junto comigo que o vídeo está show de
              bola!
            </p>
          </Link>

          <div className={styles.buttonNavigate}>
            <div>
              <button>
                <FiChevronsLeft size={25} color="#FFF" />
              </button>
              <button>
                <FiChevronLeft size={25} color="#FFF" />
              </button>
            </div>

            <div>
              <button>
                <FiChevronsRight size={25} color="#FFF" />
              </button>
              <button>
                <FiChevronRight size={25} color="#FFF" />
              </button>
            </div>
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
        post.data.description.find((content) => content.type === "paragraph")
          ?.text ?? "",
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
    },
    revalidate: 60 * 30, // Atualiza a cada 30 minutos.
  };
};
