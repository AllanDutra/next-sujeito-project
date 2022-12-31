import Head from "next/head";
import Link from "next/link";
import styles from "./styles.module.scss";

import Image from "next/image";
import thumbImg from "../../../public/images/thumb.png";

export default function Posts() {
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
        </div>
      </main>
    </>
  );
}
