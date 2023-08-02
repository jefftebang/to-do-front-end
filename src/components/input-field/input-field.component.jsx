const InputField = ({
  requestErrors,
  setMaxLength,
  isTextArea,
  value,
  onChangeProp,
  containerClass,
  otherClass,
  ...otherProps
}) => {
  return (
    <div className={`flex flex-col ${containerClass}`}>
      {requestErrors?.length > 0 ? (
        <div className="mb-1">
          {requestErrors?.map((err, i) => (
            <li className="text-xs text-red-500 font-light list-none" key={i}>
              {err}
            </li>
          ))}
        </div>
      ) : null}
      {isTextArea ? (
        <textarea
          {...otherProps}
          className={`shadow-[inset_0px_10px_8px_0px_#00000024] outline-none pt-3 px-1 resize-none bg-gray-50 ${otherClass}`}
          value={value}
          onChange={onChangeProp}
          maxLength={setMaxLength}
        />
      ) : (
        <input
          {...otherProps}
          className={`shadow-[inset_0px_10px_8px_0px_#00000024] outline-none pt-3 px-1 transition-all duration-500 ${
            requestErrors?.length > 0 ? "bg-red-100" : "bg-gray-50"
          } ${otherClass}`}
          value={value}
          onChange={onChangeProp}
          maxLength={setMaxLength}
        />
      )}
      <span className="block text-xs text-gray-400 py-1">
        {value.length}/{setMaxLength}
      </span>
    </div>
  );
};

export default InputField;
