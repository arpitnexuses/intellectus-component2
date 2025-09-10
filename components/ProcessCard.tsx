import React from 'react';
import styles from './ProcessCard.module.css';

interface ProcessCardProps {
  title: string;
  description: string;
  bulletPoints: string[];
  iconPath: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ title, description, bulletPoints, iconPath }) => {
  return (
    <div className={styles['process-card']}>
      {/* Icon */}
      <div className={styles['card-icon']}>
        <img 
          src={iconPath} 
          alt={`${title} icon`}
          className={styles['card-icon-image']}
        />
      </div>
      
      {/* Title */}
      <h3 className={styles['card-title']}>{title}</h3>
      
      {/* Description */}
      <p className={styles['card-description']}>{description}</p>
      
      {/* Bullet Points */}
      <ul className={styles['card-bullets']}>
        {bulletPoints.map((point, index) => (
          <li key={index} className={styles['bullet-point']}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessCard;
