import styles from './styles.module.scss'

export function UtterancesComments() {
  return (
    <article
      className={styles.commentsArea}
      ref={elem => {
        if (!elem) {
          return;
        }

        const scriptElem = document.createElement("script");

        scriptElem.src = "https://utteranc.es/client.js";
        scriptElem.async = true;
        scriptElem.crossOrigin = "anonymous";
        scriptElem.setAttribute("repo", "Marcel099/ignite-react-d05-d06-criando-uma-aplicacao-do-zero");
        scriptElem.setAttribute("issue-term", "pathname");
        scriptElem.setAttribute("label", "comment");
        scriptElem.setAttribute("theme", "photon-dark");

        elem.appendChild(scriptElem);
      }}
    />
  )
}