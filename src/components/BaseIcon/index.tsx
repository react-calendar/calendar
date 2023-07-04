import { useMemo } from 'react';
import * as icons from './icons';
import style from './index.module.scss';

interface Props {
  name: string;
  width?: string;
  height?: string;
  size?: string;
  viewBox?: string;
}

export default function BaseIcon(props: Props) {
  const { size = 26 } = props;
  const width = props.width ?? size;
  const height = props.height ?? size;

  const Icon = useMemo(() => (icons as any)[`Icon${props.name}`], []);

  return <Icon className={style.baseIcon} width={width} height={height}></Icon>;
}
