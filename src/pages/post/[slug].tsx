import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiWatch } from 'react-icons/fi'
import Prismic from '@prismicio/client'
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

export default function Post() {
  return (
    <div className={commonStyles.pageContainer}>
      <div className={`${commonStyles.contentContainer} ${styles.contentContainer}`}>
        <Header />
      </div>
    </div>
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
          body: RichText.asHtml(section.body)
        })),
      }
    }
  }

  return {
    props,
    revalidate: 60 * 30,  // 30 minutes
  }
};
