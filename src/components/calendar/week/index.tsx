import { useContext, useMemo } from 'react';
import { GlobalContext } from 'src/components/store';
import { resortWeeks } from 'src/utils/handler';

import 'src/styles/layout.scss';
import style from './index.module.scss';

export default function Week() {
  const { startWeek } = useContext(GlobalContext);

  const weeks = useMemo(() => resortWeeks(startWeek), [startWeek]);

  return (
    <div className={`${style.calendar__weeks} grid`}>
      {weeks.map((item: string) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
}
