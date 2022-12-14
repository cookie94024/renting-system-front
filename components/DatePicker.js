import { useQuery } from "react-query";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { API_BASE } from "../constants";
import { Fragment, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { format } from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen((open) => !open);
        }}
        className="mt-1 block w-full p-2 border-solid border-[1px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm relative"
      >
        {value ? format(value, "yyyy-MM-dd") : "點此選擇日期"}
      </button>

      <Transition
        show={open}
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-10 mt-1 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <Calendar locale="en" onChange={onChange} value={value} />
        </div>
      </Transition>
    </div>
  );
}
