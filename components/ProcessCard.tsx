import React from 'react';
import styles from './ProcessCard.module.css';

interface ProcessCardProps {
  title: string;
  description: string;
  bulletPoints: string[];
  iconPath: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ title, description, bulletPoints, iconPath }) => {
  // Create specific class names for Engagement, Outreach, and Completion cards
  const getDescriptionClass = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === 'engagement') return `${styles['card-description']} ${styles['engagement-description']}`;
    if (lowerTitle === 'outreach') return `${styles['card-description']} ${styles['outreach-description']}`;
    if (lowerTitle === 'completion') return `${styles['card-description']} ${styles['completion-description']}`;
    return styles['card-description'];
  };

  const getBulletsClass = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === 'engagement') return `${styles['card-bullets']} ${styles['engagement-bullets']}`;
    if (lowerTitle === 'outreach') return `${styles['card-bullets']} ${styles['outreach-bullets']}`;
    if (lowerTitle === 'completion') return `${styles['card-bullets']} ${styles['completion-bullets']}`;
    return styles['card-bullets'];
  };

  return (
    <div className={`${styles['process-card']} ${title.toLowerCase() === 'completion' ? styles['completion-card'] : ''}`}>
      {/* Icon */}
      <div className={styles['card-icon']}>
        <img 
          src={iconPath} 
          alt={`${title} icon`}
          className={styles['card-icon-image']}
        />
      </div>
      
      {/* Title */}
      <h3 className={`${styles['card-title']} ${title.toLowerCase() === 'completion' ? styles['completion-title'] : ''}`}>{title}</h3>
      
      {/* Description */}
      <p className={getDescriptionClass()}>{description}</p>
      
      {/* Bullet Points */}
      <ul className={getBulletsClass()}>
        {bulletPoints.map((point, index) => (
          <li key={index} className={styles['bullet-point']}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessCard;