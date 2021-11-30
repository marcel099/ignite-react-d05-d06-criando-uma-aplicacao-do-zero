import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


import { getPrismicClient } from '../../services/prismic';

import { PostHeader } from '../../components/PostHeader';
import { FooterPostNavigation } from '../../components/FooterPostNavigation';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  const numberOfWords = post.data.content.reduce((numberOfWords, section) => {
    const numberOfWordsInHeading = section.heading?.split(' ')?.length ?? 0;

    const numberOfWordsInBody = section.body.reduce((
      numberOfWordsInBody, paragraph
    ) => {
      return numberOfWordsInBody + paragraph.text.split(' ').length
    }, 0)

    return numberOfWords + numberOfWordsInHeading + numberOfWordsInBody;
  }, 0)

  const readingTime = Math.ceil(numberOfWords / 200);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <div className={`${commonStyles.pageContainer} ${styles.pageContainer}`}>
        <PostHeader />
        <main>
          <div className={styles.bannerContainer}>
            <img src={post.data.banner.url} alt="Banner" />
          </div>
          <article className={styles.post}>
            <h1 className={styles.title}>
              {post.data.title}
            </h1>

            <div className={styles.info}>
              <div className={styles.createdAt}>
                <FiCalendar />
                <time dateTime="">
                  {
                    format(
                      new Date( post.first_publication_date ),
                      'dd MMM YYY',
                      { locale: ptBR }
                    )
                  }
                </time>
              </div>
              <div className={styles.author}>
                <FiUser />
                <span>
                  {post.data.author}
                </span>
              </div>
              <div className={styles.readingTime}>
                <FiClock />
                <span>
                  {readingTime} min
                </span>
              </div>
            </div>

            <em className={styles.lastEditionDate}>
              {
                format(
                  new Date(post.last_publication_date),
                  "'* editado em 'dd MMM YYY', às 'HH:mm",
                  { locale: ptBR }
                )
              }
            </em>

            <main className={styles.postContent}>
              {post.data.content.map((section, idx) => {
                return (
                  <div key={idx}>
                    {section.heading && (
                      <h2>
                        {section.heading}
                      </h2>
                    )}
                    {section.body.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={styles.postParagraph}
                        dangerouslySetInnerHTML={{ __html: paragraph.text}}
                      />
                    ))}
                  </div>
                )
              })}
            </main>
          </article>
        </main>

        <footer>
          <FooterPostNavigation />
          <article className={styles.commentsArea}>

          </article>
        </footer>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      orderings: '[document.first_publication_date desc]',
      fetch: ['posts.title'],
      pageSize: 100,
    }
  );

  const paths = postsResponse.results.map(result => ({
    params: {slug: result.uid}
  }))

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {
      slug,
  } = params;

  if ( slug === 'favicon.png' ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log({response})

  const props: PostProps = {
    post: response,
  }

  return {
    props,
    revalidate: 60 * 30,  // 30 minutes
  }
};
