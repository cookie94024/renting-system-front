import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import DatePicker from "../components/DatePicker";
import { useMutation } from "react-query";
import axios from "axios";
import { API_BASE } from "../constants";
import { format } from "date-fns";
import classNames from "classnames";
import { useState } from "react";
import Modal from "../components/Modal";

export default function RegisterPage() {
  const [registerSuccess, setRegisterSuccess] = useState("close");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      sex: "m",
    },
  });

  const mutation = useMutation(
    (data) => axios.post(API_BASE + "/api/register/", data),
    {
      onError: (error) => {
        const errorsData = error.response.data;
        const errors = {};
        for (let key in errorsData) {
          const data = errorsData[key];
          errors[key] = errorsData[key][0];
          setError(key, { message: errorsData[key][0] });
        }
      },
      onSuccess: () => {
        setRegisterSuccess("success");
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      birth: data.birth ? format(data.birth, "yyyy-MM-dd") : "",
    });
  };

  const handleModalClose = () => {
    setRegisterSuccess("close");
  };

  const inputClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
  const errorBorderClassName =
    "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500";

  return (
    <>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                註冊會員
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                成為會員後將可以使用網站上的所有功能
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      使用者名稱
                    </label>
                    <input
                      {...register("username")}
                      type="text"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.username,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.username?.message}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="text"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.email,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.email?.message}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      請輸入密碼
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.password,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.password?.message}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      請再次輸入密碼
                    </label>
                    <input
                      {...register("password2")}
                      type="text"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.password2,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.password2?.message}
                    </span>
                  </div>

                  <Controller
                    control={control}
                    name="birth"
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                        <label
                          htmlFor="city"
                          className={classNames(
                            "block text-sm font-medium text-gray-700"
                          )}
                        >
                          出生年月日
                        </label>
                        <DatePicker
                          value={value}
                          onChange={(value) => {
                            const date = new Date(value);
                            onChange(value);
                          }}
                        />
                        <span className="text-xs text-red-500">
                          {errors.birth?.message}
                        </span>
                      </div>
                    )}
                  />

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      手機號碼
                    </label>
                    <input
                      {...register("phone")}
                      type="text"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.phone,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.phone?.message}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      性別
                    </label>
                    <select
                      {...register("sex")}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="m">男性</option>
                      <option value="f">女性</option>
                    </select>
                    <span className="text-xs text-red-500">
                      {errors.sex?.message}
                    </span>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      地址
                    </label>
                    <input
                      {...register("addr")}
                      type="text"
                      className={classNames(inputClassName, {
                        [errorBorderClassName]: errors.addr,
                      })}
                    />
                    <span className="text-xs text-red-500">
                      {errors.addr?.message}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  註冊
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <Modal open={registerSuccess === "success"} onClose={handleModalClose} />
    </>
  );
}
