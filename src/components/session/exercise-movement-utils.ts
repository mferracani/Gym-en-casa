export interface MovementSegment {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
}

export function isValidMovementSegment(
  segment: Pick<MovementSegment, "startSeconds" | "endSeconds">,
): boolean {
  return (
    Number.isInteger(segment.startSeconds) &&
    Number.isInteger(segment.endSeconds) &&
    segment.startSeconds >= 0 &&
    segment.endSeconds > segment.startSeconds
  );
}

export function buildYouTubeEmbedUrl(segment: MovementSegment): string {
  const parameters = new URLSearchParams({
    start: String(segment.startSeconds),
    end: String(segment.endSeconds),
    rel: "0",
    playsinline: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${segment.videoId}?${parameters}`;
}

export function buildMovementSourceUrl(segment: MovementSegment): string {
  const parameters = new URLSearchParams({
    v: segment.videoId,
    t: `${segment.startSeconds}s`,
  });

  return `https://www.youtube.com/watch?${parameters}`;
}
