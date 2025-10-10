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
  
  // Navigation control states
  const [lastNavigationTime, setLastNavigationTime] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationCooldown, setNavigationCooldown] = useState(0);
  
  // Dynamic configuration based on screen size
  const cardsPerView = isMobile ? 1 : 2.5;
  const totalPages = isMobile ? 6 : 3;
  
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
      description: "We work to secure outcomes that safeguard your interests while creating balanced agreements for all parties. We anticipate pressure points, manage competing interests, and ensure you enter the agreement from a position of strength.",
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

  // Navigation control constants - enhanced to prevent accidental navigation
  const NAVIGATION_COOLDOWN_MS = 800; // Minimum time between navigations (increased to prevent rapid navigation)
  const MIN_SWIPE_DISTANCE = 50; // Minimum distance for swipe (increased to prevent accidental navigation)
  const MAX_SWIPE_TIME = 500; // Maximum time for swipe gesture (reduced to prevent slow drags)
  const MIN_SWIPE_VELOCITY = 0.5; // Minimum velocity for swipe (increased to prevent accidental slow movements)

  // Check if navigation is allowed (debouncing)
  const canNavigate = (): boolean => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigationTime;
    
    if (isNavigating || timeSinceLastNav < NAVIGATION_COOLDOWN_MS) {
      return false;
    }
    
    return true;
  };

  // Safe navigation with debouncing
  const safeNavigate = (direction: 'prev' | 'next' | 'card', index?: number) => {
    if (!canNavigate()) {
      console.log('Navigation blocked - cooldown active');
      return;
    }

    setIsNavigating(true);
    setLastNavigationTime(Date.now());
    
    if (direction === 'prev') {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? totalPages - 1 : prevIndex - 1
      );
    } else if (direction === 'next') {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalPages - 1 ? 0 : prevIndex + 1
      );
    } else if (direction === 'card' && index !== undefined) {
      setCurrentIndex(index);
    }

    // Reset navigation state after animation
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const goToPrevious = () => {
    safeNavigate('prev');
  };

  const goToNext = () => {
    safeNavigate('next');
  };

  const goToCard = (index: number) => {
    safeNavigate('card', index);
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
    if (!touchStart || !touchEnd || !gestureStart) {
      setIsHorizontalSwipe(false);
      setGestureStart(null);
      return;
    }
    
    const now = Date.now();
    // Calculate movement from start to end position
    const deltaX = touchEnd.x - gestureStart.x; // Positive = right swipe, Negative = left swipe
    const deltaY = Math.abs(touchEnd.y - gestureStart.y);
    const deltaTime = now - gestureStart.time;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    console.log('Touch End Debug:', {
      startX: gestureStart.x,
      endX: touchEnd.x,
      deltaX: deltaX,
      deltaY: deltaY,
      deltaTime: deltaTime,
      velocity: velocity
    });
    
    // Enhanced validation for swipe gestures:
    // 1. Horizontal movement must be significantly greater than vertical (3:1 ratio for stricter detection)
    // 2. Movement must be at least MIN_SWIPE_DISTANCE pixels
    // 3. Gesture must be completed within MAX_SWIPE_TIME ms
    // 4. Must have minimum velocity to prevent accidental slow drags
    // 5. Must pass navigation cooldown check
    const isHorizontalGesture = Math.abs(deltaX) > deltaY * 3;
    const hasMinimumDistance = Math.abs(deltaX) > MIN_SWIPE_DISTANCE;
    const isQuickGesture = deltaTime < MAX_SWIPE_TIME;
    const hasMinimumVelocity = velocity > MIN_SWIPE_VELOCITY;
    
    if (isHorizontalGesture && hasMinimumDistance && isQuickGesture && hasMinimumVelocity && canNavigate()) {
      // Mobile-specific direction mapping
      if (isMobile) {
        // On mobile: Swipe right goes to previous, Swipe left goes to next
        if (deltaX > 0) {
          console.log('Mobile Swipe RIGHT detected - going to PREVIOUS');
          goToPrevious();
        } else {
          console.log('Mobile Swipe LEFT detected - going to NEXT');
          goToNext();
        }
      } else {
        // On desktop: Swipe right goes to next, Swipe left goes to previous
        if (deltaX > 0) {
          console.log('Desktop Swipe RIGHT detected - going to NEXT');
          goToNext();
        } else {
          console.log('Desktop Swipe LEFT detected - going to PREVIOUS');
          goToPrevious();
        }
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
    // Calculate movement from start to end position
    const deltaX = mouseEnd.x - gestureStart.x; // Positive = right drag, Negative = left drag
    const deltaY = Math.abs(mouseEnd.y - gestureStart.y);
    const deltaTime = now - gestureStart.time;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    console.log('Mouse Up Debug:', {
      startX: gestureStart.x,
      endX: mouseEnd.x,
      deltaX: deltaX,
      deltaY: deltaY,
      deltaTime: deltaTime,
      velocity: velocity
    });
    
    // Enhanced validation for mouse drag gestures:
    // 1. Horizontal movement must be significantly greater than vertical (3:1 ratio for stricter detection)
    // 2. Movement must be at least MIN_SWIPE_DISTANCE pixels
    // 3. Gesture must be completed within MAX_SWIPE_TIME ms
    // 4. Must have minimum velocity to prevent accidental slow drags
    // 5. Must pass navigation cooldown check
    const isHorizontalGesture = Math.abs(deltaX) > deltaY * 3;
    const hasMinimumDistance = Math.abs(deltaX) > MIN_SWIPE_DISTANCE;
    const isQuickGesture = deltaTime < MAX_SWIPE_TIME;
    const hasMinimumVelocity = velocity > MIN_SWIPE_VELOCITY;
    
    if (isHorizontalGesture && hasMinimumDistance && isQuickGesture && hasMinimumVelocity && canNavigate()) {
      // Mobile-specific direction mapping for mouse events
      if (isMobile) {
        // On mobile: Drag right goes to previous, Drag left goes to next
        if (deltaX > 0) {
          console.log('Mobile Drag RIGHT detected - going to PREVIOUS');
          goToPrevious();
        } else {
          console.log('Mobile Drag LEFT detected - going to NEXT');
          goToNext();
        }
      } else {
        // On desktop: Drag right goes to next, Drag left goes to previous (consistent with trackpad)
        if (deltaX > 0) {
          console.log('Desktop Drag RIGHT detected - going to NEXT');
          goToNext();
        } else {
          console.log('Desktop Drag LEFT detected - going to PREVIOUS');
          goToPrevious();
        }
      }
    }
    
    setIsMouseDown(false);
    setIsHorizontalSwipe(false);
    setGestureStart(null);
  };

  // Enhanced trackpad gesture detection with debouncing
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    
    // Debounce wheel events to prevent rapid navigation
    if (now - lastWheelTime < 100) {
      return;
    }
    
    // Debug: Log wheel events to understand trackpad behavior
    console.log('Wheel event:', { deltaX: e.deltaX, deltaY: e.deltaY });
    
    // Detect horizontal trackpad gestures with stricter validation
    const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 2;
    const hasMinimumDelta = Math.abs(e.deltaX) > 25;
    const hasMinimumVelocity = Math.abs(e.deltaX) > 20; // Additional velocity check for trackpad
    
    if (isHorizontalGesture && hasMinimumDelta && hasMinimumVelocity && canNavigate()) {
      e.preventDefault();
      setLastWheelTime(now);
      console.log('Horizontal trackpad gesture detected');
      
      if (e.deltaX > 0) {
        // Swipe right - go to next (fixed direction)
        console.log('Trackpad RIGHT detected - going to NEXT');
        goToNext();
      } else {
        // Swipe left - go to previous (fixed direction)
        console.log('Trackpad LEFT detected - going to PREVIOUS');
        goToPrevious();
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
    if (!gestureStart) {
      setIsHorizontalSwipe(false);
      setGestureStart(null);
      return;
    }
    
    const now = Date.now();
    // Calculate movement from start to end position
    const deltaX = e.clientX - gestureStart.x; // Positive = right pointer, Negative = left pointer
    const deltaY = Math.abs(e.clientY - gestureStart.y);
    const deltaTime = now - gestureStart.time;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    console.log('Pointer Up Debug:', {
      startX: gestureStart.x,
      endX: e.clientX,
      deltaX: deltaX,
      deltaY: deltaY,
      deltaTime: deltaTime,
      velocity: velocity,
      isHorizontalSwipe: isHorizontalSwipe
    });
    
    // Enhanced validation for pointer gestures:
    // 1. Horizontal movement must be significantly greater than vertical (2:1 ratio)
    // 2. Movement must be at least MIN_SWIPE_DISTANCE pixels
    // 3. Gesture must be completed within MAX_SWIPE_TIME ms
    // 4. Must have minimum velocity to prevent accidental slow drags
    // 5. Must pass navigation cooldown check
    const isHorizontalGesture = Math.abs(deltaX) > deltaY * 2;
    const hasMinimumDistance = Math.abs(deltaX) > MIN_SWIPE_DISTANCE;
    const isQuickGesture = deltaTime < MAX_SWIPE_TIME;
    const hasMinimumVelocity = velocity > MIN_SWIPE_VELOCITY;
    
    if (isHorizontalGesture && hasMinimumDistance && isQuickGesture && hasMinimumVelocity && canNavigate()) {
      console.log('Pointer gesture navigation triggered');
      // Mobile-specific direction mapping for pointer events
      if (isMobile) {
        // On mobile: Pointer right goes to previous, Pointer left goes to next
        if (deltaX > 0) {
          console.log('Mobile Pointer RIGHT detected - going to PREVIOUS');
          goToPrevious();
        } else {
          console.log('Mobile Pointer LEFT detected - going to NEXT');
          goToNext();
        }
      } else {
        // On desktop: Pointer right goes to next, Pointer left goes to previous
        if (deltaX > 0) {
          console.log('Desktop Pointer RIGHT detected - going to NEXT');
          goToNext();
        } else {
          console.log('Desktop Pointer LEFT detected - going to PREVIOUS');
          goToPrevious();
        }
      }
    }
    
    setIsHorizontalSwipe(false);
    setGestureStart(null);
  };

  // Keyboard navigation with debouncing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys and prevent rapid key presses
      if (e.key === 'ArrowLeft' && canNavigate()) {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight' && canNavigate()) {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastNavigationTime, isNavigating]);

  const getVisibleCards = () => {
    const startIndex = currentIndex * cardsPerView;
    return processData.slice(startIndex, startIndex + cardsPerView);
  };

  // Check if current page has a partial card (third card)
  const hasPartialCard = !isMobile && currentIndex < totalPages - 1;

  return (
    <div className={styles['process-section']}>
      <div className={styles['process-container']}>
        <h2 className={styles['section-title']}>Our Transaction Process</h2>
        <p className={styles['section-description']}>
          Our process guides you from assessment to completion with precision, ensuring a seamless transaction and minimal business disruption.
        </p>
        
        <div 
          className={`${styles['cards-carousel']} ${hasPartialCard ? styles['has-partial-card'] : ''}`}
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
              // Desktop: Show 2.5 cards per page
              Array.from({ length: totalPages }, (_, pageIndex) => (
                <div 
                  key={pageIndex} 
                  className={styles['cards-page']}
                  style={{ width: `${100 / totalPages}%` }}
                >
                  {processData
                    .slice(pageIndex * 2, (pageIndex + 1) * 2 + (pageIndex < totalPages - 1 ? 1 : 0))
                    .map((process, cardIndex) => (
            <ProcessCard
                        key={pageIndex * 2 + cardIndex}
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
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M27 33L17 22L27 11" fill="#3B82F6"/>
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
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M17 11L27 22L17 33" fill="#3B82F6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
