import { useEffect, useRef, useState, useCallback } from "react";

const BRAND_NAME = "Fikrado";
const RECEIPT_PREFIX = "FK";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  return `${pad(d.getDate())} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
}

function formatTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function generateReceiptNumber(count) {
  const d = new Date();
  return `${RECEIPT_PREFIX}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(count)}`;
}

function generateBarcodeSVG(seed) {
  const bars = [];
  let x = 4;
  for (let i = 0; i < 48; i++) {
    const w = ((seed.charCodeAt(i % seed.length) * 7) % 5) + 1;
    const h = 40 + ((seed.charCodeAt((i + 3) % seed.length) * 11) % 8);
    bars.push(`<rect x="${x}" y="6" width="${w}" height="${h}" fill="#1a1a1a"/>`);
    x += w + 2;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${x + 4}" height="52" viewBox="0 0 ${x + 4} 52">${bars.join("")}</svg>`;
}

export default function ReceiptPrinter() {
  const sectionRef = useRef(null);
  const slotRef = useRef(null);
  const receiptRef = useRef(null);
  const printTimeoutRef = useRef(null);
  const reprintTimeoutRef = useRef(null);
  const dragStartY = useRef(0);
  const dragOffset = useRef(0);
  const isDragging = useRef(false);
  const scrollTotal = useRef(0);
  const lastScrollY = useRef(0);
  const startTimeRef = useRef(Date.now());

  const [receiptCount, setReceiptCount] = useState(1);
  const [printProgress, setPrintProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [isTorn, setIsTorn] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [ledOn, setLedOn] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [receiptNum, setReceiptNum] = useState(generateReceiptNumber(1));
  const [barcode, setBarcode] = useState(generateBarcodeSVG(generateReceiptNumber(1)));
  const [timeOnPage, setTimeOnPage] = useState("0 min 0 s");
  const [scrollMeters, setScrollMeters] = useState("0.0 m");
  const [pagesVisited, setPagesVisited] = useState(1);
  const [clicksMade, setClicksMade] = useState(0);

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Track time on page
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setTimeOnPage(`${mins} min ${secs} s`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Track scroll distance
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      scrollTotal.current += delta;
      lastScrollY.current = window.scrollY;
      const meters = (scrollTotal.current / 1000).toFixed(1);
      setScrollMeters(`${meters} m`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track pages visited (route changes)
  useEffect(() => {
    setPagesVisited((p) => p + 1);
  }, []);

  // Track clicks
  useEffect(() => {
    const onClick = () => setClicksMade((c) => c + 1);
    window.addEventListener("click", onClick, { passive: true });
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Print sound
  const playPrintSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const duration = 0.04;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1800 + Math.random() * 400;
        gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + duration);
      }
      ctx.resume();
    } catch (_e) {
      // audio not available
    }
  }, [soundOn]);

  // Print animation via IntersectionObserver
  const startPrinting = useCallback(() => {
    if (isPrinting || isPrinted || isTorn) return;
    setIsPrinting(true);
    setLedOn(true);

    if (prefersReducedMotion.current) {
      setPrintProgress(100);
      setIsPrinting(false);
      setIsPrinted(true);
      setLedOn(false);
      return;
    }

    let progress = 0;
    const step = () => {
      progress += 8 + Math.random() * 12;
      if (progress >= 100) {
        progress = 100;
        setPrintProgress(100);
        setIsPrinting(false);
        setIsPrinted(true);
        setLedOn(false);
        playPrintSound();
        return;
      }
      setPrintProgress(progress);
      playPrintSound();
      printTimeoutRef.current = setTimeout(step, 60 + Math.random() * 80);
    };
    step();
  }, [isPrinting, isPrinted, isTorn, playPrintSound]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startPrinting();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [startPrinting]);

  // LED blink while printing
  useEffect(() => {
    if (!isPrinting) return;
    const id = setInterval(() => setLedOn((v) => !v), 200);
    return () => clearInterval(id);
  }, [isPrinting]);

  // Reprint after tear
  const printNewReceipt = useCallback(() => {
    setIsTorn(false);
    setIsPrinted(false);
    setPrintProgress(0);
    setDragY(0);
    dragOffset.current = 0;

    const newCount = receiptCount + 1;
    setReceiptCount(newCount);
    const newNum = generateReceiptNumber(newCount);
    setReceiptNum(newNum);
    setBarcode(generateBarcodeSVG(newNum));

    reprintTimeoutRef.current = setTimeout(() => {
      startPrinting();
    }, 1000);
  }, [receiptCount, startPrinting]);

  // Drag handlers
  const onPointerDown = useCallback((e) => {
    if (!isPrinted || isTorn) return;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragOffset.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [isPrinted, isTorn]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    dragOffset.current = e.clientY - dragStartY.current;
    if (dragOffset.current < 0) dragOffset.current = 0;
    setDragY(dragOffset.current);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (dragOffset.current > 60) {
      // Tear off
      setIsTorn(true);
      setIsPrinted(false);
      setDragY(0);
      reprintTimeoutRef.current = setTimeout(() => {
        printNewReceipt();
      }, 1000);
    } else {
      // Spring back
      setDragY(0);
      dragOffset.current = 0;
    }
  }, [printNewReceipt]);

  const handleTear = useCallback(() => {
    if (!isPrinted || isTorn) return;
    setIsTorn(true);
    setIsPrinted(false);
    reprintTimeoutRef.current = setTimeout(() => {
      printNewReceipt();
    }, 1000);
  }, [isPrinted, isTorn, printNewReceipt]);

  // Keyboard tear
  const onKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (isPrinted && !isTorn) {
        e.preventDefault();
        handleTear();
      }
    }
  }, [isPrinted, isTorn, handleTear]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
      if (reprintTimeoutRef.current) clearTimeout(reprintTimeoutRef.current);
    };
  }, []);

  const now = new Date();
  const visibleHeight = (printProgress / 100) * 420;

  return (
    <section
      ref={sectionRef}
      className="receipt-printer-section"
      aria-label="Interactive receipt printer"
    >
      <div className="receipt-printer-container">
        {/* Printer slot */}
        <div className="receipt-printer-slot" ref={slotRef}>
          <div className="receipt-slot-scissors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
          <div className="receipt-slot-line" />
          <div className={`receipt-slot-led ${ledOn ? "led-on" : "led-off"}`} />
        </div>

        {/* Receipt + note wrapper */}
        <div className="receipt-output-area">
          {/* Receipt paper */}
          <div
            className={`receipt-paper-wrap ${isTorn ? "receipt-torn" : ""}`}
            style={{
              height: isPrinted ? "auto" : `${visibleHeight}px`,
              maxHeight: isPrinted ? "500px" : `${visibleHeight}px`,
              overflow: isPrinted ? "visible" : "hidden",
            }}
          >
            <div
              ref={receiptRef}
              className={`receipt-paper ${isPrinted ? "receipt-grabbable" : ""}`}
              style={{
                transform: `translateY(${isPrinted ? dragY : 0}px)`,
                transition: isDragging.current ? "none" : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onKeyDown={onKeyDown}
              tabIndex={isPrinted ? 0 : -1}
              role="button"
              aria-label="Receipt paper — pull down to tear off"
            >
              {/* Logo / icon */}
              <div className="receipt-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

              {/* Brand name */}
              <div className="receipt-brand">{BRAND_NAME}</div>

              {/* Visit info */}
              <div className="receipt-visit-info">
                <div>Receipt for your visit</div>
                <div className="receipt-datetime">{formatDate(now)} · {formatTime(now)}</div>
              </div>

              <div className="receipt-divider" />

              {/* You tried */}
              <div className="receipt-you-tried">
                <div className="receipt-label">YOU TRIED</div>
                <div className="receipt-tried-text">
                  Nothing on your tab yet.{" "}
                  <a href="#softwares-hero" className="receipt-demo-link">Try our demo</a>
                </div>
              </div>

              <div className="receipt-divider" />

              {/* Stats */}
              <div className="receipt-stats">
                <div className="receipt-stat-row">
                  <span className="receipt-stat-label">Time here</span>
                  <span className="receipt-stat-value">{timeOnPage}</span>
                </div>
                <div className="receipt-stat-row">
                  <span className="receipt-stat-label">Scrolled</span>
                  <span className="receipt-stat-value">{scrollMeters}</span>
                </div>
                <div className="receipt-stat-row">
                  <span className="receipt-stat-label">Pages visited</span>
                  <span className="receipt-stat-value">{pagesVisited}</span>
                </div>
                <div className="receipt-stat-row">
                  <span className="receipt-stat-label">Clicks made</span>
                  <span className="receipt-stat-value">{clicksMade}</span>
                </div>
              </div>

              <div className="receipt-divider" />

              {/* Total */}
              <div className="receipt-total-row">
                <span className="receipt-total-label">TOTAL</span>
                <span className="receipt-total-amount">$0.00</span>
              </div>
              <div className="receipt-total-note">Free to start. No subscription.</div>

              <div className="receipt-divider" />

              {/* Thank you */}
              <div className="receipt-thank-you">Thank you for visiting.</div>

              {/* Barcode */}
              <div className="receipt-barcode" dangerouslySetInnerHTML={{ __html: barcode }} />
              <div className="receipt-barcode-number">{receiptNum}</div>

              {/* Footer */}
              <div className="receipt-footer">This receipt never left your browser.</div>
            </div>
          </div>

          {/* Handwritten note */}
          <div className="receipt-handwritten-note">
            <span className="receipt-note-text">Pull down to tear it off</span>
            <svg className="receipt-note-arrow" width="48" height="40" viewBox="0 0 48 40" fill="none" stroke="#5a8a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 36 Q18 18 30 22 Q38 24 42 16" />
              <path d="M36 12 L42 16 L38 22" />
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="receipt-controls">
          <button
            className="receipt-control-btn"
            onClick={handleTear}
            disabled={!isPrinted || isTorn}
          >
            Print another receipt
          </button>
          <button
            className="receipt-sound-toggle"
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? "Mute printer sound" : "Enable printer sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? "Sound: On" : "Sound: Off"}
          </button>
        </div>
      </div>
    </section>
  );
}
