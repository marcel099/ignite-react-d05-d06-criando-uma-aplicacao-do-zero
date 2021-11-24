import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
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
        <Header />
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
                {post.first_publication_date}
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

          <main className={styles.postContent}>
            {post.data.content.map((section) => {
              return (
                <>
                  {section.heading && (
                    <h2>
                      {section.heading}
                    </h2>
                  )}
                  {section.body.map(paragraph => (
                    <p
                      className={styles.postParagraph}
                      dangerouslySetInnerHTML={{ __html: paragraph.text}}
                    />
                  ))}
                </>
              )
            })}
          </main>
        </article>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
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

  const props: PostProps = {
    post: {
      first_publication_date: format(
        new Date( response.first_publication_date ),
        'dd MMM YYY',
        { locale: ptBR }
      ),
      data: {
        title: response.data.title,
        author: response.data.author,
        banner: {
          url: response.data.banner.url,
        },
        content: response.data.content.map(section => ({
          heading: section.heading,
          body: section.body.map(({text}) => ({text}))
        })),
      }
    }
  }

  return {
    props,
    revalidate: 60 * 30,  // 30 minutes
  }
};
