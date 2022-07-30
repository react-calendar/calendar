import { useCallback, useState } from 'react';
import style from './index.module.scss';

interface CheckboxProps {
  onChange: (value: boolean) => void;
  checked: boolean;
}

function Checkbox(props: CheckboxProps) {
  const [checked, setShecked] = useState(props.checked);

  const checkedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { checked },
      } = event;

      setShecked(checked);

      props.onChange(checked);
    },
    []
  );

  return (
    <div className={style.checkbox__container}>
      <input
        type="checkbox"
        className={style.checkbox}
        checked={checked}
        onChange={checkedChange}
      />
      <div className={style.knobs}></div>
      <div className={style.layer}></div>
    </div>
  );
}

Checkbox.defaultProps = {
  checked: false,
};

export default Checkbox;
