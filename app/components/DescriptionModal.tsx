import { FunctionComponent } from 'react';
import styles from './css/DescriptionModal.module.css';

export type DescriptionSegment = {
  text: string;
  link?: string;
};

export type ModalDescriptionProps = {
  segments: DescriptionSegment[];
};

const DescriptionModal: FunctionComponent<ModalDescriptionProps> = ({ segments }) => {
  return (
    <div className={styles.parent}>
      <b className={styles.main}>
        <span className={styles.hug}>
          <p className={styles.paragraph}>
            {segments.map((segment, index) => (
              segment.link ? (
                <a
                  key={index}
                  className="link-hover"
                  href={segment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.underline}>{segment.text}</span>
                </a>
              ) : (
                <span key={index}>{segment.text}</span>
              )
            ))}
          </p>
        </span>
      </b>
    </div>
  );
};

export default DescriptionModal;
