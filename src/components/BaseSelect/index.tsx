import { useMemo } from 'react';
import BaseIcon from '@components/BaseIcon';
import style from './index.module.scss';

interface Props {
  options: {
    disabled?: boolean;
    value: any;
    label: string;
  }[];
  value: string;
  alignRight: boolean;
  alignLeft: boolean;
  showIcon: boolean;
  small: boolean;
  onChange: (value: string) => void;
}

export default function BaseSelect(props: Props) {
  const { small, showIcon, onChange, value, options, alignRight, alignLeft } = props;

  const SelectIcon = useMemo(() => {
    if (showIcon) return <BaseIcon name="ChevronDown" size={small ? '16' : '18'} />;
  }, [showIcon, small]);

  const SelectOptions = useMemo(() => {
    return options.map((opt) => (
      <option value={opt.value} disabled={opt.disabled} key={opt.value}>
        {opt.label}
      </option>
    ));
  }, [options]);

  const className = useMemo(() => {
    const c = ['focus'];

    if (showIcon) {
      c.push(style.hasIcon);
    }

    if (alignRight) {
      c.push(style.alignRight);
    }

    if (alignLeft) {
      c.push(style.alignLeft);
    }

    if (small) {
      c.push(style.small);
    }

    return c.join(' ');
  }, [small, alignLeft, alignRight, showIcon]);

  return (
    <div className={style.baseSelect}>
      {SelectIcon}
      <select value={value} className={className} onChange={(e) => onChange(e.target.value)}>
        {SelectOptions}
      </select>
    </div>
  );
}
