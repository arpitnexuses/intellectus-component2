"use client";

import React, { useState, useEffect } from 'react';
import ProcessCard from './ProcessCard';
import styles from './ProcessCard.module.css';

const ProcessSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(null);
  const [mouseEnd, setMouseEnd] = useState<{ x: number; y: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [gestureStart, setGestureStart] = useState<{ x: number; y: number; time: number } | null>(null);
  
  // Dynamic configuration based on screen size
  const cardsPerView = isMobile ? 1 : 3;
  const totalPages = isMobile ? 6 : Math.ceil(6 / cardsPerView);
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch/Swipe navigation functions for all devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();
    setLastTouchTime(now);
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setGestureStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: now
    });
    setIsHorizontalSwipe(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !gestureStart) return;
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    
    const deltaX = Math.abs(currentTouch.x - gestureStart.x);
    const deltaY = Math.abs(currentTouch.y - gestureStart.y);
    
    // Determine if this is a horizontal swipe (more horizontal than vertical movement)
    if (deltaX > deltaY && deltaX > 15) {
      setIsHorizontalSwipe(true);
      e.preventDefault(); // Prevent vertical scrolling
    }
    
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !gestureStart) return;
    
    const now = Date.now();
    const deltaX = gestureStart.x - touchEnd.x;
    const deltaY = Math.abs(gestureStart.y - touchEnd.y);
    const deltaTime = now - gestureStart.time;
    
    // Only navigate if:
    // 1. Horizontal movement is significantly greater than vertical
    // 2. Movement is at least 30px
    // 3. Gesture is completed within 500ms (prevents slow drags)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 30 && deltaTime < 500) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    setIsHorizontalSwipe(false);
    setGestureStart(null);
  };

  // Mouse drag/swipe navigation for trackpad
  const handleMouseDown = (e: React.MouseEvent) => {
    const now = Date.now();
    setIsMouseDown(true);
    setMouseEnd(null);
    setMouseStart({
      x: e.clientX,
      y: e.clientY
    });
    setGestureStart({
      x: e.clientX,
      y: e.clientY,
      time: now
    });
    setIsHorizontalSwipe(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !gestureStart) return;
    
    const currentMouse = {
      x: e.clientX,
      y: e.clientY
    };
    
    const deltaX = Math.abs(currentMouse.x - gestureStart.x);
    const deltaY = Math.abs(currentMouse.y - gestureStart.y);
    
    // Determine if this is a horizontal swipe (more horizontal than vertical movement)
    if (deltaX > deltaY && deltaX > 15) {
      setIsHorizontalSwipe(true);
    }
    
    setMouseEnd(currentMouse);
  };

  const handleMouseUp = () => {
    if (!isMouseDown || !mouseStart || !mouseEnd || !gestureStart) {
      setIsMouseDown(false);
      setIsHorizontalSwipe(false);
      setGestureStart(null);
      return;
    }
    
    const now = Date.now();
    const deltaX = gestureStart.x - mouseEnd.x;
    const deltaY = Math.abs(gestureStart.y - mouseEnd.y);
    const deltaTime = now - gestureStart.time;
    
    // Only navigate if:
    // 1. Horizontal movement is significantly greater than vertical
    // 2. Movement is at least 30px
    // 3. Gesture is completed within 500ms (prevents slow drags)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 30 && deltaTime < 500) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    setIsMouseDown(false);
    setIsHorizontalSwipe(false);
    setGestureStart(null);
  };

  // Enhanced trackpad gesture detection
  const handleWheel = (e: React.WheelEvent) => {
    // Debug: Log wheel events to understand trackpad behavior
    console.log('Wheel event:', { deltaX: e.deltaX, deltaY: e.deltaY });
    
    // Detect horizontal trackpad gestures
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
      e.preventDefault();
      console.log('Horizontal trackpad gesture detected');
      
      if (e.deltaX > 0) {
        // Swipe right - go to previous
        console.log('Going to previous');
        goToPrevious();
      } else {
        // Swipe left - go to next
        console.log('Going to next');
        goToNext();
      }
    }
  };

  // Pointer events for better trackpad support
  const handlePointerDown = (e: React.PointerEvent) => {
    console.log('Pointer down:', { x: e.clientX, y: e.clientY, pointerType: e.pointerType });
    const now = Date.now();
    setLastTouchTime(now);
    setGestureStart({
      x: e.clientX,
      y: e.clientY,
      time: now
    });
    setIsHorizontalSwipe(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!gestureStart) return;
    
    const deltaX = Math.abs(e.clientX - gestureStart.x);
    const deltaY = Math.abs(e.clientY - gestureStart.y);
    
    if (deltaX > deltaY && deltaX > 15) {
      console.log('Horizontal pointer movement detected');
      setIsHorizontalSwipe(true);
      e.preventDefault();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!gestureStart) return;
    
    const now = Date.now();
    const deltaX = gestureStart.x - e.clientX;
    const deltaY = Math.abs(gestureStart.y - e.clientY);
    const deltaTime = now - gestureStart.time;
    
    console.log('Pointer up:', { deltaX, deltaY, deltaTime, isHorizontalSwipe });
    
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 30 && deltaTime < 500) {
      console.log('Pointer gesture navigation triggered');
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    setIsHorizontalSwipe(false);
    setGestureStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        
        <div 
          className={styles['cards-carousel']}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        >
          <div 
            className={styles['cards-slider']}
            style={{ 
              transform: `translateX(-${currentIndex * (100 / totalPages)}%)`,
              width: `${totalPages * 100}%`
            }}
          >
            {isMobile ? (
              // Mobile: Show each card individually
              processData.map((process, index) => (
                <div 
                  key={index} 
                  className={styles['cards-page']}
                  style={{ width: `${100 / totalPages}%` }}
                >
                  <ProcessCard
                    title={process.title}
                    description={process.description}
                    bulletPoints={process.bulletPoints}
                    iconPath={process.iconPath}
                  />
                </div>
              ))
            ) : (
              // Desktop: Show 3 cards per page
              Array.from({ length: totalPages }, (_, pageIndex) => (
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
              ))
            )}
          </div>
        </div>
        
        <div className={styles['navigation-container']}>
          <button 
            className={styles['nav-arrow']} 
            onClick={goToPrevious}
            aria-label="Previous cards"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E3A8A"/>
                  <stop offset="100%" stopColor="#0891B2"/>
                </linearGradient>
              </defs>
              <path d="M12.5 15L7.5 10L12.5 5" stroke="url(#arrowGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className={styles['carousel-indicators']}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles['indicator']} ${currentIndex === index ? styles['active'] : ''}`}
                onClick={() => goToCard(index)}
                aria-label={`Go to ${isMobile ? 'card' : 'page'} ${index + 1}`}
            />
          ))}
          </div>
          
          <button 
            className={styles['nav-arrow']} 
            onClick={goToNext}
            aria-label="Next cards"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <defs>
                <linearGradient id="arrowGradientRight" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E3A8A"/>
                  <stop offset="100%" stopColor="#0891B2"/>
                </linearGradient>
              </defs>
              <path d="M7.5 15L12.5 10L7.5 5" stroke="url(#arrowGradientRight)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;