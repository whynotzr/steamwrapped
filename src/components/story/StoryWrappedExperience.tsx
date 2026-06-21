"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryWrappedData } from "@/types/story-wrapped";
import { getStoryDataFromMock } from "@/lib/story/from-mock";
import { StoryLoadingScreen } from "./StoryLoadingScreen";
import { StoryProgressBar } from "./StoryProgressBar";
import {
  ArchetypeSlide,
  GraveyardSlide,
  IntroSlide,
  PlaytimeSlide,
  PodiumSlide,
  ShareCardPreview,
  Top1Slide,
} from "./StorySlides";
import { StoryShareActions } from "./StoryShareActions";

const STORY_SLIDE_COUNT = 6;
const AUTO_ADVANCE_MS = 6000;
const SHARE_CARD_ID = "story-share-card";

interface StoryWrappedExperienceProps {
  mode?: "demo";
  initialData?: StoryWrappedData;
}

export function StoryWrappedExperience({
  mode = "demo",
  initialData,
}: StoryWrappedExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "story">("loading");
  const [data, setData] = useState<StoryWrappedData | null>(
    () => initialData ?? (mode === "demo" ? getStoryDataFromMock() : null)
  );
  const [slide, setSlide] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const progressRef = useRef<number | null>(null);

  const totalSlides = STORY_SLIDE_COUNT + 1;
  const isShareSlide = slide >= STORY_SLIDE_COUNT;

  const handleLoadingComplete = useCallback(() => {
    setPhase("story");
  }, []);

  const goNext = useCallback(() => {
    setSlide((s) => Math.min(s + 1, totalSlides - 1));
    setSegmentProgress(0);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setSlide((s) => Math.max(s - 1, 0));
    setSegmentProgress(0);
  }, []);

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * 0.35) goPrev();
      else goNext();
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    if (phase !== "story" || isShareSlide) return;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      setSegmentProgress(Math.min(1, elapsed / AUTO_ADVANCE_MS));
      if (elapsed >= AUTO_ADVANCE_MS) {
        goNext();
        return;
      }
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [phase, slide, isShareSlide, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "story") return;
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, goNext, goPrev]);

  if (phase === "loading" && data) {
    return (
      <StoryLoadingScreen
        messages={data.loadingMessages}
        minDurationMs={4000}
        onComplete={handleLoadingComplete}
      />
    );
  }

  if (!data) return null;

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#171a21]">
      {!isShareSlide && (
        <StoryProgressBar
          total={STORY_SLIDE_COUNT}
          current={slide}
          segmentProgress={segmentProgress}
        />
      )}

      <div
        className="relative flex flex-1 flex-col pt-8"
        onClick={handleTap}
        role="presentation"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {slide === 0 && (
              <IntroSlide
                profile={data.profile}
                headline={data.intro.headline}
                subheadline={data.intro.subheadline}
              />
            )}
            {slide === 1 && <PlaytimeSlide playtime={data.playtime} />}
            {slide === 2 && <Top1Slide game={data.top1} />}
            {slide === 3 && <PodiumSlide games={data.podium} />}
            {slide === 4 && <GraveyardSlide graveyard={data.graveyard} />}
            {slide === 5 && <ArchetypeSlide archetype={data.archetype} />}
            {slide === 6 && (
              <>
                <ShareCardPreview
                  profile={data.profile}
                  shareCard={data.shareCard}
                  cardId={SHARE_CARD_ID}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isShareSlide && (
        <StoryShareActions
          cardId={SHARE_CARD_ID}
          filename={`steamwrapped-${data.profile.personaName}.png`}
        />
      )}

      {!isShareSlide && (
        <p className="pointer-events-none pb-4 text-center text-[10px] text-white/20">
          Left tap · back · Right tap · next · {AUTO_ADVANCE_MS / 1000}s
        </p>
      )}
    </div>
  );
}
