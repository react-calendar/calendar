type PopoverConfig = Partial<{
  label: string;
  visibility: PopoverVisibility;
  placement: Placement;
  hideIndicator: boolean;
  isInteractive: boolean;
}>;

type EventConfig = Partial<{ label: string }>;

interface AttributeConfig {
  key: string | number;
  hashcode: string;
  content: ContentConfig;
  highlight: HighlightConfig;
  dot: DotConfig;
  bar: BarConfig;
  popover: PopoverConfig;
  event: EventConfig;
  dates: DateRangeSource[];
  customData: any;
  order: number;
  pinPage: boolean;
}
