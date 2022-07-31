import { useContext, useMemo, useState } from 'react';
import { GlobalContext } from 'src/components/store';
import Checkbox from 'src/components/checkbox';
import Picker from 'components/picker';

import style from './index.module.scss';
import 'src/styles/layout.scss';

export default function Header() {
  const { showLunar, selectDate, fold, viewChange } = useContext(GlobalContext);

  // 农历年
  const lunar = useMemo(() => {
    if (showLunar) {
      return (
        <div className={style.year_desc}>
          {`${selectDate.lunar!.gzYear}${selectDate.lunar!.zodiac}年`}
        </div>
      );
    }

    return null;
  }, [showLunar, selectDate]);

  const [displayPicker, setDisplayPicker] = useState(false);

  return (
    <div className="row justify-between items-center">
      <div
        className={`${style.calendar__content} row `}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setDisplayPicker(!displayPicker);
        }}>
        <div
          className={
            style.datetime
          }>{`${selectDate.month}月${selectDate.day}日`}</div>
        <div className="column justify-center">
          <div>{`${selectDate.year}年`}</div>
          {lunar}
        </div>
      </div>
      <Picker
        display={displayPicker}
        onClose={() => {
          setDisplayPicker(false);
        }}></Picker>
      <Checkbox checked={fold} onChange={viewChange}></Checkbox>
    </div>
  );
}
