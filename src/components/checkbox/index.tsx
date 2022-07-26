import PropTypes from 'prop-types';
import { useState } from 'react';
import 'src/styles/checkbox.scss';

interface CheckboxProps {
  onChange?: (value: boolean) => void;
  checked: boolean;
}

function Checkbox(props: CheckboxProps) {
  const [checked, setShecked] = useState(props.checked);

  function checkedChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      target: { checked },
    } = event;

    setShecked(checked);

    if (typeof props.onChange === 'function') {
      props.onChange(checked);
    }
  }

  return (
    <div className="checkbox__container relative-position">
      <input
        type="checkbox"
        className="checkbox relative-position"
        checked={checked}
        onChange={checkedChange}
      />
      <div className="knobs"></div>
      <div className="layer"></div>
    </div>
  );
}

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

Checkbox.defaultProps = {
  checked: false,
};

export default Checkbox;
