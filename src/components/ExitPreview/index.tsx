import Link from 'next/link';

import styles from './styles.module.scss'

export function ExitPreview() {
  return (
    <aside className={styles.container}>
      <Link href="/api/exit-preview">
        <a>
          <span>Sair do modo Preview</span>
        </a>
      </Link>
    </aside>
  )
}