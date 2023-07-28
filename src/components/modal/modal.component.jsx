import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

const Modal = ({ openModal, otherClass, children, ...otherProps }) => {
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    openModal === true ? setIsOpen(true) : setIsOpen(false);
  }, [openModal]);

  return (
    <div {...otherProps}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${otherClass}`}
                >
                  <div>{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Modal;
