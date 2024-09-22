import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

function Button({ label, onClick, variant }: ButtonProps): React.JSX.Element {
  const baseStyles =
    'px-4 py-2 rounded-md font-semibold transition duration-300';
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {label}
    </button>
  );
}

Button.defaultProps = {
  variant: 'primary',
};

export default Button;
