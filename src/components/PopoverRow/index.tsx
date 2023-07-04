import { Attribute } from '@utils/attribute';
import style from './index.module.scss';
import { useMemo } from 'react';

interface Props {
  attribute: Attribute;
}

export default function PopoverRow(props: Props) {
  const { attribute } = props;

  const indicator = useMemo(() => {
    const { content, highlight, dot, bar, popover } = attribute;

    if (popover && popover.hideIndicator) return null;

    if (content) {
      return {
        class: `bar ${style.dayPopoverRowBar} attr ${content.base.color}`,
      };
    }

    if (highlight) {
      return {
        class: `highlight-bg-solid ${style.dayPopoverRowHighlight} attr ${highlight.base.color}`,
      };
    }

    if (dot) {
      return {
        class: `dot attr ${dot.base.color}`,
      };
    }

    if (bar) {
      return {
        class: `bar ${style.dayPopoverRowBar} attr ${bar.base.color}`,
      };
    }

    return null;
  }, [attribute]);

  return (
    <div className={style.dayPopoverRow}>
      {/* Indicator */}
      <div className={style.dayPopoverRowIndicator}>
        <span className={indicator?.class} />
      </div>
      {/* Content */}
      <div className={style.dayPopoverRowLabel}>
        {attribute.popover ? attribute.popover!.label : 'No content provided'}
      </div>
    </div>
  );
}
