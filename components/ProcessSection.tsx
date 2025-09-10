import React from 'react';
import ProcessCard from './ProcessCard';
import styles from './ProcessCard.module.css';

const ProcessSection: React.FC = () => {
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

  return (
    <div className={styles['process-section']}>
      <div className={styles['process-container']}>
        <h2 className={styles['section-title']}>Our Transaction Process</h2>
        <p className={styles['section-description']}>
          Our process guides you from assessment to completion with precision, ensuring a seamless transaction and minimal business disruption.
        </p>
        
        <div className={styles['cards-grid']}>
          {processData.map((process, index) => (
            <ProcessCard
              key={index}
              title={process.title}
              description={process.description}
              bulletPoints={process.bulletPoints}
              iconPath={process.iconPath}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
