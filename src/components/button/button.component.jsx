const BUTTON_TYPES_CLASSES = {
  blueBTN: `bg-blue-200 text-blue-900 hover:bg-blue-400`,
  redBTN: `bg-red-200 text-red-900 hover:bg-red-400`,
  greenBTN: `bg-green-200 text-green-900 hover:bg-green-400`,
  grayBTN: `bg-gray-50 text-gray-700 hover:bg-sky-200`,
};

const Button = ({ children, btnType, otherClass, ...otherProps }) => {
  return (
    <button
      type="button"
      className={`inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 font-medium enabled:hover:text-white outline-none enabled:hover:shadow-md enabled:hover:drop-shadow-lg transition-all ${BUTTON_TYPES_CLASSES[btnType]} ${otherClass}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
