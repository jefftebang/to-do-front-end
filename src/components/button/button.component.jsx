const BUTTON_TYPES_CLASSES = {
  blueBTN: `bg-blue-200 text-blue-900 enabled:hover:bg-blue-400 disabled:text-gray-400 disabled:bg-gray-100`,
  redBTN: `bg-red-200 text-red-900 enabled:hover:bg-red-400 disabled:text-gray-400 disabled:bg-gray-100`,
  grayBTN: `bg-gray-100 text-gray-700 hover:bg-sky-200`,
};

const Button = ({
  children,
  btnType,
  btnIsDisabled,
  otherClass,
  ...otherProps
}) => {
  return (
    <button
      disabled={btnIsDisabled}
      type="button"
      className={`inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 font-medium enabled:hover:text-white outline-none enabled:hover:shadow-md enabled:hover:drop-shadow-lg transition-all duration-300 ${BUTTON_TYPES_CLASSES[btnType]} ${otherClass}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
