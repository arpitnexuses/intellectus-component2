"use client";

import React, { useState } from 'react';
import ProcessCard from './ProcessCard';
import styles from './ProcessCard.module.css';

const ProcessSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fixed configuration for 3 cards per view (desktop)
  const cardsPerView = 3;
  const totalPages = Math.ceil(6 / cardsPerView);

  const processData = [
    {
      title: "Engagement",
      description: "We start by understanding your business and transaction objectives to align our approach. Setting clear expectations to ensure a smooth process.",
      bulletPoints: [
        "Understand business objectives and goals",
        "Outline process roadmap and timelines",
        "Establish communication framework with stakeholders"
      ],
      iconPath: "/CardIcons/1.png"
    },
    {
      title: "Preparation",
      description: "We position your business for success by creating clear, compelling marketing materials. We also organise and present key financial and operational information to build investor confidence.",
      bulletPoints: [
        "Review financials and operations",
        "Prepare marketing materials and valuation reports",
        "Set up secure data room for sharing information"
      ],
      iconPath: "/CardIcons/2.png"
    },
    {
      title: "Outreach",
      description: "We identify and approach the right investors or buyers to create competitive tension and maximise interest. We also manage engagement to sustain momentum throughout the process.",
      bulletPoints: [
        "Target suitable investors or acquirers",
        "Share materials and initiate conversations",
        "Coordinate meetings and presentations"
      ],
      iconPath: "/CardIcons/3.png"
    },
    {
      title: "Diligence",
      description: "We manage the due diligence process to minimise risk and maintain deal certainty. We also coordinate responses quickly and accurately.",
      bulletPoints: [
        "Organise financial, legal, and operational reviews",
        "Address queries and manage documentation",
        "Ensure compliance and readiness for completion"
      ],
      iconPath: "/CardIcons/4.png"
    },
    {
      title: "Negotiation",
      description: "We work to secure outcomes that safeguard your interests while creating balanced agreements for all parties. Our approach builds competitive tension and ensures clarity to deliver the most favourable outcome for you.",
      bulletPoints: [
        "Gather and assess initial offers",
        "Support term sheet and structure negotiations",
        "Align terms with client priorities"
      ],
      iconPath: "/CardIcons/5.png"
    },
    {
      title: "Completion",
      description: "We oversee the final steps to ensure a seamless close. We also coordinate all parties for a smooth transition.",
      bulletPoints: [
        "Finalise agreements and documentation",
        "Secure necessary approvals",
        "Ensure successful transaction completion"
      ],
      iconPath: "/CardIcons/6.png"
    }
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleCards = () => {
    const startIndex = currentIndex * cardsPerView;
    return processData.slice(startIndex, startIndex + cardsPerView);
  };

  return (
    <div className={styles['process-section']}>
      <div className={styles['process-container']}>
        <h2 className={styles['section-title']}>Our Transaction Process</h2>
        <p className={styles['section-description']}>
          Our process guides you from assessment to completion with precision, ensuring a seamless transaction and minimal business disruption.
        </p>
        
        <div className={styles['carousel-container']}>
          <button 
            className={styles['nav-button']} 
            onClick={goToPrevious}
            aria-label="Previous cards"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className={styles['cards-carousel']}>
            <div 
              className={styles['cards-slider']}
              style={{ 
                transform: `translateX(-${currentIndex * (100 / totalPages)}%)`,
                width: `${totalPages * 100}%`
              }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div 
                  key={pageIndex} 
                  className={styles['cards-page']}
                  style={{ width: `${100 / totalPages}%` }}
                >
                  {processData
                    .slice(pageIndex * cardsPerView, (pageIndex + 1) * cardsPerView)
                    .map((process, cardIndex) => (
                      <ProcessCard
                        key={pageIndex * cardsPerView + cardIndex}
                        title={process.title}
                        description={process.description}
                        bulletPoints={process.bulletPoints}
                        iconPath={process.iconPath}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className={styles['nav-button']} 
            onClick={goToNext}
            aria-label="Next cards"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className={styles['carousel-indicators']}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles['indicator']} ${currentIndex === index ? styles['active'] : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;