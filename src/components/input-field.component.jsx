const InputField = ({
  isTextArea,
  value,
  onChangeProp,
  otherClass,
  ...otherProps
}) => {
  return isTextArea ? (
    <textarea
      {...otherProps}
      className={`shadow-[inset_0px_10px_8px_0px_#00000024] outline-none pt-3 px-1 resize-none ${otherClass}`}
      value={value}
      onChange={onChangeProp}
    />
  ) : (
    <input
      {...otherProps}
      className={`shadow-[inset_0px_10px_8px_0px_#00000024] outline-none pt-3 px-1 resize-none ${otherClass}`}
      value={value}
      onChange={onChangeProp}
    />
  );
};

export default InputField;
