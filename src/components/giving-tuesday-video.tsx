import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi';

const SRC = '/videos/lwbf-giving-tuesday-2025.mp4';
const POSTER = '/videos/lwbf-giving-tuesday-2025-poster.jpg';
/** Start fetching just before the film scrolls in, so it is running by then. */
const ROOT_MARGIN = '200px 0px';

/**
 * Giving Tuesday film. It sits well below the fold, so nothing is fetched until
 * it approaches the viewport, and it pauses again once it leaves. Browsers only
 * allow autoplay while muted, so it starts silent and offers a button to turn
 * the sound on.
 */
const GivingTuesdayVideo: FunctionComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // Once the source is attached it stays attached; only playback follows the
  // element in and out of view.
  const [hasSource, setHasSource] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: ROOT_MARGIN }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) setHasSource(true);
  }, [isInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasSource) return;

    if (isInView) {
      // React does not always reflect `muted` onto the element, and an unmuted
      // video will not autoplay.
      video.muted = isMuted;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    // `isMuted` is deliberately not a dependency: toggling the sound should not
    // restart playback, `toggleAudio` handles that.
  }, [isInView, hasSource]);

  // A browser with autoplay switched off leaves the film sitting on its poster,
  // so clicking it — or the play button over it — starts it by hand.
  const play = () => {
    setHasSource(true);
    const video = videoRef.current;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (video) video.play().catch(() => {});
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || video.paused) {
      play();
      return;
    }
    video.pause();
  };

  const toggleAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    // Unmuting is a user gesture, so this is also the moment a browser that
    // refused to autoplay will let the film start.
    if (!nextMuted && video.paused) play();
  };

  return (
    <Box ref={containerRef} position="relative" lineHeight={0}>
      {/* A plain element rather than `Box as="video"`, which does not carry the
          video ref type through. */}
      <video
        ref={videoRef}
        src={hasSource ? SRC : undefined}
        poster={POSTER}
        muted
        loop
        // Safari has been known to drop out of a `loop` after a seek, so the
        // end of the film also restarts it explicitly.
        onEnded={(event) => {
          const video = event.currentTarget;
          video.currentTime = 0;
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          video.play().catch(() => {});
        }}
        playsInline
        preload="none"
        onClick={togglePlayback}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          cursor: 'pointer',
        }}
        aria-label="Lewis W. Butler Foundation Giving Tuesday 2025 film"
      />
      {isPlaying ? null : (
        <IconButton
          onClick={play}
          aria-label="Play film"
          icon={<FiPlay />}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          isRound
          size="lg"
          fontSize="xl"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          color="white"
          _hover={{ backgroundColor: 'blue.brand' }}
          _focusVisible={{ outline: '2px solid white', outlineOffset: '2px' }}
        />
      )}
      <IconButton
        onClick={toggleAudio}
        aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
        icon={isMuted ? <FiVolumeX /> : <FiVolume2 />}
        position="absolute"
        bottom={3}
        left={3}
        size="lg"
        fontSize="2xl"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        color="white"
        _hover={{ backgroundColor: 'blue.brand' }}
        _focusVisible={{ outline: '2px solid white', outlineOffset: '-4px' }}
      />
    </Box>
  );
};

export default GivingTuesdayVideo;
