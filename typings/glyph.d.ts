type GlyphTarget = 'base' | 'start' | 'end' | 'startEnd';

type ThemeProp =
  | 'class'
  | 'wrapperClass'
  | 'contentClass'
  | 'style'
  | 'contentStyle'
  | 'color'
  | 'fillMode';

interface Glyph {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

interface Profile<T> {
  start: T;
  base: T;
  end: T;
  startEnd?: T;
}

// Highlights
type HighlightFillMode = 'solid' | 'light' | 'outline';

interface Highlight extends Glyph {
  fillMode: HighlightFillMode;
  wrapperClass: string | any[];
  contentClass: string | any[];
  contentStyle: Record<string, any>;
}

type HighlightConfig = boolean | string | Partial<Highlight | Profile<Partial<Highlight>>>;

// Dots
type Dot = Glyph;
type DotConfig = boolean | string | Partial<Dot | Profile<Partial<Dot>>>;

// Bars
type Bar = Glyph;
type BarConfig = boolean | string | Partial<Bar | Profile<Partial<Bar>>>;

// Content
type Content = Glyph;
type ContentConfig = string | Partial<Content | Profile<Partial<Content>>>;
