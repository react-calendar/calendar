import { useCallback, useContext, useMemo, useState } from 'react';
import { GlobalContext } from 'src/components/store';

import style from './index.module.scss';
import 'src/styles/layout.scss';

interface PickerProps {
  display: boolean;
  onClose: () => void;
}

function init(year: number) {
  const i = (year - 1900) % 12;
  return new Array(12).fill(null).map((_, idx) => year + idx - i);
}

function refreshYears(years: number[], direct: number) {
  return years.map((x) => x + direct * 12);
}

export default function Picker(props: PickerProps) {
  const { selectDate, onSelect } = useContext(GlobalContext);
  const { display, onClose } = props;

  const [year, setYear] = useState(selectDate.year);

  const [showYear, setShowYear] = useState(false);

  const [years, setYears] = useState(init(year));

  const month = useMemo(() => {
    return Array(12)
      .fill(null)
      .map((_, idx) => idx + 1);
  }, []);

  const prev = useCallback(() => {
    if (showYear) {
      setYears(refreshYears(years, -1));
    } else {
      setYear(year - 1);
    }
  }, [year, showYear, years]);

  const next = useCallback(() => {
    if (showYear) {
      setYears(refreshYears(years, 1));
    } else {
      setYear(year + 1);
    }
  }, [year, showYear, years]);

  const select = useCallback(
    (e: number) => {
      const date = new Date(year, e, 0).getDate();
      const day = selectDate.day <= date ? selectDate.day : date;
      onSelect({ year, month: e, day: day });
      onClose();
    },
    [year, selectDate]
  );

  const options = useMemo(() => {
    if (showYear) {
      return (
        <div className={`${style.grid}`}>
          {years.map((e: number) => {
            return (
              <div
                key={e}
                className={`${style.options} ${
                  year === e ? style.select : ''
                } ${
                  e <= 2100 && e >= 1900 ? '' : style.disable
                } row items-center justify-center`}
                onClick={() => {
                  setYear(e);
                  setShowYear(false);
                }}>
                {e}
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className={`${style.grid}`}>
          {month.map((e: number) => {
            return (
              <div
                key={e}
                className={`${style.options} ${
                  selectDate.year === year && selectDate.month === e
                    ? style.select
                    : ''
                } row items-center justify-center`}
                onClick={() => {
                  select(e);
                }}>
                {e}月
              </div>
            );
          })}
        </div>
      );
    }
  }, [showYear, year, years, month, selectDate]);

  return (
    <div
      className={`${style.picker__container} ${
        display ? style.show : style.hidden
      }`}>
      <div className={style.picker}>
        <div
          className={`row justify-between items-center ${style.picker__header}`}>
          <svg
            className={`${style.svg} ${
              year === 1900 || years[0] === 1900 ? style.disable : ''
            }`}
            onClick={prev}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
          </svg>
          <div
            className={style.year}
            onClick={() => {
              setShowYear(!showYear);
            }}>
            {showYear ? `${years[0]}-${years[11]}` : year}
          </div>
          <svg
            className={`${style.svg} ${
              year === 2100 || years[8] === 2100 ? style.disable : ''
            }`}
            onClick={next}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        </div>
        {options}
      </div>
    </div>
  );
}
